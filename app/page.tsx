import type { Metadata } from 'next'
import { cvUpdated } from '@/cv/updated'
import { jsonLd } from '@/seo/describe'
import TourText from '@/workbench/TourText'
import Workbench from '@/workbench/Workbench'

export const metadata: Metadata = { alternates: { canonical: '/' } }

export default async function Home() {
  return (
    <>
      <Workbench cvUpdated={await cvUpdated()} />
      <TourText />
      {/* Who this is, for search engines and AI tools (src/seo/describe.ts). */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, '\\u003c') }} />
    </>
  )
}
