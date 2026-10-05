// The apps and where they're live. Static facts come from src/data/apps.json;
// what's actually live comes from src/data/stores.json, which
// scripts/fetch-stores.mjs refreshes from the stores on every deploy. So a store
// button appears, and an app turns "Live", the day it's approved, untouched.
import type { CSSProperties } from 'react'
import { FaApple, FaGooglePlay } from 'react-icons/fa'
import { FiGlobe } from 'react-icons/fi'
import apps from '@/data/apps.json'
import stores from '@/data/stores.json'

export type AppKey = keyof typeof apps

export interface AppStatus {
  key: AppKey
  name: string
  label: string
  icon: string
  web: string
  live: boolean
  apple?: string
  google?: string
}

export function appStatus(key: AppKey): AppStatus {
  const a = apps[key]
  const s = stores.apps[key]
  // URLs come from apps.json; the store check only decides whether each one shows.
  const apple = s.apple.live ? a.apple.url : undefined
  const google = s.google.live ? `https://play.google.com/store/apps/details?id=${a.google}` : undefined
  return { key, name: a.name, label: a.label, icon: a.icon, web: a.web, live: !!(apple || google), apple, google }
}

/** "the App Store and Google Play", "Google Play", … for the CV and copy. */
export function liveOn(key: AppKey): string {
  const s = appStatus(key)
  const where = [s.apple && 'the App Store', s.google && 'Google Play'].filter(Boolean)
  return where.join(' and ')
}

export const statusText = (s: AppStatus) => (s.live ? 'Live · actively updated' : 'In development')

/** One app: icon, name, status, and a button for each live store (plus its website). */
export function AppRow({ app, web = true, c, className, style }: { app: AppKey; web?: boolean; c?: string; className?: string; style?: CSSProperties }) {
  const s = appStatus(app)
  return (
    <div className={`app-row${className ? ' ' + className : ''}`} data-c={c} style={style}>
      <img className="app-ic" src={`/work/${s.icon}.webp`} width={256} height={256} alt="" />
      <div className="app-meta">
        <b>{s.label}</b>
        <span className={`app-st${s.live ? ' live' : ''}`}>{statusText(s)}</span>
      </div>
      <div className="app-links">
        {s.apple && <a href={s.apple} target="_blank" rel="noopener" aria-label={`${s.label} on the App Store`} title="App Store"><FaApple aria-hidden="true" /></a>}
        {s.google && <a href={s.google} target="_blank" rel="noopener" aria-label={`${s.label} on Google Play`} title="Google Play"><FaGooglePlay aria-hidden="true" /></a>}
        {web && <a href={s.web} target="_blank" rel="noopener" aria-label={`${s.name} website`} title="Website"><FiGlobe aria-hidden="true" /></a>}
      </div>
    </div>
  )
}
