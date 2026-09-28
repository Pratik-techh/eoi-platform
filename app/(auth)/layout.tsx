import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to the Employment Outcome Intelligence Platform',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-mesh"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Synthetic data banner */}
      <div className="synthetic-banner">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Synthetic data — prototype · No real personal information is used
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--sp-6)',
        }}
      >
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-container)',
          padding: 'var(--sp-8)',
          boxShadow: 'var(--shadow-card)',
          maxWidth: 480,
          width: '100%',
        }}>
          {children}
        </div>
      </div>

      <footer
        style={{
          padding: 'var(--sp-4) var(--sp-6)',
          borderTop: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 'var(--text-xs)',
          color: 'var(--muted)',
        }}
      >
        <span>Employment Outcome Intelligence Platform · SIH 2026 · SIH26135</span>
        <span>Prototype · For demonstration purposes only</span>
      </footer>
    </div>
  )
}
