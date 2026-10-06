// Shared by the scripts that photograph pages after `next build` (build-cv.mjs,
// build-og.mjs): serve out/ on a free local port, and launch headless Chrome.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { chromium } from 'playwright'

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.txt': 'text/plain', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
}

export async function serveOut(outDir) {
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
  return { origin: `http://localhost:${server.address().port}`, close: () => server.close() }
}

// Without --font-render-hinting=none, headless Chrome on Linux (Vercel) rounds
// every glyph to whole pixels: letters get uneven gaps ("Sof tware") and lines
// run wider than on Windows or macOS, so pages lay out differently there.
export const launch = () => chromium.launch({ args: ['--font-render-hinting=none'] })
