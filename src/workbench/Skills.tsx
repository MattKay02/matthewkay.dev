'use client'

// The skills shelf in "How I work". It reads the skills repo's manifest live, so
// publishing a skill there (SKILL.md + an entry in skills.json) shows it here with
// no change to this repo. The committed snapshot, refreshed by `npm run github`,
// is what renders first and what stays if GitHub can't be reached.
import { useEffect, useState } from 'react'
import snapshot from '@/data/skills.json'
import { FiTerminal } from 'react-icons/fi'

export const SKILLS_REPO = 'https://github.com/MattKay02/skills'
const MANIFEST = 'https://raw.githubusercontent.com/MattKay02/skills/main/skills.json'
const MAX = 8

type Skill = { name: string; label: string; description: string; why?: string; stack?: string[] }

export default function SkillsShelf({ x, y, w }: { x: number; y: number; w: number }) {
  const [skills, setSkills] = useState<Skill[]>(snapshot.skills)

  useEffect(() => {
    const ctl = new AbortController()
    fetch(MANIFEST, { signal: ctl.signal, cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { skills?: Skill[] }) => { if (Array.isArray(d.skills) && d.skills.length) setSkills(d.skills) })
      .catch(() => { /* keep the snapshot */ })
    return () => ctl.abort()
  }, [])

  const shown = skills.slice(0, MAX)
  const more = skills.length - shown.length
  return (
    <div className="skills" data-c="how" style={{ left: x, top: y, width: w }}>
      <a className="sk-head" href={SKILLS_REPO} target="_blank" rel="noopener">
        <FiTerminal aria-hidden="true" /> <b>{skills.length}</b> Claude Code skills I&apos;ve built · live from GitHub
      </a>
      <div className="sk-grid">
        {shown.map((s) => (
          <a key={s.name} className="sk" href={SKILLS_REPO} target="_blank" rel="noopener" title={s.description}>
            <span className="sk-l">{s.label}</span>
            <b>{s.name}</b>
            {s.stack && <span className="sk-s">{s.stack.join(' · ')}</span>}
          </a>
        ))}
        {more > 0 && <a className="sk more" href={SKILLS_REPO} target="_blank" rel="noopener"><b>+{more} more</b></a>}
      </div>
    </div>
  )
}
