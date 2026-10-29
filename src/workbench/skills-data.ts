// The skills library as data: the committed snapshots of the skills repo's skills.json
// and tests.json, and the helpers shared by the board (Skills.tsx, which swaps in the
// live files) and the text versions of the site (TourText, /llms.txt). No 'use client',
// so server code can call these.
import snapshot from '@/data/skills.json'
import testsSnapshot from '@/data/skill-tests.json'

export const SKILLS_REPO = 'https://github.com/MattKay02/skills'
export const RAW = 'https://raw.githubusercontent.com/MattKay02/skills/main'

export type Step = 'plan' | 'decide' | 'build' | 'check' | 'ship'
export interface Skill {
  name: string; label: string; description: string; why?: string; stack?: string[]
  step?: Step; summary?: string; flow?: string[]; evidence?: { image: string; dark?: string; caption?: string }
  /** The problem that made the skill, in one plain sentence (a short `why`). */
  problem?: string
  /** 1, 2 or 3: tells this skill's story in How I work, in that order. */
  featured?: number
}
interface Case { name: string; kind: 'trigger' | 'behaviour'; runs: number; with: number | null; without: number | null; date: string }
export interface Tests { generated?: string; skills: Record<string, { lastRun: string; cases: Case[] }> }

export const SKILLS = snapshot.skills as Skill[]
export const TESTS = testsSnapshot as Tests

export const STEP_LABEL: Record<Step, string> = { plan: 'Plan', decide: 'Decide', build: 'Build', check: 'Check', ship: 'Ship' }

export const skillId = (name: string) => `sk-${name}`
export const stepOf = (s: Skill): Step => (s.step && s.step in STEP_LABEL ? s.step : 'check')

/** The (up to) three skills whose stories How I work tells: those marked `featured`, else those with real output. */
export function featured(skills: Skill[]): Skill[] {
  const marked = skills.filter((s) => typeof s.featured === 'number').sort((a, b) => a.featured! - b.featured!)
  return (marked.length ? marked : skills.filter((s) => s.evidence)).slice(0, 3)
}

/** A skill's eval results in plain numbers, or null when it has none. */
function results(tests: Tests, name: string) {
  const t = tests.skills[name]
  if (!t) return null
  const triggers = t.cases.filter((c) => c.kind === 'trigger')
  return {
    passed: triggers.filter((c) => c.with === 1).length, total: triggers.length,
    scores: t.cases.filter((c) => c.kind === 'behaviour' && c.with !== null).map((c) => ({ with: c.with!, without: c.without })),
  }
}

/** "Tested · loads when it should, 2 of 2 · scores 0.92 with it, 0.88 without", or null when there are no results. */
export function testLine(tests: Tests, name: string): string | null {
  const r = results(tests, name)
  if (!r) return null
  const parts = [`loads when it should, ${r.passed} of ${r.total}`]
  for (const s of r.scores) parts.push(`scores ${s.with.toFixed(2)} with it${s.without !== null ? `, ${s.without.toFixed(2)} without` : ''}`)
  return `Tested · ${parts.join(' · ')}`
}

/** One skill as a sentence for the text versions: step, what it does, why it exists, its tests and what its picture shows. */
export function skillText(s: Skill, tests: Tests = TESTS): string {
  const r = results(tests, s.name)
  const tested = r && [
    `Tested: loads when it's asked for and stays out otherwise in ${r.passed} of ${r.total} cases`,
    ...r.scores.map((x) => `task score ${x.with.toFixed(2)} with the skill${x.without !== null ? `, ${x.without.toFixed(2)} without` : ''}`),
  ].join('; ')
  return [
    `${s.name} (${STEP_LABEL[stepOf(s)]}): ${s.summary ?? s.description}`,
    s.problem && `Why I wrote it: ${s.problem}`,
    tested && `${tested}.`,
    s.evidence?.caption && `Shown: ${s.evidence.caption}`,
  ].filter(Boolean).join(' ')
}
