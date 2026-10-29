// The /cv page: the CV on the site's own desk, with Download PDF in its bar.
// A server component, so the CV's text is only ever in /cv's own HTML, which
// the public site doesn't build (src/cv/flags.ts).
import type { ReactNode } from 'react'
import Link from 'next/link'
import { FiDownload } from 'react-icons/fi'
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
