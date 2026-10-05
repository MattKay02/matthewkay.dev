# Matthew Kay · Portfolio

The personal portfolio of **Matthew Kay**, software engineer and founder of
[MGKCodes](https://mgkcodes.com).

It's built as a **workbench**: one board of real, shipped work that a camera moves across as
you scroll. A guide panel tells the story stop by stop, so the page reads well even if you just
scroll straight through. Click a frame to jump to it, click a part of a product to look closer,
or drag to look around.

🔗 **Live:** [mattkay02.github.io](https://mattkay02.github.io)

## What's on the board

- **frunt**, the main project: a live SaaS that turns a restaurant's own documents into staff
  training and answers that cite their source. Shown with its manager app, staff app, website
  and the parts that run the business around it.
- **MGKFitness**: Run and Lift, two Flutter apps on one account, and the rebuild of Liftio.
- **Other work**, **How I work** (including the Claude Code skills I've built, read live from
  [my skills repo](https://github.com/MattKay02/skills)), **About** and **Contact**.
- The hero carries my **GitHub contribution graph**, refreshed daily.
- My **CV** is generated from the same repo: [`src/data/cv.ts`](src/data/cv.ts) renders
  [`/cv`](https://mattkay02.github.io/cv/), and every deploy prints it to `/cv.pdf`, dated by
  when the CV last changed.

## Design

Light, greyscale and precise: a 12-column grid, measured type, and colour that only ever comes
from the work itself. Devices use Apple's official product bezels, shown the way Apple's
marketing guidelines ask. See [`docs/design-system.md`](docs/design-system.md).

## Tech

Next.js 16 (App Router) · TypeScript · React 19 · static export to GitHub Pages.
See [`docs/architecture.md`](docs/architecture.md) for how the camera, the board and the live
data work.

## Local development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # static site in out/
npm run cv        # print the CV to out/cv.pdf (after build)
npm run github    # refresh the contribution graph and the skills snapshot
npm run preview   # serve out/ locally
```

## Deployment

Pushes to `main` deploy to GitHub Pages through
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which also rebuilds once a day
so the contribution graph stays current. Pull requests run a build check
([`ci.yml`](.github/workflows/ci.yml)).

## License

ISC © Matthew Kay · [github.com/MattKay02](https://github.com/MattKay02) ·
[mgkcodes.com](https://mgkcodes.com)
