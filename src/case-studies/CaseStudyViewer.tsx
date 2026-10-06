'use client'

// A case study over the board, the way the CV opens: the page on the site's own
// desk, closed with Escape, the X, or a click on the desk. <CaseStudyPageShell>
// is the same design as the standalone /work/<slug> page.
import { useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { FiExternalLink, FiX } from 'react-icons/fi'
import '@/cv/cv.css' // the viewer shell (.cvv) is shared with the CV
import CaseStudySheet, { checkedLabel } from './CaseStudySheet'
import { FRUNT_PUBLISHED } from './flags'
import type { CaseStudy } from './frunt'

function Bar({ study, children }: { study: CaseStudy; children: ReactNode }) {
  return (
    <header className="cvv-bar">
      <span className="logo">MK.</span>
      <span className="cvv-title">
        <b>{study.name} · case study</b>
        <span>{checkedLabel(study)}{!FRUNT_PUBLISHED && ' · draft, not published'}</span>
      </span>
      <div className="cvv-actions">{children}</div>
    </header>
  )
}

export function CaseStudyViewer({ study, open, onClose }: { study: CaseStudy | null; open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    root.classList.add('cv-open')
    // Focus the dialog, not its close button: opened from a link (/#cv) with no tap yet, the
    // browser would draw a keyboard focus ring on the button. Tab still reaches the buttons first.
    dialog.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    addEventListener('keydown', onKey)
    return () => { root.classList.remove('cv-open'); removeEventListener('keydown', onKey) }
  }, [open, onClose])

  if (!open || !study) return null
  return (
    <div ref={dialog} tabIndex={-1} className="cvv" role="dialog" aria-modal="true" aria-label={`${study.name} case study`}>
      <Bar study={study}>
        <a className="btn ghost cs-open" href={`/work/${study.slug}/`} aria-label="Open as a page"><span>Open as a page</span> <FiExternalLink aria-hidden="true" /></a>
        <button type="button" className="ibtn" onClick={onClose} aria-label="Close the case study"><FiX aria-hidden="true" /></button>
      </Bar>
      <div className="cvv-scroll" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
        <CaseStudySheet study={study} />
      </div>
    </div>
  )
}

export function CaseStudyPageShell({ study }: { study: CaseStudy }) {
  return (
    <main className="cvv cvv-page">
      <Bar study={study}>
        <Link className="btn ghost" href="/">Workbench</Link>
      </Bar>
      <div className="cvv-scroll">
        <CaseStudySheet study={study} />
      </div>
    </main>
  )
}
