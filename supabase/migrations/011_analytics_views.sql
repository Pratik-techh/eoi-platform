-- Migration 011: Analytics views, anomaly detection trigger, compute_metrics function

-- ─── Analytics views (used by all dashboards) ────────────────────────────────

-- Funnel stage counts (the core funnel view)
CREATE OR REPLACE VIEW public.v_outcome_funnel AS
SELECT
  c.agency_id,
  c.id AS cohort_id,
  co.agency_id AS course_agency_id,
  c.state,
  c.district,
  co.sector,
  COUNT(DISTINCT e.eoi_student_id)  AS enrolled,
  COUNT(DISTINCT CASE WHEN e.status = 'COMPLETED' THEN e.eoi_student_id END) AS trained,
  COUNT(DISTINCT ar.eoi_student_id) AS assessed,
  COUNT(DISTINCT CASE WHEN jr.readiness_band IN ('HIGH','MEDIUM') THEN jr.eoi_student_id END) AS job_ready,
  COUNT(DISTINCT ie.eoi_student_id) AS interviewed,
  COUNT(DISTINCT se.eoi_student_id) AS selected,
  COUNT(DISTINCT CASE WHEN eo.employment_status = 'VERIFIED_EMPLOYED' THEN eo.eoi_student_id END) AS verified_employed,
  COUNT(DISTINCT CASE WHEN eo.employment_status = 'VERIFIED_EMPLOYED'
    AND (eo.start_date + INTERVAL '90 days') <= NOW() THEN eo.eoi_student_id END) AS retained_3m
FROM public.cohorts c
JOIN public.courses co ON co.id = c.course_id
LEFT JOIN public.enrollments e ON e.cohort_id = c.id
LEFT JOIN public.assessment_results ar ON ar.eoi_student_id = e.eoi_student_id
LEFT JOIN LATERAL (
  SELECT DISTINCT ON (eoi_student_id) *
    FROM public.job_readiness_records
    WHERE eoi_student_id = e.eoi_student_id
    ORDER BY eoi_student_id, computed_at DESC
) jr ON TRUE
LEFT JOIN public.interview_events ie ON ie.eoi_student_id = e.eoi_student_id
LEFT JOIN public.selection_events se ON se.eoi_student_id = e.eoi_student_id
LEFT JOIN public.employment_outcomes eo ON eo.eoi_student_id = e.eoi_student_id
GROUP BY c.agency_id, c.id, co.agency_id, c.state, c.district, co.sector;

-- Top-level KPI summary view
CREATE OR REPLACE VIEW public.v_kpi_summary AS
SELECT
  SUM(enrolled)          AS total_enrolled,
  SUM(trained)           AS total_trained,
  SUM(assessed)          AS total_assessed,
  SUM(job_ready)         AS total_job_ready,
  SUM(interviewed)       AS total_interviewed,
  SUM(selected)          AS total_selected,
  SUM(verified_employed) AS total_verified_employed,
  SUM(retained_3m)       AS total_retained_3m,
  ROUND(SUM(trained)::NUMERIC         / NULLIF(SUM(enrolled), 0)          * 100, 2) AS training_completion_rate,
  ROUND(SUM(assessed)::NUMERIC        / NULLIF(SUM(trained), 0)           * 100, 2) AS assessment_completion_rate,
  ROUND(SUM(job_ready)::NUMERIC       / NULLIF(SUM(assessed), 0)          * 100, 2) AS job_readiness_rate,
  ROUND(SUM(interviewed)::NUMERIC     / NULLIF(SUM(job_ready), 0)         * 100, 2) AS interview_rate,
  ROUND(SUM(selected)::NUMERIC        / NULLIF(SUM(interviewed), 0)       * 100, 2) AS selection_rate,
  ROUND(SUM(verified_employed)::NUMERIC / NULLIF(SUM(enrolled), 0)        * 100, 2) AS verified_employment_rate,
  ROUND(SUM(retained_3m)::NUMERIC     / NULLIF(SUM(verified_employed), 0) * 100, 2) AS retention_rate_3m,
  NOW() AS calculated_at
FROM public.v_outcome_funnel;

-- Per-agency verified metrics (for Agency Intelligence)
CREATE OR REPLACE VIEW public.v_agency_metrics AS
SELECT
  a.id AS agency_id,
  a.name AS agency_name,
  a.state,
  SUM(f.enrolled)          AS enrolled,
  SUM(f.trained)           AS trained,
  SUM(f.verified_employed) AS verified_employed,
  SUM(f.retained_3m)       AS retained_3m,
  ROUND(SUM(f.verified_employed)::NUMERIC / NULLIF(SUM(f.enrolled), 0) * 100, 2) AS verified_employment_rate,
  ROUND(SUM(f.retained_3m)::NUMERIC / NULLIF(SUM(f.verified_employed), 0) * 100, 2) AS retention_rate_3m,
  COUNT(DISTINCT d.id) AS dispute_count,
  COUNT(DISTINCT CASE WHEN eo.employment_status = 'PENDING_VERIFICATION' THEN eo.id END) AS pending_count
FROM public.agencies a
LEFT JOIN public.v_outcome_funnel f ON f.agency_id = a.id
LEFT JOIN public.disputes d ON EXISTS (
  SELECT 1 FROM public.students s WHERE s.eoi_student_id = d.eoi_student_id AND s.agency_id = a.id
)
LEFT JOIN public.employment_outcomes eo ON eo.agency_id = a.id
GROUP BY a.id, a.name, a.state;

-- Skill demand/supply gap view
CREATE OR REPLACE VIEW public.v_skill_gap AS
WITH demand AS (
  SELECT skill_id, industry, COUNT(*) AS demand_count, AVG(required_proficiency) AS avg_demand_proficiency
    FROM public.skill_requirements GROUP BY skill_id, industry
),
supply AS (
  SELECT cs.skill_id, AVG(cs.target_proficiency) AS avg_supply_proficiency, COUNT(DISTINCT e.eoi_student_id) AS supply_students
    FROM public.course_skills cs
    JOIN public.courses co ON co.id = cs.course_id
    JOIN public.enrollments e ON e.cohort_id IN (SELECT id FROM public.cohorts WHERE course_id = co.id)
    GROUP BY cs.skill_id
),
achieved AS (
  SELECT skill_id, AVG(proficiency) AS avg_achieved_proficiency
    FROM public.student_skills WHERE source = 'ASSESSMENT'
    GROUP BY skill_id
)
SELECT
  s.id AS skill_id,
  s.name AS skill_name,
  s.domain,
  d.demand_count,
  d.avg_demand_proficiency,
  sup.avg_supply_proficiency,
  sup.supply_students,
  a.avg_achieved_proficiency,
  CASE
    WHEN d.avg_demand_proficiency > COALESCE(a.avg_achieved_proficiency, 0) + 1 THEN 'HIGH_GAP'
    WHEN d.avg_demand_proficiency > COALESCE(a.avg_achieved_proficiency, 0) + 0.5 THEN 'MEDIUM_GAP'
    ELSE 'ADEQUATE'
  END AS gap_level,
  d.industry
FROM public.skills s
LEFT JOIN demand d ON d.skill_id = s.id
LEFT JOIN supply sup ON sup.skill_id = s.id
LEFT JOIN achieved a ON a.skill_id = s.id;

-- ─── Anomaly detection trigger ───────────────────────────────────────────────
-- Detects: bulk employment reporting (> 50 reports by same agency in 60 seconds)
CREATE OR REPLACE FUNCTION public.detect_bulk_reporting_anomaly()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_recent_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_recent_count
    FROM public.employment_outcomes
    WHERE agency_id = NEW.agency_id
      AND reported_at >= NOW() - INTERVAL '60 seconds';

  IF v_recent_count >= 50 THEN
    INSERT INTO public.anomaly_signals (
      signal_type, entity_type, entity_id, severity, description
    ) VALUES (
      'BULK_REPORTING_BURST', 'agency', NEW.agency_id::TEXT, 'HIGH',
      format('Agency reported %s employment events in the past 60 seconds. Needs review.',
        v_recent_count + 1)
    );
  END IF;

  -- Implausibly fast employer confirmation detection: checked separately in confirm_employment
  RETURN NEW;
END;
$$;

CREATE TRIGGER detect_bulk_reporting
  AFTER INSERT ON public.employment_outcomes
  FOR EACH ROW EXECUTE FUNCTION public.detect_bulk_reporting_anomaly();

-- ─── Analytics recalculation (full implementation) ───────────────────────────
CREATE OR REPLACE FUNCTION public.trigger_analytics_recalculation(
  p_outcome_id UUID,
  p_correlation_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_snapshot JSONB;
  v_snapshot_id UUID;
BEGIN
  -- Compute and store a new analytics snapshot
  SELECT row_to_json(k.*) INTO v_snapshot FROM public.v_kpi_summary k;

  INSERT INTO public.analytics_snapshots (snapshot_type, filters, data, calculation_version)
  VALUES ('DASHBOARD', '{}'::JSONB, v_snapshot, '1.0')
  RETURNING id INTO v_snapshot_id;

  -- Log recalculation to ledger
  PERFORM ledger.insert_event(
    NULL, NULL, 'ANALYTICS_RECALCULATED', 'SYSTEM',
    'analytics_snapshot', v_snapshot_id::TEXT,
    NULL, v_snapshot, p_correlation_id,
    jsonb_build_object('triggered_by_outcome', p_outcome_id)
  );
END;
$$;

-- ─── Materialised view for regional analytics (refreshed by scheduled job) ────
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_regional_summary AS
SELECT
  COALESCE(f.state, 'Unknown') AS state,
  f.district,
  co.sector,
  SUM(f.enrolled)          AS enrolled,
  SUM(f.trained)           AS trained,
  SUM(f.verified_employed) AS verified_employed,
  ROUND(SUM(f.verified_employed)::NUMERIC / NULLIF(SUM(f.enrolled), 0) * 100, 2) AS employment_rate,
  NOW() AS refreshed_at
FROM public.v_outcome_funnel f
JOIN public.cohorts c ON c.id = f.cohort_id
JOIN public.courses co ON co.id = c.course_id
GROUP BY COALESCE(f.state, 'Unknown'), f.district, co.sector
WITH NO DATA;

-- Initial refresh
REFRESH MATERIALIZED VIEW public.mv_regional_summary;

CREATE INDEX ON public.mv_regional_summary (state);
CREATE INDEX ON public.mv_regional_summary (sector);
