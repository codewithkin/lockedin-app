import { isToday } from "./date";
import { type Goal, type Task } from "./types";

export type GoalStats = {
  done: number;
  total: number;
  dueToday: number;
  pct: number;
};

export function goalStats(tasks: Task[], goalId: string): GoalStats {
  const mine = tasks.filter((t) => t.goalId === goalId);
  const done = mine.filter((t) => t.status === "done").length;
  const total = mine.length;
  const dueToday = mine.filter((t) => t.status === "pending").length;
  return { done, total, dueToday, pct: total > 0 ? done / total : 0 };
}

export function completedToday(tasks: Task[]): Task[] {
  return tasks
    .filter((t) => t.status === "done" && isToday(t.completedAt))
    .sort((a, b) => (a.completedAt && b.completedAt && a.completedAt < b.completedAt ? 1 : -1));
}

export function skippedToday(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.status === "skipped" && isToday(t.completedAt));
}

export function lastCompletedToday(tasks: Task[]): Task | null {
  return completedToday(tasks)[0] ?? null;
}

export function pendingForGoal(tasks: Task[], goalId: string | null): Task[] {
  return tasks.filter((t) => t.status === "pending" && t.goalId === goalId);
}

export type GoalGroup = { goal: Goal | null; tasks: Task[] };

// Pending tasks grouped by goal, primary goal first, then by goal order.
export function pendingByGoal(
  tasks: Task[],
  goals: Goal[],
  primaryGoalId: string | null,
): GoalGroup[] {
  const ordered = [...goals].sort((a, b) => {
    if (a.id === primaryGoalId) return -1;
    if (b.id === primaryGoalId) return 1;
    return 0;
  });
  const groups: GoalGroup[] = [];
  for (const goal of ordered) {
    const mine = pendingForGoal(tasks, goal.id);
    if (mine.length > 0) groups.push({ goal, tasks: mine });
  }
  const orphans = pendingForGoal(tasks, null);
  if (orphans.length > 0) groups.push({ goal: null, tasks: orphans });
  return groups;
}

// The next pending task in the same goal, after the given task in queue order.
export function nextInGoal(tasks: Task[], goalId: string | null, afterTaskId: string): Task | null {
  const pending = tasks.filter((t) => t.status === "pending" && t.goalId === goalId);
  const idx = pending.findIndex((t) => t.id === afterTaskId);
  if (idx >= 0) return pending[idx + 1] ?? null;
  return pending[0] ?? null;
}

// All of a goal's tasks for the bottom sheet: pending first, then today's done/skipped.
export function goalSheetTasks(tasks: Task[], goalId: string | null): Task[] {
  const pending = tasks.filter((t) => t.status === "pending" && t.goalId === goalId);
  const settled = tasks.filter(
    (t) =>
      t.goalId === goalId &&
      (t.status === "done" || t.status === "skipped") &&
      isToday(t.completedAt),
  );
  return [...pending, ...settled];
}
