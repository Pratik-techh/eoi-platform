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
      badge: 'CANONICAL',
      example: 'Google India Pvt. Ltd. (org-google-01)',
    },
    {
      step: 4,
      title: 'Authorized Account',
      detail: 'Multi-party authorized enterprise verifier credentials',
      badge: 'VERIFIED',
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
      background: '#0F0F0F',
      border: '1px solid #242424',
      borderRadius: 'var(--r-control)',
      padding: 'var(--sp-6)',
      marginBottom: 'var(--sp-6)',
    }}>
      <div style={{ marginBottom: 'var(--sp-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <span style={{
            fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-badge)',
            background: '#151515', color: '#18B6A4', border: '1px solid rgba(24, 182, 164, 0.4)',
            letterSpacing: '0.04em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#18B6A4', boxShadow: '0 0 5px rgba(24, 182, 164, 0.5)' }} />
            Zero Trust Pipeline
          </span>
          <h2 style={{ fontSize: 'var(--text-md)', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Organization Entity Resolution Flow
          </h2>
        </div>
        <p style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: 4 }}>
          Control is never granted by name matching alone. Every verification routes through canonical legal identifier resolution.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--sp-3)' }}>
        {steps.map((st) => (
          <div
            key={st.step}
            style={{
              background: '#080808',
              border: '1px solid #242424',
              borderRadius: 'var(--r-control)',
              padding: '14px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{
                width: 20, height: 20, borderRadius: 'var(--r-badge)', background: '#FFFFFF', color: '#000000',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700,
              }}>
                {st.step}
              </span>
              <span style={{
                fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '1px 6px', borderRadius: 2,
                background: '#151515', border: '1px solid #242424', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                {st.badge}
              </span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginBottom: 4 }}>
              {st.title}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4, marginBottom: 10 }}>
              {st.detail}
            </div>
            <div style={{
              fontSize: '11px', fontFamily: 'var(--font-mono)', background: '#151515',
              border: '1px solid #242424', padding: '4px 8px', borderRadius: 2, color: 'var(--text-on-surface)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {st.example}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
