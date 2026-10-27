import type { Metadata } from 'next'
import { jsonLd } from '@/seo/describe'
import TourText from '@/workbench/TourText'
import Workbench from '@/workbench/Workbench'
import { SHOW_FRUNT, SHOW_MGK } from '@/case-studies/flags'
import { FRUNT } from '@/case-studies/frunt'
import { MGKFITNESS } from '@/case-studies/mgkfitness'

export const metadata: Metadata = { alternates: { canonical: '/' } }

export default function Home() {
  return (
    <>
      {/* A case study's copy reaches the page only while it is visible (published, or a draft in dev and previews). */}
      <Workbench caseStudies={[...(SHOW_FRUNT ? [FRUNT] : []), ...(SHOW_MGK ? [MGKFITNESS] : [])]} />
      <TourText />
      {/* Who this is, for search engines and AI tools (src/seo/describe.ts). */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, '\\u003c') }} />
    </>
  )
}
