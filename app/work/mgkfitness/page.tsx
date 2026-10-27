// The MGKFitness case study as a standalone page: the same sheet as the viewer
// over the board (/#mgkfitness). Not built into the site until MGK_PUBLISHED is
// true; `npm run dev` and Vercel previews show the draft.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudyPageShell } from '@/case-studies/CaseStudyViewer'
import { MGK_PUBLISHED, SHOW_MGK } from '@/case-studies/flags'
import { MGKFITNESS } from '@/case-studies/mgkfitness'

export const metadata: Metadata = {
  title: 'MGKFitness · case study · Matthew Kay',
  description: 'How I built Run and Lift, two fitness apps on one account with an AI coach whose plans are checked by code: why, the decisions, what went wrong and what I learnt.',
  alternates: { canonical: '/work/mgkfitness/' },
  ...(MGK_PUBLISHED ? {} : { robots: { index: false, follow: false } }),
}

export default function MgkFitnessCaseStudy() {
  if (!SHOW_MGK) notFound()
  return <CaseStudyPageShell study={MGKFITNESS} />
}
