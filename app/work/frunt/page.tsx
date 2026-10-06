// The frunt case study as a standalone page: the same sheet as the viewer over
// the board (/#frunt). Not built into the site until FRUNT_PUBLISHED is true;
// `npm run dev` shows the draft.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudyPageShell } from '@/case-studies/CaseStudyViewer'
import { FRUNT_PUBLISHED, SHOW_FRUNT } from '@/case-studies/flags'
import { FRUNT } from '@/case-studies/frunt'

export const metadata: Metadata = {
  title: 'frunt · case study · Matthew Kay',
  description: "How I built frunt, a live SaaS that turns a restaurant's documents into cited answers and staff training: why, the decisions, what went wrong and what I learnt.",
  alternates: { canonical: '/work/frunt/' },
  ...(FRUNT_PUBLISHED ? {} : { robots: { index: false, follow: false } }),
}

export default function FruntCaseStudy() {
  if (!SHOW_FRUNT) notFound()
  return <CaseStudyPageShell study={FRUNT} />
}
