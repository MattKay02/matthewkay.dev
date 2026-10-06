// The guided tour. Each stop names the cluster it belongs to, what the camera
// frames on a wide screen (r) and on a phone (m), and what the guide panel says.
// Rects are [x, y, width, height] in board pixels.

import { SHOW_FRUNT } from '@/case-studies/flags'

export type Cluster = 'hero' | 'all' | 'frunt' | 'mgk' | 'other' | 'how' | 'about' | 'contact'
export type Rect = [number, number, number, number]
export type Extra = 'heroProof' | 'slots' | 'slotsOne' | 'fruntApps' | 'mgkApps' | 'skills' | 'contact' | 'fruntCase'

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
}

export const WORLD = { w: 4760, h: 6260 }

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
  c: 'frunt', r: [3590, 1440, 1060, 490], m: [3600, 1450, 1040, 470], nav: 'frunt: how it was built',
  extra: 'fruntCase',
  title: 'Every big call written down, with the date I made it.',
  body: 'From a demo on 1 May 2026 to both app stores by 13 June. Three of the calls that shaped it:',
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
    body: 'Scroll for the guided tour, or click any frame to jump straight to it.',
  },
  {
    c: 'frunt', r: [1760, 200, 510, 880], m: [1760, 200, 510, 880], nav: 'frunt: the problem',
    title: "Restaurants have their rules written down. Staff don't read them.",
    body: "frunt turns a restaurant's own documents into staff training and instant answers. A web app for managers; a phone app and WhatsApp for staff.",
  },
  {
    c: 'frunt', r: [2230, 380, 1440, 1110], m: [2230, 400, 1440, 1060], nav: 'frunt: the manager app',
    title: 'Managers bring the documents they already have.',
    body: 'frunt reads them, files them and turns them into courses, and a manager checks each one before staff see it. Use the tabs under the laptop to look through the screens.',
  },
  {
    c: 'frunt', r: [2400, 520, 1100, 740], m: [3700, 640, 372, 740], nav: 'frunt: sourced answers',
    lock: { 'frunt-a': 1 },
    title: 'Every answer shows where it came from.',
    body: "Staff ask in plain words. frunt answers only from that restaurant's documents and cites each source, so a manager can check it.",
  },
  {
    c: 'frunt', r: [3690, 370, 760, 1080], m: [3700, 380, 740, 1050], nav: 'frunt: the staff app',
    title: 'Staff get answers and training on their phone.',
    body: 'Two screens from the staff app, on the App Store and Google Play. Staff can also ask on WhatsApp, with no app to install.',
  },
  {
    c: 'frunt', r: [1740, 30, 2920, 1910], m: [1770, 1460, 1180, 460], nav: 'frunt: the whole system',
    layers: true, extra: 'fruntApps',
    title: 'More than an app.',
    body: 'frunt is six parts I designed, built and run: two apps, a website, an admin console, an Instagram studio and an outreach engine.',
  },
  ...(SHOW_FRUNT ? [FRUNT_CASE] : []),
  {
    c: 'mgk', r: [1740, 2080, 1200, 1160], m: [1770, 2530, 820, 620], nav: 'MGKFitness: Liftio',
    title: 'Liftio. My first App Store app.',
    body: 'A gym tracker in React Native: 330+ exercises, progress charts, personal bests and cloud backup.',
  },
  {
    c: 'mgk', r: [2560, 2520, 1100, 1060], m: [2790, 2530, 830, 1010], nav: 'MGKFitness: the rebuild',
    title: 'Then I rebuilt it as part of something bigger.',
    body: 'Lift is Liftio rewritten in Flutter, one app in a suite with Run. I kept the old App Store listing instead of starting fresh: its reviews and history were worth more than a tidy app ID.',
  },
  {
    c: 'mgk', r: [2780, 2520, 1880, 1060], m: [3360, 2530, 800, 700], nav: 'MGKFitness: the suite',
    extra: 'mgkApps',
    title: 'Two apps that know about each other.',
    body: 'Log a run in Run and Lift sees it, so the coach plans around your whole week.',
  },
  {
    c: 'mgk', r: [1740, 2070, 2920, 1940], m: [1770, 3540, 1180, 460], nav: 'MGKFitness: the whole system',
    layers: true, extra: 'slots',
    title: 'A suite, not two apps.',
    body: 'Two apps on one account and one backend, an AI coach, a website, a social pipeline and the release tooling around them.',
  },
  {
    c: 'other', r: [100, 1320, 1560, 1440], m: [110, 1730, 1530, 980], nav: 'Other work',
    extra: 'slotsOne',
    title: 'Smaller builds, each made to learn something.',
    body: 'Client sites, experiments and practice projects. Hover a card to see it in colour.',
  },
  {
    c: 'how', r: [1740, 4090, 2920, 2080], m: [1770, 4420, 940, 1260], nav: 'How I work',
    title: 'I use AI to move fast. These are the checks that keep it honest.',
    body: 'Plan, decide, build, check, ship. Each step leaves something behind that you can look at, and under each one are the skills I built for it, loaded live from GitHub.',
    extra: 'skills',
  },
  {
    c: 'how', r: [3190, 4815, 970, 1340], m: [3205, 4830, 465, 420], nav: 'How I work: the checks',
    layers: true,
    title: 'Most of my skills are checks.',
    body: "Each one is tested: it has to load when it's asked for and stay out when it isn't. The pictures are real output, not mockups. Pick one to look closer.",
  },
  {
    c: 'about', r: [100, 2880, 1560, 900], m: [1020, 2940, 640, 760], nav: 'About',
    title: 'I build things to understand them.',
    body: 'I run MGKCodes, the studio behind frunt and MGKFitness. Away from the desk: gym, golf and gaming.',
  },
  {
    c: 'contact', r: [100, 3860, 1560, 640], m: [110, 3880, 1240, 520], nav: 'Contact',
    extra: 'contact',
    title: "Hiring? Let's talk.",
  },
]

export const LINKS = {
  linkedin: 'https://linkedin.com/in/matthew-kay-',
  github: 'https://github.com/MattKay02',
  x: 'https://x.com/mattykay2002',
  mgkcodes: 'https://mgkcodes.com',
  skills: 'https://github.com/MattKay02/skills',
  email: 'mattykay2002@gmail.com',
}

/** Installs every skill in any agent that supports Agent Skills (`--skill <name>` for one). */
export const SKILLS_INSTALL = 'npx skills add MattKay02/skills'
