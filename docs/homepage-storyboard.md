# Homepage storyboard — second pass

> **History, not the spec.** The site is now built (branch `feat/workbench`). The tour lives in
> `src/workbench/stops.ts` and the board in `src/workbench/Board.tsx`; open decisions are in the
> root `CLAUDE.md`. This file is kept for how the design got here.

> **Draft, 5 October 2026.** For reacting to, not building from yet. Copy in
> *italics* is placeholder wording. Open questions are at the bottom.
>
> **Second pass:** frunt leads as the main project; MGKFitness follows. The case
> studies and the learning side are marked as **slots**, left open until they
> are designed.
>
> **Structure superseded, 5 October 2026.** The stacked, one-section-per-project
> layout below was rejected as too blocky. The chosen concept is **the
> Workbench**: one board of real work that the camera moves across as you
> scroll ([prototype](https://claude.ai/artifact/M6pUCQpwJud4dGNMyDakcC),
> private). The order of the beats, their content, the slots and the open
> questions below still apply; the "what moves" parts do not.

The homepage, beat by beat: what's on screen, what moves, and what the reader
should know by the end of each beat. The page is measured in **screens** (one
screen = one viewport height of scrolling), the same unit as the MGKFitness
`storyboard.ts`.

## The page's job

A recruiter gives it about a minute. By the end of the **first screen** they
should know four things: who you are, what kind of work you do, the proof, and
how to reach you. Everything after that pulls them into a case study.

**The skim test:** someone who scrolls straight to the bottom without stopping
still gets all four answers, because the words are always real text, never
baked into an image or a video frame.

## Rules for the whole page

- **Greyscale UI; colour comes with the work.** The page stays greyscale. Colour
  only appears when real product screens light up, so colour arrives with the
  work.
- **Pin and play, never hijack.** A section can hold still while its film plays
  on scroll. Scroll speed is never changed.
- **Every motion carries meaning.** If a beat would say the same thing as a
  still image, it is a still image.
- **Phones get the tall version.** Films come in a wide and a tall shape, as on
  the MGKFitness site. The real-time 3D hero becomes a still render on phones.
- **Less motion means stills.** "Reduce motion" and "save data" visitors get
  the key stills and the same words.
- **Nothing blocks the page.** No intro screen; the page can be used from the
  first second.
- **Sticky nav:** `MK.` · Work · How I work · About · **CV** (a button, always
  visible).

## Slots left open

Two things are deliberately not designed yet. The homepage leaves room for
them, and they get their own pass next.

- **Case study slot.** Each flagship beat ends with a way into its case study
  (`/work/frunt`, `/work/mgkfitness`). The case study pages, and what the
  homepage shows before they exist, are designed later. The agreed shape: what
  I made → why → what I aimed for → challenges and decisions → where it landed
  → what I learnt.
- **Learning slot.** Each project, flagship or not, carries room for what it
  taught you. What goes there, and how much of it shows on the homepage versus
  the case study, is designed later.

---

## Beat 1 — Hero

**Length:** 1 screen, held for about half a screen more while the phone leaves.

**On screen**
- `MATTHEW` / `KAY` in the two-line heading style (solid line, then outline).
- The positioning line. *Placeholder: "Product engineer. I design and build
  polished apps, end to end."*
- A proof strip: *frunt · live* — *Run · in App Store review* — *Lift 2.0 · next*.
- Two buttons: **Download CV** and **Get in touch**.
- A 3D phone in greyscale, its screen showing **frunt's staff app** in colour.

**What moves**
- The `MK.` mark settles into place as the page loads (under a second, replacing
  the old 3.2-second intro).
- The phone turns slightly to follow the cursor.
- On scroll, the type slides off (as now) and the phone shrinks and drops into
  Beat 2, where it becomes the staff phone in the frunt film.

**Phone / less motion:** a still render of the phone; everything else the same.

**By the end the reader knows:** all four answers.

**Needs:** a 3D phone model, a frunt staff app screen, the CV as a PDF.
**Effort:** large. The cursor-following phone and the hand-off into Beat 2 are
the most technical moments on the page.

---

## Beat 2 — frunt (the main project)

**Length:** about 4 screens, pinned.

**On screen:** `SELECTED` / `WORK` heading. The phone from the hero lands, now
showing frunt's staff app, and a laptop sits beside it showing the manager's
dashboard. Two devices, because frunt is two apps: a web app for managers and
a phone app for staff.

**What moves, in order**
1. A restaurant's documents drop into the manager's dashboard on the laptop: an
   allergen policy, a cleaning SOP. *"Restaurants already have their rules
   written down. Staff don't read them."*
2. The documents are read and sorted, and training appears on the staff phone.
   *"frunt turns them into training."*
3. A staff member asks a question on the phone. The answer appears with its
   source paragraph highlighted. *"Every answer shows where it came from."*
4. Both devices settle. The result line: *Live SaaS · manager web app · staff
   app on the App Store and Google Play.* (WhatsApp answers are built but not
   switched on; don't list them as live.)

**Then:** the case study slot and the learning slot.

**Phone / less motion:** the tall film; or four stills with the same words.

**By the end the reader knows:** you built and run a real, complex product (AI
search, many restaurants on one system, payments) and made it simple to use.

**Needs:** frunt screens (have web and mobile; may need fresh captures to match
the current app). Everything shown must come from a demo restaurant, not a real
client.
**Effort:** large. This is now the signature beat, and it carries the hero's
hand-off.

---

## Beat 3 — MGKFitness

**Length:** about 4 screens, pinned.

**On screen:** a new phone rises in from below, with words appearing beside it.

**What moves, in order**
1. The phone shows **Liftio 1.4** (the React Native app). *"Liftio. My first
   App Store app."*
2. The phone turns, and its screens change to **Lift 2.0** (Flutter, the
   redesign). *"Then I rebuilt it as part of something bigger."* The redesign is
   the animation: same app, before and after, on one turn.
3. A second phone slides in: **Run**. A run logged on Run appears in Lift's
   week. *"Two apps that know about each other."*
4. Both phones settle. The result line: *Run in App Store review · Lift 2.0
   next · open source from 11 October.*

**Then:** the case study slot and the learning slot.

**Phone / less motion:** the tall film; or four stills with the same words.

**By the end the reader knows:** you redesign and re-architect your own work,
and you think in systems, not single screens.

**Needs:** Liftio 1.4 screenshots (have them), Lift 2.0 and Run screens (to
capture), the frames themselves (rendered, e.g. in Remotion with a 3D device).
**Effort:** large.

---

## Beat 4 — Other work

**Length:** about 1.5 screens, not pinned.

**On screen:** `OTHER` / `WORK`, then an uneven grid of cards. Each card: the
name, one line on what it is, and the learning slot (one line on what it
taught you, or why you built it).

**What moves:** cards are greyscale stills. On hover they turn to colour and
play a short muted clip. On a phone, a tap does the same.

**Candidates:** Ledger, MSA, Red Cross, FootyScores, Netflix clone, YouTube
clone (see open questions).

**By the end the reader knows:** you have range, and you build things on
purpose to learn.

**Needs:** a 5 to 10 second screen recording per project.
**Effort:** medium, mostly recording.

---

## Beat 5 — How I work

**Length:** about 3 screens, pinned.

> First idea only. This overlaps with the learning side, so it gets revisited
> in the same pass as the case studies.

**On screen:** `HOW I` / `WORK`. A single line draws down the page as you
scroll, passing five stops. At each stop a real piece of work slides in:

| Stop | What slides in |
|---|---|
| **Plan** | A screen board: every screen of an app laid out, each with its purpose |
| **Decide** | A real decision record: *"Liftio is replaced, not relaunched"*, with its reasoning |
| **Build** | The AI workflow: your skills library, read live from the skills repo |
| **Check** | How work is checked: screenshot checks, design reviews, build checks on every PR |
| **Ship** | A store submission, from build to review |

After the last stop: open-source contributions, read live from GitHub.

The line under the heading: *"I use AI to move fast. This is how I keep it
honest."*

**Phone / less motion:** the five stops as a plain vertical list.

**By the end the reader knows:** the method, and why your work isn't the same
as an app someone prompted into existence.

**Needs:** a screen board image, an excerpt of one decision record. The skills
and contributions feeds already exist on the current site.
**Effort:** medium.

---

## Beat 6 — About

**Length:** about 1.5 screens.

**On screen:** `ABOUT` / `ME`, three short lines of bio, the headshot, and
MGKCodes as context: *"I run MGKCodes, the studio behind frunt and
MGKFitness."* The card deck (Gym, Golf, Gaming) stays.

**What moves:** the card deck, as now. The Gym card gains a line linking to
Lift: *"Why Lift exists."*

**By the end the reader knows:** who you are and why you build.

**Effort:** small. Mostly reuse.

---

## Beat 7 — Contact

**Length:** 1 screen.

**On screen:** one large line, *"Hiring for [role]? Let's talk."* Download CV,
email, LinkedIn, GitHub. The footer.

**Effort:** small.

---

## The whole page

About **15 to 17 screens**. Long, but the first screen does the essential job,
and the CV button is always one click away.

**Removed from the current site:** the intro screen, the tech stack logo grid,
the project filter tabs, and the separate MGKCodes section (now part of About).
Open Source and Skills are merged into How I work.

## Build order

The MGKFitness film already works before any video exists: it crossfades
between stills, so the storyboard can be walked through early. Use the same
approach here.

1. **The page in stills.** Every beat built with still images and real text,
   with the slots as visible placeholders. This is already a usable site, and
   the skim test can be checked.
2. **The frunt film.** The signature beat.
3. **The 3D hero** and its hand-off into the frunt film.
4. **The MGKFitness film.**
5. **How I work, other work clips, and polish.**

Case studies and the learning side are designed in their own pass, alongside
step 1 or 2.

## Open questions

1. **frunt's demo data.** frunt now leads the page, so this comes first: is
   there a demo restaurant to film, or does one need setting up?
2. **The proof strip has to be true on launch day.** Decision record 0001 says
   the shipped Liftio 1.4 has not worked since 7 August, so "Liftio on the App
   Store" can't be part of the proof until Lift 2.0 is out. Run's status needs
   checking too.
3. **Headshot: hero or About?** A face in the hero builds trust; the phone in
   the hero leads with the work. This draft puts the face in About.
4. **The positioning line.** Still open; it depends on the role decision.
5. **The clones.** Keep the Netflix and YouTube clones as "built to learn"
   cards, or drop them?
6. **Missing projects?** Anything newer worth a card, such as the content
   pipelines or the daily log?
7. **Real-time 3D in the hero, or pre-rendered?** Real-time can follow the
   cursor; pre-rendered is cheaper and can't stutter. This draft uses real-time
   in the hero only.
