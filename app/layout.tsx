import type { Metadata, Viewport } from 'next'
import './globals.css'
import { GuidedTour } from '@/components/GuidedTour'
import { KioskLockdown } from '@/components/security/KioskLockdown'

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
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('eoi_theme');
                if (t === 'dark') {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>
        {children}
        <GuidedTour />
        <KioskLockdown />
      </body>
    </html>
  )
}
