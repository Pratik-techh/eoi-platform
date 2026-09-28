import type { Metadata } from 'next'
import Link from 'next/link'
import { StatusChip } from '@/components/StatusChip'

export const metadata: Metadata = {
  title: 'Notifications | Student',
  description: 'Realtime alerts regarding verification, employment, and dispute outcomes',
}

export default async function StudentNotificationsPage() {
  const notifications = [
    {
      id: 'notif-01',
      title: 'Employment Confirmed',
      message: 'Google India Pvt. Ltd. confirmed your employment as Software Engineer. Your Employability Passport has been updated.',
      date: '12 Aug 2026',
      link: '/student/dashboard',
      read: true,
      status: 'VERIFIED' as const,
    },
    {
      id: 'notif-02',
      title: 'Assessment Certificate Issued',
      message: 'National Skill Certification Panel published your verified assessment credential for Full Stack Web Development (Score: 94.4/100).',
      date: '28 Jul 2026',
      link: '/student/passport',
      read: true,
      status: 'VERIFIED' as const,
    },
    {
      id: 'notif-03',
      title: 'Job Readiness Score Calculated',
      message: 'Your readiness score was computed as 94.4/100 under NSQF Level 5 formula. Qualified for enterprise interview pipelines.',
      date: '25 Jul 2026',
      link: '/student/skills',
      read: true,
      status: 'VERIFIED' as const,
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Notification Inbox</h1>
            <p className="page-header__description">
              Event-driven updates regarding your verified employment milestones and credentials
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', maxWidth: '720px' }}>
        {notifications.map(n => (
          <div
            key={n.id}
            style={{
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)',
              padding: 'var(--sp-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)' }}>
                  {n.title}
                </span>
                <StatusChip status={n.status} />
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', margin: '4px 0 8px', lineHeight: 1.4 }}>
                {n.message}
              </p>
              <div style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{n.date}</span>
                <Link href={n.link} style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                  View details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
