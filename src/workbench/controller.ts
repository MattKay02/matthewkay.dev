// The camera and everything that moves every frame. React renders the board and
// the guide; this module drives them imperatively, because 60 updates a second
// through React state would be wasteful. mountWorkbench() returns a small API and
// a destroy() that undoes everything it set up.
import { WORLD, type Cluster, type Rect, type Stop } from './stops'

export const LOOKS = ['paper', 'studio', 'brutal'] as const
export type Look = (typeof LOOKS)[number]

export interface WorkbenchEls {
  world: HTMLElement
  stage: HTMLElement
  track: HTMLElement
  bar: HTMLElement
  cap: HTMLElement
  ticks: HTMLElement
  mini: HTMLElement
  zoomRead: HTMLElement
  xyRead: HTMLElement
  you: HTMLElement
}

export interface WorkbenchApi {
  goStop(i: number): void
  goCluster(c: Cluster): void
  next(): void
  prev(): void
  focusTile(id: string): void
  setLook(l: Look): void
  destroy(): void
}

type Cam = { cx: number; cy: number; z: number; ax: number; ay: number }
type Lap = {
  el: HTMLElement; id: string; c: string; label: string; cap: HTMLElement | null
  slides: HTMLElement[]; dots: HTMLButtonElement[]; i: number; hold: number; hover: boolean
}

const HOLD = 0.6, TRAVEL = 1.0, MINI_W = 130
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const mix = (a: number, b: number, e: number) => a + (b - a) * e
const clamp = (v: number, max: number) => Math.max(0, Math.min(max, v))

export function mountWorkbench(els: WorkbenchEls, stops: Stop[], onStop: (i: number) => void): WorkbenchApi {
  const { world, stage, track, bar, cap, ticks, mini, zoomRead, xyRead, you } = els
  const { w: W, h: H } = WORLD
  const MS = MINI_W / W, MINI_H = Math.round(H * MS)
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const tagged = Array.from(world.querySelectorAll<HTMLElement>('[data-c]'))
  const firstStop: Partial<Record<Cluster, number>> = {}
  stops.forEach((s, i) => { if (firstStop[s.c] === undefined) firstStop[s.c] = i })

  // Everything added here is removed in destroy().
  const cleanups: (() => void)[] = []
  const listen = (target: EventTarget, type: string, fn: (e: Event) => void, opts?: AddEventListenerOptions) => {
    target.addEventListener(type, fn, opts)
    cleanups.push(() => target.removeEventListener(type, fn, opts))
  }

  // ---------- geometry ----------
  let vw = 0, vh = 0, narrow = false
  function layout() {
    vw = innerWidth; vh = innerHeight; narrow = vw < 760
    track.style.height = ((stops.length * HOLD + (stops.length - 1) * TRAVEL) * vh + vh) + 'px'
  }
  function area() {
    const top = bar.getBoundingClientRect().bottom
    if (narrow) {
      const ch = cap.getBoundingClientRect().height
      return { x: 10, y: top + 10, w: vw - 20, h: Math.max(120, vh - top - ch - 20) }
    }
    const left = cap.getBoundingClientRect().right + 20
    return { x: left, y: top + 20, w: Math.max(200, vw - 190 - left), h: vh - top - 40 }
  }
  function fitRect(r: Rect, pad = 0.92): Cam {
    const a = area()
    const z = Math.min(a.w / r[2], a.h / r[3]) * pad
    return { cx: r[0] + r[2] / 2, cy: r[1] + r[3] / 2, z, ax: a.x + a.w / 2, ay: a.y + a.h / 2 }
  }
  const fit = (i: number) => fitRect((narrow && stops[i].m) || stops[i].r)

  /** Where the page scroll puts us: resting at stop i, or travelling from i to i+1 (f in 0..1). */
  function pose(y: number) {
    let s = y / vh
    for (let i = 0; i < stops.length; i++) {
      if (s < HOLD) return { i, f: 0 }
      s -= HOLD
      if (i === stops.length - 1) return { i, f: 0 }
      if (s < TRAVEL) return { i, f: s / TRAVEL }
      s -= TRAVEL
    }
    return { i: stops.length - 1, f: 0 }
  }
  function camAt(p: { i: number; f: number }): Cam {
    const a = fit(p.i)
    if (p.f === 0) return a
    const b = fit(p.i + 1)
    const e = reduced.matches ? (p.f < 0.5 ? 0 : 1) : ease(p.f)
    // Long moves pull back mid-flight so you can see where you're going.
    const dist = Math.hypot(b.cx - a.cx, b.cy - a.cy)
    const dip = reduced.matches ? 0 : Math.min(0.5, (dist * Math.min(a.z, b.z)) / Math.max(vw, vh) * 0.4)
    const z = Math.exp(mix(Math.log(a.z), Math.log(b.z), e)) * (1 - dip * Math.sin(Math.PI * e))
    return { cx: mix(a.cx, b.cx, e), cy: mix(a.cy, b.cy, e), z, ax: mix(a.ax, b.ax, e), ay: mix(a.ay, b.ay, e) }
  }

  // ---------- laptops: several screens rotating in one MacBook ----------
  function show(lap: Lap, j: number) {
    const next = (j + lap.slides.length) % lap.slides.length
    if (next === lap.i && lap.slides[next].classList.contains('is-on')) return
    const prev = lap.slides[lap.i]
    lap.i = next
    lap.slides.forEach((sl, k) => { sl.classList.toggle('is-on', k === next); if (k !== next) sl.classList.remove('was') })
    if (prev && prev !== lap.slides[next]) { prev.classList.add('was'); setTimeout(() => prev.classList.remove('was'), 950) }
    lap.dots.forEach((d, k) => d.classList.toggle('is-on', k === next))
    if (lap.cap && lap.label) lap.cap.textContent = `${lap.label} · ${lap.slides[next].dataset.title}`
  }
  const laps: Lap[] = Array.from(world.querySelectorAll<HTMLElement>('.dev.mac')).map((el) => {
    const lap: Lap = {
      el, id: el.dataset.lap || '', c: el.dataset.c || '', label: el.dataset.label || '', cap: el.querySelector('figcaption'),
      slides: Array.from(el.querySelectorAll<HTMLElement>('.scr .sl')), dots: [], i: 0, hold: 0, hover: false,
    }
    const dotsEl = el.querySelector('.lp-dots')
    if (dotsEl) {
      lap.dots = lap.slides.map((sl, j) => {
        const d = document.createElement('button')
        d.type = 'button'
        d.setAttribute('aria-label', `Show ${sl.dataset.title}`)
        d.addEventListener('click', (e) => { e.stopPropagation(); show(lap, j); lap.hold = performance.now() + 9000 })
        dotsEl.appendChild(d)
        return d
      })
      lap.dots[0]?.classList.add('is-on')
      cleanups.push(() => lap.dots.forEach((d) => d.remove()))
    }
    listen(el, 'mouseenter', () => { lap.hover = true })
    listen(el, 'mouseleave', () => { lap.hover = false })
    return lap
  })
  const rotation = setInterval(() => {
    if (reduced.matches || document.hidden || shown < 0) return
    const st = stops[shown], now = performance.now()
    laps.forEach((lap) => {
      if (lap.slides.length < 2 || lap.hover || now < lap.hold || st.c !== lap.c) return
      if (st.lock && lap.id in st.lock) return
      show(lap, lap.i + 1)
    })
  }, 3400)
  cleanups.push(() => clearInterval(rotation))

  // ---------- the current stop ----------
  let shown = -1
  const navTicks = () => Array.from(ticks.querySelectorAll<HTMLElement>('.tick'))
  function select(i: number) {
    if (i === shown) return
    shown = i
    const s = stops[i], active = s.c
    document.body.classList.toggle('overview', active === 'all')
    tagged.forEach((el) => el.classList.toggle('on', active === 'all' || el.dataset.c === active))
    miniCells.forEach((m) => m.el.classList.toggle('on', active === 'all' || m.c === active))
    if (s.lock) for (const id in s.lock) { const lp = laps.find((l) => l.id === id); if (lp) show(lp, s.lock[id]) }
    onStop(i)
  }
  function goStop(i: number) {
    i = Math.max(0, Math.min(stops.length - 1, i))
    scrollTo({ top: (i * (HOLD + TRAVEL) + HOLD * 0.35) * vh, behavior: 'auto' })
  }
  const goCluster = (c: Cluster) => { const i = firstStop[c]; if (i !== undefined) goStop(i) }
  const next = () => goStop(shown === stops.length - 1 ? 0 : shown + 1)
  const prev = () => goStop(shown - 1)

  // ---------- the hero: everything measured from the real type ----------
  let measureCtx: CanvasRenderingContext2D | null = null
  function measureHero() {
    const $ = (id: string) => document.getElementById(id)
    const nm = $('heroName'), ms = $('measure'), lbl = $('measureLbl'), ph = $('heroPhoto')
    const gBase = $('gBase'), gCap = $('gCap'), gGap = $('gGap'), gGapLbl = $('gGapLbl')
    const bl = nm?.querySelector<HTMLElement>('.bl')
    if (!nm || !ms || !lbl || !ph || !gBase || !gCap || !gGap || !gGapLbl || !bl) return
    // Fit the name to leave at least one column before the photo (uppercase looks are wider).
    nm.style.fontSize = '250px'
    const room = ph.offsetLeft - nm.offsetLeft - 127
    if (nm.offsetWidth > room) nm.style.fontSize = Math.floor((250 * room) / nm.offsetWidth) + 'px'
    const w = Math.round(nm.offsetWidth)
    ms.style.width = w + 'px'
    lbl.textContent = w.toLocaleString('en-GB')
    const base = nm.offsetTop + bl.offsetTop
    const cs = getComputedStyle(nm)
    measureCtx ??= document.createElement('canvas').getContext('2d')
    if (!measureCtx) return
    measureCtx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
    const capH = Math.round(measureCtx.measureText('H').actualBoundingBoxAscent)
    const capTop = Math.round(base - capH)
    gBase.style.top = Math.round(base) + 'px'
    gCap.style.top = capTop + 'px'
    ph.style.top = capTop + 'px'
    const x0 = nm.offsetLeft + w, gap = ph.offsetLeft - x0
    gGap.style.left = x0 + 'px'
    gGap.style.width = gap + 'px'
    gGap.style.top = Math.round(base - capH / 2) + 'px'
    gGapLbl.textContent = String(Math.round(gap))
  }
  document.fonts?.ready.then(() => measureHero())

  function setLook(l: Look) {
    document.documentElement.dataset.style = l
    try { localStorage.setItem('wb-style', l) } catch { /* private window: the look just isn't remembered */ }
    measureHero()
  }

  // ---------- focus: a part (tile, browser or chip) takes the camera until the page scrolls on ----------
  let focus: { rect: Rect; y: number; c: string; el: HTMLElement } | null = null
  function clearFocus() {
    if (!focus) return
    focus.el.classList.remove('hl')
    document.querySelectorAll('[data-tile]').forEach((b) => b.classList.remove('is-on'))
    focus = null
  }
  function setFocus(el: HTMLElement) {
    clearFocus()
    const spec = el.dataset.focus || 'self'
    const rect: Rect = spec === 'self'
      ? [el.offsetLeft - 40, el.offsetTop - 40, el.offsetWidth + 80, el.offsetHeight + 80]
      : (spec.split(',').map(Number) as Rect)
    focus = { rect, y: scrollY, c: el.dataset.c || '', el }
    el.classList.add('hl')
    document.querySelectorAll<HTMLElement>('[data-tile]').forEach((b) => b.classList.toggle('is-on', b.dataset.tile === el.id))
  }
  const focusTile = (id: string) => { const t = document.getElementById(id); if (t) setFocus(t) }

  // ---------- dragging and clicking the board ----------
  let dragging = false, moved = false
  let start = { x: 0, y: 0, ox: 0, oy: 0 }
  const look = { x: 0, y: 0 }
  listen(stage, 'pointerdown', (ev) => {
    const e = ev as PointerEvent
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    dragging = true; moved = false
    start = { x: e.clientX - look.x, y: e.clientY - look.y, ox: e.clientX, oy: e.clientY }
    document.body.classList.add('dragging')
  })
  listen(window, 'pointermove', (ev) => {
    const e = ev as PointerEvent
    if (dragging) {
      look.x = e.clientX - start.x; look.y = e.clientY - start.y
      if (Math.hypot(e.clientX - start.ox, e.clientY - start.oy) > 5) moved = true
    }
    if (e.pointerType === 'mouse') {
      const overHud = (e.target as Element | null)?.closest?.('.cap, .bar, .mini')
      you.classList.toggle('show', !overHud && !dragging)
      you.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 18}px)`
    }
  })
  listen(window, 'pointerup', () => { dragging = false; document.body.classList.remove('dragging') })
  listen(document, 'mouseout', (ev) => { if (!(ev as MouseEvent).relatedTarget) you.classList.remove('show') })
  listen(stage, 'click', (ev) => {
    if (moved) { moved = false; return }
    const t = ev.target as Element
    if (t.closest('.lp-dots, a, button')) return
    const ft = t.closest<HTMLElement>('[data-focus]')
    if (ft && shown >= 0 && ft.dataset.c === stops[shown].c) { setFocus(ft); return }
    const hit = t.closest<HTMLElement>('[data-c]')
    if (!hit) return
    const c = hit.dataset.c as Cluster
    if (c !== stops[shown]?.c) goCluster(c)
  })
  listen(window, 'keydown', (ev) => {
    const e = ev as KeyboardEvent
    if (e.altKey || e.ctrlKey || e.metaKey) return
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    if (e.key === 'Escape') clearFocus()
  })

  // ---------- minimap ----------
  const miniCells = Array.from(world.querySelectorAll<HTMLElement>('.frame')).map((f) => {
    const x = parseFloat(f.style.left), y = parseFloat(f.style.top), w = parseFloat(f.style.width), h = parseFloat(f.style.height)
    const el = document.createElement('i')
    el.style.cssText = `left:${x * MS}px;top:${y * MS}px;width:${w * MS}px;height:${h * MS}px`
    mini.appendChild(el)
    return { el, c: f.dataset.c as Cluster, x, y, w, h }
  })
  const view = document.createElement('b')
  mini.appendChild(view)
  cleanups.push(() => { miniCells.forEach((m) => m.el.remove()); view.remove() })
  listen(mini, 'click', (ev) => {
    const e = ev as MouseEvent
    const r = mini.getBoundingClientRect(), wx = (e.clientX - r.left) / MS, wy = (e.clientY - r.top) / MS
    let best: (typeof miniCells)[number] | null = null, bd = Infinity
    miniCells.forEach((m) => {
      const inside = wx >= m.x && wx <= m.x + m.w && wy >= m.y && wy <= m.y + m.h
      const dd = inside ? -1 : Math.hypot(wx - (m.x + m.w / 2), wy - (m.y + m.h / 2))
      if (dd < bd) { bd = dd; best = m }
    })
    if (best) goCluster((best as (typeof miniCells)[number]).c)
  })

  // ---------- the loop ----------
  let cur: Cam | null = null, last = performance.now(), still = 0, raf = 0
  const tickVals: number[] = []
  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now
    const p = pose(scrollY)
    let target = camAt(p)
    if (focus) {
      if (Math.abs(scrollY - focus.y) > 30 || (shown >= 0 && stops[shown].c !== focus.c)) clearFocus()
      else target = fitRect(focus.rect, 0.9)
    }
    select(p.f < 0.5 ? p.i : p.i + 1)

    if (!cur) cur = reduced.matches ? { ...target } : { ...target, z: target.z * 1.1 }
    let delta = 0
    if (reduced.matches) cur = { ...target }
    else {
      const k = 1 - Math.exp(-dt * 8)
      for (const key of ['cx', 'cy', 'ax', 'ay'] as const) { const dd = (target[key] - cur[key]) * k; cur[key] += dd; delta += Math.abs(dd) }
      const lz = Math.log(cur.z), dz = (Math.log(target.z) - lz) * k
      cur.z = Math.exp(lz + dz); delta += Math.abs(dz) * 400
    }
    if (!dragging) { look.x *= 0.86; look.y *= 0.86; if (Math.abs(look.x) < 0.1) look.x = 0; if (Math.abs(look.y) < 0.1) look.y = 0 }
    delta += Math.abs(look.x) + Math.abs(look.y) > 0.5 ? 1 : 0

    const z = cur.z, tx = cur.ax - cur.cx * z + look.x, ty = cur.ay - cur.cy * z + look.y
    world.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${z})`
    world.style.setProperty('--inv', (1 / z).toFixed(4))
    // Promote the board to its own layer only while it moves, so text re-rasterises sharp at rest.
    still = delta > 0.05 ? 0 : still + 1
    world.classList.toggle('moving', still < 8)

    let g = 48 * z
    while (g < 14) g *= 4
    stage.style.backgroundSize = `${g}px ${g}px`
    stage.style.backgroundPosition = `${tx}px ${ty}px`

    const vx = -tx / z, vy = -ty / z
    const x0 = clamp(vx * MS, MINI_W), x1 = clamp((vx + vw / z) * MS, MINI_W)
    const y0 = clamp(vy * MS, MINI_H), y1 = clamp((vy + vh / z) * MS, MINI_H)
    view.style.cssText = `left:${x0}px;top:${y0}px;width:${x1 - x0}px;height:${y1 - y0}px`
    zoomRead.textContent = Math.round(z * 100) + '%'
    xyRead.textContent = `x ${Math.round(cur.cx)} y ${Math.round(cur.cy)}`
    navTicks().forEach((el, j) => {
      const v = j <= p.i ? 1 : j === p.i + 1 ? p.f : 0
      if (tickVals[j] !== v) { tickVals[j] = v; el.style.setProperty('--p', v.toFixed(3)) }
    })
    raf = requestAnimationFrame(frame)
  }

  layout()
  listen(window, 'resize', layout)
  const p0 = pose(scrollY)
  select(p0.f < 0.5 ? p0.i : p0.i + 1)
  measureHero()
  raf = requestAnimationFrame(frame)
  cleanups.push(() => cancelAnimationFrame(raf))

  return {
    goStop, goCluster, next, prev, focusTile, setLook,
    destroy() {
      cleanups.splice(0).forEach((fn) => fn())
      document.body.classList.remove('overview', 'dragging')
    },
  }
}
