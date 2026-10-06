// The CV itself: one A4 sheet rendered from src/data/cv.ts. Used by the viewer
// over the workbench, by the /cv page, and (printed) for /cv.pdf.
import { cv } from '@/data/cv'
import './cv.css'

/** `preview` is the copy on the board: same sheet, but its name isn't the page's heading. */
export default function CvSheet({ updated, preview }: { updated: string; preview?: boolean }) {
  const Name = preview ? 'p' : 'h1'
  return (
    <article className="cv-sheet">
      <header className="cv-head">
        <div>
          <Name className="cv-name">{cv.name}</Name>
          <p className="cv-role">{cv.headline}</p>
        </div>
        <p className="cv-updated">Updated {updated}</p>
      </header>
      <p className="cv-contact">
        <span>{cv.location}</span>
        <a href={`mailto:${cv.email}`}>{cv.email}</a>
        <span data-phone hidden />
        {cv.links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
      </p>

      <section>
        <h2>Profile</h2>
        <p>{cv.profile}</p>
      </section>

      <section>
        <h2>Experience</h2>
        {cv.experience.map((r) => (
          <div key={r.org} className="cv-role-block">
            <div className="cv-line"><h3>{r.role} <span>· {r.org}</span></h3><span className="cv-dates">{r.dates}</span></div>
            {r.products?.map((p) => (
              <div key={p.name} className="cv-product">
                <h4>{p.name} <span>· {p.tagline}</span>{p.link && <> · <a href={p.link.href}>{p.link.label}</a></>}</h4>
                <ul>{p.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section>
        <h2>Projects</h2>
        <ul className="cv-items">
          {cv.projects.map((p) => (
            <li key={p.name}><b>{p.name}</b>: {p.line}{p.link && <> <a href={p.link.href}>{p.link.label}</a></>}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Skills</h2>
        <dl className="cv-skills">
          {cv.skills.map((s) => <div key={s.group}><dt>{s.group}</dt><dd>{s.items}</dd></div>)}
        </dl>
      </section>

      <section>
        <h2>Work experience</h2>
        {cv.work.map((w) => (
          <div key={w.name} className="cv-entry">
            <div className="cv-line"><h3>{w.name}</h3><span className="cv-dates">{w.dates}</span></div>
            {w.line && <p>{w.line}</p>}
          </div>
        ))}
      </section>

      <section>
        <h2>Education</h2>
        {cv.education.map((e) => (
          <div key={e.name} className="cv-entry">
            <div className="cv-line"><h3>{e.name}</h3><span className="cv-dates">{e.dates}</span></div>
            {e.line && <p>{e.line}</p>}
          </div>
        ))}
      </section>
    </article>
  )
}
