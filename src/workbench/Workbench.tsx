'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { FiMail, FiMoon, FiSun } from 'react-icons/fi'
import { ExploreViewer } from './Explore'
import { CaseStudyViewer } from '@/case-studies/CaseStudyViewer'
import { CASE_BOARDS } from '@/case-studies/boards'
import type { CaseStudy } from '@/case-studies/types'
import Board from './Board'
import { PART_IDS } from './products'
import { mountWorkbench, type WorkbenchApi } from './controller'
import { FaGithub, FaLinkedin, IconLinks } from './icons'
import { AppRow } from './apps'
import { skillId, storyId, useSkills } from './Skills'
import { featured } from './skills-data'
import { CHAPTERS, CV_REQUEST, LINKS, NAV_ITEMS, SHOW_SLOTS, SKILLS_INSTALL, stops, type Stop } from './stops'

/** The progress bar's buttons: one per run of stops in the same cluster, so each is at least 24px
 * wide (the WCAG target size) however many stops there are. Each stop is still its own bar. */
const TICK_RUNS = stops.reduce<number[][]>((runs, s, j) => {
  if (j > 0 && s.c === stops[j - 1].c) runs[runs.length - 1].push(j)
  else runs.push([j])
  return runs
}, [])

/** `caseStudies` holds only the visible ones (published, or drafts in dev and previews), so unpublished copy never reaches the built site. */
export default function Workbench({ caseStudies = [] }: { caseStudies?: CaseStudy[] }) {
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
  const [exploreOpen, setExploreOpen] = useState(false)
  const openExplore = useCallback(() => setExploreOpen(true), [])
  const closeExplore = useCallback(() => setExploreOpen(false), [])
  const [caseOpen, setCaseOpen] = useState<string | null>(null)
  const openCase = useCallback((slug: string) => setCaseOpen(slug), [])
  const closeCase = useCallback(() => setCaseOpen(null), [])

  useEffect(() => {
    const els = {
      world: world.current, stage: stage.current, track: track.current, bar: bar.current, cap: cap.current,
      ticks: ticks.current, mini: mini.current, zoomRead: zoomRead.current, xyRead: xyRead.current, you: you.current,
    }
    if (Object.values(els).some((el) => !el)) return
    const a = mountWorkbench(els as { [K in keyof typeof els]: NonNullable<(typeof els)[K]> }, stops, setShown)
    api.current = a
    if (document.documentElement.dataset.theme === 'dark') { setDark(true); paintThemeColor(true) }
    if (location.hash === '#cv') a.goCluster('contact') // old links to the CV land where it can be requested
    const hash = location.hash.slice(1)
    if (caseStudies.some((s) => s.slug === hash)) setCaseOpen(hash) // /#frunt, /#mgkfitness: straight to a case study
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
          <Board />
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
            <a className="btn solid" href={CV_REQUEST}>Request CV <FiMail aria-hidden="true" /></a>
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
          <GuideBody stop={stop} onCase={openCase} onExplore={openExplore} onGo={(c) => api.current?.goCluster(c)} onTile={(id) => api.current?.focusTile(id)} />
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

      <ExploreViewer open={exploreOpen} onClose={closeExplore} />
      <CaseStudyViewer study={caseStudies.find((s) => s.slug === caseOpen) ?? null} open={caseOpen !== null} onClose={closeCase} />

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

function GuideBody({ stop, onCase, onExplore, onGo, onTile }: {
  stop: Stop; onCase: (slug: string) => void; onExplore: () => void; onGo: (c: Stop['c']) => void; onTile: (id: string) => void
}) {
  const [copied, setCopied] = useState('')
  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).then(() => setCopied('Copied'), () => setCopied('Select it above'))
  }
  const { skills } = useSkills()
  // How I work's stories (live from the skills repo), or its skills; the products list their parts.
  const parts = !stop.layers ? undefined
    : stop.extra === 'stories' ? featured(skills).map((s) => ({ id: storyId(s.name), name: s.label }))
    : stop.c === 'how' ? skills.map((s) => ({ id: skillId(s.name), name: s.label }))
    : PART_IDS[stop.c]
  const kind = stop.extra === 'stories' ? 'stories' : stop.c === 'how' ? 'skills' : 'parts'
  return (
    <>
      {stop.kicker && <span className="kick">{stop.kicker}</span>}
      <h2>{stop.title}</h2>
      {stop.body && <p>{stop.body}</p>}
      {parts && (
        <div className="layers">
          <span>{parts.length} {kind} · pick one to look closer</span>
          <div>{parts.map((p) => <button key={p.id} type="button" data-tile={p.id} onClick={() => onTile(p.id)}>{p.name}</button>)}</div>
        </div>
      )}
      {/* Touch screens only: the live board is a guided tour there, so this is how to wander it. */}
      {stop.c === 'all' && <div className="ctas explore"><button type="button" className="btn solid" onClick={onExplore}>Explore the board</button></div>}
      {stop.extra === 'heroProof' && (
        <>
          <div className="apps"><AppRow app="frunt" /><AppRow app="run" /><AppRow app="lift" /></div>
          <div className="ctas">
            <a className="btn solid" href={CV_REQUEST}>Request CV</a>
            <button type="button" className="btn ghost" onClick={() => onGo('contact')}>Get in touch</button>
          </div>
          <IconLinks />
        </>
      )}
      {stop.extra === 'fruntApps' && <div className="apps"><AppRow app="frunt" /></div>}
      {stop.extra === 'case' && stop.study && (
        <>
          <ol className="calls">{CASE_BOARDS[stop.study].decisions.map((d) => <li key={d}>{d}</li>)}</ol>
          <div className="ctas"><button type="button" className="btn solid" onClick={() => onCase(stop.study!)}>Read the case study</button></div>
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
            <a className="btn solid" href={CV_REQUEST}>Request CV</a>
          </div>
        </>
      )}
    </>
  )
}
