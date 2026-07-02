import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import { Pressable, Share, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";

import { PrimaryButton } from "@/components/buttons";
import {
  GoalShareCard,
  StreakShareCard,
  TaskShareCard,
  TodayShareCard,
} from "@/components/share-cards";
import { useToast } from "@/components/toast";
import { BodyMuted, Label } from "@/components/typography";
import { isToday } from "@/lib/date";
import { goalStats, lastCompletedToday } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { COLORS } from "@/lib/theme";

type ShareType = "day" | "streak" | "goal" | "task";

export default function ShareScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string; goalId?: string; taskId?: string }>();
  const type = (params.type as ShareType) ?? "day";
  const { state, today } = useApp();
  const { show } = useToast();
  const cardRef = useRef<View>(null);
  const [busy, setBusy] = useState(false);

  async function onShare() {
    if (busy) return;
    setBusy(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const uri = await captureRef(cardRef, { format: "png", quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: "Share" });
      } else {
        await Share.share({ url: uri });
      }
    } catch {
      show("Couldn't open the share sheet. Try again.", "error");
    } finally {
      setBusy(false);
    }
  }

  const streak = state.stats.streak;

  let card: React.ReactNode = null;
  if (type === "streak") {
    card = (
      <StreakShareCard
        ref={cardRef}
        streak={streak}
        tasksCompleted={state.stats.tasksCompleted}
        totalFocusSeconds={state.stats.totalFocusSeconds}
      />
    );
  } else if (type === "goal") {
    const goal = state.goals.find((g) => g.id === params.goalId);
    if (goal) {
      const s = goalStats(state.tasks, goal.id);
      const tasks = state.tasks
        .filter((t) => t.goalId === goal.id)
        .sort((a, b) => (a.status === "pending" ? -1 : b.status === "pending" ? 1 : 0));
      card = <GoalShareCard ref={cardRef} goal={goal} done={s.done} total={s.total} tasks={tasks} />;
    }
  } else if (type === "task") {
    const task = params.taskId
      ? state.tasks.find((t) => t.id === params.taskId)
      : lastCompletedToday(state.tasks);
    if (task) card = <TaskShareCard ref={cardRef} task={task} streak={streak} />;
  }

  if (!card) {
    const tasks = state.tasks.filter(
      (t) => isToday(t.completedAt) && (t.status === "done" || t.status === "skipped"),
    );
    card = (
      <TodayShareCard
        ref={cardRef}
        streak={streak}
        done={today.completed}
        focusSeconds={today.focusSeconds}
        tasks={tasks}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 8 }}>
          <Label>Share</Label>
          <Pressable onPress={() => router.back()} hitSlop={12} style={{ position: "absolute", right: 0 }}>
            <Ionicons name="close" size={24} color={COLORS.subtle} />
          </Pressable>
        </View>

        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Animated.View entering={FadeInUp.duration(420)}>{card}</Animated.View>
          <Animated.View entering={FadeIn.delay(300)}>
            <BodyMuted style={{ marginTop: 16, textAlign: "center", fontSize: 14 }}>
              Goes straight to your share sheet. Post it anywhere.
            </BodyMuted>
          </Animated.View>
        </View>

        <View style={{ paddingBottom: 16 }}>
          <PrimaryButton label={busy ? "Opening…" : "Share it"} onPress={onShare} disabled={busy} />
        </View>
      </View>
    </SafeAreaView>
  );
}
