// Photographs the whole board into out/board-light.jpg and out/board-dark.jpg (2880 px wide): the
// picture phones explore by pinching and dragging ("Explore the board" in the guide panel). Safari
// zooms an image on the GPU without redrawing anything, which the live board can't do on a phone.
// Run after `next build`:
//
//   npm run board   → out/board-*.jpg, plus copies in public/ for the dev server
import { copyFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { launch, serveOut } from './headless.mjs'

const WIDTH = 2880
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'out')
const { origin, close } = await serveOut(outDir)
const browser = await launch()
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(`${origin}/`, { waitUntil: 'networkidle' })
  // The board's full extent, then a viewport exactly that shape at the photo's width.
  const { w, h } = await page.evaluate(() => { const el = document.querySelector('.world'); return { w: el.offsetWidth, h: el.scrollHeight } })
  const s = WIDTH / w
  await page.setViewportSize({ width: WIDTH, height: Math.round(h * s) })
  // The overview look (nothing dimmed, no camera), with the page's own chrome hidden.
  await page.evaluate(() => document.body.classList.add('overview'))
  await page.addStyleTag({ content: `
    .bar, .cap, .mini, .mcursor, .you { display: none !important; }
    .world { transform: scale(${s}) !important; transition: none !important; }
    .stage { background-size: ${48 * s}px ${48 * s}px !important; background-position: 0 0 !important; }
    *, *::before, *::after { animation: none !important; transition: none !important; }` })
  for (const theme of ['light', 'dark']) {
    await page.evaluate((t) => { document.documentElement.dataset.theme = t }, theme)
    await page.evaluate(() => document.fonts.ready)
    // Every image that shows has to have arrived, including the live ones from GitHub.
    await page.waitForFunction(() => [...document.querySelectorAll('.world img')]
      .filter((i) => getComputedStyle(i).display !== 'none' && i.offsetParent)
      .every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 30000 }).catch(() => console.warn(`board-${theme}: some images had not loaded`))
    await page.waitForTimeout(300)
    const target = join(outDir, `board-${theme}.jpg`)
    await page.screenshot({ path: target, type: 'jpeg', quality: 80 })
    if (!process.env.CI) await copyFile(target, join(root, 'public', `board-${theme}.jpg`))
    console.log(`Board picture: ${target}`)
  }
} finally {
  await browser.close()
  close()
}
