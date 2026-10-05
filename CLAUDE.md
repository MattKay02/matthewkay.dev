# Matthew Kay · Portfolio (the Workbench)

## What this site is for

A personal portfolio aimed at **recruiters and hiring managers**, who give it about a minute.
Its job is to get Matthew interviews. Winning clients is mgkcodes.com's job, not this site's.

- **Results first, AI as the method.** The site shows what Matthew made, why, what he aimed for
  and how he dealt with the challenges. AI-assisted work is shown as evidence of *how* he works
  (skills, decision records, checks), never as the headline.
- **The skim test.** Someone who scrolls straight through still learns who he is, what he builds,
  the proof, and how to reach him, because every message is real text in the guide panel.
- This is the **personal hat** (`MattKay02`). MGKCodes products appear as Matthew's work; no
  business internals (finances, client or lead data) ever go on the page or into this public repo.

## The concept: the Workbench

One board of real work. Native page scroll moves a camera through 13 stops; a guide panel on the
left (a bottom sheet on phones) tells the story. Visitors can click a frame to jump, click a
product "part" to zoom to it, drag to look around (springs back), use ← → keys, or the minimap.

Order: Hero → the whole board → **frunt** (problem, sourced answers, the whole system) →
**MGKFitness** (Liftio, the rebuild, the suite, the whole system) → Other work → How I work →
About → Contact. frunt is the main project and leads.

## Design rules

- **Paper look by default**: light greyscale desk. Studio (dark) and Brutalist (v1) are kept as
  alternates behind the top-bar switch; decide whether to keep the switch before launch.
- **Greyscale only. Colour comes only from the work**: screens are greyscale until their project
  is the current stop or hovered.
- **Neat and precise.** Matthew is a neat, precise person: grids, alignment, measured spacing,
  design-tool vocabulary (selection frames, guides, measurements). **No scrapbook devices**:
  no tape, sticky notes, handwriting fonts or random tilts. He rejected those explicitly.
- **The hero is a design spec** on a 12-column grid (column 103px, gutter 24px, from x 130):
  live-measured cap-height and baseline guides, name width and name-to-photo gap, the photo as a
  selected frame, the live GitHub contribution graph, and large icon links. No numbered note boxes.
- **Type**: Space Grotesk (display), Inter (body), IBM Plex Mono (data; labels in Brutalist).
  Two-line headings: a solid line, then an offset second line (grey fill in Paper/Studio, outline
  in Brutalist).
- **Devices are Apple's own Product Bezels** (MacBook Air M5 13" Silver, iPhone 18 Pro Black),
  used under Apple's rules: upright, never overlapping, no added shadows or reflections, never
  animate the device itself, same relative scale within a group (iPhone ≈ 0.237 × MacBook
  width). Screen content may change (rotating MacBook slides are fine). Filters and dimming apply
  to screen content only. Web screens are 16:10 and sit below the notch; phone screens are raw
  screens with no baked-in frame or background.
- **Other work** is plain screenshots in equal 16:10 boxes on a three-column grid (no laptops).
- **Motion carries meaning**: pin and play, never hijack scroll speed. Reduced motion means cuts,
  no rotation, no cursor animation. Phones get a bottom-sheet guide and framing that favours
  phone screens.
- **Copy**: plain, short, specific, from the reader's side. No em dashes in on-page copy, no
  buzzwords, no AI-sounding filler. **Statuses must be true** (see Facts) and go stale, so check
  them before every launch.

## Tech

Next.js 16 (App Router), TypeScript, static export to `out/`, served by GitHub Pages. Global CSS
with tokens in `app/globals.css` (no CSS Modules). Fonts via `next/font`. Icons via `react-icons`.
Next.js 16 differs from older versions: read `node_modules/next/dist/docs/` before using an API
you haven't checked (see the block at the end of this file).

```
app/
  layout.tsx           fonts, metadata, the no-flash look script
  page.tsx             renders <Workbench />
  globals.css          tokens for the three looks + every style on the page
src/workbench/
  stops.ts             the tour: camera rects (desktop r, phone m), panel copy, links
  Board.tsx            the board layout in board pixels, plus the product "parts" data
  parts.tsx            building blocks: Frame, Title, Note, MacBook, IPhone, Browser, Tile, Shot…
  Skills.tsx           skills shelf, read live from the skills repo's skills.json
  controller.ts        the camera and everything per-frame (imperative; returns destroy())
  Workbench.tsx        React shell: top bar, guide panel, minimap, stage
  icons.tsx            link icons and the MGKCodes monogram
src/data/
  github.json          contribution calendar (generated)
  skills.json          skills manifest snapshot (generated; the live fetch overrides it)
scripts/fetch-github.mjs   refreshes both snapshots: `npm run github`
public/work/           every image on the board, plus the Apple frames
docs/                  architecture, design system, screens-feed spec, storyboard history
```

**Commands**: `npm run dev` (dev server, http://localhost:3000) · `npm run build` (static site in
`out/`) · `npm run github` (refresh contribution graph + skills snapshot) · `npm run preview`.

**Adding a stop**: add it to `stops.ts` (cluster, `r`, `m`, `nav`, copy). **Adding a project
part**: add it to `FRUNT_PARTS` / `MGK_PARTS` in `Board.tsx`. **Moving things**: everything on the
board is in board pixels; the world is 4760 × 4900.

### Live data (do not break)

- **Skills**: `Skills.tsx` fetches
  `https://raw.githubusercontent.com/MattKay02/skills/main/skills.json` in the browser. Matthew's
  publishing loop depends on this: adding a skill to the skills repo must show here with no
  change to this repo. Keep the fetch contract and the snapshot fallback.
- **GitHub graph**: built from `src/data/github.json`. The deploy workflow refreshes it before
  each build and rebuilds daily (`schedule` in `deploy.yml`). Only per-day counts are stored.
- **Product screens**: today they're static files in `public/work/`. The plan for screens that
  update themselves is `docs/screens-feed.md` (implemented in the product repos, not here).

### Verify before saying it's done

`npm run build` passes (TypeScript included). Check the dev server at desktop width and at 390px
(phone), with no console errors. Check reduced motion when touching animation. The `run` and
`lighthouse-audit` skills cover launching and performance checks.

## Facts (keep true; re-check before launch)

- **frunt**: live SaaS. Manager web app; staff app on the App Store (June 2026) and Google Play.
  Instagram studio live since 21 Sep 2026. **WhatsApp is built but switched off; never list it as
  live.** Admin console and outreach + analytics are internal: no admin screenshots until they
  can be captured from the demo restaurant, never a real customer's data.
- **MGKFitness**: Run 1.0 submitted to both stores on 2 Oct 2026 (in review). Lift 2.0 is next:
  the Flutter rebuild of Liftio (Liftio 1.4's backend stopped working in Aug 2026, so never
  present Liftio as live). Repo public by 11 Oct 2026. mgkfitness.mgkcodes.com has no tracking.
- **Other work**: Ledger, MSA (client), Red Cross (client), YouTube clone and Netflix clone
  (practice), FootyScores.

## Open decisions

- **Positioning line**: the hero's "Product engineer. I design and build polished apps, end to
  end." is a draft. The target role isn't settled.
- **Domain**: held until positioning settles. `.design` only if design is the headline;
  otherwise matthewkay.dev or .me (matthewkay.com and .co.uk are taken).
- **Case studies**: the dashed "Case study" and "What I learnt" slots. Agreed format: what I made
  → why → what I aimed for → challenges and decisions → where it landed → what I learnt.
- **How I work** and **About** are first ideas.
- **CV**: the buttons say "CV coming soon" until a PDF is added.
- **Accessibility / SEO**: consider a plain list view of the work alongside the board.

## Developer

Matthew Kay · github.com/MattKay02 · mgkcodes.com · mattykay2002@gmail.com ·
linkedin.com/in/matthew-kay- · x.com/mattykay2002

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
