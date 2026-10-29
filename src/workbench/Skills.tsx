'use client'

// How I work, from the skills repo. Two parts, both read live from GitHub, so publishing a
// skill there (SKILL.md + a skills.json entry) shows it here with no change to this repo:
// - the pipeline: the five steps down the page, every skill a row under the step it
//   serves (skills.json's `step`);
// - the stories: up to three skills told as the problem that made them, what they do and
//   their real output (`featured`, `problem`, `evidence`).
// The committed snapshots render first and stay if GitHub is unreachable.
import { useEffect, useState, type ReactNode } from 'react'
import { preconnect } from 'react-dom'
import { FiArrowUpRight } from 'react-icons/fi'
import { SKILLS_INSTALL } from './stops'
import {
  RAW, SKILLS, SKILLS_REPO, STEP_LABEL, TESTS, featured, skillId, stepOf, testLine, type Skill, type Step, type Tests,
} from './skills-data'

export { skillId }
export const storyId = (name: string) => `story-${name}`

// One fetch for the whole page, shared by the board and the guide panel.
let live: Promise<{ skills: Skill[]; tests: Tests }> | undefined
const getJson = (path: string) => fetch(`${RAW}/${path}`, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))

export function useSkills() {
  // Open the connections early: one for the fetches below (CORS), one for the evidence images.
  preconnect('https://raw.githubusercontent.com', { crossOrigin: 'anonymous' })
  preconnect('https://raw.githubusercontent.com')
  const [data, setData] = useState<{ skills: Skill[]; tests: Tests }>({ skills: SKILLS, tests: TESTS })
  useEffect(() => {
    live ??= Promise.all([getJson('skills.json'), getJson('tests.json').catch(() => TESTS)]).then(([m, t]) => ({
      skills: Array.isArray(m?.skills) && m.skills.length ? m.skills : SKILLS,
      tests: t?.skills ? t : TESTS,
    }))
    let on = true
    live.then((d) => { if (on) setData(d) }).catch(() => { /* keep the snapshots */ })
    return () => { on = false }
  }, [])
  return data
}

type Box = { x: number; y: number; w: number; h: number }
const at = ({ x, y, w, h }: Box) => ({ left: x, top: y, width: w, height: h })
const source = (name: string) => `${SKILLS_REPO}/tree/main/${name}`

/** A skill's evidence image: real output, in both looks. Only the current look's file loads. */
function Evidence({ name, ev }: { name: string; ev: NonNullable<Skill['evidence']> }) {
  const alt = ev.caption ?? `${name} output`
  return (
    <div className={`story-img${ev.dark ? ' two' : ''}`}>
      <img className="ev-l" src={`${RAW}/${name}/${ev.image}`} alt={alt} loading="lazy" decoding="async" />
      {ev.dark && <img className="ev-d" src={`${RAW}/${name}/${ev.dark}`} alt={alt} loading="lazy" decoding="async" />}
    </div>
  )
}

// ---------- the pipeline ----------

/** One step of the process: its number, what it leaves behind, and an example. */
export interface HowStep {
  step: Step; n: string; title: string; text: string; ev: string
  /** A row that isn't a skill, after the step's skills (the decision records under Decide). */
  note?: { label: string; text: string }
}

/** Board pixels. Rows sit two to a line under their step, so a step with many skills stays short. */
export const PIPE = { head: 76, afterHead: 12, row: 124, rowGap: 12, colGap: 20, stepGap: 26, indent: 64 }

function StepHead({ st, ...box }: Box & { st: HowStep }) {
  return (
    <div className="stp" data-c="how" style={at(box)}>
      <i>{st.n}</i><b>{st.title}</b><span>{st.ev}</span>
      <p>{st.text}</p>
    </div>
  )
}

function SkillRow({ s, story, tested, ...box }: Box & { s: Skill; story: number; tested: boolean }) {
  return (
    <article className="skr" id={skillId(s.name)} data-c="how" data-focus="self" style={at(box)}>
      <header>
        <b>{s.label}</b>
        <a href={source(s.name)} target="_blank" rel="noopener">{s.name}<FiArrowUpRight aria-hidden="true" /></a>
        {story >= 0 && <em className="skr-st">Story {String(story + 1).padStart(2, '0')}</em>}
        <em className={`skr-t${tested ? '' : ' none'}`}>{tested ? 'Tested' : 'Not tested yet'}</em>
      </header>
      <p title={s.summary ?? s.description}>{s.summary ?? s.description}</p>
    </article>
  )
}

/** The Build step's row: the library itself, with the one command that installs it. */
function LibraryRow({ skills, tests, ...box }: Box & { skills: Skill[]; tests: Tests }) {
  const tested = skills.filter((s) => tests.skills[s.name]).length
  return (
    <a className="skr lib" href={SKILLS_REPO} target="_blank" rel="noopener" data-c="how" style={at(box)}>
      <header>
        <b>Skills library</b>
        <span>MattKay02/skills<FiArrowUpRight aria-hidden="true" /></span>
        <em className="skr-t">{tested} of {skills.length} tested</em>
      </header>
      <p>{skills.length} skills, open source. Anyone can install them: <code>{SKILLS_INSTALL}</code></p>
    </a>
  )
}

/** The five steps down the page, with every skill under the step it serves. */
export function Pipeline({ steps, x, y, w }: { steps: HowStep[]; x: number; y: number; w: number }) {
  const { skills, tests } = useSkills()
  const stars = featured(skills).map((s) => s.name)
  const rowW = (w - PIPE.indent - PIPE.colGap) / 2
  const out: ReactNode[] = []
  let top = y, lastHead = y
  for (const st of steps) {
    lastHead = top
    out.push(<StepHead key={st.step} st={st} x={x} y={top} w={w} h={PIPE.head} />)
    top += PIPE.head + PIPE.afterHead
    let count = 0
    const rowTop = top
    const box = () => {
      const k = count++
      return { x: x + PIPE.indent + (k % 2) * (rowW + PIPE.colGap), y: rowTop + Math.floor(k / 2) * (PIPE.row + PIPE.rowGap), w: rowW, h: PIPE.row }
    }
    if (st.step === 'build') out.push(<LibraryRow key="lib" skills={skills} tests={tests} {...box()} />)
    for (const s of skills.filter((k) => stepOf(k) === st.step)) {
      out.push(<SkillRow key={s.name} s={s} story={stars.indexOf(s.name)} tested={!!tests.skills[s.name]} {...box()} />)
    }
    if (st.note) {
      const b = box()
      out.push(
        <div key={`${st.step}-note`} className="skr note" data-c="how" style={at(b)}>
          <header><b>{st.note.label}</b></header>
          <p>{st.note.text}</p>
        </div>,
      )
    }
    const lines = Math.ceil(count / 2)
    top += lines ? lines * (PIPE.row + PIPE.rowGap) - PIPE.rowGap + PIPE.stepGap : PIPE.stepGap - PIPE.afterHead
  }
  // The rule joining the step numbers, centred on them.
  out.unshift(<i key="rule" className="stp-rule" data-c="how" aria-hidden="true" style={{ left: x + 19, top: y + 20, height: lastHead - y }} />)
  return <>{out}</>
}

// ---------- the stories ----------

/** The problem a skill came from: its own line, else the first sentence of its `why`. */
const problemOf = (s: Skill) => s.problem ?? s.why?.match(/^.*?[.!?](\s|$)/)?.[0].trim()

function StoryCard({ s, i, tests, ...box }: Box & { s: Skill; i: number; tests: Tests }) {
  const problem = problemOf(s)
  const tested = testLine(tests, s.name)
  return (
    <article className="story" id={storyId(s.name)} data-c="how" data-focus="self" style={at(box)}>
      <div className="story-txt">
        <span className="story-k">{String(i + 1).padStart(2, '0')} · The problem</span>
        <p className="story-p">{problem ?? s.summary ?? s.description}</p>
        <span className="story-k">What I built · {STEP_LABEL[stepOf(s)]}</span>
        <b className="story-n">{s.label}<a href={source(s.name)} target="_blank" rel="noopener">{s.name}<FiArrowUpRight aria-hidden="true" /></a></b>
        {problem && <p className="story-s">{s.summary ?? s.description}</p>}
        <footer className={`skr-t${tested ? '' : ' none'}`}>{tested ?? 'Not tested yet'}</footer>
      </div>
      <div className="story-vis">
        <span className="story-k">{s.evidence ? 'Real output' : 'What goes in, what comes out'}</span>
        {s.evidence
          ? <Evidence name={s.name} ev={s.evidence} />
          : s.flow && (
            <ol className="story-flow">
              {s.flow.slice(0, 3).map((f, k) => <li key={k}><span>{['In', 'Does', 'Out'][k]}</span>{f}</li>)}
            </ol>
          )}
      </div>
    </article>
  )
}

/** Up to three stories, stacked, under a heading that says where they come from. */
export function Stories({ x, y, w, h, gap }: { x: number; y: number; w: number; h: number; gap: number }) {
  const { skills, tests } = useSkills()
  return (
    <>
      <div className="story-head" data-c="how" style={{ left: x, top: y - 46, width: w }}>
        <b>Three problems, and the skill each one became</b>
        <span>Read live from github.com/MattKay02/skills</span>
      </div>
      {featured(skills).map((s, i) => <StoryCard key={s.name} s={s} i={i} tests={tests} x={x} y={y + i * (h + gap)} w={w} h={h} />)}
    </>
  )
}
