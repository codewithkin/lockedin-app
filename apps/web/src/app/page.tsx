import { PlayBadge } from "@/components/play-badge";
import { WaitlistForm } from "@/components/waitlist-form";

const steps = [
  {
    n: "01",
    title: "Open it.",
    body: "Your current task is right there. The timer's already running.",
  },
  {
    n: "02",
    title: "Do the one thing.",
    body: "No list to browse, no decisions. Just the task in front of you.",
  },
  {
    n: "03",
    title: "Done or Skip.",
    body: "Mark it and the next task loads instantly. Keep the loop going.",
  },
];

function CtaWithNote({ centered = false }: { centered?: boolean }) {
  return (
    <div className={centered ? "flex flex-col items-center gap-2" : "flex flex-col gap-2"}>
      <PlayBadge />
      <span className="text-xs text-neutral-500">iOS coming soon.</span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6">
      {/* Hero */}
      <section className="flex min-h-[88vh] flex-col justify-center py-24">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-[#f0541e]">LockedIn</p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-7xl">
          Stop scrolling.
          <br />
          Start executing.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-neutral-400">
          LockedIn turns your day into one focused loop. One task. One timer. Done. Next.
        </p>
        <div className="mt-10">
          <CtaWithNote />
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-neutral-900 py-24">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          You don&apos;t need another planner.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-400">
          You&apos;ve got the apps. The lists. The color-coded systems. And you&apos;re still not
          doing the thing. The problem was never planning — it&apos;s execution. LockedIn skips the
          planning theater and puts you straight into the work.
        </p>
      </section>

      {/* How it works */}
      <section className="border-t border-neutral-900 py-24">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          One loop. That&apos;s the whole app.
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-neutral-800 bg-[#121212] p-6">
              <p className="font-mono text-sm text-[#f0541e]">{s.n}</p>
              <h3 className="mt-4 text-xl font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-neutral-400">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-neutral-500">No dashboards. No setup. Just the next right action.</p>
      </section>

      {/* Goals to Tasks */}
      <section className="border-t border-neutral-900 py-24">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Set a goal. Break it into tasks. Execute.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-400">
          Pick what you&apos;re working toward. Drop the tasks under it. LockedIn feeds them to you
          one at a time, in order — so a big goal becomes the next single thing you do.
        </p>
      </section>

      {/* Streak */}
      <section className="border-t border-neutral-900 py-24">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Finish one task a day. Keep the streak alive.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-400">
          Show up, do one thing, and your streak grows. Miss a day and it resets. Simple enough to
          hold in your head — and surprisingly hard to break once it&apos;s going.
        </p>
      </section>

      {/* Proof */}
      <section className="border-t border-neutral-900 py-24">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Discipline you can actually see.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-400">
          Every day, LockedIn turns your focus into a clean summary — tasks done, time focused,
          streak intact. Post it. Or just keep it for yourself. Either way, the receipts are real.
        </p>
      </section>

      {/* Pricing */}
      <section className="border-t border-neutral-900 py-24">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          The loop is free. Forever.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-400">
          Tasks, the timer, the streak, your daily summary — all free, for good. Go Pro when you
          want deeper history, themes, and sync.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-neutral-800 bg-[#121212] p-6">
            <p className="text-sm uppercase tracking-wide text-neutral-500">Free</p>
            <p className="mt-3 text-neutral-300">
              Goals &amp; tasks · Focus timer · Streak · Daily summary · Shareable cards
            </p>
          </div>
          <div className="rounded-2xl border border-[#f0541e]/40 bg-[#121212] p-6">
            <p className="text-sm uppercase tracking-wide text-[#f0541e]">Pro</p>
            <p className="mt-3 text-2xl font-semibold text-white">
              $2.99<span className="text-base font-normal text-neutral-500">/mo</span>
              <span className="text-base font-normal text-neutral-500"> · $19.99/yr</span>
            </p>
            <p className="mt-3 text-neutral-400">
              Advanced history, templates, themes, export, sync. 2-day free trial.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-neutral-900 py-28 text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Lock in today.
        </h2>
        <p className="mt-4 text-lg text-neutral-400">One task. One timer. Start the streak.</p>
        <div className="mt-10 flex justify-center">
          <CtaWithNote centered />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#f0541e]">LockedIn</p>
            <p className="mt-3 max-w-xs text-sm text-neutral-500">
              One task. One timer. Discipline, made visible.
            </p>
            <div className="mt-6">
              <PlayBadge />
              <p className="mt-2 text-xs text-neutral-600">iOS coming soon.</p>
            </div>
          </div>
          <div className="max-w-sm">
            <p className="text-sm font-medium text-neutral-200">iPhone user? Be first in line.</p>
            <div className="mt-3">
              <WaitlistForm />
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-neutral-900 pt-8 text-xs text-neutral-600 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} LockedIn</span>
          <span className="flex gap-5">
            <a href="/privacy" className="hover:text-neutral-400">
              Privacy
            </a>
            <a href="/terms" className="hover:text-neutral-400">
              Terms
            </a>
          </span>
        </div>
      </footer>
    </main>
  );
}
