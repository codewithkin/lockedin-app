import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/buttons";
import { BodyMuted, Caption, Label, MonoTimer, Title } from "@/components/typography";
import { formatClock } from "@/lib/date";
import { useApp } from "@/lib/store";
import { COLORS } from "@/lib/theme";

export default function Focus() {
  const router = useRouter();
  const { currentTask, queue, state, today, completeTask, skipTask } = useApp();

  const total = (currentTask?.durationMin ?? 25) * 60;
  const [secondsLeft, setSecondsLeft] = useState(total);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSecondsLeft(total);
  }, [currentTask?.id, total]);

  useEffect(() => {
    if (!currentTask) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentTask?.id]);

  if (!currentTask) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <Ionicons name="checkmark-done-circle-outline" size={56} color="#3f3f46" />
          <Title style={{ marginTop: 20, textAlign: "center" }}>Nothing queued.</Title>
          <BodyMuted style={{ marginTop: 8, textAlign: "center" }}>
            Add a task and you&apos;re straight back in the loop.
          </BodyMuted>
          <View style={{ marginTop: 28, width: "100%" }}>
            <PrimaryButton label="Add a task" onPress={() => router.push("/tasks")} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const goal = state.goals.find((g) => g.id === currentTask.goalId);
  const elapsed = total - secondsLeft;
  const remainingAfter = queue.length - 1;
  const timeUp = secondsLeft === 0;

  function onDone() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const wasFirstToday = today.completed === 0;
    completeTask(currentTask!.id, elapsed);
    if (wasFirstToday) router.push("/first-win");
  }

  function onSkip() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    skipTask(currentTask!.id);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
      <View style={{ flex: 1, paddingHorizontal: 28 }}>
        <View style={{ alignItems: "center", paddingTop: 16 }}>
          <Label>Now · Focusing</Label>
          {goal ? (
            <Caption style={{ marginTop: 6 }} color={COLORS.subtle}>
              {goal.title}
            </Caption>
          ) : null}
        </View>

        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Title style={{ textAlign: "center" }}>{currentTask.title}</Title>
          <MonoTimer
            style={{ marginTop: 32 }}
            color={timeUp ? COLORS.coral : COLORS.fg}
          >
            {formatClock(secondsLeft)}
          </MonoTimer>
          <Caption style={{ marginTop: 10 }}>
            {timeUp
              ? "Time's up — close it out."
              : remainingAfter > 0
                ? `${remainingAfter} more after this`
                : "Last one in the queue"}
          </Caption>
        </View>

        <View style={{ gap: 8, paddingBottom: 12 }}>
          <PrimaryButton label="Done" onPress={onDone} haptic={false} />
          <Pressable onPress={onSkip} style={{ alignItems: "center", paddingVertical: 14 }}>
            <BodyMuted style={{ fontSize: 15 }}>Skip</BodyMuted>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
