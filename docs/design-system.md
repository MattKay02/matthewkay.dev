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

## Looks

Three token sets on `<html data-style>`. **Paper** is the default and has no attribute.

| Token | Paper | Studio | Brutalist |
|---|---|---|---|
| `--bg` | `#ebebeb` | `#101010` | `#0a0a0a` |
| `--surface` | `#ffffff` | `#1a1a1a` | `#1a1a1a` |
| `--strong` (headings, primary) | `#0d0d0d` | `#f3f3f3` | `#f5f5f5` |
| `--text2` (secondary text) | `#3a3a3a` | `#c8c8c8` | `#cccccc` |
| `--muted` (labels) | `#6a6a6a` | `#8c8c8c` | `#858585` |
| `--line` (hairlines) | 10% black | 9% white | `#333333` |
| Radii (`--r-art` / panel / buttons) | 10 / 16 / pill | same | 0 |
| Labels | Inter, sentence case | same | IBM Plex Mono, uppercase |
| Shadows | soft | deep | none |

Other tokens: `--dim` (opacity of clusters that aren't current), `--img-off` (the greyscale
filter on screens), `--hm0`–`--hm4` (contribution graph levels), `--colfill` (layout grid).

## Typography

- **Display**: Space Grotesk 500 (Paper, Studio) or 700 (Brutalist), tight tracking, line-height 0.82
  on board titles.
- **Body**: Inter 400/500.
- **Data**: IBM Plex Mono for measurements, URLs, tech lists and graph labels.
- **Two-line headings** on the board: a solid line (`Title`), then a larger offset second line
  (`Title outline`): grey fill in Paper and Studio, an outline in Brutalist. Large watermark words
  behind work use `Title bg`.

## The hero grid

12 columns, **103px wide with 24px gutters**, starting at x 130 (a 127px pitch). The name takes
columns 1–8, "Kay" starts on column 4, the photo takes 10–12, the contribution graph spans all 12,
and the icon links sit one per column (a 96px button plus a 31px gap is one column). Guides,
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

Below 760px the guide panel becomes a bottom sheet, the minimap and look switch are hidden, and
each stop's phone rect (`m`) frames a smaller area, usually a phone screen, so it reads on a
phone.
