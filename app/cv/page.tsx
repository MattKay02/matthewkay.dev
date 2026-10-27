// The CV as a page, printed by scripts/build-cv.mjs to the PDF that's emailed
// on request. Not on the public site: there it renders the 404 (src/cv/flags.ts).
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CvPageShell } from '@/cv/CvPage'
import { SHOW_CV } from '@/cv/flags'
import { cvUpdated } from '@/cv/updated'

export const metadata: Metadata = {
  title: 'Matthew Kay · CV',
  robots: { index: false, follow: false },
}

export default async function CvPage() {
  if (!SHOW_CV) notFound()
  return <CvPageShell updated={await cvUpdated()} />
}
