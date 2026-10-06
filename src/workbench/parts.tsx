// Building blocks for the board. Everything is placed in board pixels; the
// camera in controller.ts moves and scales the whole board at once.
import type { CSSProperties, ReactNode } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import type { Cluster } from './stops'

type Box = { x: number; y: number; w?: number; h?: number }
const at = ({ x, y, w, h }: Box, extra?: CSSProperties): CSSProperties => ({
  left: x, top: y, ...(w !== undefined ? { width: w } : {}), ...(h !== undefined ? { height: h } : {}), ...extra,
})

export const IMG = (name: string) => `/work/${name}.webp`

export function Frame({ c, label, ...box }: Box & { c: Cluster; label: string }) {
  return <div className="frame" data-c={c} style={at(box)}><span className="flabel">{label}</span></div>
}

/** Display type. `outline` is the second line of the two-line heading; `bg` is a watermark behind the work. */
export function Title({ c, size, outline, xl, bg, z, style, children, ...box }: Box & {
  c: Cluster; size: number; outline?: boolean; xl?: boolean; bg?: boolean; z?: number; style?: CSSProperties; children: ReactNode
}) {
  const cls = ['ttl', outline && 'o', xl && 'xl', bg && 'bgw'].filter(Boolean).join(' ')
  return <div className={cls} data-c={c} style={at(box, { fontSize: size, ...(z ? { zIndex: z } : {}), ...style })}>{children}</div>
}

export function Note({ c, kicker, quote, children, ...box }: Box & { c: Cluster; kicker: string; quote?: string; children: ReactNode }) {
  return (
    <div className="note" data-c={c} style={at(box)}>
      <span className="k">{kicker}</span>
      <p>{children}</p>
      {quote && <p className="q">{quote}</p>}
    </div>
  )
}

export function SlotBox({ c, title, ...box }: Box & { c: Cluster; title: string }) {
  return <div className="slotbox" data-c={c} style={at(box)}><span>Slot · designed next</span><b>{title}</b></div>
}

export function Spec({ c, children, ...box }: Box & { c: Cluster; children: ReactNode }) {
  return <div className="spec" data-c={c} style={at(box)}>{children}</div>
}

// ---------- devices: Apple's MacBook Air and iPhone frames, used as supplied ----------

/** `src` is a full image URL (a product's own screen, see screens.ts); `img` names a saved copy in public/work. */
export interface Slide { img?: string; src?: string; w: number; h: number; bg: string; title: string; alt: string; overlay?: ReactNode }

/** A MacBook that rotates through its slides; tabs and arrows under it pick one (controller.ts wires both). */
export function MacBook({ c, id, label, slides, ...box }: Box & { c: Cluster; id: string; label: string; slides: Slide[] }) {
  return (
    <figure className="dev mac" data-c={c} data-lap={id} data-label={label} style={at(box)}>
      <div className="dv">
        <img loading="lazy" decoding="async" className="fr" src={IMG('macbook-air')} width={1700} height={1120} alt="" />
        <div className="scr">
          {slides.map((s, i) => (
            <div key={s.title} className={`sl${i === 0 ? ' is-on' : ''}`} data-title={s.title} style={{ background: s.bg }}>
              <img loading="lazy" decoding="async" src={s.src ?? IMG(s.img ?? '')} width={s.w} height={s.h} alt={s.alt} />
              {s.overlay}
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        // Under the frame, never on it (Apple's rules).
        <div className="lp-ctl">
          <button type="button" className="lp-prev" aria-label="Previous screen"><FiChevronLeft aria-hidden="true" /></button>
          <div className="lp-tabs" role="group" aria-label={`${label} screens`}>
            {slides.map((s, i) => (
              <button key={s.title} type="button" className={`lp-tab${i === 0 ? ' is-on' : ''}`} aria-pressed={i === 0}>{s.title}</button>
            ))}
          </div>
          <button type="button" className="lp-next" aria-label="Next screen"><FiChevronRight aria-hidden="true" /></button>
          <span className="lp-count" aria-hidden="true">1 / {slides.length}</span>
        </div>
      )}
      <figcaption>{label} · {slides[0].title}</figcaption>
    </figure>
  )
}

/** A numbered spec-style note above a device, with a leader line down to it. */
export function Callout({ c, n, title, children, ...box }: Box & { c: Cluster; n: string; title: string; children: ReactNode }) {
  return (
    <div className="callout" data-c={c} style={at(box)}>
      <header><b>{n}</b><span>{title}</span></header>
      <p>{children}</p>
      <i className="callout-lead" aria-hidden="true" />
    </div>
  )
}

/** A project brief: the problem, what the product does in numbered steps, and the facts. */
export function Brief({ c, problem, story, steps, facts, ...box }: Box & {
  c: Cluster; problem: string; story: string; steps: string[]; facts: string
}) {
  return (
    <div className="note brief" data-c={c} style={at(box)}>
      <span className="k">The problem</span>
      <p className="brief-h">{problem}</p>
      <p className="brief-p">{story}</p>
      <span className="k">What it does</span>
      <ol className="brief-steps">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
      <p className="brief-f">{facts}</p>
    </div>
  )
}

export function IPhone({ c, img, src, iw, ih, alt, caption, below, ...box }: Box & {
  c: Cluster; img?: string; src?: string; iw: number; ih: number; alt: string; caption?: string; below?: { nm: string; ln: string }
}) {
  return (
    <figure className={`dev iph${below ? ' below' : ''}`} data-c={c} style={at(box)}>
      <div className="dv">
        <img loading="lazy" decoding="async" className="fr" src={IMG('iphone')} width={675} height={1380} alt="" />
        <div className="scr"><img loading="lazy" decoding="async" src={src ?? IMG(img ?? '')} width={iw} height={ih} alt={alt} /></div>
      </div>
      {below
        ? <figcaption><span className="nm">{below.nm}</span><span className="ln">{below.ln}</span></figcaption>
        : caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

/** A plain browser window (not an Apple product, so free to style). `long` scrolls the page on hover. */
export function Browser({ c, url, img, iw, ih, alt, caption, long, focus, ...box }: Box & {
  c: Cluster; url: string; img: string; iw: number; ih: number; alt: string; caption: string; long?: boolean; focus: string
}) {
  return (
    <figure className={`browser${long ? ' long' : ''}`} data-c={c} data-focus={focus} style={at(box)}>
      <div className="bw-bar">
        <i /><i /><i />
        <span>{url.replace('https://', '').replace(/\/$/, '')}</span>
        <a href={url} target="_blank" rel="noopener">Open ↗</a>
      </div>
      <div className="bw-scr"><img loading="lazy" decoding="async" src={IMG(img)} width={iw} height={ih} alt={alt} /></div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

/** One part of a product: status, one line, the tech. Click to zoom to `focus` ("x,y,w,h" or "self"). */
export function Tile({ id, c, ix, name, status, live, line, tech, focus, ...box }: Box & {
  id: string; c: Cluster; ix: string; name: string; status: string; live?: boolean; line: string; tech: string; focus: string
}) {
  return (
    <article className="tile" id={id} data-c={c} data-focus={focus} style={at(box)}>
      <header><span className="ix">{ix}</span><b>{name}</b><em className={`st${live ? ' live' : ''}`}>{status}</em></header>
      <p>{line}</p>
      <span className="tech">{tech}</span>
    </article>
  )
}

/** A plain screenshot card, for the smaller projects. */
export function Shot({ c, img, src, iw, ih, alt, nm, ln, ...box }: Box & { c: Cluster; img?: string; src?: string; iw: number; ih: number; alt: string; nm: string; ln: string }) {
  return (
    <figure className="card" data-c={c} style={at(box)}>
      <div className="shot"><img loading="lazy" decoding="async" src={src ?? IMG(img ?? '')} width={iw} height={ih} alt={alt} /></div>
      <figcaption><span className="nm">{nm}</span><span className="ln">{ln}</span></figcaption>
    </figure>
  )
}

export function PassionCard({ c, img, ix, label, rot = 0, ...box }: Box & { c: Cluster; img: string; ix: string; label: string; rot?: number }) {
  return (
    <figure className="pcard" data-c={c} style={at(box, rot ? { transform: `rotate(${rot}deg)` } : undefined)}>
      <img loading="lazy" decoding="async" src={IMG(img)} width={420} height={560} alt={label} />
      <figcaption><i>{ix}</i><b>{label}</b></figcaption>
    </figure>
  )
}

export function Step({ c, n, title, text, ev, ...box }: Box & { c: Cluster; n: string; title: string; text: string; ev: string }) {
  return (
    <div className="step" data-c={c} style={at(box)}>
      <span className="n">{n}</span><b>{title}</b><p>{text}</p><span className="ev">{ev}</span>
    </div>
  )
}
