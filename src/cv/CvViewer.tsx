'use client'

// The CV viewer: the CV on the site's own desk, with Download PDF in its bar.
// <CvViewer> opens over the workbench; <CvPageShell> is the same design as the
// standalone /cv page.
import { useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { FiDownload, FiX } from 'react-icons/fi'
import CvSheet from './CvSheet'

export const CV_PDF = '/cv.pdf'
export const CV_FILE = 'Matthew_Kay_CV.pdf'

function Bar({ updated, children }: { updated: string; children: ReactNode }) {
  return (
    <header className="cvv-bar">
      <span className="logo">MK.</span>
      <span className="cvv-title"><b>Matthew Kay · CV</b><span>Updated {updated}</span></span>
      <div className="cvv-actions">
        <a className="btn solid" href={CV_PDF} download={CV_FILE}>Download PDF <FiDownload aria-hidden="true" /></a>
        {children}
      </div>
    </header>
  )
}

export function CvViewer({ open, onClose, updated }: { open: boolean; onClose: () => void; updated: string }) {
  const closeBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    root.classList.add('cv-open')
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    addEventListener('keydown', onKey)
    return () => { root.classList.remove('cv-open'); removeEventListener('keydown', onKey) }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="cvv" role="dialog" aria-modal="true" aria-label="Matthew Kay's CV">
      <Bar updated={updated}>
        <button ref={closeBtn} type="button" className="ibtn" onClick={onClose} aria-label="Close the CV"><FiX aria-hidden="true" /></button>
      </Bar>
      {/* Clicking the desk around the sheet closes the viewer. */}
      <div className="cvv-scroll" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
        <CvSheet updated={updated} />
      </div>
    </div>
  )
}

export function CvPageShell({ updated }: { updated: string }) {
  return (
    <main className="cvv cvv-page">
      <Bar updated={updated}>
        <Link className="btn ghost" href="/">Workbench</Link>
      </Bar>
      <div className="cvv-scroll">
        <CvSheet updated={updated} />
      </div>
    </main>
  )
}
