// hello@matthewkay.dev's mail, with one addition. Request CV on the site opens an email
// to hello@ with the subject "CV request". Every email is forwarded to Matthew as
// before; a CV request also gets a second email to him with the latest private CV
// attached (Workers KV, kept current by .github/workflows/cv.yml), ready to send.
// Nothing ever goes to the person asking: Matthew answers them himself, so a bot or an
// AI tool that sends "CV request" never gets the CV or the phone number on it.
import { cvNote, isCvRequest } from './cv.js'

export default {
  async email(message, env, ctx) {
    const raw = await new Response(message.raw).arrayBuffer()
    // Never lose mail: forward first, exactly as the plain routing rule did. If this
    // throws, the sender gets a bounce rather than the email quietly disappearing.
    await message.forward(env.FORWARD_TO)
    if (!isCvRequest(message.headers.get('subject') ?? '', message.headers)) return
    ctx.waitUntil(
      cvNote(raw, env)
        .then((note) => env.NOTIFY.send(note))
        .catch((e) => console.error('cv-request: the CV note was not sent', e)),
    )
  },
}
