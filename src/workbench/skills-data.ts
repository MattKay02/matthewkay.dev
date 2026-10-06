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
}
interface Case { name: string; kind: 'trigger' | 'behaviour'; runs: number; with: number | null; without: number | null; date: string }
export interface Tests { generated?: string; skills: Record<string, { lastRun: string; cases: Case[] }> }

export const SKILLS = snapshot.skills as Skill[]
export const TESTS = testsSnapshot as Tests

export const STEP_LABEL: Record<Step, string> = { plan: 'Plan', decide: 'Decide', build: 'Build', check: 'Check', ship: 'Ship' }

export const skillId = (name: string) => `sk-${name}`

/** "Tested · loads right 2/2 · task 0.92 vs 0.88", or null when there are no results. */
export function testLine(tests: Tests, name: string): string | null {
  const t = tests.skills[name]
  if (!t) return null
  const triggers = t.cases.filter((c) => c.kind === 'trigger')
  const passed = triggers.filter((c) => c.with === 1).length
  const parts = [`loads right ${passed}/${triggers.length}`]
  for (const c of t.cases.filter((c) => c.kind === 'behaviour' && c.with !== null)) {
    parts.push(`task ${c.with!.toFixed(2)}${c.without !== null ? ` vs ${c.without.toFixed(2)}` : ''}`)
  }
  return `Tested · ${parts.join(' · ')}`
}

/** One skill as a sentence for the text versions: step, what it does, its tests and what its picture shows. */
export function skillText(s: Skill, tests: Tests = TESTS): string {
  const tested = testLine(tests, s.name)
    ?.replace(/loads right (\d+)\/(\d+)/, 'loads when asked and stays out otherwise in $1 of $2 cases')
    .replace(/task ([\d.]+) vs ([\d.]+)/g, 'task score $1 with the skill, $2 without')
  return [
    `${s.name} (${s.step ? STEP_LABEL[s.step] : s.label}): ${s.summary ?? s.description}`,
    tested && `${tested}.`,
    s.evidence?.caption && `Shown: ${s.evidence.caption}`,
  ].filter(Boolean).join(' ')
}
