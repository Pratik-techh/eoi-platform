import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ActorRole } from '@/lib/supabase/database.types'
import AppShell from '@/components/layout/AppShell'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role = (user.user_metadata?.['role'] as ActorRole | undefined) ?? 'student'

  return <AppShell user={{ id: user.id, email: user.email ?? '', role }}>{children}</AppShell>
}
