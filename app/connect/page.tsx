// The QR landing page: everywhere to follow Matthew and what he builds, on one card. Kept out
// of search, as mgkcodes.com/connect was, and the only place on the site that lists his social
// accounts: the board itself is for recruiters. mgkcodes.com/connect is the studio's card and
// links here for him (23 Oct 2026). It opens on a person, then says where to look for what.
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { FaGithub, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa'
import { FaThreads, FaXTwitter } from 'react-icons/fa6'
import { FiArrowUpRight, FiFileText, FiMail } from 'react-icons/fi'
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
  /** What's there, so a visitor picks by what they want rather than by platform. */
  detail: string
  href: string
  icon: ReactNode
  /** The one place to begin for someone who doesn't know where to. */
  start?: boolean
  /** On this site: opens in the same tab. */
  here?: boolean
}

const LOOK: Row[] = [
  { label: 'Instagram', detail: 'My days, training and London, in photos', href: LINKS.instagram, icon: <FaInstagram aria-hidden="true" />, start: true },
  { label: 'TikTok', detail: 'The same, in short videos', href: LINKS.tiktok, icon: <FaTiktok aria-hidden="true" /> },
  { label: 'X', detail: "Short posts on what I'm working on", href: LINKS.x, icon: <FaXTwitter aria-hidden="true" /> },
  { label: 'Threads', detail: 'The same short posts, and the replies', href: LINKS.threads, icon: <FaThreads aria-hidden="true" /> },
  { label: 'GitHub', detail: 'Code, and my Claude Code skills', href: LINKS.github, icon: <FaGithub aria-hidden="true" /> },
]

const HIRE: Row[] = [
  { label: 'LinkedIn', detail: 'Work history, and the best place to talk work', href: LINKS.linkedin, icon: <FaLinkedin aria-hidden="true" /> },
  { label: 'CV', detail: 'One page, with a PDF', href: '/cv/', icon: <FiFileText aria-hidden="true" />, here: true },
  { label: 'Email', detail: LINKS.email, href: `mailto:${LINKS.email}`, icon: <FiMail aria-hidden="true" />, here: true },
]

const BUILD: Row[] = [
  { label: 'MGKCodes', detail: 'The studio I run', href: LINKS.mgkcodes, icon: <MGKIcon className="mgk" /> },
  { label: 'frunt', detail: 'Staff training and compliance for restaurants', href: 'https://frunthospitality.com', icon: <img src="/work/frunt-icon.webp" alt="" /> },
  { label: 'MGKFitness', detail: 'Run and Lift, open source fitness apps', href: 'https://mgkfitness.mgkcodes.com', icon: <img src="/work/mgkfitness-icon.webp" alt="" /> },
]

function Section({ n, title, rows }: { n: string; title: string; rows: Row[] }) {
  return (
    <section className="cx-sec">
      <h2 className="cx-sh">
        <span>{n}</span>
        {title}
      </h2>
      <ul className="cx-rows">
        {rows.map((r) => (
          <li key={r.href}>
            <a href={r.href} {...(r.here ? {} : { target: '_blank', rel: 'noopener' })}>
              <span className="cx-icon">{r.icon}</span>
              <span className="cx-text">
                <b>
                  {r.label}
                  {r.start && <em className="cx-start">Start here</em>}
                </b>
                <span>{r.detail}</span>
              </span>
              <FiArrowUpRight className="cx-go" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function ConnectPage() {
  return (
    <main className="cx">
      <article className="cx-card">
        <header className="cx-head">
          {/* The photo as a selected frame, as on the board's hero. */}
          <figure className="cx-frame" aria-hidden="false">
            {/* eslint-disable-next-line @next/next/no-img-element -- a static export with unoptimised images */}
            <img className="cx-photo" src="/connect/matthew.jpg" alt="Matthew Kay at London Tech Week" width={96} height={96} />
            <i className="h tl" /><i className="h tr" /><i className="h bl" /><i className="h br" />
          </figure>
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
        <p className="cx-handle">
          <span>@matthewkaydev</span> on every platform
        </p>

        <Section n="01" title="Where to look" rows={LOOK} />
        <Section n="02" title="Work with me" rows={HIRE} />
        <Section n="03" title="What I build" rows={BUILD} />

        <footer className="cx-foot">
          <a href="/">matthewkay.dev</a>
          <span>London</span>
        </footer>
      </article>
    </main>
  )
}
