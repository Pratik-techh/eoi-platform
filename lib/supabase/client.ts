'use client'

/**
 * Browser-side client.
 * Calls auth endpoints and supports client-side data operations.
 */
export function createClient() {
  return {
    auth: {
      async signInWithPassword({ email, password }: { email: string; password: string }) {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          const json = await res.json()
          if (!res.ok) {
            return { data: { user: null }, error: new Error(json.error ?? 'Authentication failed') }
          }
          return { data: { user: json.user }, error: null }
        } catch (err: unknown) {
          return { data: { user: null }, error: err as Error }
        }
      },

      async signOut() {
        try {
          await fetch('/api/auth/logout', { method: 'POST' })
          return { error: null }
        } catch (err: unknown) {
          return { error: err as Error }
        }
      },

      async getUser() {
        try {
          const res = await fetch('/api/auth/user')
          const json = await res.json()
          return { data: { user: json.user }, error: null }
        } catch (err: unknown) {
          return { data: { user: null }, error: err as Error }
        }
      },
    },
  }
}
