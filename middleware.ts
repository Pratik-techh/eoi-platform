import { NextResponse, type NextRequest } from 'next/server'
import type { ActorRole } from '@/lib/supabase/database.types'

// Route groups and their required role families
const ROUTE_ROLE_MAP: Record<string, ActorRole[]> = {
  '/gov':      ['gov_analyst', 'gov_program_admin', 'gov_auditor'],
  '/agency':   ['agency_admin', 'agency_officer'],
  '/student':  ['student'],
  '/employer': ['employer_admin', 'employer_verifier'],
  '/platform': ['security_officer', 'platform_ops'],
  '/demo':     ['gov_analyst', 'gov_program_admin', 'gov_auditor', 'agency_admin', 'agency_officer', 'student', 'employer_admin', 'employer_verifier', 'security_officer', 'platform_ops'],
}

// Role to home page mapping
const ROLE_HOME: Record<ActorRole, string> = {
  gov_analyst:        '/gov/dashboard',
  gov_program_admin:  '/gov/programs',
  gov_auditor:        '/gov/audit',
  agency_admin:       '/agency/dashboard',
  agency_officer:     '/agency/dashboard',
  student:            '/student/dashboard',
  employer_admin:     '/employer/organization',
  employer_verifier:  '/employer/verification',
  security_officer:   '/platform/security',
  platform_ops:       '/platform/health',
}

// Public routes (no auth required)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/demo',
  '/403',
  '/integrations',
  '/_next',
  '/api/auth',
  '/api/integrations',
  '/favicon.ico',
]

function isPublicRoute(pathname: string): boolean {
  if (pathname === '/') return true
  if (/\.(pdf|png|jpg|jpeg|svg|ico|css|js|txt|html|woff|woff2)$/i.test(pathname)) return true
  return PUBLIC_ROUTES.some(route => route !== '/' && pathname.startsWith(route))
}

function getRequiredRoles(pathname: string): ActorRole[] | null {
  for (const [prefix, roles] of Object.entries(ROUTE_ROLE_MAP)) {
    if (pathname.startsWith(prefix)) {
      return roles
    }
  }
  return null
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Extract session from cookie
  let user: { id: string; email: string; user_metadata: { role: ActorRole; full_name?: string } } | null = null
  const sessionToken = request.cookies.get('eoi_session')?.value

  if (sessionToken) {
    try {
      const decoded = atob(sessionToken)
      const parsed = JSON.parse(decoded)
      if (parsed.email && parsed.role) {
        user = {
          id: parsed.id,
          email: parsed.email,
          user_metadata: { role: parsed.role, full_name: parsed.name },
        }
      }
    } catch {
      // Invalid session cookie
    }
  }

  // 1. Public routes pass through
  if (isPublicRoute(pathname)) {
    if (pathname === '/login' && user) {
      const role = user.user_metadata.role
      const home = ROLE_HOME[role] ?? '/gov/dashboard'
      return NextResponse.redirect(new URL(home, request.url))
    }
    return NextResponse.next()
  }

  // 3. Unauthenticated users must log in
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 4. Role-based route protection
  const requiredRoles = getRequiredRoles(pathname)
  if (requiredRoles) {
    const userRole = user.user_metadata.role
    if (!requiredRoles.includes(userRole)) {
      const home = ROLE_HOME[userRole] ?? '/login'
      const forbiddenUrl = new URL('/403', request.url)
      forbiddenUrl.searchParams.set('attempted', pathname)
      forbiddenUrl.searchParams.set('redirect', home)
      return NextResponse.redirect(forbiddenUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
