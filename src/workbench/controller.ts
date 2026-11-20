// The camera and everything that moves every frame. React renders the board and
// the guide; this module drives them imperatively, because 60 updates a second
// through React state would be wasteful. mountWorkbench() returns a small API and
// a destroy() that undoes everything it set up.
import { WORLD, type Cluster, type Rect, type Stop } from './stops'

export interface WorkbenchEls {
  world: HTMLElement
  stage: HTMLElement
  /** The desk's dot grid, under the board. */
  dots: HTMLElement
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
  destroy(): void
}

type Cam = { cx: number; cy: number; z: number; ax: number; ay: number }
type Lap = {
  el: HTMLElement; id: string; c: string; label: string; cap: HTMLElement | null
  slides: HTMLElement[]; tabs: HTMLButtonElement[]; count: HTMLElement | null; i: number; hold: number; hover: boolean
}

const HOLD = 0.6, TRAVEL = 1.0, MINI_W = 130
/** At or below this width the guide is a bottom sheet (matches the 1024px breakpoint in globals.css). */
const SHEET_MAX = 1024
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const mix = (a: number, b: number, e: number) => a + (b - a) * e
const clamp = (v: number, max: number) => Math.max(0, Math.min(max, v))

export function mountWorkbench(els: WorkbenchEls, stops: Stop[], onStop: (i: number) => void): WorkbenchApi {
  const { world, stage, dots, track, bar, cap, ticks, mini, zoomRead, xyRead, you } = els
  const { w: W, h: H } = WORLD
  const MS = MINI_W / W, MINI_H = Math.round(H * MS)
  // Touch devices (phones, tablets) get the reduced-motion camera, which cuts between stops, on a board
  // that isn't its own GPU layer. iPhone Safari stalled and crashed redrawing the whole scaled board as
  // the camera glided (6 Oct 2026). Drag-to-look is mouse-only, so touch loses nothing else.
  const touch = matchMedia('(hover: none) and (pointer: coarse)').matches
  const mq = matchMedia('(prefers-reduced-motion: reduce)')
  const reduced = { get matches() { return mq.matches || touch } }
  // Touch screens move between stops only by Back, Next, the progress bar and taps on the board. The
  // page itself doesn't scroll there: a stray swipe used to scroll it and jump the tour (Matthew, 30 Oct
  // 2026). `at` is the stop on screen, kept for the tab's session so a reload lands back on it.
  const stepped = touch
  let at = 0
  if (stepped) {
    document.documentElement.classList.add('stepped')
    try { at = Math.max(0, Math.min(stops.length - 1, Number(sessionStorage.getItem('wb-stop')) || 0)) } catch { /* no storage: the Intro */ }
  }
  let tagged = Array.from(world.querySelectorAll<HTMLElement>('[data-c]'))
  const firstStop: Partial<Record<Cluster, number>> = {}
  stops.forEach((s, i) => { if (firstStop[s.c] === undefined) firstStop[s.c] = i })

  // Everything added here is removed in destroy().
  const cleanups: (() => void)[] = []
  const listen = (target: EventTarget, type: string, fn: (e: Event) => void, opts?: AddEventListenerOptions) => {
    target.addEventListener(type, fn, opts)
    cleanups.push(() => target.removeEventListener(type, fn, opts))
  }

  // ---------- geometry ----------
  let vw = 0, vh = 0, narrow = false, miniShown = true
  function layout() {
    vw = innerWidth; vh = innerHeight
    narrow = matchMedia(`(max-width: ${SHEET_MAX}px)`).matches
    miniShown = !!mini.parentElement && getComputedStyle(mini.parentElement).display !== 'none'
    track.style.height = stepped ? '0px' : ((stops.length * HOLD + (stops.length - 1) * TRAVEL) * vh + vh) + 'px'
  }
  function area() {
    const top = bar.getBoundingClientRect().bottom
    if (narrow) {
      const ch = cap.getBoundingClientRect().height
      return { x: 10, y: top + 10, w: vw - 20, h: Math.max(120, vh - top - ch - 20) }
    }
    const left = cap.getBoundingClientRect().right + 20
    // Keep clear of the minimap only when it is showing.
    return { x: left, y: top + 20, w: Math.max(200, vw - (miniShown ? 190 : 24) - left), h: vh - top - 40 }
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
    lap.tabs.forEach((t, k) => { t.classList.toggle('is-on', k === next); t.setAttribute('aria-pressed', String(k === next)) })
    if (lap.count) lap.count.textContent = `${next + 1} / ${lap.slides.length}`
    if (lap.cap && lap.label) lap.cap.textContent = `${lap.label} · ${lap.slides[next].dataset.title}`
  }
  const laps: Lap[] = Array.from(world.querySelectorAll<HTMLElement>('.dev.mac')).map((el) => {
    const lap: Lap = {
      el, id: el.dataset.lap || '', c: el.dataset.c || '', label: el.dataset.label || '', cap: el.querySelector('figcaption'),
      slides: Array.from(el.querySelectorAll<HTMLElement>('.scr .sl')),
      tabs: Array.from(el.querySelectorAll<HTMLButtonElement>('.lp-tab')), count: el.querySelector('.lp-count'),
      i: 0, hold: 0, hover: false,
    }
    // The visitor's choice wins: once they pick a screen, this laptop stops rotating on its own.
    const pick = (e: Event, j: number) => { e.stopPropagation(); show(lap, j); lap.hold = Infinity }
    lap.tabs.forEach((t, j) => listen(t, 'click', (e) => pick(e, j)))
    const prev = el.querySelector('.lp-prev'), next = el.querySelector('.lp-next')
    if (prev) listen(prev, 'click', (e) => pick(e, lap.i - 1))
    if (next) listen(next, 'click', (e) => pick(e, lap.i + 1))
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
  /** Where an element sits on the board, in board pixels (it never moves, so measured once). */
  const boxes = new WeakMap<Element, Rect>()
  function boardBox(el: Element): Rect {
    let r = boxes.get(el)
    if (!r) {
      const wb = world.getBoundingClientRect(), s = wb.width / W, b = el.getBoundingClientRect()
      r = [(b.left - wb.left) / s, (b.top - wb.top) / s, b.width / s, b.height / s]
      boxes.set(el, r)
    }
    return r
  }
  /** How much of an element lies inside a board rect, 0 to 1. */
  function share(el: Element, [x, y, w, h]: Rect) {
    const [ex, ey, ew, eh] = boardBox(el)
    if (!ew || !eh) return 1
    const ix = Math.max(0, Math.min(ex + ew, x + w) - Math.max(ex, x)), iy = Math.max(0, Math.min(ey + eh, y + h) - Math.max(ey, y))
    return (ix * iy) / (ew * eh)
  }
  // Phones: the light follows the camera. What a stop frames stays lit and the rest of its project dims
  // with everything else, so whatever the edges of a small screen cut through reads as background.
  const subject = (s: Stop): Rect | null => (stepped && s.c !== 'all' ? (narrow && s.m) || s.r : null)
  function light(el: HTMLElement, s: Stop) {
    let on = s.c === 'all' || el.dataset.c === s.c
    const sub = subject(s)
    if (on && sub && !el.classList.contains('frame')) on = share(el, sub) >= 0.5
    el.classList.toggle('on', on)
  }
  function select(i: number) {
    if (i === shown) return
    shown = i
    const s = stops[i], active = s.c
    document.body.classList.toggle('overview', active === 'all')
    tagged.forEach((el) => light(el, s))
    miniCells.forEach((m) => m.el.classList.toggle('on', active === 'all' || m.c === active))
    if (s.lock) for (const id in s.lock) { const lp = laps.find((l) => l.id === id); if (lp) show(lp, s.lock[id]) }
    if (stepped) { warm(i + 1); warm(i - 1) }
    onStop(i)
  }
  // Phones: decode the images of the stops either side ahead of time, so none decodes mid-flight.
  function warm(j: number) {
    if (j < 0 || j >= stops.length) return
    const c = fit(j), view: Rect = [c.cx - c.ax / c.z, c.cy - c.ay / c.z, vw / c.z, vh / c.z]
    world.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
      if (share(img, view) === 0) return
      if (img.loading === 'lazy') img.loading = 'eager'
      img.decode?.().catch(() => { /* not loaded yet or not an image: it loads as usual */ })
    })
  }
  // Board pieces that arrive after mount (the skills, once the live list replaces the snapshot) join
  // the current stop's state; without this a newly published skill sits dimmed until the next rebuild.
  const arrivals = new MutationObserver(() => {
    tagged = Array.from(world.querySelectorAll<HTMLElement>('[data-c]'))
    if (shown >= 0) tagged.forEach((el) => light(el, stops[shown]))
  })
  arrivals.observe(world, { childList: true })
  cleanups.push(() => arrivals.disconnect())
  function goStop(i: number) {
    i = Math.max(0, Math.min(stops.length - 1, i))
    if (stepped) {
      // Straight to the stop, so a quick second tap on Next counts from the new one.
      at = i; clearFocus(); select(i)
      try { sessionStorage.setItem('wb-stop', String(i)) } catch { /* fine */ }
      return
    }
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
    // Fit the name to leave at least one column before the photo.
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

  // ---------- focus: a part (tile, browser or chip) takes the camera until the page scrolls on ----------
  let focus: { rect: Rect; y: number; c: string; el: HTMLElement } | null = null
  function clearFocus() {
    if (!focus) return
    focus.el.classList.remove('hl')
    if (shown >= 0) light(focus.el, stops[shown])
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
    el.classList.add('hl', 'on') // lit even where a phone's stop had dimmed it
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
    if (t.closest('.lp-ctl, a, button')) return
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
    if (document.documentElement.classList.contains('cv-open')) return // the CV viewer is on top
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
  // What was last written to the page. The loop runs every frame but only touches the DOM on a change:
  // Chrome skips identical writes, Safari may restyle the whole board for each one.
  const wrote: Record<string, string> = {}
  const put = (key: string, v: string, apply: (v: string) => void) => { if (wrote[key] !== v) { wrote[key] = v; apply(v) } }

  /** The dot grid, frame labels' size and the board at one pose. The grid is anchored to the board. */
  type Pose = { tx: number; ty: number; z: number }
  function paintDesk(p: Pose) {
    let g = 48 * p.z
    while (g < 14) g *= 4
    put('bgs', `${g}px ${g}px`, (v) => { dots.style.backgroundSize = v })
    put('bgp', `${p.tx}px ${p.ty}px`, (v) => { dots.style.backgroundPosition = v })
    put('inv', (1 / p.z).toFixed(4), (v) => world.style.setProperty('--inv', v))
  }

  // ---------- the camera on touch screens ----------
  // The camera itself cuts (see `reduced`); what the visitor sees between stops is one of two moves:
  // - 'gpu': the board flies the camera's own path to the new view, eased, and pulling back mid-flight on
  //   long moves as it does on desktop, as one Web Animation of the board's transform, which Safari runs on
  //   the GPU without redrawing the board. The grid fades out for the flight and the frame labels hide:
  //   both are sized to the zoom, and redrawing them every frame would cost the smoothness.
  //   The first flights are timed, and a phone that can't keep up switches to 'slide' for good. Each timed
  //   flight is marked 'trying' first, so if Safari crashes mid-flight the next visit starts on 'slide'.
  // - 'slide': the new view slides in from the direction of travel. One redraw, then a viewport-sized move.
  // A move starts once the guide card has settled for two frames: a new stop's card changes the room the
  // camera has, and a move that restarts mid-flight is what made the old glide stutter.
  const GLIDE_KEY = 'wb-glide2' // v2, the camera-path flight (19 Nov 2026): v1's verdicts don't carry over
  let glide: 'gpu' | 'slide' = 'gpu', verified = false, timing = false, checks = 0, bad = 0
  try {
    const saved = localStorage.getItem(GLIDE_KEY)
    if (saved === 'slide' || saved === 'trying') { glide = 'slide'; localStorage.setItem(GLIDE_KEY, 'slide') }
    else if (saved === 'gpu') verified = true
  } catch { /* no storage: glide, unchecked */ }
  const remember = (v: string | null) => {
    try { if (v) localStorage.setItem(GLIDE_KEY, v); else localStorage.removeItem(GLIDE_KEY) } catch { /* fine */ }
  }
  const flat = (p: Pose) => `translate(${p.tx}px, ${p.ty}px) scale(${p.z})`
  const flat3d = (p: Pose) => `translate3d(${p.tx}px, ${p.ty}px, 0) scale(${p.z})`
  /** A quick start that settles gently: the flight answers the tap at once. */
  const easeFlight = (t: number) => 1 - Math.pow(1 - t, 2.6) * (1 - 0.35 * t)
  let shownPose: Pose | null = null, shownCam: Cam | null = null, waiting = '', settled = 0, flight: Animation | null = null

  /** At rest: a plain 2D transform, off its own layer, so text is drawn sharp; grid and labels back. */
  function rest(p: Pose) {
    world.style.transform = flat(p)
    world.style.willChange = ''
    world.classList.remove('gliding')
    paintDesk(p)
    dots.style.opacity = ''
  }
  function moveTouch(cam: Cam, next: Pose) {
    const key = flat(next)
    if (shownPose && flat(shownPose) === key) { waiting = ''; return }
    if (key !== waiting) { waiting = key; settled = 0 }
    if (shownPose && ++settled < 2) return
    waiting = ''
    const from = shownPose, fromCam = shownCam
    shownPose = next; shownCam = cam
    if (!from || !fromCam || mq.matches) { if (flight) { flight.cancel(); flight = null } rest(next); return } // first view, or real reduced motion: cut
    if (glide === 'gpu') fly(fromCam, from, cam, next)
    else { if (flight) { flight.cancel(); flight = null } rest(next); slideIn(from, next) }
  }
  function fly(a: Cam, aPose: Pose, b: Cam, bPose: Pose) {
    if (flight) {
      // A second tap before the first move ended: fly on from wherever the board is now.
      const m = new DOMMatrix(getComputedStyle(world).transform)
      flight.cancel(); flight = null
      if (m.a > 0) { aPose = { tx: m.e, ty: m.f, z: m.a }; a = { ax: b.ax, ay: b.ay, z: m.a, cx: (b.ax - m.e) / m.a, cy: (b.ay - m.f) / m.a } }
    }
    // The same path as the desktop camera: centre and zoom eased together, zoom on a log scale, and a
    // pull-back on long moves so you can see where you're going.
    const reach = (Math.hypot(b.cx - a.cx, b.cy - a.cy) * Math.min(a.z, b.z)) / Math.max(vw, vh)
    const dip = Math.min(0.5, reach * 0.4)
    const duration = Math.round(Math.min(1000, 540 + 300 * Math.min(1, reach) + 110 * Math.abs(Math.log(b.z / a.z))))
    const frames: Keyframe[] = []
    const N = 32
    for (let k = 0; k <= N; k++) {
      const e = easeFlight(k / N)
      const z = Math.exp(mix(Math.log(a.z), Math.log(b.z), e)) * (1 - dip * Math.sin(Math.PI * e))
      const cx = mix(a.cx, b.cx, e), cy = mix(a.cy, b.cy, e), ax = mix(a.ax, b.ax, e), ay = mix(a.ay, b.ay, e)
      frames.push({ transform: flat3d({ tx: ax - cx * z, ty: ay - cy * z, z }) })
    }
    world.classList.add('gliding')
    dots.style.opacity = '0'
    world.style.willChange = 'transform'
    world.style.transform = flat3d(aPose)
    const mine = world.animate(frames, { duration, easing: 'linear', fill: 'forwards' })
    flight = mine
    // The first flight isn't timed: it's when the whole board's images arrive, which says nothing about
    // how this phone flies.
    if (!verified && !timing && flown > 0) time(duration)
    mine.finished.then(() => {
      if (flight !== mine) return
      flight = null
      flown++
      rest(bPose)
      mine.cancel()
    }, () => { /* cancelled by a newer move */ })
  }
  let flown = 0
  /** Demotes to 'slide' only on two clearly struggling flights: long stalls or under 20 frames a second. */
  function time(duration: number) {
    timing = true
    remember('trying')
    let frames = 0, worst = 0, last = performance.now()
    const t0 = last
    const watch = (t: number) => {
      frames++; worst = Math.max(worst, t - last); last = t
      if (t - t0 < duration) { requestAnimationFrame(watch); return }
      timing = false; checks++
      if (worst > 200 || frames < (duration / 1000) * 20) bad++
      if (bad >= 2) { glide = 'slide'; remember('slide') }
      else if (checks - bad >= 2) { verified = true; remember('gpu') }
      else remember(null)
    }
    requestAnimationFrame(watch)
  }
  function slideIn(prev: Pose, next: Pose) {
    // The new view comes in from the side it lies on: the direction the camera travelled, on screen.
    const dx = (prev.tx - next.tx) / Math.max(prev.z, next.z), dy = (prev.ty - next.ty) / Math.max(prev.z, next.z)
    const len = Math.hypot(dx, dy) || 1
    stage.animate([
      { transform: `translate(${(dx / len) * 36}px, ${(dy / len) * 36}px)`, opacity: 0.35 },
      { transform: 'none', opacity: 1 },
    ], { duration: 320, easing: 'cubic-bezier(.2, .8, .2, 1)' })
  }
  cleanups.push(() => { flight?.cancel() })
  const tickVals: number[] = []
  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now
    const p = stepped ? { i: at, f: 0 } : pose(scrollY)
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
      // The ease never quite arrives; snap once it's invisible, so a resting page writes nothing.
      if (delta < 0.01) cur = { ...target }
    }
    if (!dragging) { look.x *= 0.86; look.y *= 0.86; if (Math.abs(look.x) < 0.1) look.x = 0; if (Math.abs(look.y) < 0.1) look.y = 0 }
    delta += Math.abs(look.x) + Math.abs(look.y) > 0.5 ? 1 : 0

    const z = cur.z, tx = cur.ax - cur.cx * z + look.x, ty = cur.ay - cur.cy * z + look.y
    if (touch) moveTouch({ ...cur }, { tx, ty, z })
    else {
      put('tf', `translate3d(${tx}px, ${ty}px, 0) scale(${z})`, (v) => { world.style.transform = v })
      paintDesk({ tx, ty, z })
    }
    // Promote the board to its own layer only while it moves, so text re-rasterises sharp at rest.
    still = delta > 0.05 ? 0 : still + 1
    put('moving', String(still < 8 && !touch), (v) => world.classList.toggle('moving', v === 'true'))

    const vx = -tx / z, vy = -ty / z
    const x0 = clamp(vx * MS, MINI_W), x1 = clamp((vx + vw / z) * MS, MINI_W)
    const y0 = clamp(vy * MS, MINI_H), y1 = clamp((vy + vh / z) * MS, MINI_H)
    put('view', `left:${x0}px;top:${y0}px;width:${x1 - x0}px;height:${y1 - y0}px`, (v) => { view.style.cssText = v })
    put('zoom', Math.round(z * 100) + '%', (v) => { zoomRead.textContent = v })
    put('xy', `x ${Math.round(cur.cx)} y ${Math.round(cur.cy)}`, (v) => { xyRead.textContent = v })
    navTicks().forEach((el, j) => {
      const v = j <= p.i ? 1 : j === p.i + 1 ? p.f : 0
      if (tickVals[j] !== v) { tickVals[j] = v; el.style.setProperty('--p', v.toFixed(3)) }
    })
    raf = requestAnimationFrame(frame)
  }

  layout()
  listen(window, 'resize', layout)
  const p0 = stepped ? { i: at, f: 0 } : pose(scrollY)
  select(p0.f < 0.5 ? p0.i : p0.i + 1)
  measureHero()
  raf = requestAnimationFrame(frame)
  cleanups.push(() => cancelAnimationFrame(raf))

  return {
    goStop, goCluster, next, prev, focusTile,
    destroy() {
      cleanups.splice(0).forEach((fn) => fn())
      document.body.classList.remove('overview', 'dragging')
      document.documentElement.classList.remove('stepped')
    },
  }
}
