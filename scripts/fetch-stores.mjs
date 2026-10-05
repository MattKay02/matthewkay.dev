// Checks every app's store listings and writes src/data/stores.json, which the
// site and the CV read to decide what to call "live" and which store buttons
// to show. Nothing about release status is ever typed by hand.
//
//   npm run stores
//
// App Store: Apple's public lookup API (UK store). A listing can set a
// minVersion, so Lift's page (which still carries Liftio 1.4 until Lift 2.0 is
// approved) only counts once it reaches 2.0.0.
// Google Play: the listing page in the UK store returns 200 only once published.
// The deploy runs this before every build and daily; if a check fails, the
// committed snapshot is kept.
import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data')
const apps = JSON.parse(await readFile(join(dataDir, 'apps.json'), 'utf8'))

const newer = (a, b) => {
  const pa = a.split('.').map(Number), pb = b.split('.').map(Number)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) > (pb[i] ?? 0)
  }
  return true // equal counts as reaching it
}

async function apple({ id, url, minVersion }) {
  const res = await fetch(`https://itunes.apple.com/lookup?id=${id}&country=gb`)
  if (!res.ok) throw new Error(`App Store lookup ${id}: ${res.status}`)
  const r = (await res.json()).results?.[0]
  if (!r) return { live: false }
  const live = !minVersion || newer(r.version, minVersion)
  return { live, url, version: r.version, updated: r.currentVersionReleaseDate?.slice(0, 10) }
}

async function google(pkg) {
  const url = `https://play.google.com/store/apps/details?id=${pkg}`
  const res = await fetch(`${url}&hl=en_GB&gl=GB`, { redirect: 'follow' })
  if (res.status !== 200 && res.status !== 404) throw new Error(`Google Play ${pkg}: ${res.status}`)
  return { live: res.status === 200, url }
}

const out = { checkedAt: new Date().toISOString(), apps: {} }
for (const [key, app] of Object.entries(apps)) {
  out.apps[key] = { apple: await apple(app.apple), google: await google(app.google) }
  const a = out.apps[key]
  console.log(`${key}: App Store ${a.apple.live ? 'live' : 'not live'}${a.apple.version ? ` (v${a.apple.version})` : ''}, Google Play ${a.google.live ? 'live' : 'not live'}`)
}
await writeFile(join(dataDir, 'stores.json'), JSON.stringify(out, null, 2) + '\n')
