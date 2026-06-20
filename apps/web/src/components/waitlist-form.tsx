"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-sm text-neutral-300">
        You&apos;re on the list. We&apos;ll ping you when iOS drops.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-neutral-400"
      />
      <button
        type="submit"
        className="rounded-xl bg-[#f0541e] px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
      >
        Notify me
      </button>
    </form>
  );
}
