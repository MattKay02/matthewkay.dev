// Server-side only (runs at build): the date the CV data last changed in git, so
// "Updated" means the content changed, not that the site was rebuilt.
//
// Vercel clones only recent history, and in a shallow clone `git log` would
// report the oldest fetched commit instead of the real change. So when the
// clone is shallow, ask GitHub's API for the last commit that touched cv.ts.
import { execSync } from 'node:child_process'

const FILE = 'src/data/cv.ts'

function git(cmd: string): string {
  try { return execSync(`git ${cmd}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { return '' }
}

async function fromGitHub(): Promise<string> {
  const repo = process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
    ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
    : 'MattKay02/MattKay02.github.io'
  const ref = process.env.VERCEL_GIT_COMMIT_SHA || git('rev-parse HEAD') || 'main'
  const headers: Record<string, string> = { 'User-Agent': 'mattkay02-portfolio', Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/commits?path=${FILE}&sha=${ref}&per_page=1`, { headers })
    if (!res.ok) return ''
    const [last] = await res.json()
    return last?.commit?.committer?.date?.slice(0, 10) ?? ''
  } catch { return '' }
}

// One lookup per build (both pages ask). Not in dev, where the server outlives edits to cv.ts.
let cached: Promise<string> | undefined

export function cvUpdated(): Promise<string> {
  if (process.env.NODE_ENV !== 'production') cached = undefined
  cached ??= (async () => {
    const shallow = git('rev-parse --is-shallow-repository') !== 'false'
    const iso = (!shallow && git(`log -1 --format=%cs -- ${FILE}`)) || (await fromGitHub()) || new Date().toISOString().slice(0, 10)
    const d = new Date(iso + 'T00:00:00Z')
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  })()
  return cached
}
