import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { AddRow } from "@/components/primitives";
import { Screen, ScreenHeader } from "@/components/screen";
import { TaskComposer } from "@/components/task-composer";
import { BodyStrong, Caption, Label } from "@/components/typography";
import { formatClock } from "@/lib/date";
import { pendingForGoal } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { useCountdown } from "@/lib/use-countdown";
import { COLORS, RADIUS } from "@/lib/theme";

export default function Tasks() {
  const router = useRouter();
  const { state, currentTask, pauseSession, resumeSession, removeTask } = useApp();
  const countdown = useCountdown();
  const [composerGoalId, setComposerGoalId] = useState<string | null | undefined>(undefined);

  const goals = [...state.goals].sort((a, b) => {
    if (a.id === state.primaryGoalId) return -1;
    if (b.id === state.primaryGoalId) return 1;
    return 0;
  });

  function togglePause() {
    Haptics.selectionAsync();
    if (countdown.paused) resumeSession();
    else pauseSession();
  }

  return (
    <Screen>
      <ScreenHeader
        title="Plan"
        subtitle="Jot down what you wanna get done."
        right={
          <Pressable onPress={() => router.push("/settings")} hitSlop={10} style={{ marginTop: 6 }}>
            <Ionicons name="settings-outline" size={22} color={COLORS.subtle} />
          </Pressable>
        }
      />

      {goals.length === 0 ? (
        <View style={{ marginTop: 24 }}>
          <EmptyState
            icon="flag-outline"
            title="No goals yet"
            message="Add a goal first, then stack your tasks under it."
            actionLabel="New goal"
            onAction={() => router.push("/add-goal")}
          />
        </View>
      ) : null}

      {goals.map((goal) => {
        const pending = pendingForGoal(state.tasks, goal.id);
        return (
          <View key={goal.id} style={{ marginTop: 24 }}>
            <Pressable
              onPress={() => router.push(`/goal/${goal.id}`)}
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Label style={{ flex: 1, color: COLORS.coral }}>{goal.title}</Label>
              <Caption>{pending.length}</Caption>
              <Ionicons name="chevron-forward" size={16} color={COLORS.subtle} />
            </Pressable>

            <View style={{ marginTop: 10, gap: 8 }}>
              {pending.map((t) => {
                const isActive = t.id === currentTask?.id;
                return (
                  <Pressable
                    key={t.id}
                    onPress={() =>
                      isActive
                        ? togglePause()
                        : router.push({ pathname: "/edit-task", params: { id: t.id } })
                    }
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      borderRadius: RADIUS.xl,
                      borderWidth: 1,
                      borderColor: isActive ? COLORS.coral : COLORS.line,
                      backgroundColor: isActive ? "rgba(255,107,74,0.07)" : COLORS.card,
                      padding: 16,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      {isActive ? <Label style={{ marginBottom: 2 }}>{countdown.paused ? "Paused" : "Focusing now"}</Label> : null}
                      <BodyStrong style={{ fontSize: 15 }}>{t.title}</BodyStrong>
                      <Caption style={{ marginTop: 2 }}>
                        {isActive ? formatClock(countdown.remaining) : `${t.durationMin}m`}
                      </Caption>
                    </View>
                    {isActive ? (
                      <Ionicons name={countdown.paused ? "play" : "pause"} size={20} color={COLORS.coral} />
                    ) : (
                      <Pressable onPress={() => removeTask(t.id)} hitSlop={8}>
                        <Ionicons name="trash-outline" size={16} color="#6b6b73" />
                      </Pressable>
                    )}
                  </Pressable>
                );
              })}

              {composerGoalId === goal.id ? (
                <TaskComposer goalId={goal.id} onClose={() => setComposerGoalId(undefined)} />
              ) : (
                <AddRow label="Add tasks" onPress={() => setComposerGoalId(goal.id)} />
              )}
            </View>
          </View>
        );
      })}

      {goals.length > 0 ? (
        <View style={{ marginTop: 28 }}>
          <AddRow label="New goal" onPress={() => router.push("/add-goal")} />
        </View>
      ) : null}
    </Screen>
  );
}
