// Counts MGKFitness's build figures from its repo into src/data/mgk-stats.json,
// so the case study's numbers are never typed by hand and never go stale.
//
//   npm run mgk
//
// One GitHub API call lists every file on mgk-fitness's main branch (what was
// last submitted to the stores); the figures are counts of paths, nothing more.
// It also reads which apps the coach checks AI consent for (CONSENT_KEYS in
// supabase/functions/coach/consent.ts on main), which decides whether the case
// study may publish (src/case-studies/flags.ts), and says which decision records
// are newer than the case study's `lastAdrRead`, which is where the next update
// starts.
//
// The repo is public, so any token will do (GITHUB_TOKEN on Vercel, else the
// signed-in gh CLI, else none, within GitHub's anonymous rate limit). If it
// fails, the build keeps the committed snapshot.

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = 'MGKCodes/mgk-fitness'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'src', 'data', 'mgk-stats.json')

let token = process.env.GITHUB_TOKEN
if (!token) try { token = execSync('gh auth token', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { /* anonymous */ }
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'mattkay02-portfolio', ...(token && { Authorization: `Bearer ${token}` }) }

async function get(path) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/${path}`, { headers })
  if (!res.ok) throw Object.assign(new Error(`GitHub ${res.status} for ${path}`), { status: res.status })
  return res.json()
}

const main = await get('branches/main')
const tree = await get(`git/trees/${main.commit.sha}?recursive=1`)
if (tree.truncated) throw new Error('mgk-fitness tree came back truncated; counts would be wrong')
const files = tree.tree.filter((t) => t.type === 'blob').map((t) => t.path)
const count = (re) => files.filter((p) => re.test(p)).length

// Run and Lift number their decision records separately (both start at 0001).
const adrs = (app) => files.filter((p) => new RegExp(`^apps/mgk_${app}/docs/decisions/\\d{4}-.+\\.md$`).test(p))
const latest = (paths) => paths.map((p) => p.match(/(\d{4})-[^/]+$/)[1]).sort().at(-1) ?? null
const run = adrs('run'), lift = adrs('lift')

// Which apps the coach checks consent for, as shipped on main.
let consent = { run: false, lift: false }
try {
  const f = await get('contents/supabase/functions/coach/consent.ts?ref=main')
  const src = Buffer.from(f.content, 'base64').toString('utf8')
  const keys = src.match(/CONSENT_KEYS[^=]*=\s*{([^}]*)}/)?.[1] ?? ''
  consent = { run: /\brun\s*:/.test(keys), lift: /\blift\s*:/.test(keys) }
} catch (e) {
  if (e.status !== 404) throw e
}

const data = {
  generatedAt: new Date().toISOString(),
  ref: 'main',
  commit: main.commit.sha.slice(0, 7),
  decisionRecords: run.length + lift.length,
  latestAdr: { run: latest(run), lift: latest(lift) },
  testFiles: count(/(_test\.dart|_test\.ts)$|^supabase\/tests\/.+\.sql$/),
  migrations: count(/^supabase\/migrations\/.+\.sql$/),
  edgeFunctions: count(/^supabase\/functions\/[^/]+\/index\.ts$/),
  consent,
}
writeFileSync(out, JSON.stringify(data, null, 2) + '\n')
console.log(
  `mgk-stats.json: ${data.decisionRecords} decision records, ${data.testFiles} test files, ${data.migrations} migrations, ` +
    `${data.edgeFunctions} Edge Functions at ${data.commit}; consent checked for ` +
    (Object.entries(consent).filter(([, on]) => on).map(([app]) => app).join(' and ') || 'neither app'),
)

// Where the next case-study update starts.
const study = readFileSync(join(root, 'src', 'case-studies', 'mgkfitness.ts'), 'utf8')
const read = study.match(/lastAdrRead: 'Run (\d{4}) and Lift (\d{4})'/)
if (read) {
  const newer = [...run.filter((p) => p.match(/(\d{4})-[^/]+$/)[1] > read[1]), ...lift.filter((p) => p.match(/(\d{4})-[^/]+$/)[1] > read[2])]
  if (newer.length) console.log(`\nThe MGKFitness case study was last checked up to Run ${read[1]} and Lift ${read[2]}. Newer on main:\n  ${newer.join('\n  ')}\nRead them, update src/case-studies/mgkfitness.ts, and move lastAdrRead + checked.`)
}
