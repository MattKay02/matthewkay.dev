// frunt's "how it was built" stop (see boards.ts). Dates are from frunt's git
// history and decision records, read up to ADR 0087 on 6 Oct 2026.
import type { CaseBoard } from './boards'

export const FRUNT_BOARD: CaseBoard = {
  slug: 'frunt',
  name: 'frunt',
  history: "frunt's git history",
  milestones: [
    { date: '2026-05-01', label: 'A demo, to show restaurants the idea' },
    { date: '2026-05-15', label: 'First commit' },
    { date: '2026-05-18', label: 'Working end to end' },
    { date: '2026-06-01', label: 'Live at frunthospitality.com' },
    { date: '2026-06-09', label: 'Staff app on the App Store' },
    { date: '2026-06-13', label: 'Staff app on Google Play' },
    { date: '2026-06-14', label: 'First paying venue' },
    { date: '2026-08-24', label: 'Refocused on the answers' },
    { date: '2026-09-11', label: 'Answers on WhatsApp' },
    { date: '2026-09-21', label: 'Instagram studio live' },
  ],
  decisions: [
    'Allergen answers come from the database and a plain-code check, never from a second AI.',
    'When jobs failed without a word, every job started reporting that it ran.',
    'When features crowded out the answers, I froze them.',
  ],
}
