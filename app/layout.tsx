import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const display = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-display' })
const body = Inter({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-body' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Matthew Kay · Product engineer',
  description: 'I design and build polished apps, end to end: frunt, MGKFitness and the studio behind them, MGKCodes.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Matthew Kay · Product engineer',
    description: 'A workbench of real, shipped work: frunt, MGKFitness and how I build.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ebebeb',
}

// Applies a saved or linked look (#paper, #studio, #brutal) before first paint, so it never flashes.
const lookScript = `try{var s=location.hash.slice(1);if(!/^(paper|studio|brutal)$/.test(s))s=localStorage.getItem("wb-style");if(/^(paper|studio|brutal)$/.test(s))document.documentElement.dataset.style=s}catch(e){}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: lookScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
