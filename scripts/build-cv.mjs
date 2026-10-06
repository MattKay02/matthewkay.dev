// Prints the /cv page to a PDF. Run after `next build`.
//
//   npm run cv            → out/cv.pdf (public, no phone number), plus a copy in
//                           public/cv.pdf so the dev server can serve it
//   npm run cv:private    → private/Matthew_Kay_CV.pdf with the phone number from
//                           CV_PHONE; for sending directly, never deployed
//
// Fails if the CV runs past one A4 page, so it can't quietly overflow.
import { createServer } from 'node:http'
import { readFile, copyFile, mkdir, stat } from 'node:fs/promises'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'out')
const isPrivate = process.argv.includes('--private')
const phone = process.env.CV_PHONE?.trim()
if (isPrivate && !phone) throw new Error('Set CV_PHONE to make the private copy, e.g. CV_PHONE="+44 ..." npm run cv:private')

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain' }
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (p.endsWith('/')) p += 'index.html'
  try {
    const file = join(outDir, p)
    if ((await stat(file)).isDirectory()) throw new Error('dir')
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' })
    res.end(await readFile(file))
  } catch {
    res.writeHead(404); res.end()
  }
})
await new Promise((r) => server.listen(0, r))
const port = server.address().port

const browser = await chromium.launch()
try {
  const page = await browser.newPage()
  await page.emulateMedia({ media: 'print' })
  await page.goto(`http://localhost:${port}/cv/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)

  if (isPrivate) {
    await page.evaluate((num) => { const el = document.querySelector('[data-phone]'); if (el) { el.textContent = num; el.hidden = false } }, phone)
  }

  // One page, always: compare the content's height with an A4 page. The sheet
  // itself is fixed at A4 height in print, so measure down to its lowest child.
  const { content, pageH } = await page.evaluate(() => {
    const sheet = document.querySelector('.cv-sheet')
    const probe = Object.assign(document.createElement('div'), { style: 'height:297mm;position:absolute' })
    document.body.appendChild(probe)
    const h = probe.getBoundingClientRect().height
    probe.remove()
    const top = sheet.getBoundingClientRect().top
    const bottom = Math.max(...[...sheet.children].map((el) => el.getBoundingClientRect().bottom))
    return { content: bottom - top + parseFloat(getComputedStyle(sheet).paddingBottom), pageH: h }
  })
  if (content > pageH + 1) throw new Error(`The CV runs ${Math.ceil(content - pageH)}px past one A4 page. Trim src/data/cv.ts.`)
  // Text wraps slightly differently on Linux (where Vercel prints it) than on
  // Windows or macOS, so a CV that only just fits locally can overflow there.
  if (content > pageH * 0.98) console.warn(`CV: only ${Math.floor(pageH - content)}px spare; it may overflow on another OS. Consider trimming.`)

  const target = isPrivate ? join(root, 'private', 'Matthew_Kay_CV.pdf') : join(outDir, 'cv.pdf')
  await mkdir(dirname(target), { recursive: true })
  await page.pdf({ path: target, format: 'A4', printBackground: true, preferCSSPageSize: true })
  if (!isPrivate && !process.env.CI) await copyFile(target, join(root, 'public', 'cv.pdf'))
  console.log(`CV: ${target} (${Math.round((content / pageH) * 100)}% of the page used)`)
} finally {
  await browser.close()
  server.close()
}
