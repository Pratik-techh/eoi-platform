'use client'

import { Suspense } from 'react'
import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormErrors = Partial<Record<keyof z.infer<typeof LoginSchema>, string>> & { root?: string }

// Demo accounts for judges — all 10 platform personas across 4 stakeholder families
const DEMO_ACCOUNTS = [
  { label: 'Government Analyst', email: 'gov.analyst@eoi.demo', role: 'gov_analyst' },
  { label: 'Government Program Admin', email: 'gov.admin@eoi.demo', role: 'gov_program_admin' },
  { label: 'Government Auditor', email: 'gov.auditor@eoi.demo', role: 'gov_auditor' },
  { label: 'Agency Officer', email: 'agency.officer@eoi.demo', role: 'agency_officer' },
  { label: 'Agency Admin', email: 'agency.admin@eoi.demo', role: 'agency_admin' },
  { label: 'Student Trainee', email: 'student.x@eoi.demo', role: 'student' },
  { label: 'Employer Verifier', email: 'employer.verifier@eoi.demo', role: 'employer_verifier' },
  { label: 'Employer Admin', email: 'employer.admin@eoi.demo', role: 'employer_admin' },
  { label: 'Security Officer', email: 'security.officer@eoi.demo', role: 'security_officer' },
  { label: 'Platform Operations', email: 'platform.ops@eoi.demo', role: 'platform_ops' },
]

const ROLE_REDIRECTS: Record<string, string> = {
  gov_analyst: '/gov/dashboard',
  gov_program_admin: '/gov/programs',
  gov_auditor: '/gov/audit',
  agency_admin: '/agency/dashboard',
  agency_officer: '/agency/dashboard',
  student: '/student/dashboard',
  employer_admin: '/employer/organization',
  employer_verifier: '/employer/verification',
  security_officer: '/platform/security',
  platform_ops: '/platform/health',
}

const DEMO_PASSWORD = 'Demo@EOI2026'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isPending, startTransition] = useTransition()

  function prefillDemo(demoEmail: string) {
    setEmail(demoEmail)
    setPassword(DEMO_PASSWORD)
    setErrors({})
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})

    const parsed = LoginSchema.safeParse({ email, password })
    if (!parsed.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof z.infer<typeof LoginSchema>
        if (field) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      })

      if (error) {
        setErrors({ root: error.message === 'Invalid login credentials'
          ? 'Email or password is incorrect. Check the demo accounts below.'
          : error.message
        })
        return
      }

      // Determine proper role-based landing
      const matched = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === parsed.data.email.toLowerCase())
      const targetUrl: string = (redirect && redirect !== '/') ? redirect : ((matched && ROLE_REDIRECTS[matched.role]) || '/gov/dashboard')

      router.push(targetUrl)
      router.refresh()
    })
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      {/* Platform wordmark */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-2)',
          marginBottom: 'var(--sp-2)',
        }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'var(--primary)',
            borderRadius: 'var(--r-control)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 14L7 8L10 11L13 6L15 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="15" cy="4" r="2" fill="var(--verified)"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>
              EOI Platform
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
              Employment Outcome Intelligence
            </div>
          </div>
        </div>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--ink)', marginTop: 'var(--sp-6)' }}>
          Sign in
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', marginTop: 'var(--sp-1)' }}>
          Access is role-based. Use a demo account below to explore.
        </p>

        {/* 1-Click Evaluator Switcher Callout */}
        <div style={{
          marginTop: 'var(--sp-4)',
          padding: 'var(--sp-3) var(--sp-4)',
          background: 'rgba(29, 78, 137, 0.08)',
          border: '1px solid rgba(29, 78, 137, 0.25)',
          borderRadius: 'var(--r-control)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--sp-2)',
        }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary)' }}>
            ⚡ SIH 2026 Evaluator Guide:
          </span>
          <a
            href="/demo"
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              color: 'var(--primary)',
              textDecoration: 'underline',
            }}
          >
            Open 1-Click Role Switcher →
          </a>
        </div>
      </div>

      {/* Login form */}
      <form onSubmit={handleSubmit} noValidate>
        {errors.root && (
          <div role="alert" style={{
            background: 'var(--chip-disputed-bg)',
            border: '1px solid var(--chip-disputed-border)',
            borderRadius: 'var(--r-control)',
            padding: 'var(--sp-3) var(--sp-4)',
            marginBottom: 'var(--sp-4)',
            fontSize: 'var(--text-sm)',
            color: 'var(--disputed)',
          }}>
            {errors.root}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--ink)', marginBottom: 'var(--sp-1)' }}
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={!!errors.email}
              style={{
                width: '100%',
                padding: 'var(--sp-2) var(--sp-3)',
                border: `1px solid ${errors.email ? 'var(--disputed)' : 'var(--line)'}`,
                borderRadius: 'var(--r-control)',
                fontSize: 'var(--text-base)',
                color: 'var(--ink)',
                background: 'var(--surface)',
                outline: 'none',
                fontFamily: 'var(--font-ui)',
              }}
            />
            {errors.email && (
              <p id="email-error" role="alert" style={{ fontSize: 'var(--text-xs)', color: 'var(--disputed)', marginTop: 'var(--sp-1)' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--ink)', marginBottom: 'var(--sp-1)' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              aria-invalid={!!errors.password}
              style={{
                width: '100%',
                padding: 'var(--sp-2) var(--sp-3)',
                border: `1px solid ${errors.password ? 'var(--disputed)' : 'var(--line)'}`,
                borderRadius: 'var(--r-control)',
                fontSize: 'var(--text-base)',
                color: 'var(--ink)',
                background: 'var(--surface)',
                outline: 'none',
                fontFamily: 'var(--font-ui)',
              }}
            />
            {errors.password && (
              <p id="password-error" role="alert" style={{ fontSize: 'var(--text-xs)', color: 'var(--disputed)', marginTop: 'var(--sp-1)' }}>
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            id="login-submit"
            disabled={isPending}
            style={{
              width: '100%',
              padding: 'var(--sp-2) var(--sp-4)',
              background: isPending ? 'var(--muted)' : 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--r-control)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              cursor: isPending ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-ui)',
              transition: 'background 0.15s ease',
            }}
          >
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>

      {/* Demo accounts panel */}
      <div style={{
        marginTop: 'var(--sp-8)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-container)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: 'var(--sp-3) var(--sp-4)',
          background: 'var(--canvas)',
          borderBottom: '1px solid var(--line)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: 'var(--muted)',
        }}>
          DEMO ACCOUNTS — All use password: <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--line)', padding: '1px 4px', borderRadius: '2px' }}>{DEMO_PASSWORD}</code>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {DEMO_ACCOUNTS.map((account, i) => (
            <button
              key={account.email}
              id={`demo-${account.role}`}
              onClick={() => prefillDemo(account.email)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--sp-3) var(--sp-4)',
                border: 'none',
                borderBottom: i < DEMO_ACCOUNTS.length - 1 ? '1px solid var(--line)' : 'none',
                background: 'var(--surface)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                textAlign: 'left',
                color: 'var(--ink)',
                fontFamily: 'var(--font-ui)',
                transition: 'background 0.1s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--canvas)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}
            >
              <span style={{ fontWeight: 500 }}>{account.label}</span>
              <code style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--muted)',
              }}>
                {account.email}
              </code>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ width: 420, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 'var(--text-sm)' }}>
        Loading…
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
