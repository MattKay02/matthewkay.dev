// The parts of each flagship: tiles on the board, chips in the guide panel, and
// the site's text version for search engines and AI tools (src/seo/describe.ts).
// Statuses that depend on the stores come from apps.tsx, never typed by hand.
import { appStatus } from './apps'
import type { Cluster } from './stops'

export interface Part { name: string; status: string; live?: boolean; line: string; tech: string; focus: string }

export const FRUNT_PARTS: Part[] = [
  { name: 'Manager app', status: 'Live', live: true, line: 'Documents in; training, a rota and sourced answers out.', tech: 'Next.js · Supabase pgvector · Claude · Inngest · Stripe', focus: '2230,400,1440,980' },
  { name: 'Staff app', status: 'Live', live: true, line: 'Ask, read, sign off and train from a phone. On the App Store and Google Play.', tech: 'Flutter · Firebase messaging', focus: '3700,640,740,740' },
  { name: 'Website', status: 'Live', live: true, line: 'Marketing site, pricing and ten UK-law guides, built to be found.', tech: 'Next.js · structured data · llms.txt', focus: '3700,70,740,560' },
  { name: 'Admin console', status: 'In use', line: 'How I run the business: customers, revenue, AI cost per feature, health checks.', tech: 'Stripe · PostHog · Sentry · GitHub + Vercel APIs', focus: 'self' },
  { name: 'Instagram studio', status: 'Live', live: true, line: 'Claude proposes posts and I approve them; they render, schedule, publish and report back.', tech: 'Instagram API · Inngest · Satori', focus: 'self' },
  { name: 'Outreach + analytics', status: 'In use', line: 'Sourcing, email, calls and visits, with PostHog and Search Console showing what works.', tech: 'Notion · Gmail · Vercel cron · Search Console', focus: 'self' },
]

const run = appStatus('run'), lift = appStatus('lift')
const appState = (live: boolean) => (live ? 'Live' : 'In development')

export const MGK_PARTS: Part[] = [
  { name: 'Run', status: appState(run.live), live: run.live, line: 'Running tracker with an AI training coach.', tech: 'Flutter · GPS · shared design system', focus: '3580,2560,580,650' },
  { name: 'Lift', status: appState(lift.live), live: lift.live, line: 'Strength log with a coach of its own. The rebuild of Liftio.', tech: 'Flutter · shared design system', focus: '2800,2560,580,650' },
  { name: 'Backend + AI coach', status: run.live ? 'Live' : 'Built', live: run.live, line: 'One account across both apps. The coach plans around your whole week.', tech: 'Supabase · Edge Functions · OpenRouter · RevenueCat', focus: 'self' },
  { name: 'Website', status: 'Live', live: true, line: 'Scroll film, waiting list, support and legal pages. No tracking, by design.', tech: 'Next.js 16 · Replicate clips', focus: '3860,2080,660,470' },
  { name: 'Social', status: 'In development', line: "Posts drawn in Remotion from the site's own words, published through the Instagram API.", tech: 'Remotion · Instagram API', focus: 'self' },
  { name: 'Release ops', status: 'In use', line: 'Store listings and submissions run from Claude Code; builds on Codemagic.', tech: 'App Store Connect · Google Play · Codemagic', focus: 'self' },
]

/** Tile ids per cluster, so the guide panel can offer them as chips. */
export const PART_IDS: Partial<Record<Cluster, { id: string; name: string }[]>> = {
  frunt: FRUNT_PARTS.map((p, i) => ({ id: `ft${i + 1}`, name: p.name })),
  mgk: MGK_PARTS.map((p, i) => ({ id: `mt${i + 1}`, name: p.name })),
}
