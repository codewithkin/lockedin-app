export type TaskStatus = "pending" | "active" | "done" | "skipped";

export type Goal = {
  id: string;
  title: string;
  createdAt: string;
};

export type Task = {
  id: string;
  goalId: string | null;
  title: string;
  durationMin: number;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  focusSeconds?: number;
};

export type DayRecord = {
  date: string;
  completed: number;
  skipped: number;
  focusSeconds: number;
  streakAfter: number;
};

export type Stats = {
  streak: number;
  lastActiveDate: string | null;
  totalFocusSeconds: number;
  tasksCompleted: number;
  tasksSkipped: number;
};

export type PersistedState = {
  onboarded: boolean;
  goals: Goal[];
  tasks: Task[];
  stats: Stats;
  history: DayRecord[];
};

export const emptyState: PersistedState = {
  onboarded: false,
  goals: [],
  tasks: [],
  stats: {
    streak: 0,
    lastActiveDate: null,
    totalFocusSeconds: 0,
    tasksCompleted: 0,
    tasksSkipped: 0,
  },
  history: [],
};
