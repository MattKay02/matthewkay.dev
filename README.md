# Matthew Kay · Portfolio

The personal portfolio of **Matthew Kay**, software engineer and founder of
[MGKCodes](https://mgkcodes.com).

It's built as a **workbench**: one board of real, shipped work that a camera moves across as
you scroll. A guide panel tells the story stop by stop, so the page reads well even if you just
scroll straight through. Click a frame to jump to it, click a part of a product to look closer,
or drag to look around.

🔗 **Live:** [matthewkay.dev](https://matthewkay.dev)

## What's on the board

- **frunt**, the main project: a live SaaS that turns a restaurant's own documents into staff
  training and answers that cite their source. Shown with its manager app, staff app, website
  and the parts that run the business around it.
- **MGKFitness**: Run and Lift, two Flutter apps on one account, and the rebuild of Liftio.
- **Other work**, **How I work** (including the Claude Code skills I've built, read live from
  [my skills repo](https://github.com/MattKay02/skills)), **About** and **Contact**.
- The hero carries my **GitHub contribution graph**, refreshed daily.
- **App statuses are checked, not typed.** Every deploy asks the App Store and Google Play which
  listings are live, so an app shows as live, with a button for each store, the day it's approved.
- My **CV** is generated from the same repo: [`src/data/cv.ts`](src/data/cv.ts) renders
  [`/cv`](https://matthewkay.dev/cv/), and every deploy prints it to `/cv.pdf`, dated by
  when the CV last changed.

## Design

Light, greyscale and precise: a 12-column grid, measured type, and colour that only ever comes
from the work itself. Devices use Apple's official product bezels, shown the way Apple's
marketing guidelines ask. See [`docs/design-system.md`](docs/design-system.md).

## Tech

Next.js 16 (App Router) · TypeScript · React 19 · static export, hosted on Vercel.
See [`docs/architecture.md`](docs/architecture.md) for how the camera, the board and the live
data work.

## Local development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # static site in out/
npm run cv        # print the CV to out/cv.pdf (after build)
npm run github    # refresh the contribution graph and the skills snapshot
npm run stores    # check which App Store and Google Play listings are live
npm run preview   # serve out/ locally
```

## Deployment

Vercel builds every push: `main` goes to production at [matthewkay.dev](https://matthewkay.dev)
and every other branch gets a preview URL. The build ([`vercel.json`](vercel.json)) refreshes the
live data, builds the site and prints the CV. [`daily.yml`](.github/workflows/daily.yml) rebuilds
production once a day so the contribution graph and app statuses stay current, and pull requests
run a build check ([`ci.yml`](.github/workflows/ci.yml)).

## License

ISC © Matthew Kay · [github.com/MattKay02](https://github.com/MattKay02) ·
[mgkcodes.com](https://mgkcodes.com)
