# Architecture

How the workbench is built, where its data comes from, and how it ships.

## Stack

- **Next.js 16** (App Router) with **TypeScript**, built as a **static export** (`output: 'export'`)
  into `out/` and served by **GitHub Pages**.
- **React 19** renders the board and the guide panel; a small imperative controller
  (`src/workbench/controller.ts`) drives everything that changes every frame.
- **Global CSS with tokens** (`app/globals.css`). Three looks (Paper, Studio, Brutalist) are token
  sets switched by `data-style` on `<html>`.
- **next/font** for Space Grotesk, Inter and IBM Plex Mono. **react-icons** for link icons.

## Structure

```
app/layout.tsx            fonts, metadata, and an inline script that applies a saved look before paint
app/page.tsx              <Workbench />
app/globals.css           tokens + all styles
src/workbench/stops.ts    the tour (13 stops): cluster, camera rects, panel copy
src/workbench/Board.tsx   the board in board pixels; FRUNT_PARTS / MGK_PARTS data
src/workbench/parts.tsx   Frame, Title, Note, SlotBox, MacBook, IPhone, Browser, Tile, Shot, …
src/workbench/Skills.tsx  skills shelf (live skills.json)
src/workbench/controller.ts  camera, rotation, focus, minimap, measurements, input
src/workbench/Workbench.tsx  React shell: top bar, guide panel, minimap, stage
src/data/                 github.json and skills.json snapshots (generated)
scripts/fetch-github.mjs  refreshes both snapshots
public/work/              board images and the Apple frames
```

## The board and the camera

The board (`.world`) is one absolutely positioned element, **4760 × 4900 board pixels**. Every
item on it is placed in board pixels. The camera is a single CSS transform on the board:
`translate3d(tx, ty, 0) scale(z)`.

**Scroll drives the camera.** The page has a tall spacer (`#track`) and the stage is fixed. Each
stop gets `HOLD` (0.6 of a screen) of scroll where the camera rests, then `TRAVEL` (1 screen) to
the next stop. `pose(scrollY)` returns the current stop and how far along the move is.

**Framing.** Each stop has a rect `r` (desktop) and optionally `m` (phones). `fit()` scales the
rect into the free area of the screen: right of the guide panel on desktop, above the bottom
sheet on phones. Moves ease in and out, interpolate zoom in log space, and pull back mid-flight
on long moves so the visitor can see where they're going.

**Smoothing.** The rendered camera eases toward the target each frame. While it moves, the board
gets `will-change: transform`; at rest it's removed so text re-rasterises sharp.

**Reduced motion.** Moves become cuts, laptops don't rotate, the "Matthew" cursor stays still.

## What happens at each stop

`select(i)` runs when the current stop changes:

- elements with `data-c` matching the stop's cluster get `.on`; everything else dims
  (`--dim`), except devices, which stay as supplied (only their screen content dims);
- the minimap highlights the cluster;
- a stop can `lock` a rotating MacBook to one screen (the frunt "sourced answers" stop locks the
  manager app to Ask frunt, which carries the annotation);
- React is told the new index (`onStop`) and re-renders the guide panel.

## Interaction

- **Click a frame** in another cluster to jump to its first stop.
- **Click a part** (a tile, a browser window, or a chip in the guide panel) to focus it: the
  camera fits that part's `data-focus` rect (`"x,y,w,h"`, or `"self"` for the element's own box)
  until the page scrolls on by more than 30px. Escape clears it.
- **Drag** (mouse only) to look around; the offset springs back on release.
- **Keys**: ← → move between stops.
- **Minimap**: cells come from the `.frame` elements; clicking one jumps to that cluster.
- **"You" tag** follows a mouse pointer over the board; hidden on touch devices.

## Rotating MacBooks

A `MacBook` with several slides rotates every 3.4s while its cluster is current, crossfading
over the previous slide (no flash of the screen behind). It pauses on hover and for 9s after a
dot is clicked. The label above it updates with the slide title.

## The hero's measurements

Everything in the hero is measured from the real type after fonts load (and again when the look
changes): the name's width, the cap-height and baseline (a zero-size inline probe plus canvas
`measureText`), and the gap to the photo. The photo's top edge is placed on the cap-height line.
If a look's type is too wide (Brutalist is uppercase), the name is scaled so at least one
column stays clear before the photo.

## Live data

- **Contribution graph**: `scripts/fetch-github.mjs` queries GitHub's GraphQL API
  (`contributionsCollection.contributionCalendar`) with `GITHUB_TOKEN` in CI or the `gh` CLI
  locally, and writes per-day counts only to `src/data/github.json`.
- **Skills**: `Skills.tsx` fetches the skills repo's `skills.json` in the browser and falls back
  to the committed snapshot. Adding a skill to the skills repo shows it here with no change to
  this repo; keep that contract.
- **Product screens** are static files for now. `docs/screens-feed.md` specifies how the products
  will publish screens that update themselves.

## The CV

`src/data/cv.ts` holds the CV as typed data. `src/cv/CvSheet.tsx` renders it as an A4 sheet
(`src/cv/cv.css`). It appears in three places: the viewer over the workbench (`CvViewer`, opened by
every "View CV" button or `/#cv`, with Download PDF in its bar), the standalone `/cv` page (same
design), and the PDF. The "Updated" date comes from `git log` for `cv.ts` at build time
(`src/cv/updated.ts`, server-only, passed down from `app/page.tsx`), so it tracks content changes,
not daily rebuilds (the deploy checks out full history for this). While the viewer is open,
`html.cv-open` locks page scroll and the camera ignores the arrow keys. `scripts/build-cv.mjs` then serves `out/`, opens `/cv/` in headless Chromium (Playwright)
with print styles, checks the content fits one A4 page, and prints `out/cv.pdf`. Locally it also
copies the PDF to `public/cv.pdf` (gitignored) so the dev server can serve it. With `--private`
and `CV_PHONE` set, it fills the hidden phone slot and writes `private/Matthew_Kay_CV.pdf`
instead; that copy is gitignored and never deployed.

## Build and deploy

- `npm run dev` · `npm run build` (→ `out/`) · `npm run github` · `npm run preview`
- `deploy.yml` runs on push to `main` and **daily**: `npm ci` → `npm run github` (allowed to
  fail; the committed snapshots are used) → `npm run build` → install Chromium → `npm run cv` →
  upload `out/` → GitHub Pages.
- `ci.yml` builds every pull request into `main` and prints the CV, so an overflowing CV fails
  the check.
- **`main` auto-deploys**: do feature work on a branch.
