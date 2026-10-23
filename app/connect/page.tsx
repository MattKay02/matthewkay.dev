// The QR landing page: everywhere to follow Matthew and what he builds, on one card. Kept out
// of search, as mgkcodes.com/connect was, and the only place on the site that lists his social
// accounts: the board itself is for recruiters. mgkcodes.com/connect is the studio's card and
// links here for him (23 Oct 2026).
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { FaGithub, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa'
import { FaThreads, FaXTwitter } from 'react-icons/fa6'
import { FiArrowUpRight, FiMail } from 'react-icons/fi'
import { MGKIcon } from '@/workbench/icons'
import { LINKS } from '@/workbench/stops'
import './connect.css'

export const metadata: Metadata = {
  title: { absolute: 'Connect · Matthew Kay' },
  description: 'Where to find Matthew Kay, and what he builds.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/connect/' },
}

interface Row {
  label: string
  detail: string
  href: string
  icon: ReactNode
}

const FOLLOW: Row[] = [
  { label: 'Instagram', detail: '@matthewkaydev', href: LINKS.instagram, icon: <FaInstagram aria-hidden="true" /> },
  { label: 'Threads', detail: '@matthewkaydev', href: LINKS.threads, icon: <FaThreads aria-hidden="true" /> },
  { label: 'X', detail: '@matthewkaydev', href: LINKS.x, icon: <FaXTwitter aria-hidden="true" /> },
  { label: 'TikTok', detail: '@matthewkaydev', href: LINKS.tiktok, icon: <FaTiktok aria-hidden="true" /> },
  { label: 'LinkedIn', detail: 'Matthew Kay', href: LINKS.linkedin, icon: <FaLinkedin aria-hidden="true" /> },
  { label: 'GitHub', detail: 'MattKay02', href: LINKS.github, icon: <FaGithub aria-hidden="true" /> },
]

const WORK: Row[] = [
  { label: 'MGKCodes', detail: 'The studio I run', href: LINKS.mgkcodes, icon: <MGKIcon className="mgk" /> },
  { label: 'frunt', detail: 'Staff training and compliance for restaurants', href: 'https://frunthospitality.com', icon: <img src="/work/frunt-icon.webp" alt="" /> },
  { label: 'MGKFitness', detail: 'Run and Lift, open source fitness apps', href: 'https://mgkfitness.mgkcodes.com', icon: <img src="/work/mgkfitness-icon.webp" alt="" /> },
]

function Rows({ rows }: { rows: Row[] }) {
  return (
    <ul className="cx-rows">
      {rows.map((r) => (
        <li key={r.href}>
          <a href={r.href} target="_blank" rel="noopener">
            <span className="cx-icon">{r.icon}</span>
            <span className="cx-text">
              <b>{r.label}</b>
              <span>{r.detail}</span>
            </span>
            <FiArrowUpRight className="cx-go" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function ConnectPage() {
  return (
    <main className="cx">
      <article className="cx-card">
        <header className="cx-head">
          {/* eslint-disable-next-line @next/next/no-img-element -- a static export with unoptimised images */}
          <img className="cx-photo" src="/connect/matthew.jpg" alt="Matthew Kay at London Tech Week" width={96} height={96} />
          <div>
            <span className="cx-k">Connect</span>
            <h1>
              Matthew Kay
              <span>Building with AI</span>
            </h1>
          </div>
        </header>
        {/* So a scan lands on a person, not a list (Matthew, 23 Oct 2026). Lines the site and the bios already use. */}
        <div className="cx-intro">
          <p>Hi, I&rsquo;m Matt. I&rsquo;m a developer in London, and I run MGKCodes, the studio behind frunt and MGKFitness.</p>
          <p>
            This is the quick version: where I post and what I&rsquo;m building. On Instagram, Threads, X and TikTok I share the
            standards I keep, building and training. The full portfolio is at <a href="/">matthewkay.dev</a>.
          </p>
        </div>

        <h2 className="cx-k">Follow</h2>
        <Rows rows={FOLLOW} />

        <h2 className="cx-k">Work</h2>
        <Rows rows={WORK} />

        <a className="cx-mail" href={`mailto:${LINKS.email}`}>
          <FiMail aria-hidden="true" />
          {LINKS.email}
        </a>
        <footer className="cx-foot">
          <a href="/">matthewkay.dev</a>
        </footer>
      </article>
    </main>
  )
}
