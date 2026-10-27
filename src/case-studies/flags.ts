// Whether each case study is public. Kept apart from the content so the board
// can ask without pulling the whole case study into the browser bundle.
import stats from '@/data/frunt-stats.json'
import mgk from '@/data/mgk-stats.json'

/** Matthew approved the frunt case study's copy (6 Oct 2026). */
const FRUNT_APPROVED = true

/**
 * The case study quotes frunt's answer-accuracy eval after the allergen-gate
 * fix (Matthew's call, 6 Oct 2026). So it publishes itself only once that
 * eval passes its whole safety floor in a record on frunt-web's `main`, which
 * means the fix is live in production, not just written. `npm run frunt`
 * (every build) reads the record, so publishing needs no edit here.
 */
const run = stats.eval as null | { ref: string; safety: { passed: number; total: number } }
export const FRUNT_EVAL_LIVE = !!run && run.ref === 'main' && run.safety.total > 0 && run.safety.passed === run.safety.total

export const FRUNT_PUBLISHED = FRUNT_APPROVED && FRUNT_EVAL_LIVE

/**
 * Drafts show in `npm run dev` and on Vercel preview deployments (which sit
 * behind Vercel's login), so they can be reviewed; never on the production site.
 */
const DRAFTS = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'

export const SHOW_FRUNT = FRUNT_PUBLISHED || DRAFTS

/** Matthew has read and approved the MGKFitness case study's copy. Not yet: drafted 27 Oct 2026. */
const MGK_APPROVED = false

/**
 * Its consent card says the coach checks AI consent at the server for both apps
 * (Matthew's call, 27 Oct 2026: wait for both). So it publishes only once both
 * are in the coach's CONSENT_KEYS on mgk-fitness's `main`, which `npm run mgk`
 * (every build) reads: shipped with the apps, not just written.
 */
export const MGK_CONSENT_LIVE = mgk.consent.run && mgk.consent.lift

export const MGK_PUBLISHED = MGK_APPROVED && MGK_CONSENT_LIVE

export const SHOW_MGK = MGK_PUBLISHED || DRAFTS

/** By slug, for what every case study does alike (the viewer's "draft" label, the sitemap). */
export const PUBLISHED: Record<string, boolean> = { frunt: FRUNT_PUBLISHED, mgkfitness: MGK_PUBLISHED }
