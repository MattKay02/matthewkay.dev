# Screens feed — spec

> **Draft, 5 October 2026.** The agreement between the products that publish
> their screens (frunt, MGKFitness) and the portfolio that shows them. Each
> product implements its side in its own repo and its own session; this file is
> the shared contract. Open decisions are at the bottom.

## Why

frunt and MGKFitness change constantly. The portfolio shows their screens, and
nobody should ever update those screenshots by hand. So each product captures
its own screens automatically whenever it ships, and publishes them at a fixed
address. The portfolio reads that address every time it loads.

Three layers:

1. **Screens that update themselves** (the default). Captured by the product's
   CI, published as a feed, read by the portfolio.
2. **Live embeds, on demand only.** A "Try it live" button on a close-up loads
   the real thing in a full-size overlay. Never on page load, never inside the
   zooming board (an embedded page takes the scroll wheel and stops the camera).
3. **Later: short clips** recorded by the same capture runs, played on hover.

**Who owns what.** Capturing, hosting and the feed belong to the product repos
(the MGKCodes side). The portfolio only reads public files. No secrets, logins
or customer data ever reach the portfolio repo.

---

## 1. The feed

Each product publishes **one JSON file** at a stable public URL:

```
<product feed base>/feed.json
```

```json
{
  "schema": 1,
  "product": "frunt",
  "generatedAt": "2026-10-05T14:02:11Z",
  "source": { "repo": "frunt-web", "commit": "abc1234", "version": "web" },
  "screens": [
    {
      "id": "ask",
      "title": "Ask frunt",
      "surface": "web",
      "src": "https://…/screens/frunt/ask.3f9a2c1e.webp",
      "width": 1440,
      "height": 900,
      "capturedAt": "2026-10-05T14:01:58Z",
      "alt": "Ask frunt answering a question about peanut allergen controls, citing three documents"
    }
  ],
  "embeds": [
    {
      "id": "landing",
      "title": "frunt website",
      "surface": "web",
      "url": "https://frunthospitality.com/",
      "width": 1440,
      "height": 900
    }
  ]
}
```

| Field | Rule |
|---|---|
| `schema` | `1`. Bump only for a breaking change to this format. |
| `id` | Lowercase kebab-case. **A promise:** an id always means the same screen. Never reuse an id for a different screen. |
| `surface` | `web` or `phone`. Tells the portfolio which frame and size to use. |
| `src` | Absolute URL of the image. **Content-hashed file name** (see Publishing). |
| `width`, `height` | The capture viewport in CSS pixels. The image itself is at 1x for `web`, 2x for `phone`. |
| `alt` | What the screen shows, in plain words. The portfolio uses it as the image's alt text. |
| `embeds` | Optional. Pages the portfolio may load live, on demand. |

**Images:** WebP, quality around 80, longest side 2000px or less.
`web` captures use a 1440×900 viewport at 1x. `phone` captures use 430×932 at
2x (860×1864), matching the phone Run's store kit already uses.

**Bare screens only.** No device frame, no background, no headline, no status
bar drawn on top. The portfolio draws its own frames: an iPhone around every
`phone` screen and a MacBook around every `web` screen. The MacBook's screen is
16:10, which is why `web` captures use 1440×900. A capture that already has a
frame would get two.

**Several screens can share one device.** The portfolio may rotate a few
screens through one MacBook or iPhone, so publish each screen separately under
its own id; the grouping is the portfolio's choice, not the feed's.

**Serving:** `feed.json` must be readable from another origin
(`Access-Control-Allow-Origin: *`), because the portfolio fetches it in the
browser. Images are plain `<img>` loads and need nothing special.

## 2. The screens

These are the ids the portfolio's board uses today. Adding ids is free; removing
or renaming one is a breaking change (see Rules).

**frunt** (`frunt-web`, captured from a demo restaurant)

| id | Screen | Surface |
|---|---|---|
| `home` | Manager home | web |
| `ask` | Ask frunt, with an answer and its sources | web |
| `documents` | Documents library | web |
| `training` | Training courses | web |
| `rota` | Rota | web |

Embed: `landing` → `https://frunthospitality.com/`.

frunt's staff-app screens (`staff-ask`, `staff-training`, `staff-home`) come
from `frunt-mobile`, which has no capture tooling yet. **Phase 2.** Until then
the portfolio shows its saved copies of them.

**MGKFitness** (`mgk-fitness`, captured from the preview builds)

| id | Screen | Surface |
|---|---|---|
| `lift-log` | Lift, logging a workout | phone |
| `lift-plan` | Lift, the plan | phone |
| `lift-coach` | Lift, the coach | phone |
| `run-record` | Run, recording a run | phone |
| `run-plan` | Run, the plan | phone |
| `run-coach` | Run, the coach | phone |

These match the file names already in `web/public/screens/`, so the landing
page can switch to the feed too and keep one source of truth.

Embeds: `lift-preview` and `run-preview` → the hosted preview builds (see
Live embeds).

**Not in any feed:** Liftio 1.4. It's retired, its screens never change, and
they stay as fixed images in the portfolio.

## 3. When capture runs

| Product | Trigger | Backstop |
|---|---|---|
| frunt | After every successful **production** deploy: a GitHub Actions workflow on `deployment_status` (Vercel reports deploys to GitHub), filtered to `state == success` and the Production environment. | Weekly schedule + manual run. |
| MGKFitness | When a release reaches `main` (push to `main` touching `apps/` or `packages/`). Builds the preview with `flutter build web -t lib/preview/main.dart --release`, then captures with Playwright, as `tool/capture_store_screens.mjs` already does. | Weekly schedule + manual run. |

## 4. Rules that keep it hands-off

- **Fail closed.** If any listed screen fails (login fails, error page, missing
  element, blank image), the job fails and **publishes nothing**. The previous
  feed stays live. A red CI run is the only time anyone needs to look.
- **Check each capture.** Wait for the page to settle and for a known element
  on each screen. Reject images that are blank or nearly blank.
- **Publish atomically.** Upload images first, under content-hashed names
  (`ask.3f9a2c1e.webp`), then write `feed.json` last. Images are never
  overwritten, so they can be cached for a year. `feed.json` is the only file
  that changes and is cached for about a minute.
- **Keep a short history.** Keep the images that the last three feeds point to;
  delete older ones.
- **Deterministic data.** Reset the demo data before every capture, so a stray
  edit never reaches the portfolio. Avoid content that ages visibly (fixed
  dates such as "last updated 3 March"); prefer data relative to today.

### frunt only

- **A separate demo restaurant, not the dev test tenant.** The test tenant is
  for development and changes under you. The demo restaurant exists only for
  captures, is reseeded before each run (start from
  `scripts/seed-test-tenant.mjs`), and has a presentable name. The current
  screenshots show "[TEST] Frunt Test Restaurant", which shouldn't appear on a
  portfolio.
- **Guard against real data.** Before capturing, the job confirms it is signed
  in to the demo restaurant by a flag on the tenant (for example `is_demo`), not
  by its visible name, and aborts otherwise. No real restaurant's data is ever
  captured.
- **Credentials live in CI secrets only.** The demo login can see only the demo
  restaurant and has no admin rights.

### MGKFitness only

- The preview builds already use fake data. **Check that the hosted preview
  makes no calls to production services.** A public page must never reach the
  real backend or the AI coach. Fakes only.

## 5. Live embeds

Loaded only when someone presses "Try it live", in a full-size overlay.

| Embed | What | Product-side work |
|---|---|---|
| frunt `landing` | The public website | Send `Content-Security-Policy: frame-ancestors 'self' <portfolio origin>` on the landing page only. App routes refuse framing: `frame-ancestors 'self'` (and `X-Frame-Options: SAMEORIGIN`). |
| `lift-preview`, `run-preview` | The real Flutter apps on fake data | Host each preview build at a stable path on the MGKFitness site (for example `/preview/lift/`), rebuilt on each release. The portfolio picks the screen with `?screen=<name>`. Same `frame-ancestors` rule as above, on those paths only. |

`<portfolio origin>` is **`https://matthewkay.dev`** (decided 5 Oct 2026).

## 6. The portfolio's side

- Each image on the board refers to `{ product, id }`, never to a file.
- On load, fetch each product's `feed.json` (time limit about 3 seconds). For
  each id, use the feed's `src`.
- **Fallback:** if a feed doesn't load, or an id is missing from it, show the
  portfolio's saved copy. At build time the portfolio downloads the current
  feeds and images as those saved copies (into `public/work/`, alongside the
  images used today), so every build carries a recent set. `npm run github`
  already does the same for the contribution graph and skills; the feeds can
  follow that pattern.
- Show the capture date quietly on each screen, for example *Captured from the
  live app, 5 Oct*. It's true, and it makes the point that this is real work.
- If a feed drops an id the board uses, the portfolio keeps showing the saved
  copy. Fix the board to the new id at the next portfolio change; nothing
  breaks in the meantime.

## 7. Order of work

| # | Work | Where |
|---|---|---|
| 1 | Automate Lift + Run capture on release; publish images + `feed.json`; host the preview builds | `mgk-fitness` (mostly built) |
| 2 | Demo restaurant + reseed; capture job after production deploys; publish images + `feed.json` | `frunt-web` |
| 3 | `frame-ancestors` headers for the landing page and app routes | `frunt-web` |
| 4 | Read the feeds, with saved copies as fallback | portfolio, during the real build |
| 5 | Staff-app screens (phase 2) | `frunt-mobile` |

## Open decisions

1. ~~**The portfolio's domain.**~~ Decided: `https://matthewkay.dev`.
2. **Where each feed is hosted.** Any public storage with stable URLs works.
   Supabase Storage is the obvious choice, since both products already use
   Supabase; avoid committing screenshots back into a repo, which turns every
   deploy into another deploy.
3. **The demo restaurant's name and content** for frunt.
4. **frunt-mobile's approach** for phase 2: a preview build like Lift's, or a
   web build signed in to the demo restaurant.
