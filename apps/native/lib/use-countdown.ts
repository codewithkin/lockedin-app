import { useEffect, useState } from "react";

import { useApp } from "./store";

export type Countdown = {
  active: boolean;
  remaining: number;
  total: number;
  elapsed: number;
  paused: boolean;
};

export function useCountdown(): Countdown {
  const { state } = useApp();
  const session = state.session;
  const paused = !!session?.pausedAt;
  const [, force] = useState(0);

  useEffect(() => {
    if (!session || paused) return;
    const id = setInterval(() => force((n) => (n + 1) % 1_000_000), 1000);
    return () => clearInterval(id);
  }, [session?.taskId, session?.startedAt, session?.durationSec, paused]);

  if (!session) return { active: false, remaining: 0, total: 0, elapsed: 0, paused: false };

  const now = Date.now();
  const started = new Date(session.startedAt).getTime();
  const pausedExtra = session.pausedAt ? (now - new Date(session.pausedAt).getTime()) / 1000 : 0;
  const elapsed = Math.max(
    0,
    Math.floor((now - started) / 1000 - session.pausedAccumSec - pausedExtra),
  );
  const remaining = Math.max(0, session.durationSec - elapsed);
  return { active: true, remaining, total: session.durationSec, elapsed, paused };
}
