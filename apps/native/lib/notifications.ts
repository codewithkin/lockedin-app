import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { COLORS } from "./theme";

export const NOTIF_ID = {
  timerEnd: "lockedin.timer-end",
  daily: "lockedin.daily-reminder",
  streakRisk: "lockedin.streak-risk",
  taskNudge: "lockedin.task-nudge",
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationSetup(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "LockedIn",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 200, 100, 200],
      lightColor: COLORS.coral,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

async function cancel(id: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // not scheduled
  }
}

function todayAt(hour: number, minute: number): Date {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

// Fires when the focus session's time runs out (even if backgrounded).
export async function scheduleTimerEnd(seconds: number, taskTitle: string) {
  await cancel(NOTIF_ID.timerEnd);
  if (seconds <= 0) return;
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID.timerEnd,
    content: {
      title: "Time's up",
      body: `"${taskTitle}" — close it out or add a few minutes.`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, Math.round(seconds)),
    },
  });
}

export const cancelTimerEnd = () => cancel(NOTIF_ID.timerEnd);

// A daily nudge to start the day.
export async function scheduleDailyReminder(hour = 9, minute = 0) {
  await cancel(NOTIF_ID.daily);
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID.daily,
    content: {
      title: "Lock in",
      body: "One task. One timer. Start your day.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export const cancelDailyReminder = () => cancel(NOTIF_ID.daily);

// Evening reminder, only while the streak is still at risk today.
export async function scheduleStreakRisk(hour = 20, minute = 0) {
  await cancel(NOTIF_ID.streakRisk);
  const when = todayAt(hour, minute);
  if (when.getTime() <= Date.now() + 60_000) return;
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID.streakRisk,
    content: {
      title: "Your streak's on the line",
      body: "Finish one task before midnight to keep it alive.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: when,
    },
  });
}

export const cancelStreakRisk = () => cancel(NOTIF_ID.streakRisk);

// Midday nudge while tasks are still queued.
export async function scheduleTaskNudge(count: number, hour = 13, minute = 0) {
  await cancel(NOTIF_ID.taskNudge);
  if (count <= 0) return;
  const when = todayAt(hour, minute);
  if (when.getTime() <= Date.now() + 60_000) return;
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID.taskNudge,
    content: {
      title: "Tasks waiting",
      body: `You've got ${count} task${count === 1 ? "" : "s"} queued. Knock one out.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: when,
    },
  });
}

export const cancelTaskNudge = () => cancel(NOTIF_ID.taskNudge);
