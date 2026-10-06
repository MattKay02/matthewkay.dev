// Whether each case study is public. Kept apart from the content so the board
// can ask without pulling the whole case study into the browser bundle.
//
// frunt stays unpublished until its answer-accuracy eval passes the safety floor
// after the allergen-gate fix (frunt-web docs/allergen-gate-unmatched-dish.md):
// Matthew's call, 6 Oct 2026. The publishing checklist is in CLAUDE.md.
export const FRUNT_PUBLISHED = false

/** Drafts show in `npm run dev` so they can be reviewed; never in the built site. */
export const SHOW_FRUNT = FRUNT_PUBLISHED || process.env.NODE_ENV === 'development'
