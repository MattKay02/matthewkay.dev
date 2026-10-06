# Screens that update themselves

> **Built, 6 October 2026.** Replaces the 5 October draft (a separate
> `feed.json` per product). The products already published `/studio.json` for
> mgkcodes.com, so the screens ride on that instead: one file per product, one
> contract, two readers.

## The idea

Nobody updates a screenshot on this site by hand. **Each product keeps its bare
screens in one place and lists them in its `/studio.json`.** This site, the
product's own landing page and mgkcodes.com all show them from there, so
recapturing a screen in the product updates every site that shows it.

| Product | The one place | Listed by | Feed |
|---|---|---|---|
| frunt | `frunt-web/public/screens/` | `src/lib/studio-screens.ts` | `https://frunthospitality.com/studio.json` |
| MGKFitness | `mgk-fitness/web/public/screens/` | `web/app/studio.json/screens.ts` | `https://mgkfitness.mgkcodes.com/studio.json` |

Liftio 1.4 is retired; its screens never change and stay saved here.

## The contract

`studio.json` is mgkcodes.com's contract (`lib/studio.ts` in MGKCodes/MGKCodes,
version 1). Products add an optional top-level `screens`:

```json
"screens": [
  { "id": "ask", "surface": "web", "title": "Ask frunt",
    "src": "/screens/ask.webp", "width": 1280, "height": 720,
    "alt": "frunt answering a question about peanut allergen controls, citing three of the venue's documents" }
]
```

- **Bare screens only:** no device frame, no background, no headline. Every
  reader draws its own device (this site uses Apple's bezels; mgkcodes.com draws
  its own phone). `app.screens`, which mgkcodes.com reads, points at the same
  files.
- **An id is a promise:** it always means the same screen. Add ids freely;
  never reuse or rename one.
- `src` is relative to the product's site. `width` and `height` are the image's
  pixels, read from the file when the product builds.

The ids this site uses: frunt `home`, `ask`, `documents`, `training`,
`staff-ask`, `staff-training`; MGKFitness `lift-log`, `lift-plan`, `run-record`,
`run-plan` (it also lists `run-coach`, `lift-rest`, `lift-coach`).

## Recapturing

Replace the file in the product's `public/screens/` with the same name, and
deploy the product. Done: this site loads the image from the product's site, so
it changes as soon as the product deploys. A **new** screen is a new entry in
the product's list; it reaches this site with its next build (daily).

## This site's side

- `scripts/fetch-screens.mjs` (`npm run screens`, on every Vercel build) reads
  both feeds into `src/data/screens.json`. It checks every image loads before
  keeping it; a product it can't reach keeps its last snapshot.
- `src/workbench/screens.ts` hands the board a screen by product and id
  (`FRUNT_SCREENS`, `MGK_SCREENS`). When the feed doesn't list it, or its image
  didn't load at build, the saved copy in `public/work/` is used, so the board
  never shows a broken image.
- Anything measured on one particular screenshot (the redline on frunt's Ask
  screen) shows only on the saved copy, because a new capture moves what it
  points at.
- The case-study README visuals (`app/readme/frunt/`) use the same screens, so
  the READMEs stay current too.

## Later

- **Automatic capture:** a CI job in each product that captures from demo data
  (a demo restaurant for frunt, the preview builds for MGKFitness) on each
  deploy or release and commits the files to `public/screens/`, failing closed
  if any screen fails. The contract doesn't change.
- **Live embeds:** a "Try it live" overlay on a close-up, loaded only on
  request (an embedded page inside the zooming board would take the scroll).
  Needs `frame-ancestors` headers on the product side.
- **Content-hashed file names**, if caching ever becomes a problem.
