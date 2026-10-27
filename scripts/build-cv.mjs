// Prints the /cv page to a PDF. The public site has no CV (src/cv/flags.ts):
// it's emailed on request, so this is how the copy to send gets made.
//
//   npm run cv            → builds the site with the CV in it (CV_BUILD=1), then
//                           out/cv.pdf (no phone number), plus a copy in
//                           public/cv.pdf so the dev server can serve it
//   npm run cv:private    → the same build, then private/Matthew_Kay_CV.pdf with
//                           the phone number from CV_PHONE: the one to send
//
// Vercel runs it on preview deployments only, straight after their build (no
// --build), so a CV change is checked on its pull request.
//
// Fails if the CV runs past one A4 page, so it can't quietly overflow.
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { copyFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { launch, serveOut } from './headless.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'out')
const isPrivate = process.argv.includes('--private')
const phone = process.env.CV_PHONE?.trim()
if (isPrivate && !phone) throw new Error('Set CV_PHONE to make the private copy, e.g. $env:CV_PHONE="+44 ..."; npm run cv:private')

if (process.argv.includes('--build')) execSync('npx next build', { cwd: root, stdio: 'inherit', env: { ...process.env, CV_BUILD: '1' } })
// Without the CV, /cv is still built, as the 404 page, so look for the sheet itself.
const cvHtml = join(outDir, 'cv', 'index.html')
if (!existsSync(cvHtml) || !readFileSync(cvHtml, 'utf8').includes('cv-sheet')) throw new Error('out/ has no CV: build with CV_BUILD=1 first, or run npm run cv, which does.')

const { origin, close } = await serveOut(outDir)

const browser = await launch()
try {
  const page = await browser.newPage()
  await page.emulateMedia({ media: 'print' })
  await page.goto(`${origin}/cv/`, { waitUntil: 'networkidle' })
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
  // Text wraps slightly differently on Linux (where Vercel prints it) than on
  // Windows or macOS, so a CV that only just fits locally can overflow there.
  // When space is tight, list the lines whose last line holds only a word or
  // two: trimming a few words from one of those saves a whole line.
  if (content > pageH * 0.98) {
    const short = await page.evaluate(() => [...document.querySelectorAll('.cv-sheet li, .cv-sheet p')].flatMap((el) => {
      const range = document.createRange()
      range.selectNodeContents(el)
      const rects = [...range.getClientRects()].filter((r) => r.width > 0)
      const tops = [...new Set(rects.map((r) => Math.round(r.top)))]
      if (tops.length < 2) return []
      const last = Math.max(...tops)
      const width = rects.filter((r) => Math.round(r.top) === last).reduce((sum, r) => sum + r.width, 0)
      const pct = Math.round((width / el.getBoundingClientRect().width) * 100)
      return pct < 30 ? [`  ${String(pct).padStart(2)}% last line: …${el.textContent.trim().slice(-60)}`] : []
    }))
    const spare = Math.floor(pageH - content)
    console.warn(spare >= 0
      ? `CV: only ${spare}px spare; it may overflow on another OS.`
      : `CV: ${-spare}px past one A4 page.`)
    if (short.length) console.warn(`Lines that end with a word or two (trim a few words to save a line):\n${short.join('\n')}`)
  }
  if (content > pageH + 1) throw new Error(`The CV runs ${Math.ceil(content - pageH)}px past one A4 page. Trim src/data/cv.ts.`)

  const target = isPrivate ? join(root, 'private', 'Matthew_Kay_CV.pdf') : join(outDir, 'cv.pdf')
  await mkdir(dirname(target), { recursive: true })
  await page.pdf({ path: target, format: 'A4', printBackground: true, preferCSSPageSize: true })
  if (!isPrivate && !process.env.CI) await copyFile(target, join(root, 'public', 'cv.pdf'))
  console.log(`CV: ${target} (${Math.round((content / pageH) * 100)}% of the page used)`)
} finally {
  await browser.close()
  close()
}
