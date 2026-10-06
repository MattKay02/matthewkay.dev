// README visuals for frunt's case-study repo (github.com/MattKay02/frunt).
// scripts/build-readme.mjs photographs each canvas in light and dark into
// /readme/frunt/<name>-<theme>.png on every deploy. The README links to those, so
// its images keep the site's design and the current store status. Not for visitors.
import type { Metadata } from 'next'
import { appStatus, liveOn, statusText } from '@/workbench/apps'
import { IPhone, MacBook, Shot, Tile } from '@/workbench/parts'
import { FRUNT_PARTS } from '@/workbench/products'
import { stops } from '@/workbench/stops'
import '../readme.css'

export const metadata: Metadata = { title: 'frunt · README visuals', robots: { index: false, follow: false } }

const COL = 394, GAP = 24, M = 64
const x = (i: number) => M + i * (COL + GAP)

export default function FruntReadme() {
  const app = appStatus('frunt')
  const pitch = stops.find((s) => s.c === 'frunt')!.body!.split('. ')[0] + '.'
  return (
    <main className="rk-page">
      {/* Hero: the cited answer on the manager app, beside the staff app (Apple's frames, one scale). */}
      <section className="rk" data-shot="hero" style={{ height: 680 }}>
        <span className="rk-label" style={{ left: M, top: 150 }}>Case study · an MGKCodes product</span>
        <h1 className="rk-name" style={{ left: M - 4, top: 182 }}>frunt</h1>
        <p className="rk-line" style={{ left: M, top: 350, width: 410 }}>{pitch}</p>
        <div className="rk-status" style={{ left: M, top: 522 }}>
          <img src={`/work/${app.icon}.webp`} width={48} height={48} alt="" />
          <div>
            <b>{app.label}</b>
            <span className={app.live ? 'live' : undefined}>{statusText(app)}</span>
            {app.live && <small>On {liveOn('frunt')}</small>}
          </div>
        </div>
        <MacBook c="frunt" id="rk-frunt" label="Manager web app" x={520} y={200} w={600} slides={[
          { img: 'frunt-ask', w: 1280, h: 720, bg: '#faf7ef', title: 'Ask frunt', alt: 'Ask frunt: an answer about peanut allergen controls, citing three source documents',
            overlay: <><div className="redline" style={{ left: '37.2%', top: '46.45%', width: '33.5%', height: '6.5%' }} /><div className="tag" style={{ left: '37.2%', top: '54.5%' }}>↑ Every answer cites its source</div></> },
        ]} />
        <IPhone c="frunt" x={1150} y={305} w={142} img="frunt-m-ask" iw={334} ih={736} alt="frunt staff app, asking a question" caption="Staff app · Ask" />
      </section>

      {/* The system: the six parts, with their live statuses. */}
      <section className="rk" data-shot="system" style={{ height: 652 }}>
        {FRUNT_PARTS.map((p, i) => (
          <Tile key={p.name} id={`rk-ft${i}`} c="frunt" ix={String(i + 1).padStart(2, '0')} name={p.name} status={p.status} live={p.live}
            line={p.line} tech={p.tech} focus="self" x={x(i % 3)} y={M + Math.floor(i / 3) * (250 + GAP)} w={COL} h={250} />
        ))}
      </section>

      {/* Screens from the manager app, captioned with each screen's own heading. */}
      <section className="rk" data-shot="screens" style={{ height: 450 }}>
        <Shot c="frunt" img="frunt-home" iw={1100} ih={619} alt="frunt manager app, home" nm="Home" ln="Get the team prepared before service" x={x(0)} y={M} w={COL} />
        <Shot c="frunt" img="frunt-docs" iw={1100} ih={619} alt="frunt manager app, documents" nm="Documents" ln="Your restaurant's brain" x={x(1)} y={M} w={COL} />
        <Shot c="frunt" img="frunt-training" iw={1100} ih={619} alt="frunt manager app, training" nm="Training" ln="Keep the team prepared" x={x(2)} y={M} w={COL} />
      </section>
    </main>
  )
}
