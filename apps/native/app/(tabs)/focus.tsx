import { Ionicons } from "@expo/vector-icons";
import type BottomSheet from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/buttons";
import { FocusBackground } from "@/components/focus-background";
import { FocusChooser } from "@/components/focus-chooser";
import { GoalTasksSheet } from "@/components/goal-tasks-sheet";
import { Card } from "@/components/primitives";
import { AmbientTimer } from "@/components/timers/ambient-timer";
import { NumeralsTimer } from "@/components/timers/numerals-timer";
import { RingTimer } from "@/components/timers/ring-timer";
import { type TimerVariantProps } from "@/components/timers/types";
import { Body, BodyMuted, Caption, Label, Title } from "@/components/typography";
import { nextInGoal } from "@/lib/selectors";
import { playStartFocus, playTaskComplete } from "@/lib/sounds";
import { useApp } from "@/lib/store";
import { type Task } from "@/lib/types";
import { useCountdown } from "@/lib/use-countdown";
import { COLORS } from "@/lib/theme";

export default function Focus() {
  const router = useRouter();
  const {
    currentTask,
    queue,
    state,
    today,
    setActiveTask,
    completeTask,
    skipTask,
    pauseSession,
    resumeSession,
  } = useApp();
  const countdown = useCountdown();
  const sheetRef = useRef<BottomSheet>(null);
  const [nextUp, setNextUp] = useState<Task | null>(null);

  // Keep the screen awake only while a session is actually running (not paused).
  useFocusEffect(
    useCallback(() => {
      if (!countdown.active || countdown.paused) return;
      activateKeepAwakeAsync("lockedin-focus");
      return () => deactivateKeepAwake("lockedin-focus");
    }, [countdown.active, countdown.paused]),
  );

  // Start chime when a new task becomes active.
  const prevTaskId = useRef<string | null>(null);
  useEffect(() => {
    const id = currentTask?.id ?? null;
    if (id && prevTaskId.current !== null && prevTaskId.current !== id) playStartFocus();
    prevTaskId.current = id;
  }, [currentTask?.id]);

  // Just finished a task → confirm what's next.
  if (nextUp) {
    const goal = state.goals.find((g) => g.id === nextUp.goalId);
    return (
      <NextUpConfirm
        task={nextUp}
        goalTitle={goal?.title}
        onStart={() => {
          setActiveTask(nextUp.id);
          setNextUp(null);
        }}
        onPickAnother={() => setNextUp(null)}
      />
    );
  }

  // No active task → the goal-grouped chooser.
  if (!currentTask) {
    return <FocusChooser onPick={(id) => setActiveTask(id)} />;
  }

  const goal = state.goals.find((g) => g.id === currentTask.goalId);
  const total = countdown.active ? countdown.total : currentTask.durationMin * 60;
  const remaining = countdown.active ? countdown.remaining : total;
  const elapsed = countdown.active ? countdown.elapsed : 0;
  const timeUp = countdown.active && remaining === 0;
  const next = nextInGoal(state.tasks, currentTask.goalId, currentTask.id);

  function onDone() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    playTaskComplete();
    const wasFirstToday = today.completed === 0;
    const wasLastInQueue = queue.length === 1;
    const nxt = nextInGoal(state.tasks, currentTask!.goalId, currentTask!.id);
    completeTask(currentTask!.id, elapsed);
    if (wasFirstToday) router.push("/first-win");
    else if (wasLastInQueue) router.push("/day-summary");
    else if (nxt) setNextUp(nxt);
  }

  function onSkip() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const wasLastInQueue = queue.length === 1;
    skipTask(currentTask!.id);
    if (wasLastInQueue) router.push("/day-summary");
  }

  function togglePause() {
    Haptics.selectionAsync();
    if (countdown.paused) resumeSession();
    else pauseSession();
  }

  const variantProps: TimerVariantProps = {
    taskTitle: currentTask.title,
    goalTitle: goal?.title,
    remaining,
    total,
    elapsed,
    index: today.completed + 1,
    count: today.completed + queue.length,
    timeUp,
    onDone,
    onSkip,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
      <FocusBackground />
      <View style={{ flex: 1 }}>
        {state.timerStyle === "ring" ? (
          <RingTimer {...variantProps} />
        ) : state.timerStyle === "numerals" ? (
          <NumeralsTimer {...variantProps} />
        ) : (
          <AmbientTimer {...variantProps} />
        )}
      </View>

      <FocusBottomBar
        paused={countdown.paused}
        onTogglePause={togglePause}
        nextTask={next}
        onViewAll={() => sheetRef.current?.expand()}
      />

      <GoalTasksSheet
        ref={sheetRef}
        goalId={currentTask.goalId}
        onPickTask={(id) => {
          sheetRef.current?.close();
          setActiveTask(id);
        }}
      />
    </SafeAreaView>
  );
}

function FocusBottomBar({
  paused,
  onTogglePause,
  nextTask,
  onViewAll,
}: {
  paused: boolean;
  onTogglePause: () => void;
  nextTask: Task | null;
  onViewAll: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.line,
      }}
    >
      <Pressable
        onPress={onTogglePause}
        hitSlop={8}
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          borderWidth: 1,
          borderColor: paused ? COLORS.coral : COLORS.line,
          backgroundColor: paused ? "rgba(52,211,153,0.1)" : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={paused ? "play" : "pause"} size={18} color={paused ? COLORS.coral : COLORS.fg} />
      </Pressable>

      <View style={{ flex: 1 }}>
        <Label>{paused ? "Paused" : "Next up"}</Label>
        <Body style={{ fontSize: 14 }} numberOfLines={1} color={nextTask ? COLORS.fg : COLORS.subtle}>
          {nextTask ? nextTask.title : "Nothing after this one"}
        </Body>
      </View>

      <Pressable
        onPress={onViewAll}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: COLORS.line,
          paddingHorizontal: 14,
          paddingVertical: 9,
        }}
      >
        <Caption color={COLORS.fg}>View all</Caption>
        <Ionicons name="chevron-up" size={14} color={COLORS.subtle} />
      </Pressable>
    </View>
  );
}

function NextUpConfirm({
  task,
  goalTitle,
  onStart,
  onPickAnother,
}: {
  task: Task;
  goalTitle?: string;
  onStart: () => void;
  onPickAnother: () => void;
}) {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 28 }}>
        <View style={{ alignItems: "center" }}>
          <Label>Next up</Label>
          <Title style={{ marginTop: 10, textAlign: "center" }}>That&apos;s a W. Keep it rolling?</Title>
        </View>

        <Card style={{ marginTop: 26, alignItems: "center", paddingVertical: 26 }}>
          {goalTitle ? <Label>{goalTitle}</Label> : null}
          <Title style={{ marginTop: 8, textAlign: "center" }}>{task.title}</Title>
          <Caption style={{ marginTop: 8, fontFamily: "JetBrainsMono_500Medium" }}>
            {task.durationMin}m
          </Caption>
        </Card>

        <View style={{ marginTop: 26, gap: 8 }}>
          <PrimaryButton label="Start this" onPress={onStart} />
          <Pressable onPress={onPickAnother} style={{ alignItems: "center", paddingVertical: 12 }}>
            <BodyMuted style={{ fontSize: 15 }}>Pick another</BodyMuted>
          </Pressable>
          <Pressable
            onPress={() => router.push("/share?type=task")}
            style={{ alignItems: "center", paddingVertical: 4 }}
          >
            <Caption color={COLORS.coral}>Share that win</Caption>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
