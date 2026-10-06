import type { Metadata } from 'next'
import { cvUpdated } from '@/cv/updated'
import { jsonLd } from '@/seo/describe'
import TourText from '@/workbench/TourText'
import Workbench from '@/workbench/Workbench'
import { SHOW_FRUNT } from '@/case-studies/flags'
import { FRUNT } from '@/case-studies/frunt'

export const metadata: Metadata = { alternates: { canonical: '/' } }

export default async function Home() {
  return (
    <>
      {/* The case study's copy reaches the page only while it is visible (published, or a draft in dev). */}
      <Workbench cvUpdated={await cvUpdated()} caseStudy={SHOW_FRUNT ? FRUNT : null} />
      <TourText />
      {/* Who this is, for search engines and AI tools (src/seo/describe.ts). */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, '\\u003c') }} />
    </>
  )
}
