// The tour as plain text, in the page's HTML but not shown. The guide panel only
// renders the stop you're on, so without this, screen readers and crawlers that
// don't run JavaScript would only ever get the first stop. Same words as the panel.
import { appStatus, statusText, type AppKey } from './apps'
import { FRUNT_PARTS, MGK_PARTS, type Part } from './products'
import { LINKS, SKILLS_INSTALL, stops } from './stops'
import { BOARD_DECISIONS } from '@/case-studies/frunt-board'

const APPS: AppKey[] = ['frunt', 'run', 'lift']

function PartList({ parts }: { parts: Part[] }) {
  return <ul>{parts.map((p) => <li key={p.name}>{p.name} ({p.status}): {p.line}</li>)}</ul>
}

export default function TourText() {
  return (
    <section className="sr-only" aria-labelledby="tour-text">
      <h2 id="tour-text">The tour, as text</h2>
      {stops.map((s, i) => (
        <article key={i}>
          <h3>{s.nav}</h3>
          <p>{s.title}</p>
          {s.body && <p>{s.body}</p>}
          {s.extra === 'heroProof' && (
            <ul>
              {APPS.map((key) => {
                const a = appStatus(key)
                return (
                  <li key={key}>
                    <a href={a.web}>{a.label}</a>: {statusText(a)}
                    {a.apple && <>, <a href={a.apple}>App Store</a></>}
                    {a.google && <>, <a href={a.google}>Google Play</a></>}
                  </li>
                )
              })}
            </ul>
          )}
          {s.layers && s.c === 'frunt' && <PartList parts={FRUNT_PARTS} />}
          {s.layers && s.c === 'mgk' && <PartList parts={MGK_PARTS} />}
          {s.extra === 'skills' && <p>Install my skills: <code>{SKILLS_INSTALL}</code> (<a href={LINKS.skills}>MattKay02/skills</a>)</p>}
          {s.extra === 'fruntCase' && (
            <>
              <ol>{BOARD_DECISIONS.map((d) => <li key={d}>{d}</li>)}</ol>
              <p><a href="/work/frunt/">Read the frunt case study</a></p>
            </>
          )}
        </article>
      ))}
      <p>
        <a href="/cv/">CV</a> (<a href="/cv.pdf">PDF</a>) · <a href={LINKS.github}>GitHub</a> ·{' '}
        <a href={LINKS.linkedin}>LinkedIn</a> · <a href={LINKS.x}>X</a> · <a href={LINKS.mgkcodes}>MGKCodes</a> ·{' '}
        <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
      </p>
    </section>
  )
}
