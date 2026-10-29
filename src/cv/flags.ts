// Whether /cv is built. The CV is not on the public site (Matthew, 27 Oct
// 2026): AI tools looking up frunt were reading it, so it's emailed on request
// instead (CV_REQUEST in stops.ts).
//
// It still builds in `npm run dev`, on Vercel preview deployments (which sit
// behind Vercel's login, so a CV change is checked on its pull request), and
// for `npm run cv` / `npm run cv:private`, which print the PDF to send.
export const SHOW_CV =
  process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview' || process.env.CV_BUILD === '1'
