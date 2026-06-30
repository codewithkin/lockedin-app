import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { dayKey, isToday, isYesterday, newId } from "./date";
import { loadState, saveState } from "./storage";
import {
  type DayRecord,
  type FocusSession,
  type Goal,
  type NotificationPrefs,
  type PersistedState,
  type Task,
  type TimerStyle,
} from "./types";

type AddTaskInput = { title: string; durationMin: number; goalId?: string | null };

export type OnboardingInput = {
  focusAreas: string[];
  reason: string | null;
  areaForHabit: string;
  habitTitle: string;
  durationMin: number;
};

type AppContextType = {
  ready: boolean;
  state: PersistedState;
  currentTask: Task | null;
  queue: Task[];
  today: { completed: number; skipped: number; focusSeconds: number };
  addGoal: (title: string) => Goal;
  editGoal: (id: string, title: string) => void;
  removeGoal: (id: string) => void;
  addTask: (input: AddTaskInput) => void;
  addTasks: (inputs: AddTaskInput[]) => void;
  removeTask: (id: string) => void;
  moveTask: (id: string, dir: "up" | "down") => void;
  reorderQueue: (orderedIds: string[]) => void;
  setActiveTask: (id: string) => void;
  clearActiveTask: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeTask: (id: string, focusSeconds: number) => void;
  skipTask: (id: string) => void;
  completeOnboarding: (input: OnboardingInput) => void;
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

function makeSession(task: Task): FocusSession {
  return {
    taskId: task.id,
    startedAt: new Date().toISOString(),
    durationSec: task.durationMin * 60,
    pausedAt: null,
    pausedAccumSec: 0,
  };
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
    activeTaskId: null,
    timerStyle: "ring",
    notifications: {
      timerEnd: true,
      daily: true,
      streakRisk: true,
      taskNudge: true,
    },
    profile: {
      focusAreas: [],
      reason: null,
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

  const editGoal = useCallback((id: string, title: string) => {
    setState((s) => ({
      ...s,
      goals: s.goals.map((g) => (g.id === id ? { ...g, title: title.trim() } : g)),
    }));
  }, []);

  const removeGoal = useCallback((id: string) => {
    setState((s) => {
      const tasks = s.tasks.filter((t) => t.goalId !== id);
      const goals = s.goals.filter((g) => g.id !== id);
      const primaryGoalId = s.primaryGoalId === id ? (goals[0]?.id ?? null) : s.primaryGoalId;
      const clearedActive = s.tasks.some((t) => t.goalId === id && t.id === s.activeTaskId);
      return {
        ...s,
        tasks,
        goals,
        primaryGoalId,
        activeTaskId: clearedActive ? null : s.activeTaskId,
        session: clearedActive ? null : s.session,
      };
    });
  }, []);

  const buildTask = (input: AddTaskInput, primaryGoalId: string | null): Task => ({
    id: newId(),
    goalId: input.goalId ?? primaryGoalId ?? null,
    title: input.title.trim(),
    durationMin: input.durationMin,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  const addTask = useCallback((input: AddTaskInput) => {
    setState((s) => ({ ...s, tasks: [...s.tasks, buildTask(input, s.primaryGoalId)] }));
  }, []);

  const addTasks = useCallback((inputs: AddTaskInput[]) => {
    const valid = inputs.filter((i) => i.title.trim().length > 0);
    if (valid.length === 0) return;
    setState((s) => ({
      ...s,
      tasks: [...s.tasks, ...valid.map((i) => buildTask(i, s.primaryGoalId))],
    }));
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

  const setActiveTask = useCallback((id: string) => {
    setState((s) => {
      const task = s.tasks.find((t) => t.id === id && t.status === "pending");
      if (!task) return s;
      return { ...s, activeTaskId: id, session: makeSession(task) };
    });
  }, []);

  const clearActiveTask = useCallback(() => {
    setState((s) => ({ ...s, activeTaskId: null, session: null }));
  }, []);

  const pauseSession = useCallback(() => {
    setState((s) =>
      s.session && !s.session.pausedAt
        ? { ...s, session: { ...s.session, pausedAt: new Date().toISOString() } }
        : s,
    );
  }, []);

  const resumeSession = useCallback(() => {
    setState((s) => {
      if (!s.session || !s.session.pausedAt) return s;
      const pausedFor = (Date.now() - new Date(s.session.pausedAt).getTime()) / 1000;
      return {
        ...s,
        session: {
          ...s.session,
          pausedAt: null,
          pausedAccumSec: s.session.pausedAccumSec + Math.max(0, pausedFor),
        },
      };
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

      const clearActive = s.activeTaskId === id;
      return {
        ...s,
        tasks,
        stats,
        history,
        activeTaskId: clearActive ? null : s.activeTaskId,
        session: clearActive ? null : s.session,
      };
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
      const clearActive = s.activeTaskId === id;
      return {
        ...s,
        tasks,
        stats,
        history,
        activeTaskId: clearActive ? null : s.activeTaskId,
        session: clearActive ? null : s.session,
      };
    });
  }, []);

  const completeOnboarding = useCallback(
    (input: OnboardingInput) => {
      setState((s) => {
        const now = new Date().toISOString();
        const areaTitles =
          input.focusAreas.length > 0
            ? input.focusAreas
            : [input.areaForHabit.trim() || "My habits"];
        const goals: Goal[] = areaTitles.map((title) => ({
          id: newId(),
          title: title.trim(),
          createdAt: now,
        }));
        const habitArea = input.areaForHabit.trim();
        const habitGoal = goals.find((g) => g.title === habitArea) ?? goals[0];
        const task: Task = {
          id: newId(),
          goalId: habitGoal.id,
          title: input.habitTitle.trim() || "First habit",
          durationMin: input.durationMin,
          status: "pending",
          createdAt: now,
        };
        return {
          ...s,
          onboarded: true,
          goals,
          tasks: [task],
          primaryGoalId: habitGoal.id,
          activeTaskId: null,
          session: null,
          profile: { focusAreas: input.focusAreas, reason: input.reason },
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
        session = { ...s.session, durationSec: patch.durationMin * 60 };
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
    () =>
      state.activeTaskId
        ? (state.tasks.find((t) => t.id === state.activeTaskId && t.status === "pending") ?? null)
        : null,
    [state.tasks, state.activeTaskId],
  );
  const queue = useMemo(() => state.tasks.filter((t) => t.status === "pending"), [state.tasks]);
  const today = useMemo(() => computeToday(state.tasks), [state.tasks]);

  // If the active task vanished (removed/edited away), drop the session.
  useEffect(() => {
    if (!ready) return;
    setState((s) => {
      if (!s.activeTaskId) return s.session ? { ...s, session: null } : s;
      const stillThere = s.tasks.some(
        (t) => t.id === s.activeTaskId && t.status === "pending",
      );
      return stillThere ? s : { ...s, activeTaskId: null, session: null };
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
      editGoal,
      removeGoal,
      addTask,
      addTasks,
      removeTask,
      moveTask,
      reorderQueue,
      setActiveTask,
      clearActiveTask,
      pauseSession,
      resumeSession,
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
      editGoal,
      removeGoal,
      addTask,
      addTasks,
      removeTask,
      moveTask,
      reorderQueue,
      setActiveTask,
      clearActiveTask,
      pauseSession,
      resumeSession,
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
