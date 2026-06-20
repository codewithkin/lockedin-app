import { isToday } from "./date";
import { type Task } from "./types";

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
