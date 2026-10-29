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
pipeline, then three problems) → About → Contact. frunt is the main project and leads.

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
  screens with no baked-in frame or background. Annotations go next to a device, never on it: a
  rotating MacBook has named tabs with arrows either end and a counter under it (a visitor's click
  stops its rotation), and phone screens get numbered callouts above them with a leader line down
  (`Callout` in `parts.tsx`).
- **Each flagship opens with a project brief** (`Brief` in `parts.tsx`): the problem in Matthew's
  own words, what the product does in three numbered steps, and a facts line. The tour zooms to it,
  because board text is only readable when the camera frames it.
- **Other work** is plain screenshots in equal 16:10 boxes on a three-column grid (no laptops).
- **Readable where the camera stops.** At 1440 × 900 the board beside the panel is about 770px
  wide, so a stop framing more than about 1,500 board px across shows its text at under half
  size. Size what a stop is for to that stop (on the board: display lines 34px and up, body 21px
  and up, labels 16px and up), and split wide content into parts the camera frames one at a
  time (How I work's two columns). After a layout change, measure the on-screen text size at
  each stop, not just the look.
- **Motion carries meaning**: pin and play, never hijack scroll speed. Reduced motion means cuts,
  no rotation, no cursor animation. Phones get a bottom-sheet guide and framing that favours
  phone screens.
- **Touch devices get the light board** (`(hover: none) and (pointer: coarse)`): a board that isn't a
  GPU layer at rest, no frosted-glass blur, no wandering cursor, no fades and light shadows. iPhone
  Safari stalled and crashed on the full version (6 Oct 2026). Between stops the board glides as one
  CSS transition (GPU); the first glide is timed, and a phone that can't keep up (or crashed mid-glide,
  marked by `wb-glide: trying` in localStorage) gets a directional slide instead, for good. **Explore
  the board** (on the whole-board stop, touch only) opens a pinch-and-drag picture of the whole board,
  photographed on every deploy (`npm run board`). The camera loop writes to the page only when a value
  changes, so a resting page does no work.
- **The phone guide card never needs scrolling** at iPhone 13 Pro size with Safari's bar showing
  (390 x 664): chip lists are one sideways-swipe row, the skills install line and the Intro's link
  icons are hidden on phones, and Back/Next stay pinned to the card's bottom. Re-check all stops at
  that size when adding copy to a stop. The iPhone SE (375 x 553) still has four stops that scroll
  (the Intro, frunt's whole system and both case-study stops, 29 Oct 2026); fixing them means
  cutting copy, so it's Matthew's call.
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
  Skills.tsx           How I work: the pipeline (steps, a row per skill) and three stories (problem,
                       skill, real output); read live from the skills repo's skills.json and
                       tests.json (useSkills)
  skills-data.ts       the skills snapshots, types and text helpers (server-safe, used by
                       TourText and /llms.txt as well as the board)
  controller.ts        the camera and everything per-frame (imperative; returns destroy())
  Workbench.tsx        React shell: top bar, guide panel, minimap, stage
  apps.tsx             app statuses and AppRow (icon, name, status, store and website buttons)
  screens.ts           product screens by product + id, from the products' feeds (saved copy as fallback)
  icons.tsx            link icons and the MGKCodes monogram
  Explore.tsx          Explore the board: the whole-board picture to pinch and drag (touch screens)
app/cv/page.tsx        the CV page (dev, previews and CV_BUILD=1 only; the 404 on the public site)
app/work/<slug>/page.tsx the case studies as standalone pages: frunt, mgkfitness (404 until published)
src/case-studies/      types.ts (the CaseStudy shape), frunt.ts + mgkfitness.ts (each case study
                       as data), boards.ts + frunt-board.ts + mgk-board.ts (each "how it was built"
                       stop's milestones + decisions), flags.ts (published?), format.ts (dates),
                       CaseStudySheet, CaseStudyViewer (viewer over the board + page shell),
                       case-study.css
src/cv/                CvSheet (the A4 CV), CvPage (the page shell), flags.ts (SHOW_CV),
                       updated.ts (git date of cv.ts), cv.css
src/seo/describe.ts    JSON-LD and /llms.txt, built from the same data as the page
src/data/
  cv.ts                Matthew's CV as data: the single source for /cv and the PDF
  github.json          contribution calendar (generated)
  skills.json          skills manifest snapshot (generated; the live fetch overrides it)
  skill-tests.json     the skills' eval results snapshot (generated; same)
  apps.json            app facts: names, icons, store ids, websites (edited by hand)
  stores.json          which store listings are live (generated)
  frunt-stats.json     frunt's build figures + latest answer-accuracy run (generated)
  mgk-stats.json       MGKFitness's build figures + which apps the coach checks consent for (generated)
  screens.json         each product's bare screens, from its /studio.json (generated)
scripts/fetch-github.mjs   refreshes the graph and skills snapshots: `npm run github`
scripts/fetch-stores.mjs   checks the App Store and Google Play: `npm run stores`
scripts/fetch-frunt.mjs    counts frunt's figures from its repo: `npm run frunt`
scripts/fetch-mgk.mjs      counts MGKFitness's figures from its public repo: `npm run mgk`
scripts/fetch-screens.mjs  reads the products' screens: `npm run screens`
scripts/build-cv.mjs       builds with the CV in it and prints /cv to out/cv.pdf: `npm run cv`
scripts/build-og.mjs       photographs /og/ to out/og.png after a build: `npm run og`
scripts/build-board.mjs    photographs the whole board to out/board-{light,dark}.jpg: `npm run board`
scripts/build-readme.mjs   photographs the README visuals (light + dark, 2x): `npm run readme`
scripts/headless.mjs       shared by both: serves out/ and launches headless Chrome
scripts/vercel-*.sh        Vercel's install and build steps (see vercel.json)
workers/cv-request/        hello@matthewkay.dev's email worker: forwards all mail, attaches the CV to CV requests
.github/workflows/cv.yml   prints the private CV into R2 for that worker (cv.ts changes and daily)
vercel.json                also the bios' short links: /ig /th /x /tt /in go to social.mgkcodes.com/go/matt-*,
                           which counts the click for the desk and lands on /connect (or / for LinkedIn)
public/work/           every image on the board, the Apple frames and the app icons
docs/                  architecture, design system, screens-feed spec, storyboard history
```

**Commands**: `npm run dev` (dev server, http://localhost:3000) · `npm run build` (static site in
`out/`) · `npm run cv` (build with the CV in it, then print the PDF) · `npm run cv:private` (copy with phone
number, see below) · `npm run github` (refresh contribution graph + skills snapshot) ·
`npm run stores` (refresh store statuses) · `npm run frunt` (refresh frunt's figures; says
which frunt decision records are newer than the case study) · `npm run mgk` (the same for
MGKFitness) · `npm run screens` (refresh the
products' screens) · `npm run og` (share image; run
after build) · `npm run preview`.

### The CV is code

`src/data/cv.ts` is the **only** source of Matthew's CV. `/cv` renders it as an A4 page and
`scripts/build-cv.mjs` prints that page to a PDF, stamped "Updated" with the date `cv.ts` last
changed in git, not the build date (from GitHub's API when the build's clone is shallow, as on
Vercel). To update the CV: edit `cv.ts`, commit, push; CI and the Vercel preview print it on the
pull request. Rules:

- **Never on the public site** (Matthew, 27 Oct 2026: AI tools looking up frunt were reading the
  CV, including "looking for a junior role" next to frunt). Every CV button says "Request CV" and
  opens an email (`CV_REQUEST` in `stops.ts`); Matthew replies with the PDF from
  `npm run cv:private`. `/cv` exists only in dev, on Vercel previews (behind Vercel's login) and
  with `CV_BUILD=1` (`SHOW_CV` in `src/cv/flags.ts`); on the public site it's the 404, `noindex`,
  and there's no `/cv.pdf`. The page is a server component so the CV's text never reaches a
  script bundle; keep it that way (no `'use client'` on anything that imports `cv.ts`). The search
  data and `/llms.txt` describe Matthew with `SUMMARY` in `src/seo/describe.ts`, never
  `cv.profile`. After a change, check the production build: `grep -r "De La Salle" out/` must
  find nothing.
- **One A4 page.** The CV build fails, with how many pixels it's over, if it overflows. Trim
  content rather than shrinking type. Vercel prints it on Linux, where text can wrap a little
  differently, so keep a few percent spare locally (the script reports the real fill and warns
  above 98%). Every weight the CV uses must be loaded in `app/layout.tsx`; a faked weight renders
  at different widths on different systems.
- **Never commit a phone number.** `$env:CV_PHONE="…"; npm run cv:private` (PowerShell) writes
  the copy to send, with it, to `private/` (gitignored).
- Same copy rules as the site: true statuses, no em dashes, specific results. Links come from
  `LINKS` in `stops.ts`, so they can't drift from the site.
- Old `/#cv` links land on the Contact stop, next to Request CV. The sheet is
  `src/cv/CvSheet.tsx`, shared by the page and the PDF.
- **A CV request lands in Matthew's inbox with the CV attached.** Request CV emails
  hello@matthewkay.dev (subject "CV request"). `workers/cv-request`, the email worker on that
  address, forwards every email as a plain rule would, and for a CV request also sends Matthew
  a note (who asked, what they wrote) with the latest private CV attached. He answers them
  himself: nothing is ever sent to the person asking, so bots and AI tools never get the CV.
  `.github/workflows/cv.yml` keeps that CV current (on a `cv.ts` change and daily, as the
  "Live on" lines follow the stores): it prints `npm run cv:private` with the `CV_PHONE`
  secret into the private R2 bucket `matthewkay-cv`, never as a workflow artifact (the repo is
  public). The worker's `FORWARD_TO` (his inbox) is a worker secret, never in this repo.
  `npm test` in `workers/cv-request` covers the rules; `wrangler dev` runs it locally.

### Case studies are code

`src/case-studies/frunt.ts` is the **only** source of the frunt case study (approved by Matthew,
6 Oct 2026). It renders as `CaseStudySheet`, opened over the board by "Read the case study" on the
**frunt: how it was built** stop (and by `/#frunt`), and as the standalone `/work/frunt`. That
stop shows a dated ruler of milestones on the board (`frunt-board.ts`) and three decisions in the
panel. Format: TL;DR, what I made, why, what I aimed for, timeline, challenges and decisions
(dated cards with their ADR numbers), where it landed, how I build it with AI, what I learnt.

- **Publishes itself when the fix is live.** `FRUNT_PUBLISHED` in `flags.ts` is true once
  frunt's answer-accuracy eval passes its whole safety floor in a record on frunt-web's **`main`**
  (read by `npm run frunt`), i.e. the allergen-gate fix (MGKCodes/frunt-web#61) is in production.
  Until then it is hidden: the stop, the viewer and
  the page exist only in `npm run dev` and on Vercel preview deployments, which sit behind Vercel's
  login (the bar says "draft, not published"); the production site has
  none of them, `/work/frunt/` renders the 404 with `noindex`, and the case study's text is never
  in the build (it's passed from `app/page.tsx` only while visible). The board stop's short strings
  (`frunt-board.ts`) are in the JS bundle regardless, unrendered, so only public-ready copy goes there.
- **Why it's hidden (Matthew, 6 Oct):** the case study quotes the answer-accuracy eval *after* the
  allergen-gate fix in frunt-web (`docs/allergen-gate-unmatched-dish.md` there), with "the eval's
  first run found a real safety gap" as a decision card.
- **Figures are counted, never typed**: `npm run frunt` (and every Vercel build) counts decision
  records, API routes, migrations and test files from frunt-web's `main`, and reads the latest eval
  record (`evals/answers/results/latest.json`, main or develop), into `src/data/frunt-stats.json`.
  frunt-web is private, so on Vercel this uses its own token, `FRUNT_GITHUB_TOKEN`: a fine-grained
  token that can only read `MGKCodes/frunt-web` (Contents: read), kept apart from `GITHUB_TOKEN`
  so the graph's token stays permission-free. Without it the committed snapshot is used. The
  page prints the date and commit the figures were counted at.
- **Keeping it true:** `checked` is the day the words were last verified against frunt, and
  `lastAdrRead` the last frunt decision record read. To update, read frunt-web's ADRs after
  `lastAdrRead` and its commits after `checked`, then move both. `npm run frunt` lists the newer
  records. Statuses still come from `stores.json`; same copy rules as the site.

**Publishing (frunt):** automatic once the passing eval record is on frunt-web's `main` and this
site rebuilds (daily, or any deploy). When it goes public, check desktop + 390px + dark, and point
the `MattKay02/frunt` README at `/work/frunt/`. `/work/frunt/` joins the sitemap by itself
(`app/sitemap.ts`).

**MGKFitness** (`src/case-studies/mgkfitness.ts`, `/work/mgkfitness`, `/#mgkfitness`, the
**MGKFitness: how it was built** stop) is the second, in the same format and the same machinery:
`CaseStudy` (`types.ts`) takes several `apps`, its own `figures`, `shot` and `source`, and every
study's stop is `extra: 'case'` with a `study` slug into `CASE_BOARDS` (`boards.ts`).

- **A draft until two things are true** (`MGK_PUBLISHED` in `flags.ts`): Matthew approves the copy
  (`MGK_APPROVED`, true: Matthew read and approved it on 29 Oct 2026), and the coach checks AI
  consent at the server for **both** apps. Its consent card says so, and Matthew chose to wait for
  both (27 Oct). `npm run mgk` reads `CONSENT_KEYS` in `supabase/functions/coach/consent.ts` on
  mgk-fitness's `main`: Run's check went live in production on 27 Oct (coach v37,
  MGKCodes/mgk-fitness#9) but reaches `main` with the next release; Lift's comes with Lift 2.0.1
  (MGKCodes/mgk-fitness#10). Once both are on `main`, the next build publishes it.
- **Matthew's rules for its copy (27 Oct):** the story starts at Run (25 Jul 2026), Liftio is
  background. Competitors' prices, never their names (re-check them). Never "I wanted one app",
  never one subscription for the suite (Run and Lift each have their own), and never that one app
  reads the other's training.
- **Figures**: `npm run mgk` (every build) counts decision records (Run's and Lift's sets),
  test files, migrations and Edge Functions on mgk-fitness's `main` into `src/data/mgk-stats.json`.
  The repo is public, so `GITHUB_TOKEN` (or none) is enough. Keeping it true works as for frunt:
  `lastAdrRead` is `'Run NNNN and Lift NNNN'`, and `npm run mgk` lists newer records.
- **Phones:** every case stop's card (title, body, three decisions, the button) must fit at
  390 x 664 with Back and Next pinned; the decision list is tighter there (`.calls` in the phone
  block of `globals.css`). Re-measure when the copy changes.

**Adding a stop**: add it to `stops.ts` (cluster, `r`, `m`, `nav`, copy). **Adding a project
part**: add it to `FRUNT_PARTS` / `MGK_PARTS` in `products.ts`. **Moving things**: everything on the
board is in board pixels; the world is 4760 × 6310 (`WORLD` in `stops.ts`).
Frame labels stay the same size on screen but never grow past ~155 board px (`.flabel` in `globals.css`), so keep at least that much clear
space above every frame, or a zoomed-out overview lays the label over the frame above.
**Keep big elements off the board.** Size every drawing to its content (`Wire` in `Board.tsx`),
never to the board: anything that overlaps the hero's intro animation and sits above it gets its own
GPU layer in Safari, and two board-sized SVGs crashed iPhones on 6 Oct 2026. Board images are
`loading="lazy"` except the hero photo.

### Live data (do not break)

- **Skills**: `Skills.tsx` fetches `skills.json` and `tests.json` from
  `https://raw.githubusercontent.com/MattKay02/skills/main/` in the browser. Matthew's
  publishing loop depends on this: adding a skill to the skills repo must show here with no
  change to this repo. Keep the fetch contract and the snapshot fallback. Each skill's `step`
  (plan, decide, build, check, ship) puts it as a row under that step of How I work's pipeline.
  `featured` (1 to 3) and `problem` (one plain sentence: the problem that made it) tell its story
  in the right-hand column, with its `evidence` (`{ image, dark?, caption }`): real output from a
  real run, drawn at 404 × 196 (rendered 3x) in both looks, with the caption as its alt text and
  in the text versions. A story without evidence shows `flow` (in, does, out); with nothing
  featured, the skills with evidence are told. Picking the stories is done in the skills repo,
  never here. The test line comes from `tests.json`, which the skills repo generates from its
  eval results; never type it by hand.
- **GitHub graph**: built from `src/data/github.json`. Every Vercel build refreshes it (needs a
  `GITHUB_TOKEN` env var on Vercel; without one the committed snapshot is used), and
  `.github/workflows/daily.yml` triggers a rebuild each day through a Vercel deploy hook
  (`VERCEL_DEPLOY_HOOK` secret). Only per-day counts are stored.
- **frunt figures**: `src/data/frunt-stats.json`, refreshed by `npm run frunt` on every Vercel build
  (see "Case studies are code"). Counts of paths only; no code or business data leaves frunt-web.
  MGKFitness's (`mgk-stats.json`, `npm run mgk`) work the same way, from its public repo.
- **Product screens update themselves** (`docs/screens-feed.md`). Each product keeps its bare
  screens in its own `public/screens/` and lists them by id in its `/studio.json`;
  `npm run screens` (every build) reads them into `src/data/screens.json` and the board loads each
  image from the product's site. **Never put a product screenshot into this repo to update it**:
  recapture it in the product (replace the file, deploy) and it changes here, on the product's
  landing page and on mgkcodes.com. `public/work/` copies are only the fallback for an id a feed
  doesn't list or an image that didn't load at build. Liftio 1.4 stays saved (retired).

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
- A canonical URL on `/`; `sitemap.xml` lists it (and `/work/frunt/` once published). No CV
  (see "The CV is code").
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
  The staff Ask screen was recaptured from 1.2.0 on 25 Oct 2026 (frunt-web #112), after the
  over-citing fix of 28 Sep that the case study describes.
  Instagram studio live since 21 Sep 2026. **WhatsApp is live** (Matthew, 6 Oct 2026; the live
  webhook answers, it doesn't 404, so `WHATSAPP_ENABLED` is on in production). The rota and briefs
  are frozen in frunt (ADR 0076, 24 Aug 2026): never sell them on the board. Admin console and outreach + analytics are internal: no admin screenshots until they
  can be captured from the demo restaurant, never a real customer's data.
- **MGKFitness**: Run and Lift are live on both stores (checked 27 Oct 2026). Run: Google Play
  5 Oct, App Store 19 Oct (Apple rejected 1.0.0 on 16 Oct; 1.0.1 was approved). Lift: Google Play
  6 Oct, App Store 8 Oct as Lift 2.0, an update on Liftio's own listing. Lift is the Flutter
  rebuild of Liftio. The move to one backend (6 Aug 2026) retired Liftio 1.4's backend on purpose,
  so never present Liftio as live. One account and one backend serve both apps, but **neither app
  reads the other's training yet**: never say Lift sees your runs or the coach plans your whole
  week. Run and Lift each have their own subscription. Liftio 1.4 had 266 exercises. The repo has
  been public since 7 Oct 2026. mgkfitness.mgkcodes.com has no tracking, and its waiting list
  came down on 7 Oct.
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
  Vercel is where Matthew hosts everything else. `.dev` is HTTPS-only. **This repo is
  `MattKay02/matthewkay.dev`** (renamed from `MattKay02.github.io` on 6 Oct 2026). Old
  `mattkay02.github.io` links are caught by a separate tiny repo, `MattKay02/MattKay02.github.io`,
  whose `index.html` and `404.html` send every path to the same path on matthewkay.dev. GitHub
  Pages on this repo is no longer needed (switching it off is Matthew's to do).
- **Case studies**: frunt is public (its passing eval reached frunt-web's `main` on 14 Oct 2026).
  Its words were last checked on 6 Oct, and frunt has ADRs 0088 to 0094 since: refresh it.
  MGKFitness is approved (29 Oct 2026) and waits only on Lift's consent release (see "Case studies
  are code"). How I work next, in the same format and the same data-first way.
- **How I work** and **About** are first ideas.
- **CV numbers**: deliberately none for now (Matthew, 5 Oct: "nothing yet worth putting on").
  Don't push for metrics; suggest them only when a real milestone lands (e.g. Run's first month
  in the stores, several restaurants on frunt), as totals only.
- **Accessibility / SEO**: the tour exists as hidden text (`TourText.tsx`); a visible plain list
  view of the work alongside the board is still an option.

## Developer

Matthew Kay · github.com/MattKay02 · mgkcodes.com · mattykay2002@gmail.com ·
linkedin.com/in/matthew-kay- · x.com/matthewkaydev

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
