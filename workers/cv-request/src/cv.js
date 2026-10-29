// What a CV request is, and the note Matthew gets for one. Kept apart from index.js,
// whose exports the Workers runtime treats as handlers.
import PostalMime from 'postal-mime'

export const CV_KEY = 'Matthew_Kay_CV.pdf'

/** First contact about a CV: "CV request", "Your CV", "Résumé"; not replies in the thread, not auto-replies. */
export function isCvRequest(subject, headers) {
  // Whole words only ("CVS receipt" isn't one), with letter boundaries that know é is a letter.
  if (!/(?<![\p{L}\p{N}])(cv|r[eé]sum[eé])(?![\p{L}\p{N}])/iu.test(subject)) return false
  if (/^\s*(re|fwd?|aw|sv)\s*:/i.test(subject) || headers.get('in-reply-to')) return false
  const auto = headers.get('auto-submitted')
  return !auto || auto.toLowerCase() === 'no'
}

const day = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/London' })

function toBase64(buf) {
  const bytes = new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(s)
}

/** The note to Matthew: who asked, what they wrote, and the CV, or loudly why it isn't attached. */
export async function cvNote(raw, env) {
  const mail = await PostalMime.parse(raw)
  const address = mail.from?.address ?? 'an unknown sender'
  const name = mail.from?.name?.trim() || address
  const said = (mail.text ?? '').trim().slice(0, 4000)
  const cv = await env.CV.get(CV_KEY)
  const text = [
    `${name} (${address}) asked for your CV.`,
    '',
    said ? `What they wrote:\n\n${said}` : 'They wrote nothing else.',
    '',
    cv
      ? `The latest CV is attached, built ${day(cv.uploaded)}.`
      : 'The CV is NOT attached: there is no copy in R2. Run the "Private CV" workflow on GitHub (Actions), or npm run cv:private.',
    '',
    'To answer, reply to their own email (it came to hello@matthewkay.dev) and attach the PDF, so it goes from hello@ rather than your personal address.',
  ].join('\n')
  return {
    from: { email: env.SEND_FROM, name: 'matthewkay.dev' },
    to: env.FORWARD_TO,
    subject: `CV request from ${name}`,
    text,
    attachments: cv ? [{ content: toBase64(await cv.arrayBuffer()), filename: CV_KEY, type: 'application/pdf', disposition: 'attachment' }] : [],
  }
}
