// MGKFitness's "how it was built" stop (see boards.ts). Dates are from the
// mgk-fitness repo's history and decision records (Run 0049, Lift 0004) and the
// stores, read on 27 Oct 2026. The story starts at Run; Liftio is background.
import type { CaseBoard } from './boards'

export const MGK_BOARD: CaseBoard = {
  slug: 'mgkfitness',
  name: 'MGKFitness',
  history: 'the MGKFitness repo',
  milestones: [
    { date: '2026-07-25', label: 'Started Run, with seven decision records' },
    { date: '2026-08-06', label: 'Both apps in one repo, on one backend' },
    { date: '2026-08-17', label: 'Decided Lift replaces Liftio' },
    { date: '2026-08-18', label: 'Android became a target' },
    { date: '2026-10-02', label: 'Run sent to both stores' },
    { date: '2026-10-05', label: 'Run on Google Play' },
    { date: '2026-10-06', label: 'Lift on Google Play' },
    { date: '2026-10-07', label: 'The code went public' },
    { date: '2026-10-08', label: 'Lift on the App Store' },
    { date: '2026-10-19', label: 'Run on the App Store' },
  ],
  decisions: [
    'One backend for both apps, with every row locked to the person it belongs to.',
    "The coach can't make up a weight: plain code checks every plan it writes.",
    'Liftio rebuilt in Flutter, and shipped as an update to itself.',
  ],
}
