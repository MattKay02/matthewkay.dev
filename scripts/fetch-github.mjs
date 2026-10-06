// Pulls Matthew's GitHub contribution calendar into src/data/github.json, which
// the hero draws as its contribution graph.
//
//   npm run github
//
// Auth: GITHUB_TOKEN when set (CI), otherwise the signed-in gh CLI. Only counts
// per day are stored; no repository names, so private work stays private.
// The deploy workflow runs this before every build and on a daily schedule,
// which is what keeps the graph current on a static site.

import { execSync } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const LOGIN = 'MattKay02'
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'github.json')

const token = process.env.GITHUB_TOKEN || execSync('gh auth token', { encoding: 'utf8' }).trim()
const query = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`

const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'mattkay02-portfolio' },
  body: JSON.stringify({ query, variables: { login: LOGIN } }),
})
if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}: ${await res.text()}`)
const json = await res.json()
if (json.errors) throw new Error(JSON.stringify(json.errors))

const LEVEL = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 }
const cal = json.data.user.contributionsCollection.contributionCalendar
const data = {
  login: LOGIN,
  generatedAt: new Date().toISOString(),
  total: cal.totalContributions,
  weeks: cal.weeks.map((w) => w.contributionDays.map((d) => ({ d: d.date, c: d.contributionCount, l: LEVEL[d.contributionLevel] ?? 0 }))),
}

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify(data))
console.log(`github.json: ${data.total} contributions over ${data.weeks.length} weeks`)

// The skills shelf reads skills.json live in the browser; this snapshot is its
// fallback for when GitHub can't be reached. Publishing a skill never needs a
// change here; refreshing the snapshot just keeps the fallback close.
const SKILLS = 'https://raw.githubusercontent.com/MattKay02/skills/main/skills.json'
const skillsRes = await fetch(SKILLS)
if (skillsRes.ok) {
  const manifest = await skillsRes.json()
  writeFileSync(join(dirname(out), 'skills.json'), JSON.stringify(manifest, null, 2) + '\n')
  console.log(`skills.json: ${manifest.skills.length} skills`)
} else {
  console.warn(`skills.json not refreshed (${skillsRes.status}); keeping the committed snapshot`)
}

// Test results for the skills (generated in the skills repo from its eval runs),
// shown on each skill's card in How I work. Same live fetch + snapshot pattern.
const TESTS = 'https://raw.githubusercontent.com/MattKay02/skills/main/tests.json'
const testsRes = await fetch(TESTS)
if (testsRes.ok) {
  const tests = await testsRes.json()
  writeFileSync(join(dirname(out), 'skill-tests.json'), JSON.stringify(tests, null, 2) + '\n')
  console.log(`skill-tests.json: ${Object.keys(tests.skills ?? {}).length} skills tested`)
} else {
  console.warn(`skill-tests.json not refreshed (${testsRes.status}); keeping the committed snapshot`)
}
