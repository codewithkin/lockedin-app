import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { dayKey, isToday, isYesterday, newId } from "./date";
import { loadState, saveState } from "./storage";
import {
  type DayRecord,
  type Goal,
  type NotificationPrefs,
  type PersistedState,
  type Task,
  type TimerStyle,
} from "./types";

type AddTaskInput = { title: string; durationMin: number; goalId?: string | null };

type AppContextType = {
  ready: boolean;
  state: PersistedState;
  currentTask: Task | null;
  queue: Task[];
  today: { completed: number; skipped: number; focusSeconds: number };
  addGoal: (title: string) => Goal;
  addTask: (input: AddTaskInput) => void;
  removeTask: (id: string) => void;
  moveTask: (id: string, dir: "up" | "down") => void;
  reorderQueue: (orderedIds: string[]) => void;
  completeTask: (id: string, focusSeconds: number) => void;
  skipTask: (id: string) => void;
  completeOnboarding: (goalTitle: string, taskTitle: string, durationMin: number) => void;
  hideHintForever: (id: string) => void;
  editTask: (id: string, patch: { title?: string; durationMin?: number }) => void;
  extendSession: (minutes: number) => void;
  setPrimaryGoal: (id: string) => void;
  setTimerStyle: (style: TimerStyle) => void;
  setNotificationPref: (key: keyof NotificationPrefs, value: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function computeToday(tasks: Task[]) {
  let completed = 0;
  let skipped = 0;
  let focusSeconds = 0;
  for (const t of tasks) {
    if (!isToday(t.completedAt)) continue;
    if (t.status === "done") {
      completed += 1;
      focusSeconds += t.focusSeconds ?? 0;
    } else if (t.status === "skipped") {
      skipped += 1;
    }
  }
  return { completed, skipped, focusSeconds };
}

function upsertHistory(history: DayRecord[], record: DayRecord): DayRecord[] {
  const rest = history.filter((h) => h.date !== record.date);
  return [...rest, record].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<PersistedState>(() => ({
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
    timerStyle: "ring",
    notifications: {
      timerEnd: true,
      daily: true,
      streakRisk: true,
      taskNudge: true,
    },
  }));

  useEffect(() => {
    let mounted = true;
    loadState().then((loaded) => {
      if (!mounted) return;
      setState(loaded);
      setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  const addGoal = useCallback((title: string): Goal => {
    const goal: Goal = { id: newId(), title: title.trim(), createdAt: new Date().toISOString() };
    setState((s) => ({
      ...s,
      goals: [...s.goals, goal],
      primaryGoalId: s.primaryGoalId ?? goal.id,
    }));
    return goal;
  }, []);

  const addTask = useCallback((input: AddTaskInput) => {
    setState((s) => {
      const task: Task = {
        id: newId(),
        goalId: input.goalId ?? s.primaryGoalId ?? null,
        title: input.title.trim(),
        durationMin: input.durationMin,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      return { ...s, tasks: [...s.tasks, task] };
    });
  }, []);

  const removeTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  }, []);

  const moveTask = useCallback((id: string, dir: "up" | "down") => {
    setState((s) => {
      const pending = s.tasks.filter((t) => t.status === "pending");
      const idx = pending.findIndex((t) => t.id === id);
      if (idx < 0) return s;
      const swapWith = dir === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= pending.length) return s;
      const reordered = [...pending];
      [reordered[idx], reordered[swapWith]] = [reordered[swapWith], reordered[idx]];
      const others = s.tasks.filter((t) => t.status !== "pending");
      return { ...s, tasks: [...reordered, ...others] };
    });
  }, []);

  const reorderQueue = useCallback((orderedIds: string[]) => {
    setState((s) => {
      const pending = s.tasks.filter((t) => t.status === "pending");
      const byId = new Map(pending.map((t) => [t.id, t]));
      const reordered = orderedIds
        .map((id) => byId.get(id))
        .filter((t): t is Task => Boolean(t));
      const missing = pending.filter((t) => !orderedIds.includes(t.id));
      const others = s.tasks.filter((t) => t.status !== "pending");
      return { ...s, tasks: [...reordered, ...missing, ...others] };
    });
  }, []);

  const completeTask = useCallback((id: string, focusSeconds: number) => {
    setState((s) => {
      const todayBefore = computeToday(s.tasks).completed;
      const tasks = s.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "done" as const,
              completedAt: new Date().toISOString(),
              focusSeconds,
            }
          : t,
      );

      const stats = { ...s.stats };
      stats.totalFocusSeconds += focusSeconds;
      stats.tasksCompleted += 1;

      if (todayBefore === 0) {
        if (stats.lastActiveDate === dayKey()) {
          // already counted today; leave streak as is
        } else if (isYesterday(stats.lastActiveDate)) {
          stats.streak += 1;
        } else {
          stats.streak = 1;
        }
        stats.lastActiveDate = dayKey();
      }

      const t = computeToday(tasks);
      const history = upsertHistory(s.history, {
        date: dayKey(),
        completed: t.completed,
        skipped: t.skipped,
        focusSeconds: t.focusSeconds,
        streakAfter: stats.streak,
      });

      return { ...s, tasks, stats, history };
    });
  }, []);

  const skipTask = useCallback((id: string) => {
    setState((s) => {
      const tasks = s.tasks.map((t) =>
        t.id === id
          ? { ...t, status: "skipped" as const, completedAt: new Date().toISOString() }
          : t,
      );
      const stats = { ...s.stats, tasksSkipped: s.stats.tasksSkipped + 1 };
      const t = computeToday(tasks);
      const history = upsertHistory(s.history, {
        date: dayKey(),
        completed: t.completed,
        skipped: t.skipped,
        focusSeconds: t.focusSeconds,
        streakAfter: stats.streak,
      });
      return { ...s, tasks, stats, history };
    });
  }, []);

  const completeOnboarding = useCallback(
    (goalTitle: string, taskTitle: string, durationMin: number) => {
      setState((s) => {
        const goal: Goal = {
          id: newId(),
          title: goalTitle.trim() || "My goal",
          createdAt: new Date().toISOString(),
        };
        const task: Task = {
          id: newId(),
          goalId: goal.id,
          title: taskTitle.trim() || "First task",
          durationMin,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        return {
          ...s,
          onboarded: true,
          goals: [goal],
          tasks: [task],
          primaryGoalId: goal.id,
        };
      });
    },
    [],
  );

  const editTask = useCallback((id: string, patch: { title?: string; durationMin?: number }) => {
    setState((s) => {
      const tasks = s.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              ...(patch.title !== undefined ? { title: patch.title.trim() } : {}),
              ...(patch.durationMin !== undefined ? { durationMin: patch.durationMin } : {}),
            }
          : t,
      );
      let session = s.session;
      if (patch.durationMin !== undefined && s.session && s.session.taskId === id) {
        session = {
          ...s.session,
          durationSec: patch.durationMin * 60,
          startedAt: new Date().toISOString(),
        };
      }
      return { ...s, tasks, session };
    });
  }, []);

  const extendSession = useCallback((minutes: number) => {
    setState((s) =>
      s.session
        ? { ...s, session: { ...s.session, durationSec: s.session.durationSec + minutes * 60 } }
        : s,
    );
  }, []);

  const setPrimaryGoal = useCallback((id: string) => {
    setState((s) => ({ ...s, primaryGoalId: id }));
  }, []);

  const setTimerStyle = useCallback((style: TimerStyle) => {
    setState((s) => ({ ...s, timerStyle: style }));
  }, []);

  const setNotificationPref = useCallback((key: keyof NotificationPrefs, value: boolean) => {
    setState((s) => ({ ...s, notifications: { ...s.notifications, [key]: value } }));
  }, []);

  const hideHintForever = useCallback((id: string) => {
    setState((s) =>
      s.dismissedHints.includes(id)
        ? s
        : { ...s, dismissedHints: [...s.dismissedHints, id] },
    );
  }, []);

  const currentTask = useMemo(
    () => state.tasks.find((t) => t.status === "pending") ?? null,
    [state.tasks],
  );
  const queue = useMemo(() => state.tasks.filter((t) => t.status === "pending"), [state.tasks]);
  const today = useMemo(() => computeToday(state.tasks), [state.tasks]);

  // Keep a single focus session aligned with the current task.
  useEffect(() => {
    if (!ready) return;
    setState((s) => {
      const cur = s.tasks.find((t) => t.status === "pending") ?? null;
      if (!cur) return s.session ? { ...s, session: null } : s;
      if (s.session && s.session.taskId === cur.id) return s;
      return {
        ...s,
        session: {
          taskId: cur.id,
          startedAt: new Date().toISOString(),
          durationSec: cur.durationMin * 60,
        },
      };
    });
  }, [currentTask?.id, ready]);

  const value = useMemo(
    () => ({
      ready,
      state,
      currentTask,
      queue,
      today,
      addGoal,
      addTask,
      removeTask,
      moveTask,
      reorderQueue,
      completeTask,
      skipTask,
      completeOnboarding,
      hideHintForever,
      editTask,
      extendSession,
      setPrimaryGoal,
      setTimerStyle,
      setNotificationPref,
    }),
    [
      ready,
      state,
      currentTask,
      queue,
      today,
      addGoal,
      addTask,
      removeTask,
      moveTask,
      reorderQueue,
      completeTask,
      skipTask,
      completeOnboarding,
      hideHintForever,
      editTask,
      extendSession,
      setPrimaryGoal,
      setTimerStyle,
      setNotificationPref,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
