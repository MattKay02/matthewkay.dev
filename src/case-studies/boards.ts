// What each case study's "how it was built" stop shows on the board: the
// milestones on its dated ruler and three decisions in the guide panel. Short on
// purpose; the case study itself holds the full story.
//
// Unlike the case studies, these strings are in the browser bundle even while a
// case study is unpublished (nothing renders them until then), so nothing goes
// here that isn't ready to be public.
import { FRUNT_BOARD } from './frunt-board'
import { MGK_BOARD } from './mgk-board'

export interface Milestone { date: string; label: string }

export interface CaseBoard {
  /** The case study's slug: /work/<slug>/ and /#<slug>. */
  slug: string
  name: string
  /** Where the ruler's dates come from, for its heading. */
  history: string
  milestones: Milestone[]
  decisions: string[]
}

export const CASE_BOARDS: Record<string, CaseBoard> = { frunt: FRUNT_BOARD, mgkfitness: MGK_BOARD }
