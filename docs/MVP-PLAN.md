# LockedIn — MVP Plan

> One task. One timer. One action. Repeat.

This document defines the **first shippable version** of LockedIn at a product and behavioral level. It deliberately avoids implementation detail. The goal is to describe *what the product does, how it feels to use, and where the boundaries of v1 are* — clearly enough that design and engineering can both build from it.

Companion to the full product spec. Where the spec describes the long-term vision, this plan describes the slice we actually ship first.

---

## 0. How to read this document

- **Section 1** sets the MVP thesis and the single bet we're making.
- **Section 2** is the scope contract: what's in v1, what's explicitly cut, and why.
- **Sections 3–5** describe the product as the user experiences it: the surfaces, the core loop, and every flow step-by-step.
- **Section 6** is onboarding, in depth.
- **Sections 7–10** cover behavioral logic, monetization, edge cases, and the data the product remembers.
- **Sections 11–13** cover platform split (mobile / web / backend), success metrics, and open questions.

Anything marked **[CUT]** is intentionally not in the MVP. Anything marked **[v1]** is in scope.

---

## 1. MVP thesis

Most "focus" apps fail because they are *planning* tools wearing a productivity costume. The user spends their energy organizing tasks, decorating a system, and feeling productive — without doing the work. LockedIn's bet is the opposite:

> The product's only job is to collapse the user's entire day into a single question — **"what am I doing right now?"** — and then hold them to the answer for a fixed block of time.

Everything in the MVP exists to serve that one moment: a person opening the app and immediately being *in* a task with a clock running, rather than browsing, planning, or deciding.

The MVP succeeds if a meaningful share of users come back **day 2 and day 7** because the loop felt good and produced visible evidence of their own discipline. That is the whole test. Downloads, feature count, and polish are secondary to: *did people return and run the loop again?*

### The one bet

We are betting that **enforced single-task execution + a streak that's painful to lose + a shareable proof-of-discipline artifact** is enough to form a daily habit. If that's true, everything else (analytics, templates, social) is upside. If it's false, no amount of features saves it. So the MVP includes exactly those three things and almost nothing else.

---

## 2. Scope contract

### 2.1 In the MVP `[v1]`

| Area | What ships |
|---|---|
| Focus screen | The default landing surface: current task, auto-running timer, Done, Skip. |
| Task list | Create tasks, set a duration, reorder them into the day's queue. |
| Sequential execution | Tasks run one at a time, in order. No parallel focus. |
| Daily session | Each day is a session that tracks completed/skipped/focus time and produces an end-of-day summary. |
| Streak | One simple rule: complete ≥1 task in a day → streak lives; complete 0 → streak breaks. |
| Daily summary | An immutable end-of-day card with counts, focus time, and streak. |
| Shareable artifact | The summary can be turned into a clean image to post. |
| Onboarding | A short first-run flow that ends with the user *inside their first focus session*, not on a settings screen. |
| Local persistence | The app remembers tasks, sessions, and streak on the device across restarts. |
| Trial + paywall scaffolding | A 2-day full-access trial and a paywall surface, even if the Pro features behind it are thin in v1. |
| Marketing site | A static Next.js site: what it is, the loop, pricing, app-store links, waitlist/email capture. |

### 2.2 Cut from the MVP `[CUT]`

These are good ideas deferred on purpose. Cutting them is what makes v1 shippable.

- **Cloud sync / accounts.** v1 is device-local. No login, no server-stored user data. *(Why: accounts are a tax on first-run conversion and add backend surface we don't need to validate the loop.)*
- **Advanced analytics / focus history charts.** *(Why: nobody has history on day 1; this is a retention-phase feature, and it's a Pro hook later.)*
- **Templates (Deep Work, Study Mode, etc.).** *(Why: presets only matter once we know what real usage looks like.)*
- **Journal export, themes.** *(Why: cosmetic / power-user; zero impact on the core bet.)*
- **Calendar integration / scheduling.** *(Why: the spec is explicit — no calendar dependency. Sequential execution replaces scheduling.)*
- **Streak freeze, completion-bonus streaks.** *(Why: streak mechanics tuning comes after we see real break rates.)*
- **Social accountability, public profiles, AI task scheduling, Side Project Graveyard / ScoreMyLife.** *(Why: all future extensions per the spec.)*
- **Push notifications beyond a single optional daily nudge.** A heavy notification system is cut; one gentle "ready to lock in?" reminder is the most we'd consider, and even that is optional in v1.

### 2.3 The line we won't cross in v1

If a proposed feature does not directly increase the odds that a user **opens the app and completes a focus block today**, it does not go in the MVP. This is the filter for every "can we just add…" conversation.

---

## 3. Product surfaces

The MVP has four surfaces in the mobile app, plus the marketing site. Navigation between the four is deliberately flat and minimal — the user should rarely need to think about "where" they are.

| Surface | Purpose | Is it the default? |
|---|---|---|
| **Focus** | Execute the current task with a running timer. | **Yes — always the landing screen** once at least one task exists. |
| **Tasks** | Create tasks, set durations, order the queue. | No. Reached deliberately. |
| **Day** | See today's running session and the end-of-day summary. | No. |
| **Streak** | See streak count and day-by-day history. | No. |

Design intent: Focus is *home*. The other three are places you visit briefly and leave. The app should feel like it has gravity that always pulls back to Focus.

### 3.1 Navigation model

A minimal bottom presence (or equivalent) gives access to Tasks, Day, and Streak, but Focus is the persistent center. When the user finishes a task, they are returned to Focus with the next task already loaded — not dumped into a menu. The product never asks "what now?"; it answers it.

---

## 4. The core loop

This is the heart of the product. Everything else is scaffolding around it.

```
Open app
   ↓
Focus screen shows CURRENT TASK + timer (auto-started)
   ↓
User works
   ↓
┌──────────────┬───────────────┐
│   DONE       │     SKIP      │
↓              ↓
Logged as      Logged as
completed      skipped
└──────┬───────┴───────────────┘
       ↓
Brief feedback moment (the "reward beat")
       ↓
Next task auto-loads on Focus
       ↓
(repeat until queue empty)
       ↓
Day complete → Daily Summary → Streak updated
```

### 4.1 The non-negotiable behaviors

These define the feel of the loop and must hold in v1:

1. **Auto-start.** When a task becomes current, its timer starts on its own. The user never presses "start." The act of opening the app *is* starting.
2. **One task visible.** The Focus screen shows exactly the current task. No list, no "up next" clutter competing for attention. (A faint indicator of how many tasks remain is acceptable; a full preview is not.)
3. **Two actions only.** Done and Skip. That's the entire decision surface during a session. Adding a third primary action (pause, edit, snooze) is resisted in v1 because it reintroduces decision-making, which is the enemy.
4. **Always return to Focus.** Completing or skipping never lands the user on a menu. It lands them on the next task, already running.
5. **Fast.** Every action resolves in under ~2 seconds with immediate feedback. The loop should feel frictionless to the point of being slightly addictive.
6. **Non-punitive.** Skipping logs a "skipped" state but the tone is calm, never shaming. The product enforces; it doesn't scold.

### 4.2 What "current task" means

The current task is simply the first task in the queue with status `pending`. The system walks the queue top to bottom. There is no smart selection, no priority scoring, no AI in v1 — order is whatever the user set on the Tasks screen. This is intentional: predictability beats cleverness for habit formation.

### 4.3 The timer's role

The timer is a **fixed-duration focus block**, set per task (e.g., 25 min). It is the spine of the loop. In v1:

- It counts **down** from the task's duration.
- When it hits zero, the app prompts gently: the task is "ready to close out" — the user confirms Done or chooses Skip / extend (extend handling is an edge case, see §9).
- The timer does **not** force-complete a task on its own. The human always presses the button. This keeps the user in the role of the one executing — the app measures, the user acts.

> Open design question, flagged here and in §13: whether reaching zero should auto-complete, prompt, or just keep counting up (overtime). The MVP default is **prompt at zero**, because it preserves the "human presses the button" principle while still marking the block as done.

---

## 5. Core flows (step by step)

Each flow below is written as the user experiences it. No screens are described in pixel terms — just what happens and why.

### 5.1 Flow: Running a focus session (the everyday flow)

This is the flow that happens dozens of times a day and must be perfect.

1. User opens the app. They land on **Focus**.
2. The current task title is shown, large and singular. The timer is already running.
3. The user does the actual work in the real world. The app sits quietly with the clock.
4. The user finishes early → taps **Done**. The session is logged as completed, the focus time is banked, and a short reward beat plays (see §5.6).
5. The next pending task auto-loads and its timer starts. The user is immediately back in the loop.
6. If instead the user can't or won't do the task → taps **Skip**. It's logged as skipped (calm tone), and the next task loads.
7. When no pending tasks remain, the loop ends and the user is taken to the **Day** summary (see §5.4).

**Why it's shaped this way:** the user never has to navigate, decide, or plan during execution. The only choices are "did I do it or not," which is exactly the choice that builds the habit.

### 5.2 Flow: Creating and ordering tasks

This is the *planning* surface — kept deliberately lightweight so it can't become a procrastination playground.

1. From Focus, the user goes to **Tasks**.
2. They add a task: a **title** and a **duration**. Duration can default to a sensible block (e.g., 25 min) so adding a task is nearly one-tap.
3. They add as many as they want for the day.
4. They reorder tasks by dragging — this sets execution order. The top of the list is what runs next.
5. They return to Focus and the queue is live.

**Constraints in v1:**

- Tasks are a flat list, no projects/tags/folders. One dimension: order.
- No due dates, no recurring tasks (a deferred nicety), no subtasks.
- Editing a task's title/duration is allowed while it's still `pending`. Editing the *currently running* task is an edge case (see §9).

**Why:** task creation should take seconds. The moment it becomes a "system to maintain," we've lost. The friction budget here is tiny on purpose.

### 5.3 Flow: First task of the day / empty state

1. New day, or first ever use. The queue is empty.
2. Focus shows an **empty state** that does one thing: invites the user to add their first task, with a single obvious action leading to Tasks.
3. The empty state is encouraging and minimal — it is *not* a dashboard, tips screen, or feature tour. Its only job is to get one task in and the user into a session.
4. Once a task exists, Focus immediately becomes the running loop.

### 5.4 Flow: Ending the day / Daily Summary

1. The day ends either because (a) the queue is emptied, or (b) the calendar day rolls over (see §9 for the rollover rule).
2. The user is shown the **Daily Summary**, an immutable card:
   - Tasks completed
   - Tasks skipped
   - Total focus time
   - Streak status (e.g., "Streak: 5 days")
3. The summary is a *record*, not editable. This immutability is intentional — it's an honest mirror of the day.
4. From the summary, the user can **share** it (see §5.7) or simply close it.

Example summary content:

```
Daily Summary
Completed: 3   Skipped: 1
Focus Time: 2h 10m
Streak: 5 days 🔥
```

### 5.5 Flow: Streak

1. The **Streak** surface shows the current streak number prominently and a simple day-by-day history (which days were "locked in" vs. broken).
2. The streak updates once per day based on one rule: **≥1 completed task keeps it alive; 0 breaks it to zero.**
3. The streak is the product's primary reward and its primary retention lever. It is shown in the daily summary and is the emotional core of the paywall (see §8).

### 5.6 The reward beat

After every Done, there's a brief, satisfying confirmation — a moment of feedback (motion, a sound, a count ticking up). This is small but load-bearing: it's the dopamine hit that makes the loop want to be repeated. In v1 this is intentionally understated and calm rather than loud and gamified, consistent with the "calm, non-punitive" design tone. It exists; it just doesn't shout.

### 5.7 Flow: Sharing an artifact

1. From the Daily Summary (and optionally the Streak surface), the user can generate a **clean, shareable image** of their stats.
2. The image is designed to look good as a screenshot on TikTok / X / Reddit: minimal, bold, identity-affirming ("locked in" energy).
3. The user shares via the OS share sheet to wherever they want.

**Why it's in the MVP:** the shareable artifact is one of the three pillars of the core bet (§1). The viral loop — *use → produce proof → share → attract users* — only exists if the proof is genuinely shareable and looks good. So this is in v1, not deferred.

### 5.8 Flow: Trial → paywall

Covered in detail in §8. In short: full access for 2 days, then a continuity-framed paywall.

---

## 6. Onboarding (in depth)

Onboarding is where most habit apps lose the user. LockedIn's onboarding has **one job**: get the user from install to *inside their first running focus session* as fast as possible, while planting the streak/identity hook. Everything that doesn't serve that is cut from onboarding.

### 6.1 Onboarding principles

- **End in a session, not a settings screen.** The last step of onboarding is the user looking at their first task with the timer running. The product is *demonstrated*, not explained.
- **Sell the identity, not the features.** The framing is "become someone who's locked in," not "here are our menus." We're recruiting the user into an identity they want.
- **Earn the first task immediately.** Onboarding should produce at least one real task the user actually intends to do today — not a fake demo task. The first win must be real.
- **As few screens as possible.** Target: the user is in a session within roughly a minute. Each screen must justify its existence.
- **No account, no permissions wall up front.** Don't gate the first session behind sign-up or notification permission. Ask for nothing until the value is felt. (Notification permission, if ever requested, comes *after* the first completed session.)

### 6.2 Onboarding flow, step by step

**Step 1 — The promise (1 screen).**
A single, bold statement of what LockedIn is and the identity it offers. Something in the spirit of *"Stop planning. Start executing. One task at a time."* One primary button: **Get started / Lock in.** No carousel of 6 feature slides. One screen, one idea, one tap forward.

**Step 2 — The frame (1 short screen, optional/condensable).**
A single beat that teaches the entire mental model in one breath: *"You'll do one task at a time. A timer runs. You hit Done or Skip. That's it."* This replaces a feature tour. It can be merged into Step 1 if testing shows two screens is one too many. The bar: after this, the user understands the loop without having to be taught again.

**Step 3 — Create the first real task (the pivotal step).**
The user is prompted to type the **one thing they want to do right now** and pick a duration (with a sensible default pre-filled, so it can be near one-tap). This is the most important screen in the whole app — it's where intention becomes a committed task. Copy should push for something *real and doable today*, not aspirational. Optionally, gently invite a second and third task, but one is enough to proceed.

**Step 4 — Drop straight into Focus.**
The instant the first task exists, the user is taken to the Focus screen and **the timer starts**. No "you're all set!" interstitial. The first thing they experience is the actual core loop, live, with their own real task. This is the moment the product proves itself.

**Step 5 — First completion → first reward → streak seeded.**
When the user completes that first task, they get the reward beat and see their **streak tick to Day 1**. This is the hook: they now have something (a streak) they don't want to lose. The identity ("I'm locked in") gets its first piece of evidence.

**Step 6 (deferred to after first win) — optional asks.**
*Only after* the first completion do we consider asking for anything that benefits us: an optional daily reminder (notification permission), or mentioning the trial. Never before the value is delivered.

### 6.3 What onboarding deliberately does NOT do

- No multi-slide feature carousel.
- No account creation / email / login.
- No upfront permission prompts (notifications, etc.).
- No settings, themes, or customization choices.
- No fake/demo task — the first task is the user's real one.
- No paywall on first run (the trial is running; the paywall comes at trial end).

### 6.4 Onboarding success definition

Onboarding worked if the user **completed at least one real focus session in their first sitting** and saw their streak hit Day 1. That single completed session is the leading indicator for whether they come back tomorrow.

---

## 7. Behavioral & state logic

### 7.1 The lifecycle of a task

```
pending  →  active  →  done
                    ↘  skipped
```

- **pending** — in the queue, waiting its turn.
- **active** — currently on the Focus screen with a running timer. Exactly one task is active at a time.
- **done** — completed by the user pressing Done; focus time is banked.
- **skipped** — user pressed Skip; logged calmly, no focus time banked.

A task moves from `pending` to `active` automatically when it reaches the front of the queue. It leaves `active` only by the user's action (Done or Skip).

### 7.2 The day as a session

A **day** is the unit of progress. Across a day the system accumulates: tasks completed, tasks skipped, total focus time, and an ordered timeline of what happened. At day's end this becomes the immutable Daily Summary. The session is what the streak reads from.

### 7.3 The streak rule (single source of truth)

> At the close of a day: if the user completed **at least one** task that day, the streak increments by 1. If they completed **zero**, the streak resets to 0.

That's the entire rule in v1. No partial credit, no freezes, no bonuses. Simplicity here is a feature — the user can hold the rule in their head, which is what makes it motivating.

### 7.4 Day rollover

The product needs a definition of "when does a day end." v1 default: the **local calendar day** (midnight in the user's timezone). This is the simplest honest rule. (A "your day ends at 4am" grace window is a reasonable future tweak for night owls — flagged in §13, not in v1.)

---

## 8. Monetization (MVP scaffolding)

### 8.1 Philosophy

The paywall is **continuity-based, not restriction-based**. We don't lock the core loop behind payment — the loop is what forms the habit, and a half-working free product can't form a habit. Instead, the paywall appears once the user has something to lose (a streak, a record of discipline) and frames payment as *preserving their momentum and identity* rather than *unlocking features*.

### 8.2 Free vs. Pro

**Free (always):** task creation, Focus mode, the timer, streak tracking, the daily summary, and the shareable artifact. The entire core loop is free, forever. This is deliberate — the loop is the growth engine, so it must be unobstructed.

**Pro:** advanced analytics, focus history, templates (Deep Work / Study Mode), journal export, themes, cloud sync.

**Pricing:** $2.99/month or $19.99/year.

### 8.3 Trial

- **2-day free trial** with full Pro access.
- The trial's job is to let the habit and streak start forming *before* any monetization friction appears.
- At trial end, the paywall appears.

### 8.4 What "Pro" realistically is in the MVP

Honest scoping: most listed Pro features (analytics, history, templates, export, themes, sync) are **[CUT]** from v1's actual functionality. So in the MVP, the trial + paywall is largely **scaffolding** — the surfaces, the timing logic, and the continuity-framed messaging exist and are testable, but the bag of Pro features behind them is thin at launch and fills in post-MVP.

> **Decision to confirm (see §13):** do we charge real money at MVP launch with a thin Pro tier, or run the paywall as a *measurement surface* (show it, measure intent/conversion to a waitlist or a "founding member" offer) until the Pro features are real? Recommendation: **measure first** — instrument the paywall and trial-end moment, but don't promise Pro features we haven't built. Charging for an empty Pro tier risks early-user trust, which is the one thing a habit product can't afford.

### 8.5 The paywall moment

At trial end the user sees a screen that leads with their **streak and their record** ("You're on a 6-day streak. Keep it going.") rather than a feature grid. The emotional lever is loss-of-momentum and identity continuity, not feature envy. It's calm and respectful — consistent with the product's tone — and gives a clear, non-dark-pattern way to continue free with the core loop intact.

---

## 9. Edge cases & decisions

These are the situations that will come up immediately in real use. v1 needs a defined answer for each.

| Situation | v1 behavior |
|---|---|
| **Timer hits zero** | Prompt the user to confirm Done (or Skip / extend). Don't auto-complete; the human presses the button. *(Flagged for testing — see §13.)* |
| **User wants more time on a task** | Allow a simple "add time" / continue-in-overtime on the active task. Keep it to one obvious action so it doesn't become a second decision surface. |
| **User closes the app mid-session** | On reopen, restore the active task and a sensible timer state. v1 default: resume where the block conceptually was (we don't punish the user for backgrounding). Exact resume vs. reset behavior flagged in §13. |
| **User adds a task while a session is running** | Allowed; it joins the queue. The running task is unaffected. |
| **User edits/deletes the currently active task** | Editing title/duration of the *active* task is restricted or limited in v1 to avoid timer ambiguity; deleting the active task ends that session cleanly and advances the queue. |
| **Empty queue** | Show the empty/first-task state (§5.3), not a broken Focus screen. |
| **Day rolls over mid-session** | The active session belongs to the day it started; the new day starts fresh. (Keep simple in v1.) |
| **Zero completions in a day** | Streak breaks to 0. Daily summary still generates and is honest about it, with a calm tone — no shaming. |
| **User reorders the queue mid-day** | Allowed for `pending` tasks; `done`/`skipped` tasks stay in the record. |
| **No tasks ever created** | Onboarding should prevent this by producing the first real task; if it still happens, the empty state guides them in. |

---

## 10. What the product remembers

At an explanation level (no schema, no tech), the MVP needs to persist three kinds of memory **on the device**:

1. **Tasks** — what the user wants to do: each has a title, a duration, a status (pending/active/done/skipped), and timestamps for when it was created and completed. Order matters and is remembered.
2. **Sessions / the day's record** — what actually happened: which tasks were completed vs. skipped, how much focus time was banked, and the timeline that becomes the immutable daily summary.
3. **User stats** — the rolled-up picture: current streak, total focus time, total tasks completed, total tasks skipped, and streak history by day.

Because v1 is device-local (no accounts, no cloud sync), all of this lives on the phone. The consequence — losing data if the app is deleted or the device is lost — is an accepted v1 trade-off, and it's the main thing cloud sync (a Pro feature) solves later.

---

## 11. Platform split (what each part of the monorepo does)

The build is a Turborepo monorepo. At the product level, responsibilities split cleanly:

### 11.1 Mobile app — *the product*

Expo / React Native (with NativeWind for styling). This is where the entire experience above lives: Focus, Tasks, Day, Streak, onboarding, the timer, the streak, the summary, sharing, trial/paywall surfaces. **All four core surfaces and the whole loop are mobile.** This is "mobile-first" in the truest sense — the phone *is* the product.

### 11.2 Marketing site — *acquisition*

Next.js, **static for v1**. Its only jobs:

- Explain what LockedIn is and show the loop (the "one task, one timer" promise).
- Show pricing.
- Drive to the app stores.
- Capture interested emails / waitlist (especially useful pre-launch and for the build-in-public audience).

No app functionality lives here. It's a billboard and a funnel, not a web version of the app.

### 11.3 Backend — *minimal in v1*

Hono. Given v1 is device-local with no accounts, the backend's role at MVP is **intentionally small**. Realistic v1 responsibilities are limited to things that genuinely need a server: e.g., waitlist/email capture from the marketing site, and possibly basic anonymous analytics event collection to measure the retention metrics in §12. Anything user-data-related (sync, accounts) is deferred with the Pro tier.

> **Decision to confirm (§13):** does the MVP need a backend *at all* on day one, or can waitlist capture and analytics ride on third-party services until accounts/sync are built? Keeping the backend near-empty is consistent with the "validate the loop first" thesis.

---

## 12. Success metrics

Per the spec, the metrics that matter are about **return and completion**, not vanity numbers.

**Primary:**

- **Day-1 retention** — did they come back the day after install?
- **Day-2 retention** — the early habit signal.
- **Day-7 retention** — the "this is becoming a habit" signal.
- **Streak continuation rate** — what share of users keep a streak alive across days.
- **Focus session completion rate** — of started sessions, how many end in Done vs. Skip.

**Secondary:**

- **Share rate per session / per summary** — is the viral artifact actually being shared?
- **Return sessions per day** — do people run the loop multiple times a day?

**Explicitly NOT primary:** downloads, installs. (Easy to inflate, weakly correlated with the actual bet.)

The first-session completion in onboarding (§6.4) is the earliest leading indicator and should be tracked from day one.

---

## 13. Open questions to resolve before / during build

These are genuine product decisions that this plan flags rather than silently assumes. Most have a recommended default already stated above.

1. **Timer-at-zero behavior** — prompt (recommended), auto-complete, or count up into overtime? Worth A/B testing once live.
2. **App-backgrounded resume** — exact resume vs. reset of the active timer. Recommendation: forgiving resume.
3. **Day boundary** — strict midnight (v1 default) vs. a 3–4am grace window for night owls.
4. **Charge at launch vs. measure first** — recommendation: instrument the paywall/trial-end as a measurement surface and don't sell a thin Pro tier until the Pro features are real.
5. **Does v1 need a backend at all** — or can waitlist + analytics ride on third-party tools until accounts/sync arrive?
6. **One optional daily reminder** — include a single gentle nudge, or zero notifications in v1?
7. **How hard to push for multiple tasks in onboarding** — one real task is the floor; is nudging for three worth the added friction?

---

## 14. One-paragraph summary

LockedIn's MVP is a device-local, mobile-first focus app whose entire reason for existing is to drop the user into a single running task the moment they open it, hold them to a fixed timer, and let them mark it Done or Skip — then immediately serve the next one. A day is a session; completing at least one task keeps a streak alive, and the streak (plus a clean, shareable proof-of-discipline summary) is the engine of both retention and growth. Onboarding's only goal is to get the user into their first real session within about a minute, ending on a live timer rather than a settings screen. The free tier includes the whole loop forever; a 2-day trial and a continuity-framed paywall are scaffolded in, though the Pro feature set behind them is thin at launch and mostly deferred. The Next.js site is a static billboard that drives to the stores, and the Hono backend stays near-empty until accounts and sync are actually needed. Everything not directly serving "do one task right now" is cut on purpose.
