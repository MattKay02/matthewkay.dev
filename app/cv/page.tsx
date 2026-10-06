// The standalone CV page: the same viewer design as on the workbench. Printed by
// scripts/build-cv.mjs to /cv.pdf.
import type { Metadata } from 'next'
import { CvPageShell } from '@/cv/CvViewer'
import { cvUpdated } from '@/cv/updated'

export const metadata: Metadata = {
  title: 'Matthew Kay · CV',
  description: 'CV of Matthew Kay, product engineer and founder of MGKCodes.',
  alternates: { canonical: '/cv/' },
}

export default async function CvPage() {
  return <CvPageShell updated={await cvUpdated()} />
}
