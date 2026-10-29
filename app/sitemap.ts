// /sitemap.xml, written at build. The frunt case study joins it by itself
// once it is published (src/case-studies/flags.ts).
import type { MetadataRoute } from 'next'
import { FRUNT_PUBLISHED, MGK_PUBLISHED } from '@/case-studies/flags'

export const dynamic = 'force-static'

const SITE = 'https://matthewkay.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: 'weekly', priority: 1 },
    ...(FRUNT_PUBLISHED ? [{ url: `${SITE}/work/frunt/`, changeFrequency: 'monthly' as const, priority: 0.9 }] : []),
    ...(MGK_PUBLISHED ? [{ url: `${SITE}/work/mgkfitness/`, changeFrequency: 'monthly' as const, priority: 0.9 }] : []),
  ]
}
