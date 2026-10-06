import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Inter, Space_Grotesk } from 'next/font/google'
import { DESCRIPTION, SITE, TITLE } from '@/seo/describe'
import './globals.css'

const display = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-display' })
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' })

const SHARE = 'A workbench of real, shipped work: frunt, MGKFitness and how I build.'
// /og.png is generated on every deploy by scripts/build-og.mjs from app/og/page.tsx.
const OG_IMAGE = { url: '/og.png', width: 1200, height: 630, alt: 'Matthew Kay, product engineer: frunt, Run and Lift' }

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE),
  icons: { icon: '/favicon.svg' },
  openGraph: { title: TITLE, description: SHARE, type: 'website', siteName: 'Matthew Kay', locale: 'en_GB', images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', title: TITLE, description: SHARE, creator: '@mattykay2002', images: [OG_IMAGE] },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ebebeb',
}

// Applies a saved dark theme before first paint, so the page never flashes light first.
const themeScript = `try{if(localStorage.getItem("wb-theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
