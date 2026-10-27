// The MGKFitness case study, as data: the single source for /work/mgkfitness and
// the viewer over the board (/#mgkfitness). Same copy rules as the site: plain,
// specific, no em dashes, and statuses never typed by hand (live state comes
// from stores.json via liveOn(), figures from mgk-stats.json).
//
// DRAFT. The Why and the lead lesson are Matthew's (27 Oct 2026); the rest is
// drafted from the mgk-fitness repo and waits for his read. It publishes only
// once he approves it AND the coach checks AI consent at the server for both
// apps (src/case-studies/flags.ts).
//
// Matthew's rules for this one (27 Oct): the story starts at Run, with Liftio as
// background. Competitors' prices, never their names (checked on the UK App
// Store, 27 Oct 2026: £8.99 and £15.99 a month). Never "I wanted one app", and
// never one subscription for the suite: Run and Lift each have their own.
// Never say one app reads the other's training: nothing does yet.
//
// KEEPING IT TRUE: `checked` is the day these words were last verified against
// the mgk-fitness repo, and `lastAdrRead` the last records read in each app's
// set. `npm run mgk` lists newer ones. Re-check the competitors' prices too.
import stats from '@/data/mgk-stats.json'
import { liveOn } from '@/workbench/apps'
import type { CaseStudy } from './types'

/** "Run is live on the App Store and Google Play, and Lift on …", from the stores, never typed. */
function liveLine(): string {
  const run = liveOn('run'), lift = liveOn('lift')
  if (run && run === lift) return `Run and Lift are live on ${run}.`
  return [run && `Run is live on ${run}.`, lift && `Lift is live on ${lift}.`].filter(Boolean).join(' ')
}

export const MGKFITNESS: CaseStudy = {
  slug: 'mgkfitness',
  name: 'MGKFitness',
  apps: ['run', 'lift'],
  checked: '2026-10-27',
  lastAdrRead: 'Run 0049 and Lift 0004',
  source: 'the MGKFitness repo',
  shot: {
    img: 'site-mgkfitness', w: 1000, h: 625,
    alt: 'The MGKFitness website, introducing Run and Lift on one account',
    caption: 'mgkfitness.mgkcodes.com: two apps, one account.',
  },
  figures: [
    { n: stats.decisionRecords, label: 'decision records' },
    { n: stats.testFiles, label: 'test files' },
    { n: stats.migrations, label: 'database migrations' },
    { n: stats.edgeFunctions, label: 'Edge Functions' },
  ],
  counted: { from: 'the MGKFitness repo', at: stats.generatedAt, commit: stats.commit },

  tldr: [
    { label: 'What I made', text: 'Two fitness apps, Run for running and Lift for lifting, on one account, each with an AI coach whose plans are checked by plain code. Built and run by me, solo.' },
    { label: 'Why', text: 'Training for a half marathon, the apps I found cost about £25 a month and were built around feeds and games. It seemed overpriced, and I didn\'t like using them. I wanted something cheap, personalised and elegant.' },
    { label: 'What I aimed for', text: 'A coach you can trust with your training, and to learn how to take an app from an idea to both stores.' },
    { label: 'Decisions', text: 'One backend for both apps. Liftio rebuilt in Flutter and shipped as an update on its own listing. A coach that can\'t make up a weight. Android added once the bugs turned up there. A rule for versions that turned an App Store rejection into a same-day fix.' },
    { label: 'Where it landed', text: `${liveLine()} The code for both is open source.` },
    { label: 'How I build it', text: 'Claude writes most of the code. Decision records, tests against the real database, a board of every screen and a release script that can touch nothing else keep it right.' },
    { label: 'What I learnt', text: 'Shipping is its own skill.' },
  ],

  made: {
    line1: 'Two fitness apps, Run and Lift,',
    line2: "on one account, with a coach that can't make up a number.",
    surfaces: 'Run and Lift on iPhone and Android. A website at mgkfitness.mgkcodes.com. Both apps and their backend in one public repo.',
    role: 'Solo. Product, design, code, and running it.',
    started: '2026-07-25',
    live: '2026-10-05',
    body: 'Run records your runs with GPS and builds a training plan for your race, then adjusts it when a week falls apart. Lift logs your workouts, sets and personal bests, with progress photos and a plan of its own. Each app works without the other, on the same account. Tracking is free; the coach is the subscription, and stopping it costs you the coach, never your training. Every plan the coach writes passes plain-code checks before you see it.',
  },

  why: {
    line1: 'I signed up for the Royal Parks Half.',
    line2: 'The apps to train with seemed overpriced, and I didn\'t like using them.',
    paras: [
      'One app recorded my runs, at £8.99 a month. Another wrote the training plan, at £15.99. That\'s about £25 a month, for two apps built around a social feed, with everything turned into a game. It seemed overpriced for what I needed, and I didn\'t enjoy using either. The gym trackers I\'d tried before were no different.',
      'I wanted something cheap, personalised and elegant, so I built Run. It records your runs and writes a plan for your race, with no feed, no followers and no leaderboards. Tracking is free; the coach is the subscription.',
      'I\'d shipped an app once before. Liftio, a gym tracker in React Native, was my first App Store app, built for my own training and to learn to ship one myself. Run was Flutter, so I rebuilt Liftio in Flutter too, as Lift: one stack, one account and one backend for both apps.',
    ],
  },

  aims: [
    { label: 'A coach you can trust.', text: 'The AI writes a plan; plain code checks it before you see it. Lift\'s coach can\'t put a weight in a plan at all: it says how hard, and the app works out the kilograms from what you\'ve already lifted.' },
    { label: 'Your training stays yours.', text: 'Tracking is free and works offline. Stop paying and you lose the coach, not your history.' },
    { label: 'Learn the whole path.', text: 'Take two apps from an idea to both stores myself: the code, and everything Apple and Google expect before an app goes live.' },
  ],

  timeline: [
    { date: '2026-07-25', text: 'Started a running coach, then called Runio. Seven decision records before the app' },
    { date: '2026-08-06', text: 'Both apps in one repo, on one backend. Liftio\'s old backend retired on purpose' },
    { date: '2026-08-07', text: 'Lift\'s coach and plans, with the weight out of the model\'s reach' },
    { date: '2026-08-17', text: 'Decided Lift replaces Liftio on its own App Store listing' },
    { date: '2026-08-18', text: 'Android became a target' },
    { date: '2026-09-29', text: 'Run\'s coach asks before your training leaves the phone' },
    { date: '2026-10-02', text: 'Run sent to both stores. The website went live' },
    { date: '2026-10-05', text: 'Run on Google Play. Lift 2.0 sent to both stores' },
    { date: '2026-10-06', text: 'Lift on Google Play' },
    { date: '2026-10-07', text: 'The code went public, open source' },
    { date: '2026-10-08', text: 'Lift on the App Store, replacing Liftio' },
    { date: '2026-10-16', text: 'Apple rejected Run\'s first version. Fixed and sent back the same day' },
    { date: '2026-10-19', text: 'Run on the App Store' },
    { date: '2026-10-27', text: 'The server refuses Run\'s coach without your yes' },
  ],

  decisions: [
    {
      title: 'One backend for two apps',
      when: '25 July – 29 Sep 2026',
      adr: 'Run 0008',
      rows: [
        { label: 'What happened', text: 'Run and Liftio were separate apps that should share a login, and in time a lifting coach should be able to see your runs.' },
        { label: 'The options', text: 'A backend per app, with separate logins. Or one backend, with each app\'s data kept apart.' },
        { label: 'What I chose', text: 'One Supabase database with a section per app, a shared account, and one coach service for both. Every row is locked to the person it belongs to by row-level security. Moving to it retired Liftio 1.4\'s backend, on purpose: Lift 2.0 replaced it. When everything moved into one repo, the migration history couldn\'t rebuild the live database, so I rebuilt it from the database itself and proved the two matched.' },
        { label: 'What went wrong', text: 'Sharing a backend has a catch: whichever app deploys last wins. Both apps once shipped their own delete-account function under the same name, so deleting your Run account erased your Lift data. The fix: the app now says which app is asking. In September a review before release found the same thing again, with production running an older copy of the coach. Now one copy, from one place, serves both apps.' },
        { label: 'How it turned out', text: 'When Lift\'s rebuild started, its accounts, its data and most of its coach were already built and tested.' },
      ],
      quote: 'I\'m proudest that I took both apps to both stores, and I built and run them myself.',
    },
    {
      title: 'The coach can\'t make up a number',
      when: '25 July – 7 Aug 2026',
      adr: 'Run 0003',
      rows: [
        { label: 'What happened', text: 'A training plan runs for weeks. When an AI writes one, the mistakes are structural and easy to miss: a taper disappears, two hard days land together. You can\'t check 80 sessions by eye.' },
        { label: 'The options', text: 'Trust the model. Tell it the rules in the prompt. Or check every plan with code.' },
        { label: 'What I chose', text: 'The model proposes, plain code decides. Every plan, week and change passes a validator before it\'s saved or shown, and if the AI can\'t produce a valid plan, the app builds one without it. Lift goes further: its plan format has no field for a weight. The coach says how hard a set should be, and the app turns that into kilograms from what you\'ve actually lifted, rounded to a weight you can load. A test fails if anyone adds a weight field.' },
        { label: 'How it turned out', text: 'Because the checks catch planning mistakes, plans can run on a cheaper model, and the better one goes where the coach talks to you directly.' },
      ],
    },
    {
      title: 'Rebuild it, keep the listing',
      when: '6 – 17 Aug 2026',
      adr: 'Lift 0001',
      rows: [
        { label: 'What happened', text: 'Liftio was a React Native app at version 1.4 on the App Store. Run was already Flutter, and the two now shared a backend.' },
        { label: 'The options', text: 'Keep Liftio in React Native next to a Flutter app. Rebuild it in Flutter as a new app with a tidy name. Or rebuild it and ship it as an update to Liftio\'s own listing.' },
        { label: 'What I chose', text: 'Rebuild in Flutter, for one language and one design system across both apps, and ship it as version 2.0 on Liftio\'s listing. That reversed my own earlier plan for a new app ID: a new listing means a new app, with no update for people who have it and a website link pointing at a retired app.' },
        { label: 'How it turned out', text: 'Lift 2.0 reached the App Store on 8 October as an update to Liftio. Google Play had never had Liftio, so Lift went there as a new app. Liftio\'s website now points to Lift.' },
      ],
      quote: 'Retiring a live record to avoid an untidy string is paying a real cost for a cosmetic one.',
    },
    {
      title: 'Android, after all',
      when: '6 – 18 Aug 2026',
      adr: 'Run 0020 · 0021',
      rows: [
        { label: 'What happened', text: 'Run was planned for iPhone only, and I build on Windows. An iPhone build needs a Mac, and every screen had been checked on an Android emulator, because that\'s what my machine runs.' },
        { label: 'The options', text: 'Buy a Mac. Build on GitHub\'s Mac runners, with signing keys in a repo about to go public. Or a build service.' },
        { label: 'What I chose', text: 'Codemagic builds and signs the iPhone apps from a config file in the repo, so a release never waits on a particular desk. Then, since every layout bug in the running screen had been found on Android, I made Android a real target. Testing it found the worst bug a running app can have: Android quietly stops sending location when the screen locks, while the app still says Recording. Recording now runs as a foreground service.' },
        { label: 'How it turned out', text: 'Both apps reached Google Play first: Run on 5 October, Lift on 6 October.' },
      ],
    },
    {
      title: 'The coach asks before it sends',
      when: '29 Sep – 27 Oct 2026',
      adr: 'Run 0036',
      rows: [
        { label: 'What happened', text: 'To answer, the coach sends your training to an AI provider, and some of it is health data. My privacy policy said consent was the basis, but in Run nothing asked for it: every way into the coach sent first. Apple\'s rules also ask for permission before data goes to a third-party AI.' },
        { label: 'What I chose', text: 'In Run, one gate in front of every way in: account, then permission, then price, then the coach. The screen names who receives the data, what is sent and what never is, and neither button is picked for you. Withdrawing is one row in Settings. On 27 October the server started refusing Run\'s coach without that yes too, so a client that skips the question gets nowhere.' },
        { label: 'How it turned out', text: 'Lift\'s coach was on by default, with a switch to turn it off. Its next release asks the same question, keeps the answer on the account and has the server check it.' },
      ],
    },
    {
      title: 'A version is submitted once',
      when: '29 Sep – 19 Oct 2026',
      adr: 'Run 0039 · 0046',
      rows: [
        { label: 'What happened', text: 'Two numbering systems drifted. The build service\'s counter and TestFlight\'s numbers disagreed, so my notes\' builds 11, 12 and 13 were really 18, 19 and 20, and one release tag sat on a commit whose build had been cancelled. Nobody could say which build a tester had.' },
        { label: 'What I chose', text: 'One commit goes to both stores with one build number, kept in the code. The tag goes on the exact commit that was built. A version number is submitted once: if a review needs a new build, it ships as the next version. A script drives both stores from the terminal; it prints its plan first and changes nothing without being told to.' },
        { label: 'How it turned out', text: 'Two weeks later Apple rejected Run 1.0.0 for asking people who signed in with Apple for their name. 1.0.1 fixed it and went back the same day, and was approved and on sale on 19 October.' },
      ],
    },
  ],

  landed: [
    liveLine(),
    'Lift replaced Liftio on its App Store listing as version 2.0 on 8 October 2026, so anyone who had Liftio got it as an update.',
    'Open source since 7 October 2026: both apps, the design system, the database and the coach\'s server code, in one public repo.',
  ],

  how: {
    intro: 'Claude writes most of the code. I decide what gets built and I check what comes out:',
    steps: [
      { label: 'Decide first.', text: 'Run\'s first commit held seven decision records, written before the app existed. Each says why, what else I considered and what would change my mind.' },
      { label: 'Done means written down.', text: 'A change to a decision updates its record in the same pull request, and anything a user would notice gets a changelog line.' },
      { label: 'Test the real database.', text: 'Schema tests run against the database itself, and a rebuild from the repo must match production exactly.' },
      { label: 'Look at every screen.', text: 'A board of every screen and state, captured from the emulator and checked by eye. That became a skill I reuse.' },
      { label: 'Give Claude the release, not the keys.', text: 'The store script can release Run and Lift and nothing else, and the store keys live outside the repo. That became my mobile-store-release skill.' },
    ],
  },

  learnt: {
    lead: {
      label: 'Shipping is its own skill.',
      text: 'I built MGKFitness to learn how apps really get made and delivered, not just coded. Apple and Google each have their own idea of a finished app: how it signs you in, what it asks before your data leaves the phone, how a version is numbered and reviewed. Apple rejected Run\'s first version for asking people who signed in with Apple for their name, and it went back fixed the same day. I\'ve now taken two apps from an idea to both stores, with a website and posts to find their first users, and turned the release into a skill I reuse.',
    },
    rest: [
      { label: 'Make the wrong thing impossible.', text: 'Asking an AI not to invent a weight is a request. A plan format with nowhere to put one is a guarantee.' },
      { label: 'Shared things need one owner.', text: 'One backend saved me building Lift\'s account, data and coach twice. But twice it ran whichever app\'s copy was deployed last. Give every shared piece one home before the second app arrives.' },
      { label: 'Write the rule before you need it.', text: 'The rule for a rejected version was written two weeks before Apple rejected one, so the fix went back the same day.' },
    ],
  },
}
