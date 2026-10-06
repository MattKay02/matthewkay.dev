// Matthew's CV, as data. This file is the single source: /cv renders it and the
// deploy prints that page to /cv.pdf, stamped with the date this file last
// changed (from git). To update the CV, edit this file and push.
//
// Rules: keep it to one A4 page (the PDF build fails if it overflows), keep
// statuses true, no em dashes, and never put a phone number here; the private
// copy gets it from the CV_PHONE environment variable (npm run cv:private).
import { LINKS } from '@/workbench/stops'
import { liveOn } from '@/workbench/apps'

const runLive = liveOn('run')

export interface CvLink { label: string; href: string }
export interface CvProduct { name: string; tagline: string; link?: CvLink; bullets: string[] }
export interface CvRole { role: string; org: string; dates: string; note?: string; products?: CvProduct[] }
export interface CvItem { name: string; line: string; dates?: string; link?: CvLink }

export const cv = {
  name: 'Matthew Kay',
  /** The role being applied for (LinkedIn keeps "Founder of MGKCodes"). Swap to "Software Developer" for general junior developer roles. */
  headline: 'Product Engineer',
  location: 'London, UK',
  email: LINKS.email,
  links: [
    { label: 'github.com/MattKay02', href: LINKS.github },
    { label: 'linkedin.com/in/matthew-kay-', href: LINKS.linkedin },
    { label: 'matthewkay.dev', href: 'https://matthewkay.dev' },
  ] as CvLink[],

  profile:
    'Founder of MGKCodes, my own software studio, where I design, build and ship complete products: frunt, a live SaaS for restaurant teams that grew out of my years working in busy restaurants, and MGKFitness, a suite of Flutter fitness apps I\'m actively building. A computer science foundation from two years of a BSc, and an AI-assisted workflow I build my own tools for. Looking for a junior role in a strong product team.',

  skills: [
    { group: 'Languages', items: 'TypeScript, JavaScript, Dart, Python, SQL, HTML / CSS (C++, academic)' },
    { group: 'Frontend & mobile', items: 'React, Next.js, Flutter, React Native / Expo, Tailwind CSS' },
    { group: 'Backend & data', items: 'Node.js, Supabase (Postgres, RLS, Edge Functions), pgvector, Inngest, REST APIs' },
    { group: 'Payments & ops', items: 'Stripe, RevenueCat, PostHog, Sentry, Vercel, Codemagic, EAS Build, GitHub Actions' },
    { group: 'AI engineering', items: 'RAG with cited sources, Claude API, OpenRouter, MCP servers, Claude Code and agentic workflows' },
    { group: 'Testing', items: 'Playwright (end to end)' },
  ],

  experience: [
    {
      role: 'Founder & Software Developer',
      org: 'MGKCodes, my own software studio',
      dates: '2026 – Present',
      products: [
        {
          name: 'frunt',
          tagline: 'staff training and compliance for restaurants',
          link: { label: 'frunthospitality.com', href: 'https://frunthospitality.com' },
          bullets: [
            "Turns a restaurant's own documents into staff training and instant answers that cite their source. Live in production with a paying customer.",
            'Designed and built the manager web app end to end: Next.js, TypeScript, Supabase / PostgreSQL, Stripe billing and background jobs on Inngest.',
            "Built retrieval over each restaurant's documents with pgvector and OpenAI embeddings, so every answer names the documents it came from.",
            'Shipped the Flutter staff app to the App Store and Google Play: sign-in, deep links, biometric login and push notifications.',
            'Built the tools to run it: an admin console (customers, revenue, AI cost per feature, health checks) and an Instagram studio where Claude proposes posts that I approve, then render, schedule and publish through the Instagram API.',
          ],
        },
        {
          name: 'MGKFitness',
          tagline: 'Run and Lift, two fitness apps on one account',
          link: { label: 'mgkfitness.mgkcodes.com', href: 'https://mgkfitness.mgkcodes.com' },
          bullets: [
            'Rebuilt my first App Store app, Liftio (React Native, RevenueCat subscriptions, EAS builds), as Lift: one app in a Flutter suite with Run, sharing a design system, a backend and an account.',
            `Run: a running tracker with an AI coach on Supabase Edge Functions and OpenRouter, RevenueCat subscriptions, and releases run from Claude Code and Codemagic.${runLive ? ` Live on ${runLive}.` : ''}`,
          ],
        },
      ],
    },
  ] as CvRole[],

  projects: [
    { name: 'skills', line: 'open-source Claude Code skills I build for my own workflow: Playwright UI walkthroughs, Lighthouse audits, emulator checks, CI builds.', link: { label: 'github.com/MattKay02/skills', href: LINKS.skills } },
    { name: 'This portfolio', line: 'a Next.js site with a scroll-driven camera, live GitHub and skills data, and this CV generated from it.' },
    { name: 'Video-sharing platform', line: 'Next.js, Prisma, JWT / bcrypt auth, FFmpeg thumbnails, full-text search, infinite scroll.' },
    { name: 'Ledger', line: 'business finance dashboard: React, Supabase, Google and Apple sign-in, AI transaction entry with Claude.' },
  ] as CvItem[],

  work: [
    { name: 'Bartender (part-time) · Red Cross, Reigate', line: 'Also designed and built the pub\'s website.', dates: 'Dec 2025 – Present' },
    { name: 'Bartender · Coppa Club, Tower Bridge, London', line: 'High-volume restaurant and cocktail bar (200+ covers), and where the idea for frunt came from.', dates: 'Apr 2024 – Dec 2025' },
  ] as CvItem[],

  education: [
    { name: 'BSc Information & Knowledge Systems · University of Pretoria', line: 'Completed two years (computer science, front-end development, C++) before relocating to the UK.', dates: '2021 – 2023' },
    { name: 'Certifications · IT Career Switch', line: 'JavaScript Essentials · HTML5 & CSS3 with JavaScript · Introduction to Python', dates: '2024 – 2025' },
    { name: 'Matric · De La Salle Holy Cross College, Johannesburg', line: '', dates: '2020' },
  ] as CvItem[],
}
