// Server-side only (runs at build): the date the CV data last changed in git, so
// "Updated" means the content changed, not that the site was rebuilt.
import { execSync } from 'node:child_process'

export function cvUpdated(): string {
  let iso = ''
  try { iso = execSync('git log -1 --format=%cs -- src/data/cv.ts', { encoding: 'utf8' }).trim() } catch { /* no git: use today */ }
  const d = new Date((iso || new Date().toISOString().slice(0, 10)) + 'T00:00:00Z')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}
