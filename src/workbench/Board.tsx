// The board: every cluster laid out in board pixels. Columns in the hero follow
// a 12-column grid (column 103, gutter 24, starting at x 130).
import type { CSSProperties } from 'react'
import gh from '@/data/github.json'
import { FiFileText } from 'react-icons/fi'
import { FaGithub, IconLinks } from './icons'
import {
  Brief, Browser, Callout, Frame, IMG, IPhone, MacBook, Note, PassionCard, Shot, SlotBox, Spec, Step, Tile, Title,
} from './parts'
import SkillsPipeline, { type Column } from './Skills'
import { SHOW_SLOTS, WORLD, type Cluster } from './stops'
import { AppRow } from './apps'
import { FRUNT_PARTS, FRUNT_SITE_FOCUS, FRUNT_SITE_Y, MGK_PARTS, type Part } from './products'
import { FRUNT_SCREENS, MGK_SCREENS, phone, slide } from './screens'
import { SHOW_FRUNT } from '@/case-studies/flags'
import { BOARD_MILESTONES, fmtShort } from '@/case-studies/frunt-board'

const d = (delay: string) => ({ '--d': delay }) as CSSProperties

function Parts({ c, prefix, parts, x0, y0 }: { c: Cluster; prefix: string; parts: Part[]; x0: number; y0: number }) {
  return (
    <>
      {parts.map((p, k) => (
        <Tile key={p.name} id={`${prefix}${k + 1}`} c={c} ix={String(k + 1).padStart(2, '0')} name={p.name} status={p.status}
          live={p.live} line={p.line} tech={p.tech} focus={p.focus}
          x={x0 + (k % 3) * 600} y={y0 + Math.floor(k / 3) * 220} w={570} h={200} />
      ))}
    </>
  )
}

// ---------- hero: the GitHub contribution graph, on the grid ----------
const CELL = 23, PITCH = 28
const fmtDay = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

function GitHubGraph() {
  const months: { x: number; label: string }[] = []
  let last = -1
  gh.weeks.forEach((w, i) => {
    const m = new Date(w[0].d + 'T00:00:00Z').getUTCMonth()
    if (m !== last) {
      months.push({ x: i * PITCH, label: new Date(w[0].d + 'T00:00:00Z').toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' }) })
      last = m
    }
  })
  if (months.length > 1 && months[1].x - months[0].x < PITCH * 3) months.shift()
  return (
    <div className="gh hx" data-c="hero" style={{ left: 130, top: 690, width: 1500, ...d('.4s') }}>
      <div className="gh-head">
        <a href={`https://github.com/${gh.login}`} target="_blank" rel="noopener"><FaGithub aria-hidden="true" /> <b>{gh.total.toLocaleString('en-GB')}</b> contributions in the last year</a>
        <span className="gh-legend" aria-hidden="true">Less <i className="l0" /><i className="l1" /><i className="l2" /><i className="l3" /><i className="l4" /> More</span>
      </div>
      <div className="gh-months" aria-hidden="true">{months.map((m) => <span key={m.x} style={{ left: m.x }}>{m.label}</span>)}</div>
      <div className="gh-grid" role="img" aria-label={`${gh.total} GitHub contributions in the last year`}>
        {gh.weeks.map((w, i) => (
          <div className="gh-wk" key={i} style={{ width: CELL }}>
            {w.map((day) => <i key={day.d} className={`l${day.l}`} title={`${day.c} contribution${day.c === 1 ? '' : 's'} · ${fmtDay(day.d)}`} />)}
          </div>
        ))}
      </div>
    </div>
  )
}

function Hero({ onCv }: { onCv: () => void }) {
  return (
    <>
      <div className="cols hx" data-c="hero" aria-hidden="true" style={{ left: 130, top: 130, width: 1500, height: 970, ...d('0s') }} />
      <div className="guide hx" data-c="hero" id="gCap" aria-hidden="true" style={{ left: 100, top: 230, width: 1560, ...d('.15s') }}><span>Cap height</span></div>
      <div className="guide hx" data-c="hero" id="gBase" aria-hidden="true" style={{ left: 100, top: 380, width: 1560, ...d('.15s') }}><span>Baseline</span></div>
      <div className="measure hx" data-c="hero" id="measure" aria-hidden="true" style={{ left: 130, top: 150, width: 967, ...d('.25s') }}><span id="measureLbl">967</span></div>
      <h1 className="ttl hx" data-c="hero" id="heroName" style={{ left: 130, top: 190, fontSize: 250, zIndex: 2, ...d('.1s') }}>Matthew<span className="bl" /><span className="sr-only"> Kay</span></h1>
      <div className="ttl o xl hx" data-c="hero" style={{ left: 511, top: 410, fontSize: 300, zIndex: 2, ...d('.2s') }}>Kay</div>
      <div className="measure hx" data-c="hero" id="gGap" aria-hidden="true" style={{ left: 1097, top: 300, width: 176, ...d('.35s') }}><span id="gGapLbl">176</span></div>
      <figure className="sel hx" data-c="hero" id="heroPhoto" style={{ left: 1273, top: 230, width: 357, height: 446, ...d('.3s') }}>
        <img src={IMG('headshot')} width={900} height={600} alt="Matthew Kay" />
        <i className="hd a" /><i className="hd b" /><i className="hd c" /><i className="hd d" />
        <span className="sz">357 × 446</span>
      </figure>
      <GitHubGraph />
      <div className="hero-links hx" data-c="hero" style={{ left: 130, top: 990, ...d('.55s') }}><IconLinks size="lg" /></div>
      <button type="button" className="hcv hx" data-c="hero" onClick={onCv} style={{ left: 1273, top: 990, ...d('.6s') }}>View CV<FiFileText aria-hidden="true" /></button>
      <div className="mcursor" data-c="hero" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M4 2.5 L20 11.2 L12.6 13.1 L9.2 20.8 Z" /></svg><span>Matthew</span>
      </div>
    </>
  )
}

// ---------- frunt: how it was built, on a dated ruler ----------
// Each marker sits at its real date, so the pace shows: the May–June build, the
// summer away, the second wave. Markers too close to share a row step up a level.
const TL_INSET = 30, TL_AXIS = 940, TL_LEVEL = 32
const day = (iso: string) => Date.parse(iso + 'T00:00:00Z')

function BuildTimeline() {
  const first = new Date(day(BOARD_MILESTONES[0].date))
  const last = new Date(day(BOARD_MILESTONES[BOARD_MILESTONES.length - 1].date))
  const start = Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1)
  const end = Date.UTC(last.getUTCFullYear(), last.getUTCMonth() + 2, 1)
  const xAt = (t: number) => TL_INSET + ((t - start) / (end - start)) * TL_AXIS

  const months: { x: number; label: string }[] = []
  for (let m = new Date(start); m.getTime() <= end; m.setUTCMonth(m.getUTCMonth() + 1)) {
    months.push({ x: xAt(m.getTime()), label: m.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' }) })
  }
  const lastX: number[] = []
  const marks = BOARD_MILESTONES.map((m) => {
    const x = xAt(day(m.date))
    let level = 0
    while (lastX[level] !== undefined && x - lastX[level] < 30) level++
    lastX[level] = x
    return { x, level }
  })

  return (
    <div className="tl" data-c="frunt" style={{ left: 3620, top: 1480, width: 1000, height: 420 }}>
      <div className="tl-head"><b>How it was built</b><span>Dates from frunt&apos;s git history · {first.getUTCFullYear()}</span></div>
      <div className="tl-axis" aria-hidden="true">
        <i className="tl-line" />
        {months.map((m) => <span key={m.x} className="tl-month" style={{ left: m.x }}>{m.label}</span>)}
        {marks.map((mk, i) => (
          <b key={i} className="tl-mk" style={{ left: mk.x, bottom: 44 + mk.level * TL_LEVEL, '--stem': `${8 + mk.level * TL_LEVEL}px` } as CSSProperties}>{i + 1}</b>
        ))}
      </div>
      <ol className="tl-list">
        {BOARD_MILESTONES.map((m, i) => (
          <li key={m.date + m.label}><b>{String(i + 1).padStart(2, '0')}</b><time dateTime={m.date}>{fmtShort(m.date)}</time><span>{m.label}</span></li>
        ))}
      </ol>
    </div>
  )
}

function Frunt() {
  return (
    <>
      <Title c="frunt" x={1760} y={0} size={600} bg style={{ textTransform: 'none', letterSpacing: '-.04em' }}>frunt</Title>
      <Brief c="frunt" x={1790} y={250} w={450}
        problem="Restaurants have their rules written down. Staff don't read them."
        story="I saw it working behind a bar: training was a compliance module that ticked a box, and finding an answer meant flipping through spec sheets or asking a manager again."
        steps={[
          'A manager uploads the documents the restaurant already has.',
          'frunt turns them into short courses on staff phones.',
          'Staff ask in plain words; every answer names the document it came from.',
        ]}
        facts="For independent restaurants · built and run solo · live since June 2026" />
      <Browser c="frunt" x={1790} y={FRUNT_SITE_Y} w={450} url="https://frunthospitality.com/" img="site-frunt-long" iw={640} ih={3185}
        alt="frunthospitality.com, the frunt website" caption="Website · hover to scroll" long focus={FRUNT_SITE_FOCUS} />
      <MacBook c="frunt" id="frunt-a" label="Manager web app" x={2250} y={430} w={1400} slides={[
        { ...slide(FRUNT_SCREENS.home), bg: '#f6f5f2', title: 'Home' },
        { ...slide(FRUNT_SCREENS.ask), bg: '#faf7ef', title: 'Ask frunt',
          // The redline is measured on the saved screenshot, so a new capture drops it.
          overlay: FRUNT_SCREENS.ask.fromFeed ? undefined : <><div className="redline" style={{ left: '37.2%', top: '46.45%', width: '33.5%', height: '6.5%' }} /><div className="tag" style={{ left: '37.2%', top: '54.5%' }}>↑ Every answer cites its source</div></> },
        { ...slide(FRUNT_SCREENS.documents), bg: '#fbfcfb', title: 'Documents' },
        { ...slide(FRUNT_SCREENS.training), bg: '#fefefb', title: 'Training' },
      ]} />
      <Callout c="frunt" n="01" title="Ask" x={3720} y={400} w={332} h={240}>
        Staff ask in plain words, in the app or on WhatsApp. Every answer lists the documents it came from, so a manager can check it.
      </Callout>
      <Callout c="frunt" n="02" title="Training" x={4090} y={400} w={332} h={240}>
        Short courses built from the restaurant&apos;s own documents, not a generic module. Each one finished is recorded, with the date it&apos;s due again.
      </Callout>
      <IPhone c="frunt" x={3720} y={673} w={332} {...phone(FRUNT_SCREENS.staffAsk)} />
      <IPhone c="frunt" x={4090} y={673} w={332} {...phone(FRUNT_SCREENS.staffTraining)} />
      <Parts c="frunt" prefix="ft" parts={FRUNT_PARTS} x0={1790} y0={1480} />
      {SHOW_SLOTS && !SHOW_FRUNT && <SlotBox c="frunt" x={3620} y={1480} w={1000} h={200} title="Case study" />}
      {SHOW_SLOTS && !SHOW_FRUNT && <SlotBox c="frunt" x={3620} y={1700} w={1000} h={200} title="What I learnt" />}
      {SHOW_FRUNT && <BuildTimeline />}
      <img className="brand-mark" data-c="frunt" src={IMG('frunt-icon')} width={256} height={256} alt="frunt" style={{ left: 1790, top: 110, width: 110, height: 110 }} />
      <AppRow app="frunt" web={false} c="frunt" className="release" style={{ left: 3720, top: 1372 }} />
    </>
  )
}

function MgkFitness() {
  return (
    <>
      <Title c="mgk" x={1760} y={2100} size={220}>MGK</Title>
      <Title c="mgk" x={2130} y={2225} size={330} outline xl>Fitness</Title>
      <IPhone c="mgk" x={1780} y={2590} w={260} img="liftio-home" iw={560} ih={1212} alt="Liftio 1.4 home screen" caption="Liftio 1.4 · React Native" />
      <IPhone c="mgk" x={2060} y={2650} w={260} img="liftio-tracking" iw={560} ih={1212} alt="Liftio 1.4 workout tracking" />
      <IPhone c="mgk" x={2340} y={2590} w={260} img="liftio-detail" iw={560} ih={1212} alt="Liftio 1.4 exercise detail with a progress chart" />
      <IPhone c="mgk" x={2820} y={2590} w={260} {...phone(MGK_SCREENS.liftLog)} caption="Lift · Flutter" />
      <IPhone c="mgk" x={3100} y={2650} w={260} {...phone(MGK_SCREENS.liftPlan)} />
      <IPhone c="mgk" x={3600} y={2590} w={260} {...phone(MGK_SCREENS.runRecord)} caption="Run · Flutter" />
      <IPhone c="mgk" x={3880} y={2650} w={260} {...phone(MGK_SCREENS.runPlan)} />
      <Note c="mgk" x={2820} y={3305} w={780} kicker="Decision 0001 · accepted 17 Aug 2026"
        quote={'"Retiring a live record to avoid an untidy string is paying a real cost for a cosmetic one."'}>
        Liftio is replaced, not relaunched.
      </Note>
      {SHOW_SLOTS && <SlotBox c="mgk" x={3650} y={3290} w={470} h={200} title="Case study" />}
      {SHOW_SLOTS && <SlotBox c="mgk" x={4150} y={3290} w={470} h={200} title="What I learnt" />}
      <img className="brand-mark" data-c="mgk" src={IMG('mgkfitness-icon')} width={256} height={256} alt="MGKFitness" style={{ left: 2250, top: 2105, width: 110, height: 110 }} />
      <AppRow app="lift" web={false} c="mgk" className="release" style={{ left: 2820, top: 3200 }} />
      <AppRow app="run" web={false} c="mgk" className="release" style={{ left: 3600, top: 3215 }} />
      <Browser c="mgk" x={3880} y={2105} w={620} url="https://mgkfitness.mgkcodes.com/" img="site-mgkfitness" iw={1000} ih={625}
        alt="mgkfitness.mgkcodes.com, the MGKFitness website" caption="Website" focus="3860,2080,660,470" />
      <Parts c="mgk" prefix="mt" parts={MGK_PARTS} x0={1790} y0={3560} />
    </>
  )
}

function OtherWork() {
  return (
    <>
      <Title c="other" x={120} y={1370} size={170}>Other</Title>
      <Title c="other" x={420} y={1480} size={260} outline>Work</Title>
      <Shot c="other" x={130} y={1770} w={470} img="ledger" iw={1000} ih={621} alt="Ledger finance dashboard" nm="Ledger · web app" ln="Business finance dashboard with AI transaction entry." />
      <Shot c="other" x={645} y={1770} w={470} img="msa" iw={1000} ih={625} alt="MSA architecture portfolio" nm="MSA · client site" ln="Portfolio for an architecture student." />
      <Shot c="other" x={1160} y={1770} w={470} img="redcross" iw={1000} ih={625} alt="Red Cross Reigate pub site" nm="Red Cross · client site" ln="Landing page for a pub in Reigate." />
      <Shot c="other" x={130} y={2200} w={470} img="youtube" iw={1000} ih={474} alt="YouTube clone home feed" nm="YouTube clone · practice" ln="Full-stack video platform with auth." />
      <Shot c="other" x={645} y={2200} w={470} img="netflix" iw={800} ih={500} alt="Netflix clone home" nm="Netflix clone · practice" ln="State management, layer by layer." />
      <IPhone c="other" x={1160} y={2200} w={144} img="footy" iw={400} ih={831} alt="FootyScores app, live Premier League scores"
        below={{ nm: 'FootyScores', ln: 'Live scores, React Native + Node.' }} />
    </>
  )
}

function About() {
  return (
    <>
      <Title c="about" x={120} y={2915} size={170}>About</Title>
      <Title c="about" x={600} y={3010} size={260} outline>Me</Title>
      <div className="bio" data-c="about" style={{ left: 130, top: 3290, width: 820 }}>
        <p>Building things has always been how I think. Before I knew what programming was, I was pulling things apart to see how they worked.</p>
        <p>I run MGKCodes, the studio behind frunt and MGKFitness.</p>
      </div>
      <PassionCard c="about" x={1050} y={3010} img="gym" ix="01" label="Gym" rot={-8} />
      <PassionCard c="about" x={1210} y={2975} img="golf" ix="02" label="Golf" />
      <PassionCard c="about" x={1370} y={3010} img="gaming" ix="03" label="Gaming" rot={8} />
      <img data-c="about" src="/work/mgk-logo.svg" width={1500} height={935} alt="MGKCodes" style={{ position: 'absolute', left: 1060, top: 3420, width: 220, height: 'auto' }} />
      <Spec c="about" x={1060} y={3580}>MGKCodes · the studio<br />behind frunt + MGKFitness</Spec>
    </>
  )
}

/** How I work: the five steps as column heads, each skill under the step it serves. */
export const HOW = { x0: 1790, col: 445, gap: 30, stepY: 4520, stepH: 330, cardY: 4890, cardH: 400 }
const hx = (i: number) => HOW.x0 + i * (HOW.col + HOW.gap)

function HowIWork() {
  const cols: Column[] = [
    { step: 'plan', x: hx(0) },
    { step: 'decide', x: hx(1), after: (x, y) => (
      <Note c="how" x={x} y={y} w={HOW.col} kicker="Decision records">
        Every big call written down: what I chose, the obvious alternative, what it costs, and what would change my mind.
      </Note>
    ) },
    { step: 'build', x: hx(2) },
    { step: 'check', x: hx(3), sub: 2 },
    { step: 'ship', x: hx(5) },
  ]
  const ticks = [hx(0), hx(1), hx(2), hx(3), hx(5), hx(5) + HOW.col]
  const step = (i: number, w = HOW.col) => ({ x: hx(i), y: HOW.stepY, w, h: HOW.stepH })
  return (
    <>
      <Title c="how" x={1760} y={4185} size={150}>How I</Title>
      <Title c="how" x={2290} y={4250} size={230} outline>Work</Title>
      <svg className="wire" width={4760} height={WORLD.h} viewBox={`0 0 4760 ${WORLD.h}`} aria-hidden="true">
        <g data-c="how" className="mute" strokeWidth={2}>
          <line x1={hx(0)} y1={4490} x2={hx(5) + HOW.col} y2={4490} />
          {ticks.map((x) => <line key={x} x1={x} y1={4476} x2={x} y2={4504} />)}
        </g>
      </svg>
      <Step c="how" {...step(0)} n="01" title="Plan" text="Every screen laid out on one board, each with what it's for." ev="e.g. Lift screen board, v11" />
      <Step c="how" {...step(1)} n="02" title="Decide" text="Big calls written down with the reasoning, so they can be checked." ev="e.g. Decision 0001" />
      <Step c="how" {...step(2)} n="03" title="Build" text="AI does the typing. My own skills library sets how it works." ev="e.g. github.com/MattKay02/skills" />
      <Step c="how" {...step(3, HOW.col * 2 + HOW.gap)} n="04" title="Check" text="Screens checked by eye, design reviews, a build check on every PR, and most of my skills." ev="e.g. 19 findings, 30 Sept review" />
      <Step c="how" {...step(5)} n="05" title="Ship" text="Store submissions with a written record of what went out." ev="e.g. Run 1.0, 2 Oct 2026" />
      <SkillsPipeline cols={cols} y={HOW.cardY} card={{ w: HOW.col, h: HOW.cardH }} gap={HOW.gap} />
    </>
  )
}

/** Contact mirrors the hero: links on the left, View CV in the photo's column. The CV itself only opens on request. */
function Contact({ onCv }: { onCv: () => void }) {
  return (
    <>
      <Title c="contact" x={120} y={3895} size={200}>Let&apos;s</Title>
      <Title c="contact" x={470} y={3990} size={320} outline xl>Talk</Title>
      <div className="contactline" data-c="contact" style={{ left: 130, top: 4300 }}>mattykay2002@gmail.com</div>
      <div className="hero-links" data-c="contact" style={{ left: 130, top: 4380 }}><IconLinks size="lg" /></div>
      <button type="button" className="hcv" data-c="contact" onClick={onCv} style={{ left: 1273, top: 4380 }}>View CV<FiFileText aria-hidden="true" /></button>
    </>
  )
}

/** Arrows between the MGKFitness phones: Liftio → Lift, and Lift ↔ Run. */
function MgkWires() {
  return (
    <svg className="wire" width={4760} height={4900} viewBox="0 0 4760 4900" aria-hidden="true">
      <defs>
        <marker id="ah" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" />
        </marker>
      </defs>
      <g data-c="mgk">
        <line x1={2614} y1={2880} x2={2802} y2={2880} strokeWidth={3} markerEnd="url(#ah)" />
        <text x={2620} y={2862}>Rebuilt</text>
        <polyline className="mute" points="2695,2896 2695,3390 2814,3390" fill="none" strokeWidth={2} strokeDasharray="8 8" />
        <line x1={3376} y1={2920} x2={3584} y2={2920} strokeWidth={3} markerStart="url(#ah)" markerEnd="url(#ah)" />
        <text x={3386} y={2902}>Shares</text>
        <text x={3386} y={2952}>your week</text>
      </g>
    </svg>
  )
}

export default function Board({ onCv }: { onCv: () => void }) {
  return (
    <>
      <Frame c="hero" x={100} y={120} w={1560} h={1000} label="00 · Hero" />
      <Frame c="frunt" x={1740} y={30} w={2920} h={1910} label="01 · frunt · main project" />
      <Frame c="other" x={100} y={1320} w={1560} h={1440} label="03 · Other work" />
      <Frame c="mgk" x={1740} y={2070} w={2920} h={1940} label="02 · MGKFitness" />
      <Frame c="about" x={100} y={2880} w={1560} h={900} label="05 · About" />
      <Frame c="how" x={1740} y={4140} w={2920} h={2080} label="04 · How I work" />
      <Frame c="contact" x={100} y={3860} w={1560} h={640} label="06 · Contact" />
      <Hero onCv={onCv} />
      <Frunt />
      <MgkFitness />
      <MgkWires />
      <OtherWork />
      <About />
      <HowIWork />
      <Contact onCv={onCv} />
    </>
  )
}
