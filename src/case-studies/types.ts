// The shape of a case study. Each one is data (frunt.ts, mgkfitness.ts),
// rendered by CaseStudySheet. Anything that could go stale (live status,
// figures) is read from the stores and the counting scripts, never typed.
import type { AppKey } from '@/workbench/apps'

export interface Row { label: string; text: string }
export interface Decision {
  title: string
  when: string
  adr?: string
  rows: Row[]
  /** A finding list instead of rows (frunt's September card). */
  items?: Row[]
  quote?: string
  /** Ends with the latest answer-accuracy result (frunt), read from its stats, never typed. */
  liveEval?: boolean
}

/** A figure counted from the product's repo by a script (npm run frunt, npm run mgk). */
export interface Figure { n: number; label: string }

export interface CaseStudy {
  slug: string
  name: string
  /** The apps heading the study, each with its live status and store buttons. */
  apps: AppKey[]
  checked: string
  /** The last decision record read: '0087' for frunt (npm run frunt reads it), or a label naming several sets. */
  lastAdrRead: string
  /** What the words were checked against, for the footer: "frunt's code". */
  source: string
  tldr: Row[]
  shot: { img: string; w: number; h: number; alt: string; caption: string }
  made: { line1: string; line2: string; surfaces: string; role: string; started: string; live: string; body: string }
  why: { line1: string; line2: string; paras: string[] }
  aims: Row[]
  timeline: { date: string; text: string }[]
  decisions: Decision[]
  landed: string[]
  figures: Figure[]
  /** Where and when the figures were counted. */
  counted: { from: string; at: string; commit: string }
  how: { intro: string; steps: Row[] }
  learnt: { lead: Row; rest: Row[] }
  /** frunt only: its latest answer-accuracy run as one line. */
  evalText?: string | null
}
