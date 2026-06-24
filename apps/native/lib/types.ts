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

export type FocusSession = {
  taskId: string;
  startedAt: string;
  durationSec: number;
  pausedAt: string | null;
  pausedAccumSec: number;
};

export type TimerStyle = "ring" | "numerals" | "ambient";

export type NotificationPrefs = {
  timerEnd: boolean;
  daily: boolean;
  streakRisk: boolean;
  taskNudge: boolean;
};

export type PersistedState = {
  onboarded: boolean;
  goals: Goal[];
  tasks: Task[];
  stats: Stats;
  history: DayRecord[];
  dismissedHints: string[];
  primaryGoalId: string | null;
  session: FocusSession | null;
  activeTaskId: string | null;
  timerStyle: TimerStyle;
  notifications: NotificationPrefs;
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
  dismissedHints: [],
  primaryGoalId: null,
  session: null,
  activeTaskId: null,
  timerStyle: "ring",
  notifications: {
    timerEnd: true,
    daily: true,
    streakRisk: true,
    taskNudge: true,
  },
};
