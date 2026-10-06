// Counts frunt's build figures from its repo into src/data/frunt-stats.json, so
// the case study's numbers are never typed by hand and never go stale.
//
//   npm run frunt
//
// One GitHub API call lists every file on frunt-web's main branch; the figures
// are counts of paths, nothing more (no code, no business data). It also reads
// the latest answer-accuracy record (frunt-web ADR 0088) and says how many of
// frunt's decision records are newer than the case study's `lastAdrRead`, which
// is where the next update starts.
//
// Auth: FRUNT_GITHUB_TOKEN (Vercel: a fine-grained token that can only read
// MGKCodes/frunt-web), else GITHUB_TOKEN, else the signed-in gh CLI. frunt-web
// is private, so the token needs read access to it. Without it this
// fails and the build keeps the committed snapshot.

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = 'MGKCodes/frunt-web'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'src', 'data', 'frunt-stats.json')

const token = process.env.FRUNT_GITHUB_TOKEN || process.env.GITHUB_TOKEN || execSync('gh auth token', { encoding: 'utf8' }).trim()
const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'mattkay02-portfolio' }

async function get(path) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/${path}`, { headers })
  if (!res.ok) throw Object.assign(new Error(`GitHub ${res.status} for ${path}`), { status: res.status })
  return res.json()
}

const main = await get('branches/main')
const tree = await get(`git/trees/${main.commit.sha}?recursive=1`)
if (tree.truncated) throw new Error('frunt-web tree came back truncated; counts would be wrong')
const files = tree.tree.filter((t) => t.type === 'blob').map((t) => t.path)

const adrs = files.filter((p) => /^docs\/architecture-decisions\/\d{4}-.+\.md$/.test(p))
const latestAdr = adrs.map((p) => p.match(/(\d{4})-/)[1]).sort().at(-1)
const count = (re) => files.filter((p) => re.test(p)).length

// The latest eval record. It lands on develop first; main once released.
let evalRun = null
for (const ref of ['main', 'develop']) {
  try {
    const f = await get(`contents/evals/answers/results/latest.json?ref=${ref}`)
    const r = JSON.parse(Buffer.from(f.content, 'base64').toString('utf8'))
    evalRun = { ref, date: r.date, commit: r.commit, model: r.model, questions: r.questions, scored: r.scored, safety: r.safety }
    break
  } catch (e) {
    if (e.status !== 404) throw e
  }
}

const data = {
  generatedAt: new Date().toISOString(),
  ref: 'main',
  commit: main.commit.sha.slice(0, 7),
  decisionRecords: adrs.length,
  latestAdr,
  apiRoutes: count(/^src\/app\/api\/.+\/route\.tsx?$/),
  pages: count(/^src\/app\/.*page\.tsx$/),
  migrations: count(/^supabase\/migrations\/.+\.sql$/),
  testFiles: count(/\.test\.tsx?$/),
  eval: evalRun,
}
writeFileSync(out, JSON.stringify(data, null, 2) + '\n')
console.log(
  `frunt-stats.json: ${data.decisionRecords} decision records, ${data.apiRoutes} API routes, ` +
    `${data.migrations} migrations, ${data.testFiles} test files at ${data.commit}` +
    (evalRun ? `; eval ${evalRun.scored.passed}/${evalRun.scored.total}, safety ${evalRun.safety.passed}/${evalRun.safety.total} (${evalRun.date}, ${evalRun.ref})` : '; no eval record yet')
)

// Where the next case-study update starts.
const study = readFileSync(join(root, 'src', 'case-studies', 'frunt.ts'), 'utf8')
const lastRead = study.match(/lastAdrRead: '(\d{4})'/)?.[1]
if (lastRead && latestAdr && latestAdr > lastRead) {
  const newer = adrs.filter((p) => p.match(/(\d{4})-/)[1] > lastRead).map((p) => p.split('/').pop())
  console.log(`\nThe frunt case study was last checked up to ADR ${lastRead}. Newer on main:\n  ${newer.join('\n  ')}\nRead them, update src/case-studies/frunt.ts, and move lastAdrRead + checked.`)
}
