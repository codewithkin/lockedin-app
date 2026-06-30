import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/empty-state";
import { BodyMuted, BodyStrong, Caption, Display, Label } from "@/components/typography";
import { pendingByGoal } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { COLORS, RADIUS } from "@/lib/theme";

export function FocusChooser({ onPick }: { onPick: (taskId: string) => void }) {
  const router = useRouter();
  const { state } = useApp();
  const groups = pendingByGoal(state.tasks, state.goals, state.primaryGoalId);

  if (groups.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <EmptyState
            icon="sparkles-outline"
            title="No tasks yet"
            message="Add a goal and its first task in the planner. Start with something you can't talk yourself out of."
            actionLabel="Open the planner"
            onAction={() => router.push("/tasks")}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <Label>Today</Label>
        <Display style={{ fontSize: 30, lineHeight: 34, marginTop: 8 }}>
          Which task, right now?
        </Display>
        <BodyMuted style={{ marginTop: 6 }}>Pick one. The clock starts the second you do.</BodyMuted>

        {groups.map((group) => (
          <View key={group.goal?.id ?? "none"} style={{ marginTop: 26 }}>
            <Label style={{ color: COLORS.coral }}>{group.goal?.title ?? "No goal"}</Label>
            <View style={{ marginTop: 10, gap: 8 }}>
              {group.tasks.map((t) => (
                <Pressable
                  key={t.id}
                  onPress={() => onPick(t.id)}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    borderRadius: RADIUS.xl,
                    borderWidth: 1,
                    borderColor: COLORS.line,
                    backgroundColor: COLORS.card,
                    padding: 16,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View style={{ flex: 1 }}>
                    <BodyStrong style={{ fontSize: 15 }}>{t.title}</BodyStrong>
                    <Caption style={{ marginTop: 2 }}>{t.durationMin}m</Caption>
                  </View>
                  <Ionicons name="play-circle" size={26} color={COLORS.coral} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
