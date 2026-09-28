'use client'

export function EntityResolutionFlow() {
  const steps = [
    {
      step: 1,
      title: 'Reported Employer',
      detail: 'Agency submits employer name + claimed identifier',
      badge: 'INPUT',
      example: '"Google India" (Reported string)',
    },
    {
      step: 2,
      title: 'Identifier Resolution',
      detail: 'Lookup against MCA CIN, LLPIN, or EPFO registries',
      badge: 'REGISTRY MATCH',
      example: 'CIN: U72200KA2004FTC033590',
    },
    {
      step: 3,
      title: 'Canonical Organization',
      detail: 'Bound to unique legal entity in EOI platform',
      badge: 'ORGANIZATION',
      example: 'Google India Pvt. Ltd. (Org ID: org-google-01)',
    },
    {
      step: 4,
      title: 'Authorized Account',
      detail: 'Multi-party authorized enterprise verifier credentials',
      badge: 'AUTHORIZED',
      example: 'Kavya Reddy (employer.verifier@eoi.demo)',
    },
    {
      step: 5,
      title: 'Verification Request',
      detail: 'Sent to enterprise verification queue with audit hash',
      badge: 'ACTIONABLE',
      example: 'Pending Confirmation / Rejection',
    },
  ]

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
      padding: 'var(--sp-6)', marginBottom: 'var(--sp-6)',
    }}>
      <div style={{ marginBottom: 'var(--sp-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: 'var(--r-control)',
            background: 'var(--chip-info-bg)', color: 'var(--info)', border: '1px solid var(--chip-info-border)',
          }}>
            ZERO TRUST IDENTITY PIPELINE
          </span>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
            Organization Entity Resolution Flow
          </h2>
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4 }}>
          Control is never granted by name matching alone. Every verification routes through canonical legal identifier resolution.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--sp-3)' }}>
        {steps.map((st, i) => (
          <div
            key={st.step}
            style={{
              background: 'var(--canvas)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-control)',
              padding: 'var(--sp-4)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-2)' }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700,
              }}>
                {st.step}
              </span>
              <span style={{
                fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: 2,
                background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--muted)',
              }}>
                {st.badge}
              </span>
            </div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
              {st.title}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.4, marginBottom: 8 }}>
              {st.detail}
            </div>
            <div style={{
              fontSize: '11px', fontFamily: 'var(--font-mono)', background: 'var(--surface)',
              border: '1px solid var(--line)', padding: '2px 6px', borderRadius: 2, color: 'var(--ink)',
            }}>
              {st.example}
            </div>
            {i < steps.length - 1 && (
              <div style={{
                display: 'none', // hide on small screen grids
              }}>
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
