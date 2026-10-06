// Reads each product's bare screens from its own /studio.json into
// src/data/screens.json, so the board shows the product's current screens
// and a recapture there needs no change here.
//
//   npm run screens
//
// Each product lists its screens by stable id (the `screens` field of the
// studio contract, documented in MGKCodes/MGKCodes lib/studio.ts). The board
// loads each image straight from the product's site, so replacing a file
// there shows here as soon as the product deploys; a new or renamed screen
// arrives with the next build here (daily). Every image is checked before it
// is kept: one that doesn't load is left out, and the board falls back to its
// saved copy in public/work. A product that can't be reached keeps its last
// snapshot.

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const FEEDS = {
  frunt: 'https://frunthospitality.com/studio.json',
  mgkfitness: 'https://mgkfitness.mgkcodes.com/studio.json',
}
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'screens.json')

let previous = { products: {} }
try { previous = JSON.parse(readFileSync(out, 'utf8')) } catch { /* first run */ }

const loads = async (url) => {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(10000) })
    return res.ok && (res.headers.get('content-type') ?? '').startsWith('image/')
  } catch {
    return false
  }
}

const products = {}
for (const [product, feed] of Object.entries(FEEDS)) {
  try {
    const res = await fetch(feed, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) throw new Error(`${res.status}`)
    const data = await res.json()
    const listed = Array.isArray(data.screens) ? data.screens : []
    const screens = {}
    const dropped = []
    for (const s of listed) {
      if (typeof s?.id !== 'string' || typeof s?.src !== 'string') continue
      const src = new URL(s.src, feed).href
      if (!(await loads(src))) { dropped.push(s.id); continue }
      screens[s.id] = {
        surface: s.surface === 'web' ? 'web' : 'phone',
        src,
        width: Number(s.width) || 0,
        height: Number(s.height) || 0,
        alt: typeof s.alt === 'string' ? s.alt : '',
      }
    }
    products[product] = { feed, fetchedAt: new Date().toISOString(), screens }
    console.log(`${product}: ${Object.keys(screens).length} screens${listed.length ? '' : ' (no screens list yet: the board uses its saved copies)'}${dropped.length ? `; left out, didn't load: ${dropped.join(', ')}` : ''}`)
  } catch (e) {
    products[product] = previous.products?.[product] ?? { feed, fetchedAt: null, screens: {} }
    console.warn(`${product}: feed unreachable (${e.message}); keeping the last snapshot`)
  }
}

writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), products }, null, 2) + '\n')
