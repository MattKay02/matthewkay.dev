// node --test: the worker's rules, with a fake message, R2 bucket and send binding.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker from '../src/index.js'
import { CV_KEY, cvNote, isCvRequest } from '../src/cv.js'

const h = (o = {}) => new Headers(o)
const rawEmail = (subject, body, extra = '') => new TextEncoder().encode(
  `From: "Jane Smith" <jane@acme.example>\r\nTo: hello@matthewkay.dev\r\nSubject: ${subject}\r\nMessage-ID: <1@acme.example>\r\n${extra}Content-Type: text/plain; charset=utf-8\r\n\r\n${body}\r\n`,
).buffer
const pdf = new TextEncoder().encode('%PDF-1.7 fake').buffer
const bucket = (has) => ({ get: async (k) => (has && k === CV_KEY ? { uploaded: new Date('2026-10-29T06:00:00Z'), arrayBuffer: async () => pdf } : null) })
const env = (has = true, sent = []) => ({ CV: bucket(has), SEND_FROM: 'hello@matthewkay.dev', FORWARD_TO: 'me@inbox.example', NOTIFY: { send: async (m) => { sent.push(m); return { messageId: 'x' } } } })

test('the Request CV subject, and plain variants, count as CV requests', () => {
  for (const s of ['CV request', 'cv request', 'Your CV', 'Request for résumé', 'Resume please']) assert.equal(isCvRequest(s, h()), true, s)
})

test('replies, forwards, auto-replies and other subjects do not', () => {
  assert.equal(isCvRequest('Re: CV request', h()), false)
  assert.equal(isCvRequest('Fwd: CV request', h()), false)
  assert.equal(isCvRequest('CV request', h({ 'in-reply-to': '<a@b>' })), false)
  assert.equal(isCvRequest('CV request', h({ 'auto-submitted': 'auto-replied' })), false)
  assert.equal(isCvRequest('Hello', h()), false)
  assert.equal(isCvRequest('CVS receipt', h()), false)
})

test('the note names who asked, quotes them, and attaches the CV to Matthew only', async () => {
  const note = await cvNote(rawEmail('CV request', "Hi Matthew,\r\n\r\nCould you send me your CV? It's for this role:\r\n\r\nProduct Engineer at Acme"), env())
  assert.equal(note.to, 'me@inbox.example')
  assert.equal(note.from.email, 'hello@matthewkay.dev')
  assert.equal(note.subject, 'CV request from Jane Smith')
  assert.match(note.text, /Jane Smith \(jane@acme\.example\) asked for your CV/)
  assert.match(note.text, /Product Engineer at Acme/)
  assert.match(note.text, /built 29 Oct 2026/)
  assert.equal(note.attachments.length, 1)
  assert.equal(note.attachments[0].filename, CV_KEY)
  assert.equal(note.attachments[0].type, 'application/pdf')
  assert.equal(Buffer.from(note.attachments[0].content, 'base64').toString(), '%PDF-1.7 fake')
  assert.equal(note.replyTo, undefined) // a reply from this note would go from his personal address
})

test('with no CV in R2 the note still arrives and says so', async () => {
  const note = await cvNote(rawEmail('CV request', 'Hi'), env(false))
  assert.equal(note.attachments.length, 0)
  assert.match(note.text, /NOT attached/)
})

test('every email is forwarded first; only a CV request also sends the note', async () => {
  for (const [subject, notes] of [['CV request', 1], ['Hello there', 0], ['Re: CV request', 0]]) {
    const calls = [], sent = [], waits = []
    const message = {
      raw: new Response(rawEmail(subject, 'Hi')).body,
      headers: h({ subject }),
      forward: async (to) => { calls.push(['forward', to]) },
    }
    await worker.email(message, env(true, sent), { waitUntil: (p) => waits.push(p) })
    await Promise.all(waits)
    assert.deepEqual(calls, [['forward', 'me@inbox.example']], subject)
    assert.equal(sent.length, notes, subject)
  }
})
