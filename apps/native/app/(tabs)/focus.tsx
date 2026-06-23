import * as Haptics from "expo-haptics";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/empty-state";
import { FocusBackground } from "@/components/focus-background";
import { AmbientTimer } from "@/components/timers/ambient-timer";
import { NumeralsTimer } from "@/components/timers/numerals-timer";
import { RingTimer } from "@/components/timers/ring-timer";
import { type TimerVariantProps } from "@/components/timers/types";
import { playStartFocus, playTaskComplete } from "@/lib/sounds";
import { useApp } from "@/lib/store";
import { type TimerStyle } from "@/lib/types";
import { useCountdown } from "@/lib/use-countdown";
import { COLORS, FONTS } from "@/lib/theme";

export default function Focus() {
  const router = useRouter();
  const { currentTask, queue, state, today, completeTask, skipTask, setTimerStyle } = useApp();
  const countdown = useCountdown();

  // Play the start chime when a new focus session begins (advancing to a new task).
  const prevTaskId = useRef<string | null>(null);
  useEffect(() => {
    const id = currentTask?.id ?? null;
    if (id && prevTaskId.current !== null && prevTaskId.current !== id) {
      playStartFocus();
    }
    prevTaskId.current = id;
  }, [currentTask?.id]);

  // Keep the screen awake while a focus session is running and visible.
  useFocusEffect(
    useCallback(() => {
      if (!countdown.active) return;
      activateKeepAwakeAsync("lockedin-focus");
      return () => {
        deactivateKeepAwake("lockedin-focus");
      };
    }, [countdown.active]),
  );

  if (!currentTask) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <EmptyState
            icon="checkmark-done-circle-outline"
            title="Nothing queued."
            message="Add a task and you're straight back in the loop."
            actionLabel="Add a task"
            onAction={() => router.push("/tasks")}
          />
        </View>
      </SafeAreaView>
    );
  }

  const goal = state.goals.find((g) => g.id === currentTask.goalId);
  const fallbackTotal = currentTask.durationMin * 60;
  const total = countdown.active ? countdown.total : fallbackTotal;
  const remaining = countdown.active ? countdown.remaining : fallbackTotal;
  const elapsed = countdown.active ? countdown.elapsed : 0;
  const timeUp = countdown.active && remaining === 0;

  function onDone() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    playTaskComplete();
    const wasFirstToday = today.completed === 0;
    const wasLastInQueue = queue.length === 1;
    completeTask(currentTask!.id, elapsed);
    if (wasFirstToday) router.push("/first-win");
    else if (wasLastInQueue) router.push("/day-summary");
  }

  function onSkip() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const wasLastInQueue = queue.length === 1;
    skipTask(currentTask!.id);
    if (wasLastInQueue) router.push("/day-summary");
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
      <StyleSwitcher value={state.timerStyle} onChange={setTimerStyle} />
    </SafeAreaView>
  );
}

const STYLES: { key: TimerStyle; label: string }[] = [
  { key: "ring", label: "Ring" },
  { key: "numerals", label: "Numerals" },
  { key: "ambient", label: "Ambient" },
];

function StyleSwitcher({
  value,
  onChange,
}: {
  value: TimerStyle;
  onChange: (style: TimerStyle) => void;
}) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, paddingVertical: 10 }}>
      {STYLES.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => {
              Haptics.selectionAsync();
              onChange(o.key);
            }}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: active ? "rgba(255,107,74,0.12)" : "transparent",
              borderWidth: 1,
              borderColor: active ? COLORS.coralDeep : "transparent",
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.monoMedium,
                fontSize: 11,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: active ? COLORS.coral : COLORS.subtle,
              }}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
