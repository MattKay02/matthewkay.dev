// Photographs /og/ into out/og.png (1200 × 630): the image LinkedIn, X and
// messaging apps show for a link to the site. Run after `next build`:
//
//   npm run og    → out/og.png, plus a copy in public/og.png for the dev server
import { copyFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { launch, serveOut } from './headless.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'out')
const { origin, close } = await serveOut(outDir)
const browser = await launch()
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await page.goto(`${origin}/og/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const target = join(outDir, 'og.png')
  await page.locator('.og').screenshot({ path: target })
  if (!process.env.CI) await copyFile(target, join(root, 'public', 'og.png'))
  console.log(`Share image: ${target}`)
} finally {
  await browser.close()
  close()
}
