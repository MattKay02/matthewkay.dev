'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { FiFileText, FiMoon, FiSun } from 'react-icons/fi'
import { CvViewer } from '@/cv/CvViewer'
import { ExploreViewer } from './Explore'
import { CaseStudyViewer } from '@/case-studies/CaseStudyViewer'
import { BOARD_DECISIONS } from '@/case-studies/frunt-board'
import type { CaseStudy } from '@/case-studies/frunt'
import Board from './Board'
import { PART_IDS } from './products'
import { mountWorkbench, type WorkbenchApi } from './controller'
import { FaGithub, FaLinkedin, IconLinks } from './icons'
import { AppRow } from './apps'
import { skillId, useSkills } from './Skills'
import { CHAPTERS, LINKS, NAV_ITEMS, SHOW_SLOTS, SKILLS_INSTALL, stops, type Stop } from './stops'

/** The progress bar's buttons: one per run of stops in the same cluster, so each is at least 24px
 * wide (the WCAG target size) however many stops there are. Each stop is still its own bar. */
const TICK_RUNS = stops.reduce<number[][]>((runs, s, j) => {
  if (j > 0 && s.c === stops[j - 1].c) runs[runs.length - 1].push(j)
  else runs.push([j])
  return runs
}, [])

/** `caseStudy` is passed only while it is visible (published, or a draft in dev), so unpublished copy never reaches the built site. */
export default function Workbench({ cvUpdated, caseStudy = null }: { cvUpdated: string; caseStudy?: CaseStudy | null }) {
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
  const [dark, setDark] = useState(false)
  const [cvOpen, setCvOpen] = useState(false)
  const openCv = useCallback(() => setCvOpen(true), [])
  const closeCv = useCallback(() => setCvOpen(false), [])
  const [exploreOpen, setExploreOpen] = useState(false)
  const openExplore = useCallback(() => setExploreOpen(true), [])
  const closeExplore = useCallback(() => setExploreOpen(false), [])
  const [caseOpen, setCaseOpen] = useState(false)
  const openCase = useCallback(() => setCaseOpen(true), [])
  const closeCase = useCallback(() => setCaseOpen(false), [])

  useEffect(() => {
    const els = {
      world: world.current, stage: stage.current, track: track.current, bar: bar.current, cap: cap.current,
      ticks: ticks.current, mini: mini.current, zoomRead: zoomRead.current, xyRead: xyRead.current, you: you.current,
    }
    if (Object.values(els).some((el) => !el)) return
    const a = mountWorkbench(els as { [K in keyof typeof els]: NonNullable<(typeof els)[K]> }, stops, setShown)
    api.current = a
    if (document.documentElement.dataset.theme === 'dark') { setDark(true); paintThemeColor(true) }
    if (location.hash === '#cv') setCvOpen(true) // a shareable link straight to the CV
    if (location.hash === '#frunt' && caseStudy) setCaseOpen(true) // and to the case study
    return () => { a.destroy(); api.current = null }
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    if (next) document.documentElement.dataset.theme = 'dark'
    else delete document.documentElement.dataset.theme
    paintThemeColor(next)
    try { localStorage.setItem('wb-theme', next ? 'dark' : 'light') } catch { /* private window: the choice just isn't remembered */ }
  }
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
            <button type="button" className="theme" role="switch" aria-checked={dark} aria-label="Dark theme"
              title={dark ? 'Switch to light' : 'Switch to dark'} onClick={toggleTheme}>
              <FiSun className="t-sun" aria-hidden="true" />
              <FiMoon className="t-moon" aria-hidden="true" />
              <i className="knob" aria-hidden="true"><FiSun className="k-sun" /><FiMoon className="k-moon" /></i>
            </button>
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
          {TICK_RUNS.map((ch) => (
            <button key={ch[0]} type="button" className="tgroup" style={{ '--n': ch.length } as CSSProperties}
              title={stops[ch[0]].nav} aria-label={`Go to ${stops[ch[0]].nav}`}
              onClick={(e) => api.current?.goStop(Number((e.target as Element).closest<HTMLElement>('.tick')?.dataset.j ?? ch[0]))}>
              {ch.map((j) => <span key={j} className="tick" data-j={j} title={stops[j].nav}><i /></span>)}
            </button>
          ))}
        </div>
        <div className="cap-body swap" key={shown} aria-live="polite">
          <GuideBody stop={stop} onCv={openCv} onCase={openCase} onExplore={openExplore} onGo={(c) => api.current?.goCluster(c)} onTile={(id) => api.current?.focusTile(id)} />
        </div>
        <div className="cap-nav">
          <button type="button" className="nav-prev" disabled={shown === 0} onClick={() => api.current?.prev()}><span aria-hidden="true">←</span> Back</button>
          <button type="button" className="nav-next" onClick={() => api.current?.next()}>
            <small>{shown === stops.length - 1 ? 'Done' : 'Next'}</small>
            <span>{shown === stops.length - 1 ? 'Back to the start' : stops[shown + 1].nav}</span>
            <i aria-hidden="true">{shown === stops.length - 1 ? '↑' : '→'}</i>
          </button>
        </div>
        <p className="hint">Scroll, use the ← → keys, or drag to look around</p>
      </aside>

      <CvViewer open={cvOpen} onClose={closeCv} updated={cvUpdated} />
      <ExploreViewer open={exploreOpen} onClose={closeExplore} />
      <CaseStudyViewer study={caseStudy} open={caseOpen} onClose={closeCase} />

      <div className="mini" aria-hidden="true">
        <div className="mini-map" ref={mini} />
        <div className="mini-read"><span ref={zoomRead}>100%</span><span ref={xyRead}>x 0 y 0</span></div>
      </div>
    </>
  )
}

/** Matches the phone browser's toolbar to the theme's desk colour. */
function paintThemeColor(dark: boolean) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#101010' : '#ebebeb')
}

function Slots({ one }: { one?: boolean }) {
  if (!SHOW_SLOTS) return null
  if (one) return <div className="slots one"><div className="slot"><b>What each one taught me</b><em>Slot · designed next</em></div></div>
  return (
    <div className="slots">
      <div className="slot"><b>Case study</b><em>Slot · designed next</em></div>
      <div className="slot"><b>What I learnt</b><em>Slot · designed next</em></div>
    </div>
  )
}

function GuideBody({ stop, onCv, onCase, onExplore, onGo, onTile }: {
  stop: Stop; onCv: () => void; onCase: () => void; onExplore: () => void; onGo: (c: Stop['c']) => void; onTile: (id: string) => void
}) {
  const [copied, setCopied] = useState('')
  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).then(() => setCopied('Copied'), () => setCopied('Select it above'))
  }
  const { skills } = useSkills()
  // How I work lists its skills (live from the skills repo); the products list their parts.
  const parts = stop.layers ? (stop.c === 'how' ? skills.map((s) => ({ id: skillId(s.name), name: s.name })) : PART_IDS[stop.c]) : undefined
  return (
    <>
      {stop.kicker && <span className="kick">{stop.kicker}</span>}
      <h2>{stop.title}</h2>
      {stop.body && <p>{stop.body}</p>}
      {parts && (
        <div className="layers">
          <span>{parts.length} {stop.c === 'how' ? 'skills' : 'parts'} · pick one to look closer</span>
          <div>{parts.map((p) => <button key={p.id} type="button" data-tile={p.id} onClick={() => onTile(p.id)}>{p.name}</button>)}</div>
        </div>
      )}
      {/* Touch screens only: the live board is a guided tour there, so this is how to wander it. */}
      {stop.c === 'all' && <div className="ctas explore"><button type="button" className="btn solid" onClick={onExplore}>Explore the board</button></div>}
      {stop.extra === 'heroProof' && (
        <>
          <div className="apps"><AppRow app="frunt" /><AppRow app="run" /><AppRow app="lift" /></div>
          <div className="ctas">
            <button type="button" className="btn solid" onClick={onCv}>View CV</button>
            <button type="button" className="btn ghost" onClick={() => onGo('contact')}>Get in touch</button>
          </div>
          <IconLinks />
        </>
      )}
      {stop.extra === 'fruntApps' && <div className="apps"><AppRow app="frunt" /></div>}
      {stop.extra === 'fruntCase' && (
        <>
          <ol className="calls">{BOARD_DECISIONS.map((d) => <li key={d}>{d}</li>)}</ol>
          <div className="ctas"><button type="button" className="btn solid" onClick={onCase}>Read the case study</button></div>
        </>
      )}
      {stop.extra === 'mgkApps' && <div className="apps"><AppRow app="run" /><AppRow app="lift" /></div>}
      {stop.extra === 'slots' && <Slots />}
      {stop.extra === 'slotsOne' && <Slots one />}
      {stop.extra === 'skills' && (
        <div className="install">
          <span>Install them in Claude Code, Cursor or Codex</span>
          <div className="mail"><code>{SKILLS_INSTALL}</code><button type="button" className="btn ghost" onClick={() => copy(SKILLS_INSTALL)}>{copied || 'Copy'}</button></div>
          <a href={`${LINKS.skills}#install`} target="_blank" rel="noopener">One at a time, or as Claude Code plugins ↗</a>
        </div>
      )}
      {stop.extra === 'contact' && (
        <>
          <div className="mail"><code>{LINKS.email}</code><button type="button" className="btn ghost" onClick={() => copy(LINKS.email)}>{copied || 'Copy'}</button></div>
          <IconLinks />
          <div className="ctas">
            <button type="button" className="btn solid" onClick={onCv}>View CV</button>
          </div>
        </>
      )}
    </>
  )
}
