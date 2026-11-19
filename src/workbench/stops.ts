// The guided tour. Each stop names the cluster it belongs to, what the camera
// frames on a wide screen (r) and on a phone (m), and what the guide panel says.
// A phone's frame (m) holds the stop's whole subject, never part of one: on touch
// screens it is also what stays lit, and the rest of the board dims around it.
// Rects are [x, y, width, height] in board pixels.

import { SHOW_FRUNT, SHOW_MGK } from '@/case-studies/flags'

export type Cluster = 'hero' | 'all' | 'frunt' | 'mgk' | 'other' | 'how' | 'about' | 'contact'
export type Rect = [number, number, number, number]
export type Extra = 'heroProof' | 'slots' | 'slotsOne' | 'fruntApps' | 'mgkApps' | 'skills' | 'stories' | 'contact' | 'case'

export interface Stop {
  c: Cluster
  r: Rect
  m?: Rect
  nav: string
  kicker?: string
  title: string
  body?: string
  extra?: Extra
  layers?: boolean
  /** Lock a rotating MacBook (by data-lap id) to one screen while this stop is current. */
  lock?: Record<string, number>
  /** For `extra: 'case'`: which case study (its slug in CASE_BOARDS). */
  study?: string
}

export const WORLD = { w: 4760, h: 6310 }

/** The dashed case-study placeholders. Off until the first case study exists. */
export const SHOW_SLOTS = false

export const CHAPTERS: Record<Cluster, string> = {
  hero: 'Intro',
  all: 'The whole board',
  frunt: '01 · frunt · main project',
  mgk: '02 · MGKFitness',
  other: '03 · Other work',
  how: '04 · How I work',
  about: '05 · About',
  contact: '06 · Contact',
}

export const NAV_ITEMS: { c: Cluster; label: string }[] = [
  { c: 'hero', label: 'Hero' },
  { c: 'frunt', label: 'frunt' },
  { c: 'mgk', label: 'MGKFitness' },
  { c: 'other', label: 'Other work' },
  { c: 'how', label: 'How I work' },
  { c: 'about', label: 'About' },
  { c: 'contact', label: 'Contact' },
]

/** The way into the frunt case study: its dated timeline on the board, three decisions in the panel. */
const FRUNT_CASE: Stop = {
  c: 'frunt', r: [3590, 1440, 1060, 490], m: [3610, 1470, 1020, 476], nav: 'frunt: how it was built',
  extra: 'case', study: 'frunt',
  title: 'Every big call written down, with the date I made it.',
  body: 'From a demo on 1 May 2026 to both app stores by 13 June. Three of the calls that shaped it:',
}

/** The way into the MGKFitness case study: the same, under the suite. */
const MGK_CASE: Stop = {
  c: 'mgk', r: [3590, 3270, 1060, 490], m: [3610, 3300, 1020, 476], nav: 'MGKFitness: how it was built',
  extra: 'case', study: 'mgkfitness',
  title: 'Two apps, from the first decision to both stores.',
  body: 'Run started on 25 July 2026. Both apps were on both stores by 19 October. Three of the calls that shaped it:',
}

export const stops: Stop[] = [
  {
    c: 'hero', r: [100, 120, 1560, 1000], m: [100, 150, 1520, 960], nav: 'Intro',
    kicker: 'Matthew Kay · Portfolio',
    title: 'Product engineer. I design and build polished apps, end to end.',
    extra: 'heroProof',
  },
  {
    c: 'all', r: [0, 0, WORLD.w, WORLD.h], nav: 'The whole board',
    title: "Everything I've built, laid out the way I work on it.",
    body: 'Follow the tour with Next, or pick any frame to jump straight to it.',
  },
  {
    c: 'frunt', r: [1760, 200, 510, 880], m: [1780, 95, 470, 860], nav: 'frunt: the problem',
    title: "Restaurants have their rules written down. Staff don't read them.",
    body: "frunt turns a restaurant's own documents into staff training and instant answers. A web app for managers; a phone app and WhatsApp for staff.",
  },
  {
    c: 'frunt', r: [2230, 380, 1440, 1110], m: [2240, 420, 1420, 1030], nav: 'frunt: the manager app',
    title: 'Managers bring the documents they already have.',
    body: 'frunt reads them, files them and turns them into courses, and a manager checks each one before staff see it. Use the tabs under the laptop to look through the screens.',
  },
  {
    c: 'frunt', r: [2400, 520, 1100, 740], m: [3710, 390, 352, 975], nav: 'frunt: sourced answers',
    lock: { 'frunt-a': 1 },
    title: 'Every answer shows where it came from.',
    body: "Staff ask in plain words. frunt answers only from that restaurant's documents and cites each source, so a manager can check it.",
  },
  {
    c: 'frunt', r: [3690, 370, 760, 1080], m: [3710, 390, 722, 1056], nav: 'frunt: the staff app',
    title: 'Staff get answers and training on their phone.',
    body: 'Two screens from the staff app, on the App Store and Google Play. Staff can also ask on WhatsApp, with no app to install.',
  },
  {
    c: 'frunt', r: [1740, 30, 2920, 1910], m: [1740, 30, 2920, 1910], nav: 'frunt: the whole system',
    layers: true, extra: 'fruntApps',
    title: 'More than an app.',
    body: 'frunt is six parts I designed, built and run: two apps, a website, an admin console, an Instagram studio and an outreach engine.',
  },
  ...(SHOW_FRUNT ? [FRUNT_CASE] : []),
  {
    c: 'mgk', r: [1740, 2080, 1200, 1160], m: [1770, 2560, 840, 640], nav: 'MGKFitness: Liftio',
    title: 'Liftio. My first App Store app.',
    body: 'A gym tracker in React Native: 266 exercises, progress charts, personal bests and cloud backup.',
  },
  {
    c: 'mgk', r: [2560, 2520, 1100, 1060], m: [2600, 2560, 1010, 950], nav: 'MGKFitness: the rebuild',
    title: 'Then I rebuilt it as part of something bigger.',
    body: 'Lift is Liftio rewritten in Flutter, one app in a suite with Run. I kept Liftio\'s App Store listing instead of starting fresh, so anyone who had Liftio got Lift as an update.',
  },
  {
    c: 'mgk', r: [2790, 2530, 1370, 770], m: [2810, 2570, 1340, 720], nav: 'MGKFitness: the suite',
    extra: 'mgkApps',
    title: 'Two apps, one account.',
    body: 'Sign in to Run and Lift with the same account. Each app works on its own, built on one design system and one backend.',
  },
  {
    c: 'mgk', r: [1740, 2070, 2920, 1940], m: [1740, 2070, 2920, 1940], nav: 'MGKFitness: the whole system',
    layers: true, extra: 'slots',
    title: 'A suite, not two apps.',
    body: 'Two apps on one account and one backend, an AI coach, a website, a social pipeline and the release tooling around them.',
  },
  ...(SHOW_MGK ? [MGK_CASE] : []),
  {
    c: 'other', r: [100, 1320, 1560, 1440], m: [110, 1360, 1540, 1370], nav: 'Other work',
    extra: 'slotsOne',
    title: 'Smaller builds, each made to learn something.',
    body: 'Client sites, experiments and practice projects.',
  },
  {
    c: 'how', r: [1770, 4455, 1420, 1480], m: [1780, 4170, 1400, 1760], nav: 'How I work',
    title: 'I use AI to move fast. These are the checks that keep it honest.',
    body: 'Plan, decide, build, check, ship. Each step leaves something behind that you can look at, and under each one are the skills I built for it, loaded live from GitHub.',
    extra: 'skills',
  },
  {
    c: 'how', r: [3200, 4185, 1440, 1590], m: [3220, 4195, 1400, 1565], nav: 'How I work: three problems',
    layers: true, extra: 'stories',
    title: 'Each skill started as a problem I hit.',
    body: "Three of them, with real output from a real run. Every skill is tested: it has to load when it's asked for and stay out when it isn't.",
  },
  {
    // The close: what the tour showed, tied back to why Matthew builds (his calls, 19 Nov 2026: no hobby
    // photos; say plainly that building is his passion, this site included).
    c: 'about', r: [100, 2880, 1560, 900], nav: 'About',
    title: 'Building things is my passion.',
    body: "Every product here started as a problem I had: frunt from working the floor in restaurants, MGKFitness from fitness apps I didn't enjoy using. I love every part of making them, this site included. They all ship through MGKCodes, my studio, and it's just me: I design, build, release and market each one.",
  },
  {
    c: 'contact', r: [100, 3860, 1560, 640], m: [100, 3880, 1560, 600], nav: 'Contact',
    extra: 'contact',
    title: "Hiring? Let's talk.",
  },
]

export const LINKS = {
  linkedin: 'https://linkedin.com/in/matthew-kay-',
  github: 'https://github.com/MattKay02',
  x: 'https://x.com/matthewkaydev',
  // Social accounts, linked from /connect only: the board stays for recruiters.
  instagram: 'https://www.instagram.com/matthewkaydev/',
  threads: 'https://www.threads.com/@matthewkaydev',
  tiktok: 'https://www.tiktok.com/@matthewkaydev',
  mgkcodes: 'https://mgkcodes.com',
  skills: 'https://github.com/MattKay02/skills',
  email: 'hello@matthewkay.dev',
}

/**
 * The CV is sent on request, never published (Matthew, 27 Oct 2026: AI tools
 * looking up frunt were reading it). Every CV button opens this email.
 */
export const CV_REQUEST = `mailto:${LINKS.email}?subject=${encodeURIComponent('CV request')}&body=${encodeURIComponent("Hi Matthew,\n\nCould you send me your CV? It's for this role:\n\n")}`

/** Installs every skill in any agent that supports Agent Skills (`--skill <name>` for one). */
export const SKILLS_INSTALL = 'npx skills add MattKay02/skills'
