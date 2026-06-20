"use client";

import { Button } from "@lockedin/ui/components/button";
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
      <p className="font-mono text-sm text-subtle">
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
        className="flex-1 rounded-full border border-line bg-elevated px-5 py-3 text-sm text-fg outline-none placeholder:text-subtle focus:border-coral"
      />
      <Button type="submit" size="lg" className="h-12 rounded-full px-6 text-sm font-semibold">
        Notify me
      </Button>
    </form>
  );
}
