import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/buttons";
import { formatClock } from "@/lib/date";
import { useApp } from "@/lib/store";
import { ACCENT } from "@/lib/theme";

export default function Focus() {
  const router = useRouter();
  const { currentTask, queue, state, completeTask, skipTask } = useApp();

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
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="checkmark-done-circle-outline" size={56} color="#3f3f3f" />
          <Text className="mt-5 text-center text-2xl font-semibold text-foreground">
            Nothing queued.
          </Text>
          <Text className="mt-2 text-center text-base text-muted">
            Add a task and you&apos;re straight back in the loop.
          </Text>
          <View className="mt-8 w-full">
            <PrimaryButton label="Add a task" onPress={() => router.push("/plan")} />
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
    completeTask(currentTask!.id, elapsed);
  }

  function onSkip() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    skipTask(currentTask!.id);
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-7">
        <View className="items-center pt-6">
          {goal ? (
            <Text style={{ color: ACCENT }} className="text-xs font-semibold uppercase tracking-[2px]">
              {goal.title}
            </Text>
          ) : null}
        </View>

        <View className="flex-1 items-center justify-center">
          <Text className="text-center text-3xl font-bold leading-snug text-foreground">
            {currentTask.title}
          </Text>
          <Text
            style={{ color: timeUp ? ACCENT : "#fafafa" }}
            className="mt-10 text-7xl font-bold tracking-tight"
          >
            {formatClock(secondsLeft)}
          </Text>
          <Text className="mt-3 text-sm text-muted">
            {timeUp
              ? "Time's up — close it out."
              : remainingAfter > 0
                ? `${remainingAfter} more after this`
                : "Last one in the queue"}
          </Text>
        </View>

        <View className="gap-3 pb-4">
          <PrimaryButton label="Done" onPress={onDone} haptic={false} />
          <Pressable onPress={onSkip} className="items-center py-3">
            <Text className="text-base font-medium text-muted">Skip</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
