# Design system

The visual language of the workbench. The intent lives in the root `CLAUDE.md`; this is the
practical reference. Everything is defined in [`app/globals.css`](../app/globals.css).

## Principles

- **Greyscale UI; colour comes from the work.** Screens are greyscale until their project is
  the current stop or the pointer is over them.
- **Neat and precise.** Grids, alignment, measured spacing, and the vocabulary of design tools:
  selection frames, guides, measurements. No scrapbook devices (tape, sticky notes, handwriting,
  random tilts).
- **The board shows; the panel tells.** Words that matter live in the guide panel as real text,
  readable at any zoom.

## Themes

One design, **Paper**, in two themes. Light is the default (no attribute); dark is
`<html data-theme="dark">`, set by the sun/moon toggle in the top bar, remembered in localStorage
(`wb-theme`) and applied before first paint by the script in `app/layout.tsx`. Dark only changes
colour tokens; radii, type, labels and layout are the same.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#ebebeb` | `#101010` |
| `--surface` | `#ffffff` | `#1a1a1a` |
| `--strong` (headings, primary) | `#0d0d0d` | `#f3f3f3` |
| `--text2` (secondary text) | `#3a3a3a` | `#c8c8c8` |
| `--muted` (labels) | `#6a6a6a` | `#8c8c8c` |
| `--line` (hairlines) | 10% black | 9% white |
| Radii (`--r-art` / panel / buttons) | 10 / 16 / pill | same |
| Shadows | soft | deep |

The CV sheet stays white in both themes: it's a document. The phone browser's toolbar colour
(`theme-color`) follows the theme.

Other tokens: `--dim` (opacity of clusters that aren't current), `--img-off` (the greyscale
filter on screens), `--hm0`–`--hm4` (contribution graph levels), `--colfill` (layout grid).

## Typography

- **Display**: Space Grotesk 500, tight tracking, line-height 0.82 on board titles.
- **Body**: Inter 400/500 (600 for the CV's labels).
- **Data**: IBM Plex Mono for measurements, URLs, tech lists and graph labels.
- **Two-line headings** on the board: a solid line (`Title`), then a larger offset second line
  (`Title outline`) in a grey fill. Large watermark words
  behind work use `Title bg`.

## The hero grid

12 columns, **103px wide with 24px gutters**, starting at x 130 (a 127px pitch). The name takes
columns 1–8, "Kay" starts on column 4, the photo takes 10–12, the contribution graph spans all 12,
and the icon links sit one per column (a 64px icon with no circle plus a 63px gap is one
column), followed by the "View CV" button. Guides,
widths and gaps are measured from the rendered type, so the numbers shown are true.

## Components (`src/workbench/parts.tsx`)

| Component | Use |
|---|---|
| `Frame` | A cluster's outline on the board, with a label that stays the same size at any zoom. |
| `Title` | Display type: solid, `outline`, or `bg` watermark. |
| `Note` | A paper card for a problem statement or a decision record. |
| `MacBook` | Apple's MacBook Air frame; rotates through slides; optional overlay per slide (redline + tag). |
| `IPhone` | Apple's iPhone 18 Pro frame with a raw screen; caption above, or `below` with name + line. |
| `Browser` | A plain browser window for live websites; `long` scrolls the page on hover. |
| `Tile` | One part of a product: index, name, status (filled dot = live), one line, tech. Clickable. |
| `Shot` | A plain 16:10 screenshot card for smaller projects. |
| `AppRow` (`apps.tsx`) | One app on one line: its icon (32px in the panel), name, status dot, and logo-only buttons for each live store and the website. `.release` is the same row at board scale (64px icon) under each app's phones. |
| `SlotBox` | A dashed placeholder for content still to be designed (case studies). |
| `Step`, `PassionCard`, `Spec` | How I work, About, small annotations. |

## Devices

Apple's Product Bezels, used under Apple's marketing guidelines: shown as supplied, upright,
never overlapping each other or other elements, no added shadows or reflections, never animated
themselves, and at the correct relative scale within a group (iPhone ≈ 0.237 × MacBook width).
Screen content can change. Greyscale and dimming are applied to the screen content only.

- MacBook screen rect: 12.3529% / 12.8571% / 75.2941% / 74.2857% of the frame image; content
  starts 3.4255% down, below the notch.
- iPhone screen rect: 5.3333% / 2.5% / 89.3333% / 95%.

## Motion

- Camera moves ease in and out, pull back on long moves, and never change scroll speed.
- The guide panel's body slides in on each stop; MacBooks crossfade every 3.4s.
- The hero settles in on load (a 14px rise and fade, staggered).
- `prefers-reduced-motion`: cuts instead of moves, no rotation, no cursor animation.

## Responsive

| Width | Change |
|---|---|
| ≤ 1366px | The guide panel narrows to 380px. |
| ≤ 1280px | The minimap is hidden. |
| ≤ 1180px | The top-bar nav is hidden. |
| ≤ 1024px | The guide becomes a bottom sheet (at most 52% of the height); the kicker and hint are hidden; each stop's phone rect (`m`) frames a smaller area, usually a phone screen, so it reads on a phone or tablet. |
