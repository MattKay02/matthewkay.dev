'use client'

// The skills in "How I work", laid out as a pipeline: each skill sits under the step
// of the process it serves (skills.json's `step`). Both files are read live from the
// skills repo, so publishing a skill there (SKILL.md + a skills.json entry) shows it
// here with no change to this repo, and new eval results show once tests.json is
// regenerated. The committed snapshots render first and stay if GitHub is unreachable.
import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { FiArrowUpRight, FiTerminal } from 'react-icons/fi'
import { SKILLS_INSTALL } from './stops'
import { RAW, SKILLS, SKILLS_REPO, STEP_LABEL, TESTS, skillId, testLine, type Skill, type Step, type Tests } from './skills-data'

export { skillId }

// One fetch for the whole page, shared by the board and the guide panel.
let live: Promise<{ skills: Skill[]; tests: Tests }> | undefined
const getJson = (path: string) => fetch(`${RAW}/${path}`, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))

export function useSkills() {
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

/** A skill's evidence image: real output, drawn at the card's size in both looks. Only the current look's file loads. */
function Evidence({ name, ev }: { name: string; ev: NonNullable<Skill['evidence']> }) {
  const alt = ev.caption ?? `${name} output`
  return (
    <figure className={ev.dark ? 'two' : undefined}>
      <img className="ev-l" src={`${RAW}/${name}/${ev.image}`} alt={alt} loading="lazy" decoding="async" />
      {ev.dark && <img className="ev-d" src={`${RAW}/${name}/${ev.dark}`} alt={alt} loading="lazy" decoding="async" />}
    </figure>
  )
}

/** One skill on the board: its evidence (or what goes in, what it does, what comes out), name, line and test status. */
function SkillCard({ s, tests, x, y, w, h }: { s: Skill; tests: Tests; x: number; y: number; w: number; h: number }) {
  const tested = testLine(tests, s.name)
  return (
    <article className="skc" id={skillId(s.name)} data-c="how" data-focus="self" style={{ left: x, top: y, width: w, height: h }}>
      <div className="skc-vis">
        {s.evidence
          ? <Evidence name={s.name} ev={s.evidence} />
          : s.flow && (
            <ol className="skc-flow">
              {s.flow.slice(0, 3).map((f, i) => <li key={i}><span>{['In', 'Does', 'Out'][i]}</span>{f}</li>)}
            </ol>
          )}
      </div>
      <header>
        <span>{s.step ? STEP_LABEL[s.step] : s.label} · {s.label}<a href={`${SKILLS_REPO}/tree/main/${s.name}`} target="_blank" rel="noopener">Source <FiArrowUpRight aria-hidden="true" /></a></span>
        <b>{s.name}</b>
      </header>
      <p>{s.summary ?? s.description}</p>
      <footer>{tested ? <span className="skc-t">{tested}</span> : <span className="skc-t none">Not tested yet</span>}</footer>
    </article>
  )
}

/** The Build step's card: the library itself, with the one command that installs it. */
function LibraryCard({ skills, tests, x, y, w, h }: { skills: Skill[]; tests: Tests; x: number; y: number; w: number; h: number }) {
  const tested = skills.filter((s) => tests.skills[s.name]).length
  return (
    <a className="skc lib" href={SKILLS_REPO} target="_blank" rel="noopener" data-c="how" style={{ left: x, top: y, width: w, height: h }}>
      <span className="lib-k"><FiTerminal aria-hidden="true" /> Open source</span>
      <b>{skills.length} Claude Code skills</b>
      <p>How the AI works for me is written down as skills: procedures with the checks built in. Anyone can install them.</p>
      <code>{SKILLS_INSTALL}</code>
      <footer><span className="skc-t">{tested} of {skills.length} tested</span><span>github.com/MattKay02/skills <FiArrowUpRight aria-hidden="true" /></span></footer>
    </a>
  )
}

export interface Column {
  step: Step; x: number; sub?: number
  /** Board content that follows this column's cards, placed in the next free slot. */
  after?: (x: number, y: number) => ReactNode
}

/** Lays each step's skills out under its column; a column with `sub` > 1 fills a grid. */
export default function SkillsPipeline({ cols, y, card, gap }: { cols: Column[]; y: number; card: { w: number; h: number }; gap: number }) {
  const { skills, tests } = useSkills()
  return (
    <>
      {cols.map((col) => {
        const sub = col.sub ?? 1
        const at = (i: number) => ({ x: col.x + (i % sub) * (card.w + gap), y: y + Math.floor(i / sub) * (card.h + gap) })
        const slots: ReactNode[] = []
        if (col.step === 'build') slots.push(<LibraryCard key="lib" skills={skills} tests={tests} {...at(0)} w={card.w} h={card.h} />)
        for (const s of skills.filter((k) => (k.step ?? 'check') === col.step)) {
          slots.push(<SkillCard key={s.name} s={s} tests={tests} {...at(slots.length)} w={card.w} h={card.h} />)
        }
        if (col.after) { const p = at(Math.ceil(slots.length / sub) * sub); slots.push(<Fragment key="after">{col.after(p.x, p.y)}</Fragment>) }
        return <Fragment key={col.step}>{slots}</Fragment>
      })}
    </>
  )
}
