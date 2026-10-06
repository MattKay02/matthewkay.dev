'use client'

// Explore: the whole board as one picture (photographed on every deploy by scripts/build-board.mjs) to
// pinch and drag freely. Phones get the live board as a guided tour; this is how they wander. Safari
// zooms an image on the GPU without redrawing anything, which the live board can't do on a phone.
import { useEffect, useRef, useState } from 'react'
import { FiMinus, FiPlus, FiX } from 'react-icons/fi'

interface Api { zoom: (f: number) => void }

export function ExploreViewer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null)
  const area = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const api = useRef<Api | null>(null)
  const [ready, setReady] = useState(false)
  const [src, setSrc] = useState('')

  useEffect(() => {
    if (!open) return
    setSrc(document.documentElement.dataset.theme === 'dark' ? '/board-dark.jpg' : '/board-light.jpg')
    const root = document.documentElement
    root.classList.add('cv-open') // locks the page and the tour's keys, as the CV viewer does
    dialog.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    addEventListener('keydown', onKey)
    return () => { root.classList.remove('cv-open'); removeEventListener('keydown', onKey); setReady(false) }
  }, [open, onClose])

  // Drag with one finger, pinch with two, double-tap to zoom; wheel and buttons for everyone else.
  useEffect(() => {
    if (!open || !ready) return
    const el = area.current!, pic = img.current!
    const W = pic.naturalWidth, H = pic.naturalHeight
    let s = 1, x = 0, y = 0, min = 1, raf = 0, lastTap = 0
    const MAX = 1.2 // 1.2 screen px per picture px: board text is readable well before this
    const pts = new Map<number, { x: number; y: number }>()
    let pinch: { d: number; mx: number; my: number } | null = null
    const box = () => el.getBoundingClientRect()
    const clampPos = () => {
      const r = box(), w = W * s, h = H * s
      x = w <= r.width ? (r.width - w) / 2 : Math.min(0, Math.max(r.width - w, x))
      y = h <= r.height ? (r.height - h) / 2 : Math.min(0, Math.max(r.height - h, y))
    }
    const draw = () => { raf = 0; clampPos(); pic.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`; pic.style.opacity = '1' }
    const queue = () => { if (!raf) raf = requestAnimationFrame(draw) }
    const zoomAt = (ns: number, px: number, py: number) => {
      ns = Math.min(MAX, Math.max(min, ns))
      x = px - ((px - x) * ns) / s; y = py - ((py - y) * ns) / s; s = ns; queue()
    }
    const fit = () => { const r = box(); min = Math.min(r.width / W, r.height / H); s = Math.max(min, Math.min(s, MAX)); queue() }
    fit(); s = min; queue() // start with the whole board in view
    api.current = { zoom: (f) => { const r = box(); zoomAt(s * f, r.width / 2, r.height / 2) } }

    const local = (e: PointerEvent) => { const r = box(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
    const pinchOf = () => {
      const [a, b] = [...pts.values()]
      return { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 }
    }
    const down = (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId); pts.set(e.pointerId, local(e))
      if (pts.size === 2) pinch = pinchOf()
      if (pts.size === 1) {
        const now = performance.now(), p = local(e)
        if (now - lastTap < 300) zoomAt(s < (min + MAX) / 3 ? MAX * 0.7 : min, p.x, p.y)
        lastTap = now
      }
    }
    const move = (e: PointerEvent) => {
      const prev = pts.get(e.pointerId); if (!prev) return
      const p = local(e); pts.set(e.pointerId, p)
      if (pts.size === 1) { x += p.x - prev.x; y += p.y - prev.y; queue() }
      else if (pts.size === 2 && pinch) {
        const now = pinchOf()
        x += now.mx - pinch.mx; y += now.my - pinch.my
        zoomAt(s * (now.d / pinch.d), now.mx, now.my)
        pinch = now
      }
    }
    const up = (e: PointerEvent) => { pts.delete(e.pointerId); pinch = pts.size === 2 ? pinchOf() : null }
    const wheel = (e: WheelEvent) => { e.preventDefault(); const p = { x: e.clientX - box().left, y: e.clientY - box().top }; zoomAt(s * Math.exp(-e.deltaY * 0.002), p.x, p.y) }
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up)
    el.addEventListener('wheel', wheel, { passive: false })
    addEventListener('resize', fit)
    return () => {
      cancelAnimationFrame(raf); api.current = null
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up)
      el.removeEventListener('wheel', wheel); removeEventListener('resize', fit)
    }
  }, [open, ready])

  if (!open) return null
  return (
    <div ref={dialog} tabIndex={-1} className="cvv xp" role="dialog" aria-modal="true" aria-label="The whole board">
      <header className="cvv-bar">
        <span className="logo">MK.</span>
        <span className="cvv-title"><b>The whole board</b><span>Pinch to zoom, drag to look around</span></span>
        <div className="cvv-actions">
          <button type="button" className="ibtn" onClick={() => api.current?.zoom(1 / 1.8)} aria-label="Zoom out"><FiMinus aria-hidden="true" /></button>
          <button type="button" className="ibtn" onClick={() => api.current?.zoom(1.8)} aria-label="Zoom in"><FiPlus aria-hidden="true" /></button>
          <button type="button" className="ibtn" onClick={onClose} aria-label="Close the board"><FiX aria-hidden="true" /></button>
        </div>
      </header>
      <div className="xp-area" ref={area}>
        {!ready && <p className="xp-wait">Loading the board…</p>}
        {src && <img ref={img} src={src} alt="The whole workbench on one board: frunt, MGKFitness, other work, how I work, about and contact" draggable={false} onLoad={() => setReady(true)} />}
      </div>
    </div>
  )
}
