import { useEffect } from "react";

import {
  cancelDailyReminder,
  cancelStreakRisk,
  cancelTaskNudge,
  cancelTimerEnd,
  ensureNotificationSetup,
  scheduleDailyReminder,
  scheduleStreakRisk,
  scheduleTaskNudge,
  scheduleTimerEnd,
} from "@/lib/notifications";
import { useApp } from "@/lib/store";

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { state, today, queue } = useApp();
  const onboarded = state.onboarded;
  const session = state.session;
  const prefs = state.notifications;
  const sessionKey = session
    ? `${session.taskId}:${session.startedAt}:${session.durationSec}`
    : "none";

  // Ask once (after onboarding).
  useEffect(() => {
    if (!onboarded) return;
    ensureNotificationSetup();
  }, [onboarded]);

  // Daily reminder.
  useEffect(() => {
    if (!onboarded) return;
    if (prefs.daily) scheduleDailyReminder(9, 0);
    else cancelDailyReminder();
  }, [onboarded, prefs.daily]);

  // Timer-finished notification tracks the active focus session.
  useEffect(() => {
    if (!onboarded) return;
    if (!session || !prefs.timerEnd) {
      cancelTimerEnd();
      return;
    }
    const endMs = new Date(session.startedAt).getTime() + session.durationSec * 1000;
    const seconds = Math.round((endMs - Date.now()) / 1000);
    const task = state.tasks.find((t) => t.id === session.taskId);
    scheduleTimerEnd(seconds, task?.title ?? "Your task");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey, onboarded, prefs.timerEnd]);

  // Streak reminder only while today's streak is still at risk.
  useEffect(() => {
    if (!onboarded) return;
    if (prefs.streakRisk && today.completed === 0) scheduleStreakRisk();
    else cancelStreakRisk();
  }, [today.completed, onboarded, prefs.streakRisk]);

  // Midday nudge only while tasks are queued.
  useEffect(() => {
    if (!onboarded) return;
    if (prefs.taskNudge && queue.length > 0) scheduleTaskNudge(queue.length);
    else cancelTaskNudge();
  }, [queue.length, onboarded, prefs.taskNudge]);

  return <>{children}</>;
}
