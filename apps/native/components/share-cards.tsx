import { Ionicons } from "@expo/vector-icons";
import { forwardRef } from "react";
import { View } from "react-native";

import { ProgressBar } from "@/components/primitives";
import { BodyStrong, Caption, Display, Label, Title } from "@/components/typography";
import { SITE } from "@/lib/brand";
import { formatDateLabel, formatDuration } from "@/lib/date";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";
import { type Goal, type Task } from "@/lib/types";

const WIDTH = 340;

const ShareFrame = forwardRef<View, { children: React.ReactNode }>(function ShareFrame(
  { children },
  ref,
) {
  return (
    <View
      ref={ref}
      collapsable={false}
      style={{
        width: WIDTH,
        backgroundColor: COLORS.ink,
        borderRadius: RADIUS.x2,
        borderWidth: 1,
        borderColor: COLORS.coralDeep,
        padding: 26,
        overflow: "hidden",
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -100,
          right: -70,
          width: 280,
          height: 280,
          borderRadius: 140,
          backgroundColor: COLORS.coral,
          opacity: 0.16,
        }}
      />

      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Ionicons name="flame" size={16} color={COLORS.coral} />
        <Label>ExcuseLess</Label>
      </View>

      <View style={{ marginTop: 18 }}>{children}</View>

      <View
        style={{
          marginTop: 24,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: COLORS.line,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Caption style={{ fontFamily: FONTS.monoMedium }} color={COLORS.coral}>
          {SITE}
        </Caption>
        <Caption style={{ fontFamily: FONTS.monoMedium }}>{formatDateLabel()}</Caption>
      </View>
    </View>
  );
});

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View>
      <Title style={{ fontSize: 24, lineHeight: 28 }} color={accent ? COLORS.coral : COLORS.fg}>
        {value}
      </Title>
      <Label style={{ marginTop: 4, color: COLORS.subtle }}>{label}</Label>
    </View>
  );
}

function TaskLine({ task }: { task: Task }) {
  const done = task.status === "done";
  const struck = task.status === "done" || task.status === "skipped";
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Ionicons
        name={done ? "checkmark-circle" : task.status === "skipped" ? "close-circle" : "ellipse-outline"}
        size={16}
        color={done ? COLORS.coral : COLORS.subtle}
      />
      <BodyStrong
        style={{ flex: 1, fontSize: 14, textDecorationLine: struck ? "line-through" : "none" }}
        color={struck ? COLORS.subtle : COLORS.fg}
      >
        {task.title}
      </BodyStrong>
    </View>
  );
}

export const TodayShareCard = forwardRef<
  View,
  { streak: number; done: number; focusSeconds: number; tasks: Task[] }
>(function TodayShareCard({ streak, done, focusSeconds, tasks }, ref) {
  return (
    <ShareFrame ref={ref}>
      <Display style={{ fontSize: 40, lineHeight: 44 }}>Today</Display>
      <Caption style={{ marginTop: 6 }}>
        {streak} day{streak === 1 ? "" : "s"} unbroken. No excuses.
      </Caption>

      <View style={{ flexDirection: "row", gap: 28, marginTop: 22 }}>
        <Stat label="Done" value={String(done)} />
        <Stat label="Focused" value={formatDuration(focusSeconds)} />
        <Stat label="Streak" value={String(streak)} accent />
      </View>

      {tasks.length > 0 ? (
        <View style={{ marginTop: 22, gap: 8 }}>
          {tasks.slice(0, 6).map((t) => (
            <TaskLine key={t.id} task={t} />
          ))}
        </View>
      ) : null}
    </ShareFrame>
  );
});

export const TaskShareCard = forwardRef<View, { task: Task; streak: number }>(
  function TaskShareCard({ task, streak }, ref) {
    return (
      <ShareFrame ref={ref}>
        <Label>Task done</Label>
        <Display style={{ marginTop: 10, fontSize: 32, lineHeight: 36 }}>{task.title}</Display>
        <View style={{ flexDirection: "row", gap: 28, marginTop: 22 }}>
          <Stat label="Focused" value={`${task.focusSeconds ? formatDuration(task.focusSeconds) : `${task.durationMin}m`}`} />
          <Stat label="Streak" value={String(streak)} accent />
        </View>
        <Caption style={{ marginTop: 18 }}>No excuses. One task at a time.</Caption>
      </ShareFrame>
    );
  },
);

export const StreakShareCard = forwardRef<
  View,
  { streak: number; tasksCompleted: number; totalFocusSeconds: number }
>(function StreakShareCard({ streak, tasksCompleted, totalFocusSeconds }, ref) {
  return (
    <ShareFrame ref={ref}>
      <View style={{ alignItems: "center", paddingVertical: 8 }}>
        <Ionicons name="flame" size={40} color={COLORS.coral} />
        <Display style={{ fontSize: 64, lineHeight: 68, marginTop: 8 }} color={COLORS.coral}>
          {streak}
        </Display>
        <Caption>day{streak === 1 ? "" : "s"} unbroken</Caption>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 36, marginTop: 14 }}>
        <Stat label="Tasks done" value={String(tasksCompleted)} />
        <Stat label="Focused" value={formatDuration(totalFocusSeconds)} />
      </View>
    </ShareFrame>
  );
});

export const GoalShareCard = forwardRef<
  View,
  { goal: Goal; done: number; total: number; tasks: Task[] }
>(function GoalShareCard({ goal, done, total, tasks }, ref) {
  return (
    <ShareFrame ref={ref}>
      <Label>Goal</Label>
      <Display style={{ marginTop: 10, fontSize: 30, lineHeight: 34 }}>{goal.title}</Display>
      <Caption style={{ marginTop: 8 }}>
        {done} of {total} done
      </Caption>
      <View style={{ marginTop: 12 }}>
        <ProgressBar value={done} total={total} />
      </View>

      {tasks.length > 0 ? (
        <View style={{ marginTop: 20, gap: 8 }}>
          {tasks.slice(0, 7).map((t) => (
            <TaskLine key={t.id} task={t} />
          ))}
        </View>
      ) : null}
    </ShareFrame>
  );
});
