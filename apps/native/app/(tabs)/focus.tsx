import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/buttons";
import { EmptyState } from "@/components/empty-state";
import { BodyMuted, Caption, Label, MonoTimer, Title } from "@/components/typography";
import { formatClock } from "@/lib/date";
import { useApp } from "@/lib/store";
import { useCountdown } from "@/lib/use-countdown";
import { COLORS, FONTS } from "@/lib/theme";

export default function Focus() {
  const router = useRouter();
  const { currentTask, queue, state, today, completeTask, skipTask, extendSession } = useApp();
  const countdown = useCountdown();

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
  const remaining = countdown.active ? countdown.remaining : fallbackTotal;
  const elapsed = countdown.active ? countdown.elapsed : 0;
  const remainingAfter = queue.length - 1;
  const timeUp = countdown.active && remaining === 0;

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

  function onExtend(min: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    extendSession(min);
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
          <MonoTimer style={{ marginTop: 32 }} color={timeUp ? COLORS.coral : COLORS.fg}>
            {formatClock(remaining)}
          </MonoTimer>
          <Caption style={{ marginTop: 10 }}>
            {timeUp
              ? "Time's up — close it out."
              : remainingAfter > 0
                ? `${remainingAfter} more after this`
                : "Last one in the queue"}
          </Caption>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 24 }}>
            <ExtendButton label="+5 min" onPress={() => onExtend(5)} />
            <ExtendButton label="+15 min" onPress={() => onExtend(15)} />
          </View>
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

function ExtendButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderRadius: 999,
        borderWidth: 1,
        borderColor: COLORS.line,
        paddingHorizontal: 18,
        paddingVertical: 10,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <BodyMuted style={{ fontFamily: FONTS.monoMedium, fontSize: 13 }}>{label}</BodyMuted>
    </Pressable>
  );
}
