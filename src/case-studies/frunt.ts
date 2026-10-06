// The frunt case study, as data: the single source for the case study page
// (/work/frunt and the viewer over the board, /#frunt). Approved by Matthew,
// 6 Oct 2026. Same copy rules as the site: plain, specific, no em dashes, and
// statuses never typed by hand (live state comes from stores.json, figures from
// frunt-stats.json).
//
// KEEPING IT TRUE: `checked` is the day these words were last verified against
// frunt's code and decision records, and `lastAdrRead` the last record read.
// To update: read frunt-web's ADRs after `lastAdrRead` and its commits after
// `checked`; `npm run frunt` prints how many records are new.
import type { AppKey } from '@/workbench/apps'

export interface Row { label: string; text: string }
export interface Decision {
  title: string
  when: string
  adr?: string
  rows: Row[]
  /** A finding list instead of rows (the September card). */
  items?: Row[]
  quote?: string
}

export interface CaseStudy {
  slug: string
  name: string
  app: AppKey
  checked: string
  lastAdrRead: string
  tldr: Row[]
  made: { line1: string; line2: string; surfaces: string; role: string; started: string; live: string; body: string }
  why: { line1: string; line2: string; paras: string[] }
  aims: Row[]
  timeline: { date: string; text: string }[]
  decisions: Decision[]
  landed: string[]
  how: { intro: string; steps: Row[] }
  learnt: { lead: Row; rest: Row[] }
}

export const FRUNT: CaseStudy = {
  slug: 'frunt',
  name: 'frunt',
  app: 'frunt',
  checked: '2026-10-06',
  lastAdrRead: '0087',

  tldr: [
    { label: 'What I made', text: "frunt turns a restaurant's own documents into cited answers and training for staff. Live on the web, the App Store, Google Play and WhatsApp. Built and run by me, solo." },
    { label: 'Why', text: 'I worked behind a bar. Training ticked a compliance box, and finding an answer meant spec sheets or asking a manager the same question again.' },
    { label: 'What I aimed for', text: "Answers staff can trust. Each one names its document, or frunt says it doesn't know." },
    { label: 'Decisions', text: 'Allergen facts come from the database and a plain-code check, not a second AI. Every job reports that it ran. When features crowded out the answers, I froze them.' },
    { label: 'Where it landed', text: 'Live since 1 June 2026, on both app stores four weeks after the first commit, first paying venue on 14 June.' },
    { label: 'How I build it', text: 'Claude writes most of the code. Decision records, tests, a release gate and checking the real app keep it right.' },
    { label: 'What I learnt', text: 'Know what the product is, and build around it.' },
  ],

  made: {
    line1: "frunt turns a restaurant's own documents",
    line2: 'into answers and training its staff actually use.',
    surfaces: 'A web app for managers. A staff app on the App Store and Google Play. Answers on WhatsApp.',
    role: 'Solo. Product, design, code, and running it.',
    started: '2026-05-01',
    live: '2026-06-01',
    body: "A manager uploads what the restaurant already has: the allergen matrix, the SOPs, the staff handbook. frunt reads them and turns them into short courses on staff phones. Staff ask questions in plain words and get an answer that names the document it came from. If the documents don't cover it, frunt says so instead of guessing.",
  },

  why: {
    line1: 'I worked behind the bar before I built this.',
    line2: 'The knowledge was there. Nobody could use it.',
    paras: [
      'At Coppa Club and the Red Cross in Reigate, training ran on hope: hope your staff already knew the answer. When they didn\'t, finding it meant flipping through spec sheets, or asking a manager, who then answered the same questions again next shift.',
      'The training courses were third-party compliance modules. Staff hated them, and I didn\'t think they helped with the actual work. They ticked a box. Everything a restaurant knows was written down somewhere, but it was broken up, hard to find and hard to use.',
      'I wanted training that actually trains, built from the restaurant\'s own rules, and answers staff can find in seconds. I built frunt to be a real business for MGKCodes, not a demo.',
    ],
  },

  aims: [
    { label: 'Answers staff can trust.', text: "Every answer comes from the restaurant's own documents and says which one. If the documents don't say, frunt says so. A confident wrong answer about an allergen is worse than no answer." },
    { label: 'Training about this restaurant.', text: 'Courses built from its own rules, not a generic module.' },
  ],

  timeline: [
    { date: '2026-05-01', text: 'A demo, called Mise, to show restaurants the idea' },
    { date: '2026-05-11', text: 'Decided to build the real product. Wrote 12 decision records before any code' },
    { date: '2026-05-15', text: 'Renamed frunt after a UK trademark search. First commit' },
    { date: '2026-05-18', text: 'Working end to end: upload a document, ask, get a cited answer' },
    { date: '2026-06-01', text: 'Live at frunthospitality.com' },
    { date: '2026-06-09', text: 'Staff app on the App Store' },
    { date: '2026-06-13', text: 'Staff app on Google Play' },
    { date: '2026-06-14', text: 'First paying venue' },
    { date: '2026-07-29', text: 'Found three silent failures. Every job now reports that it ran (2 Aug)' },
    { date: '2026-08-24', text: 'Refocused: the answers are the product' },
    { date: '2026-09-11', text: 'Answers on WhatsApp' },
    { date: '2026-09-21', text: 'Instagram studio live' },
    { date: '2026-09-28', text: 'Answers cite only the documents they used' },
  ],

  decisions: [
    {
      title: 'The core: does it actually work?',
      when: '15 – 18 May 2026',
      adr: '0001 · 0008',
      rows: [
        { label: 'What happened', text: 'A restaurant\'s knowledge lives in PDFs, photos of laminated sheets, spreadsheets and paper. None of it is written for searching.' },
        { label: 'What I chose', text: 'Claude reads every document, photos included, so there\'s one engine instead of an OCR tool plus a model (Tesseract, Textract and Mistral OCR were the alternatives). Documents are split into passages and stored with their meaning in Postgres (pgvector), every restaurant in one database, kept apart by row-level security; a database schema per restaurant would mean every change runs once per customer.' },
        { label: 'How it turned out', text: 'Upload, ask, cited answer worked end to end on 18 May, three days after the first commit. Staff could ask and train on their phones four weeks after it.' },
      ],
      quote: 'I\'m proudest that the base product works. Not a technical feature: the goal I set out to achieve.',
    },
    {
      title: 'Allergen answers can\'t be wrong',
      when: '10 June 2026',
      adr: '0046',
      rows: [
        { label: 'What happened', text: 'Allergen questions were answered like any other: search the documents, let the model phrase the answer. A confident "the brownie is nut-free" when the matrix says otherwise is a safety incident.' },
        { label: 'The options', text: 'A second AI to check the first. Refuse every allergen question. Or a plain-code check.' },
        { label: 'What I chose', text: 'Allergen facts come from the database, read straight from the allergen matrix the manager confirmed, never from the model. A plain-code check reads every answer that names an allergen: it either adds the verified facts or replaces the whole answer with a refusal that points to the matrix.' },
        { label: 'Why not a second AI', text: '"A checker sharing the generator\'s model shares its blind spots." The cases the first model gets wrong are the ones a second model gets wrong too.' },
        { label: 'How it turned out', text: 'The model phrases the answer; it is never the source of an allergen fact.' },
      ],
    },
    {
      title: 'Nothing reported its own absence',
      when: '29 July – 2 Aug 2026',
      adr: '0074',
      rows: [
        { label: 'What happened', text: 'I came back from six weeks away and found three things that had broken quietly. A one-letter typo in a setting name meant payment updates had never reached the database since launch. Scheduled jobs added after 1 June had never run once, because the job service had stopped syncing. Nothing had errored. Nothing had said anything.' },
        { label: 'What I chose', text: 'Every scheduled job now records a run every time, even when there\'s nothing to do, and a weekly email says green or red.' },
        { label: 'The rule', text: '"Nothing to do" has to look different from "did not run".' },
      ],
    },
    {
      title: 'The answers are the product',
      when: '24 Aug 2026',
      adr: '0076',
      rows: [
        { label: 'What happened', text: 'frunt drifted. I\'d built outward from the answers into a rota and team briefs, and by summer the manager dashboard opened on "Build next week\'s rota", with the answers third in the menu. Every step made sense on its own.' },
        { label: 'The options', text: 'Delete the rota and briefs. Rename the product to something that explains itself. Turn it into an open-ended assistant.' },
        { label: 'What I chose', text: 'Freeze the rota and briefs (switched off, not deleted) and put the answers first. And a third test that every new feature must pass: do the restaurant\'s own documents make a hard job easy? The rota fails it: it never touches a document.' },
        { label: 'How it turned out', text: 'It shipped the same day: the rota and briefs switched off by default, and the website leading with the answers. The manager home became one screen on 28 Aug.' },
      ],
      quote: 'Selling the product became confusing because it was third in the list of features when you open the app.',
    },
    {
      title: 'Citations that tell the truth',
      when: 'September 2026',
      adr: '0084',
      rows: [{ label: 'What happened', text: 'Three things found by testing frunt the way a venue would:' }],
      items: [
        { label: 'Over-citing.', text: '"What are the Christmas hours?" cited seven documents, none of which answered it. Answers now cite only the documents they used. (Live, 28 Sep.)' },
        { label: 'Lost pages.', text: 'A 40-page handbook silently lost pages 19 to 40, because text extraction for long PDFs had never been built. Now it has. (Live, 23 Sep.)' },
        { label: 'A planted mistake.', text: 'In a dry run on the live app, I planted a wrong cooking temperature in a test document. frunt quoted it back, with a citation. A citation proves where an answer came from, not that the document is right. So frunt\'s document checks are an aid, and the manager stays responsible for what their documents say. (Written as ADR 0084 on 24 Sep.)' },
      ],
    },
  ],

  landed: [
    'Live: the manager web app, the staff app on the App Store and Google Play, answers on WhatsApp, the website with its UK-law guides, and the Instagram studio. Internal tools: the admin console, outreach and analytics.',
    'First paying venue: 14 June 2026.',
    'Both app stores four weeks after the first commit.',
  ],

  how: {
    intro: 'Claude writes most of the code. I decide what gets built and I check what comes out:',
    steps: [
      { label: 'Decide first.', text: 'A decision record before the code, from day one: 12 of them before the first commit. Why this, what else I considered, what would change my mind.' },
      { label: 'Review every change', text: 'before it merges.' },
      { label: 'Tests and a gate.', text: 'The release script refuses to promote anything to production unless CI passed on that exact commit. GitHub\'s branch protection costs extra on a private org repo, so I built the check myself (ADR 0064).' },
      { label: 'Run it and look.', text: 'Scripts check the real screens in a browser, and dry runs on the live app use planted mistakes and a sealed answer key.' },
    ],
  },

  learnt: {
    lead: {
      label: 'Know what the product is.',
      text: 'frunt\'s core worked by 18 May. Then I built outward, and by August the thing restaurants came for was third in the menu. Building the rota and briefs did show me what mattered. Next time I\'d name the core first and test each feature with real venues before building the next one. My first venue taught me the same thing from the other side: setup is the hard part, signing up isn\'t the same as using it, and the pitch needs to be one thing.',
    },
    rest: [
      { label: 'Write decisions down.', text: 'A record of why, written before the code, keeps a project on track, and keeps AI-written code honest.' },
      { label: 'Make failures loud.', text: 'If silence can mean "fine" or "broken", it will mean broken for weeks.' },
      { label: 'Don\'t let AI check AI.', text: 'Where an answer must be right, check it with plain code that refuses.' },
    ],
  },
}
