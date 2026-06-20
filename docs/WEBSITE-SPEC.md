# LockedIn — Marketing Site Spec

> Static marketing site. Not a web app. Its only jobs: explain the product, sell the identity, drive to the app stores, capture emails.

This document covers **language, wording, vibe, and flow** — the actual copy and feel of the site, not the engineering. Companion to `MVP-PLAN.md`. Built with Next.js, static for v1.

---

## 1. What this site is (and isn't)

**It is** a billboard and a funnel. A single scrolling page (plus a couple of thin support pages) whose whole purpose is to make a visitor think *"that's me — I need that"* and tap to the app store.

**It is not** a web version of the app, a feature wiki, a blog, or a place to log in. No app functionality lives here.

**The one job:** convert a cold visitor into an Android install. (iOS isn't out yet — see §3.5 for how the email capture is repurposed as the iOS waitlist.)

> **Platform note (v1): Android only.** The primary CTA everywhere is the **Google Play "Download" badge**. iOS is framed as **"coming soon"** with an email waitlist, not a live button.

---

## 2. Voice & vibe (carry over from the app)

The site speaks in the same voice as the product: a calm, competent training partner who's already disciplined and assumes you can be too. Quiet confidence. The work speaks; we don't shout.

**Voice principles:**

- Short, declarative, present-tense. Fragments are fine. "One task. Timer's running."
- Second person. Talk *to* the visitor, never lecture them.
- Identity over features. Sell *who they become*, not what the app does.
- Earned, not cheerful. No hype-reel exclamation marks, no "Amazing!! 🎉".
- Honest and a little stoic. Confidence without arrogance.

**Yes words/vibes:** locked in, execute, focus, now, do the work, one thing, the streak, show up, real, momentum, discipline made visible.

**No words/vibes:** "productivity," "optimize your workflow," "boost," hustle/grind clichés, drill-sergeant "NO EXCUSES," corporate-wellness softness, gamification jargon ("level up! +50 XP"), emoji spam. The streak flame 🔥 is the one allowed emoji, used sparingly.

**Litmus test for every line:** would a genuinely disciplined person find it motivating, or slightly embarrassing? If it reads like a hype reel or a guilt trip, cut it.

**Aesthetic direction (for the writer to keep in mind):** calm, monochrome-leaning, lots of negative space, one bold accent. The page should feel as spare and focused as the app — the layout itself is part of the pitch. Big type, few words, room to breathe. Never a cluttered SaaS landing page.

---

## 3. The core message

**One-liner (hero):**
> Stop scrolling. Start executing.

**The 359-character explainer (about / meta / social):**
> LockedIn is a mobile focus app that replaces scrolling with one loop: open it, see your current task, the timer's already running. Hit Done or Skip, the next task loads instantly. No planning, no dashboards — just the one thing you're doing now. Finish a task a day and your streak lives. Calm, not punishing. Built to make discipline visible — and shareable.

**Positioning frame (the thing every section reinforces):**
> A real-time execution layer for your day — not another planning tool. It shows what you're actually doing right now.

We are explicitly **not** a productivity app, task manager, or focus timer in our language. We're an execution system / an identity.

### 3.5 Email capture — repurposed as the iOS waitlist

Since the site no longer needs to "send you a link" (Android users just tap the Play Store badge), the email capture now does **one thing**: collect people who want LockedIn **on iPhone**. It's the iOS coming-soon list.

- **Framing:** `iPhone user? Be first in line.` — turns the missing iOS app from a dead end into a signal of demand we can measure.
- **Why this is useful:** it tells us how much iOS demand exists before we build it, and gives us a launch-day list to notify.
- This replaces the old "get the download link" purpose entirely. Android = download now; iOS = join the list.

---

## 4. Page flow (single scrolling homepage)

The homepage is one vertical scroll, ordered as a narrative: hook → problem → how it works → proof → identity → price → final call. Each section is short. The visitor should be able to "get it" in 15 seconds of scrolling and decide.

```
1. HERO              — the promise + app store buttons
2. THE PROBLEM       — name the pain (planning ≠ doing)
3. HOW IT WORKS      — the loop in 3 beats
4. GOALS → TASKS     — the structure, briefly
5. THE STREAK        — the hook / reward
6. PROOF / SHAREABLE  — discipline made visible
7. PRICING           — free loop forever, simple Pro
8. FINAL CTA         — one more push to install
9. FOOTER            — links, legal, email capture
```

Below is the intended copy and intent for each.

---

## 5. Section-by-section copy

### 5.1 Hero

**Intent:** in one screen, land the promise and offer the download. Most visitors decide here.

- **Headline:** `Stop scrolling. Start executing.`
- **Subhead:** `LockedIn turns your day into one focused loop. One task. One timer. Done. Next.`
- **Primary CTA:** the official **Google Play "Download" badge** (the standard one used across sites). Single, bold, unmissable.
- **Under the badge:** `iOS coming soon.` — small, calm, no apology. Optionally a quiet inline link: `iPhone? Get notified →` (scrolls to / opens the email capture).
- **Visual:** the Focus screen — a single task, a running timer. The product *is* the hero image. No mockup carousel.

Keep it to ~12 words of headline + subhead total in the eye's first pass.

### 5.2 The problem

**Intent:** make the visitor feel seen. Name the enemy: planning theater and the infinite scroll.

- **Heading:** `You don't need another planner.`
- **Body:** `You've got the apps. The lists. The color-coded systems. And you're still not doing the thing. The problem was never planning — it's execution. LockedIn skips the planning theater and puts you straight into the work.`

Tone: blunt, recognizable, not preachy. One short paragraph.

### 5.3 How it works (the loop)

**Intent:** show the entire product in three beats so there's zero mystery.

- **Heading:** `One loop. That's the whole app.`
- **Three steps (short, present-tense):**
  1. **Open it.** `Your current task is right there. The timer's already running.`
  2. **Do the one thing.** `No list to browse, no decisions. Just the task in front of you.`
  3. **Done or Skip.** `Mark it and the next task loads instantly. Keep the loop going.`
- **Close line:** `No dashboards. No setup. Just the next right action.`

### 5.4 Goals → Tasks

**Intent:** explain the small bit of structure without making it sound like work.

- **Heading:** `Set a goal. Break it into tasks. Execute.`
- **Body:** `Pick what you're working toward. Drop the tasks under it. LockedIn feeds them to you one at a time, in order — so a big goal becomes the next single thing you do.`

Keep it to one short paragraph — structure is a *means*, the loop is the *point*. Don't let this section feel like a project-management pitch.

### 5.5 The streak

**Intent:** introduce the hook and the reason to come back tomorrow.

- **Heading:** `Finish one task a day. Keep the streak alive.`
- **Body:** `Show up, do one thing, and your streak grows. Miss a day and it resets. Simple enough to hold in your head — and surprisingly hard to break once it's going.`
- **Visual:** a streak count, climbing. The flame 🔥 may appear here.

### 5.6 Proof / shareable

**Intent:** sell the identity and the viral artifact.

- **Heading:** `Discipline you can actually see.`
- **Body:** `Every day, LockedIn turns your focus into a clean summary — tasks done, time focused, streak intact. Post it. Or just keep it for yourself. Either way, the receipts are real.`
- **Visual:** a shareable daily-summary card (the kind people screenshot to TikTok / X / Reddit).

### 5.7 Pricing

**Intent:** make the free offer obvious and the Pro upsell low-friction. The whole loop is free forever — say so plainly.

- **Heading:** `The loop is free. Forever.`
- **Body:** `Tasks, the timer, the streak, your daily summary — all free, for good. Go Pro when you want deeper history, themes, and sync.`
- **Free:** `Goals & tasks · Focus timer · Streak · Daily summary · Shareable cards`
- **Pro:** `$2.99/mo or $19.99/yr — advanced history, templates, themes, export, sync. 2-day free trial.`
- **Note for the writer:** keep the framing continuity-based, never restrictive. Free isn't a crippled demo — it's the real product. Pro is for people who want more, not for people who need the basics unlocked.

### 5.8 Final CTA

**Intent:** one last clean push.

- **Heading:** `Lock in today.`
- **Subline:** `One task. One timer. Start the streak.`
- **CTA:** the Google Play "Download" badge again, with `iOS coming soon.` beneath it.

### 5.9 Footer

- Google Play "Download" badge + `iOS coming soon.`, a one-line restatement of the promise.
- Email capture (iOS waitlist): `iPhone user? Be first in line.` → button `Notify me`.
- Legal: Privacy, Terms.
- Optional: a single "build in public" link (X/TikTok) since that's an acquisition channel — but keep it understated.

---

## 6. Supporting pages (thin, v1)

Only what's strictly needed. No blog, no docs in v1.

- **Privacy Policy** — required for app stores.
- **Terms** — required.
- **(Optional) Press / one-pager** — a single page restating the pitch with assets, useful for the build-in-public audience. Low priority.

---

## 7. Microcopy & details

- **Download button:** the official **Google Play "Download" badge** only (Android-only v1). Never "Sign up" — there's no account. `iOS coming soon.` sits beneath it wherever it appears.
- **Email capture (iOS waitlist) placeholder:** `your@email.com` → button `Notify me`. Heading: `iPhone user? Be first in line.` Confirmation: `You're on the list. We'll ping you when iOS drops.` (in-voice: terse, calm).
- **Meta title:** `LockedIn — Stop scrolling. Start executing.`
- **Meta description:** use the 359-char explainer (§3), trimmed to ~155 chars for SEO: `A mobile focus app that drops you into one task with the timer already running. Do it, mark it, next. Keep your streak alive. Discipline, made visible.`
- **Social share image (OG):** the Focus screen or a streak card, with the one-liner.
- **404 page:** stay in voice — `Lost the thread. Back to the one thing →` (link home).

---

## 8. What to avoid on the site

- No long feature grids or comparison tables. We're not competing on feature count.
- No stock photos of smiling people at laptops. Show the product or nothing.
- No testimonials we don't have. (Add real ones post-launch.)
- No autoplay video, no popups on load, no cookie-banner theater beyond what's legally required.
- No jargon from §2's "no" list. Re-read every heading against the litmus test.
- No "Sign up free" language — there's no account; it's "Download."

---

## 9. Success definition

The site works if a cold visitor can, within one short scroll, (a) understand the loop, (b) feel like it's *for them specifically*, and (c) tap the Play Store badge to install — or, if they're on iPhone, join the iOS waitlist. Everything on the page serves one of those two outcomes. If a section moves the visitor toward neither, cut it.

---

## 10. One-paragraph summary

The LockedIn marketing site is a single, spare, confident scrolling page that mirrors the app's voice: short declarative lines, identity over features, calm not punishing. It opens with "Stop scrolling. Start executing.," names the planning-theater problem, shows the one-loop product in three beats, explains the light goals→tasks structure, sells the streak and the shareable daily summary as proof of discipline, lays out a free-forever loop with a simple Pro tier, and closes with a clean "Lock in today." Its only goal is to turn a cold visitor into an install or an email — no web app, no clutter, no hype.
