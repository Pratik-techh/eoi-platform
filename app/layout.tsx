import type { Metadata, Viewport } from 'next'
import './globals.css'
import { GuidedTour } from '@/components/GuidedTour'

export const metadata: Metadata = {
  title: {
    default: 'EOI Platform — Employment Outcome Intelligence',
    template: '%s · EOI Platform',
  },
  description:
    'A secure, automated and verifiable digital layer that follows a learner from training to employment and beyond. SIH 2026 · SIH26135.',
  keywords: ['employment', 'skilling', 'NSDC', 'government', 'outcome intelligence', 'SIH 2026'],
  authors: [{ name: 'EOI Platform Team' }],
  robots: { index: false, follow: false }, // Prototype — do not index
  openGraph: {
    type: 'website',
    title: 'EOI Platform — Employment Outcome Intelligence',
    description: 'Trusted, automated longitudinal outcome intelligence for government skilling programs.',
    siteName: 'EOI Platform',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1D4E89',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <GuidedTour />
      </body>
    </html>
  )
}
