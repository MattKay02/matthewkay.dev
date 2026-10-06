// /llms.txt: the site as plain Markdown for AI tools, written to out/llms.txt at
// build time (static export needs force-static). Content: src/seo/describe.ts.
import { llmsText } from '@/seo/describe'

export const dynamic = 'force-static'

export function GET() {
  return new Response(llmsText(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
