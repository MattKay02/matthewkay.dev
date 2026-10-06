// The share image: what LinkedIn, X and messaging apps show for a link to the
// site. scripts/build-og.mjs photographs this page at 1200 × 630 into /og.png on
// every deploy, so it always matches the site. Not meant for visitors (noindex).
import type { Metadata } from 'next'
import { appStatus, type AppKey } from '@/workbench/apps'
import { stops } from '@/workbench/stops'
import './og.css'

export const metadata: Metadata = { title: 'Share image', robots: { index: false, follow: false } }

const APPS: AppKey[] = ['frunt', 'run', 'lift']
const PHOTO = { w: 300, h: 375 }

export default function OgPage() {
  return (
    <main className="og">
      <span className="og-url">matthewkay.dev</span>
      <h1 className="og-name"><span>Matthew</span><span className="og-kay">Kay</span></h1>
      <p className="og-line">{stops[0].title}</p>
      <ul className="og-apps">
        {APPS.map((key) => {
          const a = appStatus(key)
          return <li key={key}><img src={`/work/${a.icon}.webp`} width={48} height={48} alt="" />{a.name}</li>
        })}
      </ul>
      <figure className="og-photo" style={{ width: PHOTO.w, height: PHOTO.h }}>
        <img src="/work/headshot.webp" alt="" />
        <i className="tl" /><i className="tr" /><i className="bl" /><i className="br" />
        <figcaption>{PHOTO.w} × {PHOTO.h}</figcaption>
      </figure>
    </main>
  )
}
