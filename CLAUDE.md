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

One board of real work. Native page scroll moves a camera through 14 stops; a guide panel on the
left (a bottom sheet on phones) tells the story. Visitors can click a frame to jump, click a
product "part" to zoom to it, drag to look around (springs back), use ← → keys, or the minimap.

Order: Hero → the whole board → **frunt** (problem, sourced answers, the whole system) →
**MGKFitness** (Liftio, the rebuild, the suite, the whole system) → Other work → **How I work** (the
pipeline, then the checks) → About → Contact. frunt is the main project and leads.

## Design rules

- **Paper, in light and dark**: one design, a greyscale desk, with a sun/moon toggle in the top
  bar. Light is the default; a visitor's choice is remembered (`wb-theme` in localStorage) and
  applied before first paint. Dark is the same design with dark tokens (`:root[data-theme="dark"]`
  in `globals.css`), never a different look. The old Studio/Brutalist switch was a prototype
  device and is gone.
- **Greyscale only. Colour comes only from the work**: screens are greyscale until their project
  is the current stop or hovered.
- **Neat and precise.** Matthew is a neat, precise person: grids, alignment, measured spacing,
  design-tool vocabulary (selection frames, guides, measurements). **No scrapbook devices**:
  no tape, sticky notes, handwriting fonts or random tilts. He rejected those explicitly.
- **The hero is a design spec** on a 12-column grid (column 103px, gutter 24px, from x 130):
  live-measured cap-height and baseline guides, name width and name-to-photo gap, the photo as a
  selected frame, the live GitHub contribution graph, and large icon links. No numbered note boxes.
- **Type**: Space Grotesk (display), Inter (body), IBM Plex Mono (data).
  Two-line headings: a solid line, then an offset second line in grey.
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

Next.js 16 (App Router), TypeScript, static export to `out/`, built and served by Vercel (project `matthewkay-dev`, personal scope
"Matthew Kay's projects"). Global CSS
with tokens in `app/globals.css` (no CSS Modules). Fonts via `next/font`. Icons via `react-icons`.
Next.js 16 differs from older versions: read `node_modules/next/dist/docs/` before using an API
you haven't checked (see the block at the end of this file).

```
app/
  layout.tsx           fonts, metadata, the no-flash theme script
  page.tsx             renders <Workbench />, the hidden text version and the JSON-LD
  globals.css          tokens (light, plus dark overrides) + every style on the page
  og/                  the share image's page (photographed into /og.png; noindex)
  readme/<product>/    README visuals for the case-study repos (photographed; noindex)
  llms.txt/route.ts    /llms.txt, written at build time
src/workbench/
  stops.ts             the tour: camera rects (desktop r, phone m), panel copy, links
  Board.tsx            the board layout in board pixels
  products.ts          each flagship's "parts" (tile copy, statuses, focus rects)
  TourText.tsx         the whole tour as hidden text, for screen readers and crawlers
  parts.tsx            building blocks: Frame, Title, Note, MacBook, IPhone, Browser, Tile, Shot…
  Skills.tsx           How I work's skill cards, laid out under each step; read live from the
                       skills repo's skills.json and tests.json (useSkills)
  skills-data.ts       the skills snapshots, types and text helpers (server-safe, used by
                       TourText and /llms.txt as well as the board)
  controller.ts        the camera and everything per-frame (imperative; returns destroy())
  Workbench.tsx        React shell: top bar, guide panel, minimap, stage
  apps.tsx             app statuses and AppRow (icon, name, status, store and website buttons)
  icons.tsx            link icons and the MGKCodes monogram
app/cv/page.tsx        the standalone CV page
src/cv/                CvSheet (the A4 CV), CvViewer (viewer over the board + page shell),
                       updated.ts (git date of cv.ts), cv.css
src/seo/describe.ts    JSON-LD and /llms.txt, built from the same data as the page
src/data/
  cv.ts                Matthew's CV as data: the single source for /cv and /cv.pdf
  github.json          contribution calendar (generated)
  skills.json          skills manifest snapshot (generated; the live fetch overrides it)
  skill-tests.json     the skills' eval results snapshot (generated; same)
  apps.json            app facts: names, icons, store ids, websites (edited by hand)
  stores.json          which store listings are live (generated)
scripts/fetch-github.mjs   refreshes the graph and skills snapshots: `npm run github`
scripts/fetch-stores.mjs   checks the App Store and Google Play: `npm run stores`
scripts/build-cv.mjs       prints /cv to out/cv.pdf after a build: `npm run cv`
scripts/build-og.mjs       photographs /og/ to out/og.png after a build: `npm run og`
scripts/build-readme.mjs   photographs the README visuals (light + dark, 2x): `npm run readme`
scripts/headless.mjs       shared by both: serves out/ and launches headless Chrome
scripts/vercel-*.sh        Vercel's install and build steps (see vercel.json)
public/work/           every image on the board, the Apple frames and the app icons
docs/                  architecture, design system, screens-feed spec, storyboard history
```

**Commands**: `npm run dev` (dev server, http://localhost:3000) · `npm run build` (static site in
`out/`) · `npm run cv` (print the CV PDF; run after build) · `npm run cv:private` (copy with phone
number, see below) · `npm run github` (refresh contribution graph + skills snapshot) ·
`npm run stores` (refresh store statuses) · `npm run og` (share image; run after build) ·
`npm run preview`.

### The CV is code

`src/data/cv.ts` is the **only** source of Matthew's CV. `/cv` renders it as an A4 page and
`scripts/build-cv.mjs` prints that page to `/cv.pdf` on every deploy, stamped "Updated" with the
date `cv.ts` last changed in git, not the build date (from GitHub's API when the build's clone is
shallow, as on Vercel). To update the CV: edit `cv.ts`, commit,
push. Rules:

- **One A4 page.** The CV build fails, with how many pixels it's over, if it overflows. Trim
  content rather than shrinking type. Vercel prints it on Linux, where text can wrap a little
  differently, so keep a few percent spare locally (the script reports the real fill and warns
  above 98%). Every weight the CV uses must be loaded in `app/layout.tsx`; a faked weight renders
  at different widths on different systems.
- **Never commit a phone number.** The public PDF has none. `CV_PHONE="…" npm run cv:private`
  writes a copy with it to `private/` (gitignored) for sending directly.
- Same copy rules as the site: true statuses, no em dashes, specific results. Links come from
  `LINKS` in `stops.ts`, so they can't drift from the site.
- **View, then download.** Every CV button on the site says "View CV" and opens the viewer
  (`src/cv/CvViewer.tsx`) over the board: the CV on the site's own desk, with Download PDF in its
  bar. `/#cv` opens it directly; `/cv` is the same design as a standalone page. The sheet itself
  is `src/cv/CvSheet.tsx`, shared by the viewer, the page and the PDF.

**Adding a stop**: add it to `stops.ts` (cluster, `r`, `m`, `nav`, copy). **Adding a project
part**: add it to `FRUNT_PARTS` / `MGK_PARTS` in `products.ts`. **Moving things**: everything on the
board is in board pixels; the world is 4760 × 6310 (`WORLD` in `stops.ts`).
Frame labels stay the same size on screen but never grow past ~155 board px (`.flabel` in `globals.css`), so keep at least that much clear
space above every frame, or a zoomed-out overview lays the label over the frame above.

### Live data (do not break)

- **Skills**: `Skills.tsx` fetches `skills.json` and `tests.json` from
  `https://raw.githubusercontent.com/MattKay02/skills/main/` in the browser. Matthew's
  publishing loop depends on this: adding a skill to the skills repo must show here with no
  change to this repo. Keep the fetch contract and the snapshot fallback. Each skill's `step`
  (plan, decide, build, check, ship) picks its column under How I work; `evidence`
  (`{ image, dark?, caption }`) shows real output on its card, drawn at the card's size
  (404 × 196) in both looks, with the caption as its alt text. Without evidence the card shows
  `flow` (in, does, out). The test line comes from `tests.json`, which the skills repo
  generates from its eval results; never type it by hand.
- **GitHub graph**: built from `src/data/github.json`. Every Vercel build refreshes it (needs a
  `GITHUB_TOKEN` env var on Vercel; without one the committed snapshot is used), and
  `.github/workflows/daily.yml` triggers a rebuild each day through a Vercel deploy hook
  (`VERCEL_DEPLOY_HOOK` secret). Only per-day counts are stored.
- **Product screens**: today they're static files in `public/work/`. The plan for screens that
  update themselves is `docs/screens-feed.md` (implemented in the product repos, not here).

### Verify before saying it's done

`npm run build` passes (TypeScript included). Check the dev server at desktop width and at 390px
(phone), with no console errors. Check reduced motion when touching animation. The `run` and
`lighthouse-audit` skills cover launching and performance checks.

## Read by machines (search engines, AI tools, link previews)

Everything here is generated from the same data as the page; never hand-write any of it.
- **Text version**: `TourText.tsx` puts every stop's words (the panel only renders the current
  one), the parts and the links into the HTML, visually hidden. The hero's `h1` reads "Matthew
  Kay" (the visible "Kay" is a separate element).
- **Structured data**: `src/seo/describe.ts` → JSON-LD on the homepage (ProfilePage, Person,
  MGKCodes as Organization, frunt / Run / Lift as SoftwareApplication with live stores).
- **`/llms.txt`**: the same module, as Markdown for AI tools (llmstxt.org). robots.txt allows
  everyone and points to it.
- **Share image**: `app/og/page.tsx` (real CSS, light Paper), photographed at 1200 × 630 into
  `/og.png` on every deploy by `scripts/build-og.mjs`; used for Open Graph and X cards.
- Canonical URLs on `/` and `/cv/`; `sitemap.xml` lists both.
- **Case-study README visuals**: `app/readme/<product>/` lays out fixed-size canvases from the
  board's own pieces (Apple frames, part tiles, live store status). `scripts/build-readme.mjs`
  photographs each in light and dark at 2x into `/readme/<product>/<name>-<theme>.png`, and the
  case-study READMEs on GitHub (e.g. `MattKay02/frunt`) link to those URLs with `<picture>`, so
  their images keep this design and stay current with no commits to those repos.

## Statuses are never typed by hand

Nothing on the site or CV may go out of date on its own: no "in review", "next", version numbers
or release dates in copy. Which apps are **live**, and which store buttons show, comes from
`src/data/stores.json`, written by `scripts/fetch-stores.mjs` (`npm run stores`) from Apple's
lookup API and the Google Play listings, on every deploy (daily). App facts (store ids, icons,
websites) live in `src/data/apps.json`. An app reads "Live · actively updated" once any listing is
live, otherwise "In development". Lift's App Store page only counts from version 2.0.0, because
until then it still carries Liftio 1.4. The CV's "Live on …" wording uses the same data
(`liveOn()` in `src/workbench/apps.tsx`). On the page, each app is one compact `AppRow`: its
icon, name and status, then logo-only buttons (Apple, Google Play, a globe for the website), each
with a hover title and an `aria-label`. The dashed case-study placeholders are hidden
(`SHOW_SLOTS` in `stops.ts`) until the first case study exists.

## Facts (keep true; re-check before launch)

- **frunt**: live SaaS. Manager web app; staff app on the App Store (June 2026) and Google Play.
  Instagram studio live since 21 Sep 2026. **WhatsApp is built but switched off; never list it as
  live.** Admin console and outreach + analytics are internal: no admin screenshots until they
  can be captured from the demo restaurant, never a real customer's data.
- **MGKFitness**: Run and Lift are both live on Google Play (Lift since 6 Oct 2026). Their App
  Store listings show up on the site by themselves once Apple approves them (Run was in review on
  5 Oct). Lift is the Flutter rebuild of Liftio; its App Store page still carries Liftio 1.4 until
  Lift 2.0 ships (Liftio's backend stopped working in Aug 2026, so never present Liftio as live). Repo public by 11 Oct 2026. mgkfitness.mgkcodes.com has no tracking.
- **Other work**: Ledger, MSA (client), Red Cross (client), YouTube clone and Netflix clone
  (practice), FootyScores.

## Open decisions

- **Positioning line**: the hero's "Product engineer. I design and build polished apps, end to
  end." is still a draft. Titles are settled by purpose: the **CV** (and this site, which is
  also for getting hired) leads with the role he's applying for, **Product Engineer** (swap to
  "Software Developer" for general junior roles); **LinkedIn** stays "Founder of MGKCodes",
  because that's what he does now. Don't try to make them match.
- **Domain and hosting: decided.** **matthewkay.dev** (bought 5 Oct 2026, Cloudflare Registrar;
  DNS in Cloudflare, DNS-only records pointing at Vercel, which issues the certificate). Moved
  from GitHub Pages to Vercel on 6 Oct 2026 after GitHub never started its certificate request;
  Vercel is where Matthew hosts everything else. GitHub Pages keeps matthewkay.dev as its custom
  domain only so old mattkay02.github.io links redirect there. `.dev` is HTTPS-only.
- **Case studies**: the dashed "Case study" and "What I learnt" slots. Agreed format: what I made
  → why → what I aimed for → challenges and decisions → where it landed → what I learnt.
- **How I work** and **About** are first ideas.
- **CV numbers**: deliberately none for now (Matthew, 5 Oct: "nothing yet worth putting on").
  Don't push for metrics; suggest them only when a real milestone lands (e.g. Run's first month
  in the stores, several restaurants on frunt), as totals only.
- **Accessibility / SEO**: the tour exists as hidden text (`TourText.tsx`); a visible plain list
  view of the work alongside the board is still an option.

## Developer

Matthew Kay · github.com/MattKay02 · mgkcodes.com · mattykay2002@gmail.com ·
linkedin.com/in/matthew-kay- · x.com/mattykay2002

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
