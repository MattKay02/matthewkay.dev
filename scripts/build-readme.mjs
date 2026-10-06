// Photographs the README visuals (app/readme/<product>/) in light and dark into
// out/readme/<product>/<name>-<theme>.png, at 2x for sharp text on GitHub. The
// case-study READMEs link to these, so they keep the site's design and current
// store statuses. Run after `next build`:  npm run readme
import { mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { launch, serveOut } from './headless.mjs'

const PRODUCTS = ['frunt']

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'out')
const { origin, close } = await serveOut(outDir)
const browser = await launch()
try {
  for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
    await context.addInitScript((t) => { try { localStorage.setItem('wb-theme', t) } catch { /* no storage: light */ } }, theme)
    const page = await context.newPage()
    for (const product of PRODUCTS) {
      await page.goto(`${origin}/readme/${product}/`, { waitUntil: 'networkidle' })
      await page.evaluate(() => document.fonts.ready)
      const dir = join(outDir, 'readme', product)
      await mkdir(dir, { recursive: true })
      for (const shot of await page.locator('.rk[data-shot]').all()) {
        const name = await shot.getAttribute('data-shot')
        await shot.screenshot({ path: join(dir, `${name}-${theme}.png`) })
        console.log(`README visual: readme/${product}/${name}-${theme}.png`)
      }
    }
    await context.close()
  }
} finally {
  await browser.close()
  close()
}
