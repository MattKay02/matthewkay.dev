// A case study as a readable page on the desk: shared by the viewer over the
// board (/#<slug>) and the standalone page (/work/<slug>). Pure render, no state.
// Live status comes from the store data, figures from each product's counting
// script (in the study's data); nothing here is typed by hand that could go stale.
import { AppRow } from '@/workbench/apps'
import { IMG } from '@/workbench/parts'
import { fmtLong as fmt, fmtShort } from './format'
import type { CaseStudy, Row } from './types'
import './case-study.css'

export const checkedLabel = (s: CaseStudy) => `Last checked ${fmt(s.checked)}`

/** "ADR 0087" for a single set of records, or the study's own label for several. */
const adrLabel = (s: CaseStudy) => (/^\d+$/.test(s.lastAdrRead) ? `ADR ${s.lastAdrRead}` : s.lastAdrRead)

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="cs-sec" aria-labelledby={`cs-${n}`}>
      <h2 id={`cs-${n}`}><span>{n}</span>{title}</h2>
      {children}
    </section>
  )
}

function Lead({ row }: { row: Row }) {
  return <p><b>{row.label}</b> {row.text}</p>
}

export default function CaseStudySheet({ study }: { study: CaseStudy }) {
  const m = study.made
  const evalText = study.evalText
  const asOf = fmt(study.counted.at)
  return (
    <article className="cs-sheet">
      <header className="cs-head">
        <span className="cs-kick">Case study · {study.name}</span>
        <h1 className="cs-ttl">{m.line1}<span>{m.line2}</span></h1>
        {study.apps.map((app) => <AppRow key={app} app={app} className="cs-app" />)}
        <dl className="cs-facts">
          <div><dt>Where</dt><dd>{m.surfaces}</dd></div>
          <div><dt>Role</dt><dd>{m.role}</dd></div>
          <div><dt>Started</dt><dd>{fmt(m.started)} · live since {fmt(m.live)}</dd></div>
        </dl>
      </header>

      <aside className="cs-tldr" aria-label="TL;DR">
        <span className="cs-label">TL;DR</span>
        <dl>
          {study.tldr.map((r) => (
            <div key={r.label}>
              <dt>{r.label}</dt>
              <dd>{r.text}{r.label === 'How I build it' && evalText ? ` A fixed accuracy test: ${evalText}` : ''}</dd>
            </div>
          ))}
        </dl>
      </aside>

      <figure className="cs-shot">
        <img src={IMG(study.shot.img)} width={study.shot.w} height={study.shot.h} alt={study.shot.alt} />
        <figcaption>{study.shot.caption}</figcaption>
      </figure>

      <Section n="01" title="What I made"><p>{m.body}</p></Section>

      <Section n="02" title="Why">
        <h3 className="cs-ttl sm">{study.why.line1}<span>{study.why.line2}</span></h3>
        {study.why.paras.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
      </Section>

      <Section n="03" title="What I aimed for">{study.aims.map((r) => <Lead key={r.label} row={r} />)}</Section>

      <Section n="04" title="Timeline">
        <ol className="cs-time">
          {study.timeline.map((t) => (
            <li key={t.date + t.text}><time dateTime={t.date}>{fmtShort(t.date)}</time><span>{t.text}</span></li>
          ))}
        </ol>
      </Section>

      <Section n="05" title="Challenges and decisions">
        <p className="cs-note">Each card: what happened, the options, what I chose, how it turned out. Dated, with the decision record it was written in.</p>
        {study.decisions.map((d) => (
          <div className="cs-card" key={d.title}>
            <header>
              <h3>{d.title}</h3>
              <span>{d.when}{d.adr ? ` · ADR ${d.adr}` : ''}</span>
            </header>
            <dl>
              {d.rows.map((r) => <div key={r.label}><dt>{r.label}</dt><dd>{r.text}</dd></div>)}
              {d.liveEval && evalText && <div><dt>The test now</dt><dd>{evalText}</dd></div>}
            </dl>
            {d.items && <ul>{d.items.map((r) => <li key={r.label}><b>{r.label}</b> {r.text}</li>)}</ul>}
            {d.quote && <blockquote>"{d.quote}"</blockquote>}
          </div>
        ))}
      </Section>

      <Section n="06" title="Where it landed">
        {study.landed.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
        <dl className="cs-figs" aria-label={`Counted from ${study.counted.from} on ${asOf}`}>
          {study.figures.map((f) => <div key={f.label}><dt>{f.n}</dt><dd>{f.label}</dd></div>)}
        </dl>
        <p className="cs-asof">Counted from {study.counted.from} on {asOf}, commit {study.counted.commit}.</p>
      </Section>

      <Section n="07" title="How I build it with AI">
        <p>{study.how.intro}</p>
        <ol className="cs-steps">
          {study.how.steps.map((r) => <li key={r.label}><b>{r.label}</b> {r.text}</li>)}
          {evalText && <li><b>Measure the answers.</b> {evalText}</li>}
        </ol>
      </Section>

      <Section n="08" title="What I learnt">
        <p className="cs-big"><b>{study.learnt.lead.label}</b> {study.learnt.lead.text}</p>
        {study.learnt.rest.map((r) => <Lead key={r.label} row={r} />)}
      </Section>

      <footer className="cs-foot">
        {checkedLabel(study)}, against {study.source} and its decision records (up to {adrLabel(study)}).
      </footer>
    </article>
  )
}
