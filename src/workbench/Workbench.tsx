'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FiFileText } from 'react-icons/fi'
import { CvViewer } from '@/cv/CvViewer'
import Board, { PART_IDS } from './Board'
import { mountWorkbench, LOOKS, type Look, type WorkbenchApi } from './controller'
import { FaGithub, FaLinkedin, IconLinks } from './icons'
import { CHAPTERS, LINKS, NAV_ITEMS, stops, type Stop } from './stops'

export default function Workbench({ cvUpdated }: { cvUpdated: string }) {
  const world = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLElement>(null)
  const cap = useRef<HTMLElement>(null)
  const ticks = useRef<HTMLDivElement>(null)
  const mini = useRef<HTMLDivElement>(null)
  const zoomRead = useRef<HTMLSpanElement>(null)
  const xyRead = useRef<HTMLSpanElement>(null)
  const you = useRef<HTMLDivElement>(null)
  const api = useRef<WorkbenchApi | null>(null)

  const [shown, setShown] = useState(0)
  const [look, setLook] = useState<Look>('paper')
  const [cvOpen, setCvOpen] = useState(false)
  const openCv = useCallback(() => setCvOpen(true), [])
  const closeCv = useCallback(() => setCvOpen(false), [])

  useEffect(() => {
    const els = {
      world: world.current, stage: stage.current, track: track.current, bar: bar.current, cap: cap.current,
      ticks: ticks.current, mini: mini.current, zoomRead: zoomRead.current, xyRead: xyRead.current, you: you.current,
    }
    if (Object.values(els).some((el) => !el)) return
    const a = mountWorkbench(els as { [K in keyof typeof els]: NonNullable<(typeof els)[K]> }, stops, setShown)
    api.current = a
    const current = document.documentElement.dataset.style as Look | undefined
    if (current && LOOKS.includes(current)) setLook(current)
    if (location.hash === '#cv') setCvOpen(true) // a shareable link straight to the CV
    return () => { a.destroy(); api.current = null }
  }, [])

  const chooseLook = (l: Look) => { setLook(l); api.current?.setLook(l) }
  const stop = stops[shown]

  return (
    <>
      <div id="track" ref={track} aria-hidden="true" />
      <div className="stage" ref={stage}>
        <div className="world" ref={world}>
          <Board onCv={openCv} />
        </div>
      </div>
      <div className="you" ref={you} aria-hidden="true">You</div>

      <header className="bar" ref={bar}>
        <div className="bar-in">
          <span className="logo">MK.</span>
          <span className="who">Matthew Kay<br />Product engineer</span>
          <nav className="nav" aria-label="Sections">
            {NAV_ITEMS.map((n) => (
              <button key={n.c} type="button" className={stop.c === n.c ? 'on' : undefined} onClick={() => api.current?.goCluster(n.c)}>{n.label}</button>
            ))}
          </nav>
          <div className="bar-right">
            <div className="looks" role="group" aria-label="Look">
              {LOOKS.map((l) => (
                <button key={l} type="button" aria-pressed={look === l} onClick={() => chooseLook(l)}>
                  {l === 'brutal' ? 'Brutalist' : l[0].toUpperCase() + l.slice(1)}
                </button>
              ))}
            </div>
            <span className="proto">Draft copy</span>
            <a className="ibtn" href={LINKS.github} target="_blank" rel="noopener" aria-label="GitHub"><FaGithub aria-hidden="true" /></a>
            <a className="ibtn" href={LINKS.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn"><FaLinkedin aria-hidden="true" /></a>
            <button type="button" className="btn solid" onClick={openCv}>CV <FiFileText aria-hidden="true" /></button>
          </div>
        </div>
      </header>

      <aside className={`cap${stop.c === 'hero' ? ' hero' : ''}`} ref={cap}>
        <div className="cap-top">
          <span className="cap-chap">{CHAPTERS[stop.c]}</span>
          <span className="cap-idx">{String(shown + 1).padStart(2, '0')} / {String(stops.length).padStart(2, '0')}</span>
        </div>
        <div className="ticks" ref={ticks} role="group" aria-label="Stops">
          {stops.map((s, j) => (
            <button key={j} type="button" className={`tick${j > 0 && s.c !== stops[j - 1].c ? ' gap' : ''}`}
              title={s.nav} aria-label={`Go to ${s.nav}`} onClick={() => api.current?.goStop(j)}><i /></button>
          ))}
        </div>
        <div className="cap-body swap" key={shown} aria-live="polite">
          <GuideBody stop={stop} onCv={openCv} onGo={(c) => api.current?.goCluster(c)} onTile={(id) => api.current?.focusTile(id)} />
        </div>
        <div className="cap-nav">
          <button type="button" className="nav-prev" disabled={shown === 0} onClick={() => api.current?.prev()} aria-label="Previous stop">← Back</button>
          <button type="button" className="nav-next" onClick={() => api.current?.next()} aria-label="Next stop">
            <small>{shown === stops.length - 1 ? 'Done' : 'Next'}</small>
            <span>{shown === stops.length - 1 ? 'Back to the start' : stops[shown + 1].nav}</span>
            <i aria-hidden="true">{shown === stops.length - 1 ? '↑' : '→'}</i>
          </button>
        </div>
        <p className="hint">Scroll, use the ← → keys, or drag to look around</p>
      </aside>

      <CvViewer open={cvOpen} onClose={closeCv} updated={cvUpdated} />

      <div className="mini" aria-hidden="true">
        <div className="mini-map" ref={mini} />
        <div className="mini-read"><span ref={zoomRead}>100%</span><span ref={xyRead}>x 0 y 0</span></div>
      </div>
    </>
  )
}

function Slots({ one }: { one?: boolean }) {
  if (one) return <div className="slots one"><div className="slot"><b>What each one taught me</b><em>Slot · designed next</em></div></div>
  return (
    <div className="slots">
      <div className="slot"><b>Case study</b><em>Slot · designed next</em></div>
      <div className="slot"><b>What I learnt</b><em>Slot · designed next</em></div>
    </div>
  )
}

function Proof({ rows }: { rows: [string, string][] }) {
  return <ul className="proof">{rows.map(([b, s]) => <li key={b}><b>{b}</b><span>{s}</span></li>)}</ul>
}

function GuideBody({ stop, onCv, onGo, onTile }: {
  stop: Stop; onCv: () => void; onGo: (c: Stop['c']) => void; onTile: (id: string) => void
}) {
  const [copied, setCopied] = useState('')
  const copy = () => {
    navigator.clipboard?.writeText(LINKS.email).then(() => setCopied('Copied'), () => setCopied('Select it above'))
  }
  const parts = stop.layers ? PART_IDS[stop.c] : undefined
  return (
    <>
      {stop.kicker && <span className="kick">{stop.kicker}</span>}
      <h2>{stop.title}{stop.draft && <span className="chip">Draft line</span>}</h2>
      {stop.body && <p>{stop.body}</p>}
      {parts && (
        <div className="layers">
          <span>{parts.length} parts · pick one to look closer</span>
          <div>{parts.map((p) => <button key={p.id} type="button" data-tile={p.id} onClick={() => onTile(p.id)}>{p.name}</button>)}</div>
        </div>
      )}
      {stop.extra === 'heroProof' && (
        <>
          <Proof rows={[['frunt', 'Live'], ['Run', 'In App Store review'], ['Lift 2.0', 'Next']]} />
          <div className="ctas">
            <button type="button" className="btn solid" onClick={onCv}>View CV</button>
            <button type="button" className="btn ghost" onClick={() => onGo('contact')}>Get in touch</button>
          </div>
          <IconLinks />
        </>
      )}
      {stop.extra === 'mgkProof' && <Proof rows={[['Run 1.0', 'In App Store review'], ['Lift 2.0', 'Next'], ['Source', 'Open from 11 Oct']]} />}
      {stop.extra === 'slots' && <Slots />}
      {stop.extra === 'slotsOne' && <Slots one />}
      {stop.extra === 'contact' && (
        <>
          <div className="mail"><code>{LINKS.email}</code><button type="button" className="btn ghost" onClick={copy}>{copied || 'Copy'}</button></div>
          <IconLinks />
          <div className="ctas">
            <button type="button" className="btn solid" onClick={onCv}>View CV</button>
          </div>
        </>
      )}
    </>
  )
}
