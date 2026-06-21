import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { Hint } from "@/components/hint";
import { AddRow, AnimatedRow, Card, ProgressBar, SectionLabel } from "@/components/primitives";
import { ProgressRing } from "@/components/progress-ring";
import { Screen, ScreenHeader } from "@/components/screen";
import { BodyStrong, Caption, Heading, Label } from "@/components/typography";
import { goalStats } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { COLORS } from "@/lib/theme";

export default function Goals() {
  const router = useRouter();
  const { state, setPrimaryGoal } = useApp();
  const goals = state.goals;
  const primary = goals.find((g) => g.id === state.primaryGoalId) ?? goals[0];
  const primaryStats = primary ? goalStats(state.tasks, primary.id) : null;

  return (
    <Screen>
      <ScreenHeader
        title="Goals"
        right={<Label style={{ marginTop: 8 }}>{goals.length} active</Label>}
      />

      <View style={{ marginTop: 16 }}>
        <Hint id="goals.primary">
          Every new task files under your primary goal — switch it anytime.
        </Hint>
      </View>

      {primary && primaryStats ? (
        <View style={{ marginTop: 20 }}>
          <Card style={{ borderColor: COLORS.coralDeep, backgroundColor: "rgba(255,107,74,0.06)" }}>
            <Label style={{ marginBottom: 10 }}>Primary goal</Label>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <View style={{ flex: 1 }}>
                <Heading style={{ fontSize: 20 }}>{primary.title}</Heading>
                <Caption style={{ marginTop: 6 }}>
                  {primaryStats.done} of {primaryStats.total} tasks done · {primaryStats.dueToday} due today
                </Caption>
              </View>
              <ProgressRing value={primaryStats.done} total={primaryStats.total} size={60} />
            </View>
          </Card>
        </View>
      ) : null}

      <View style={{ marginTop: 24 }}>
        <SectionLabel>All goals</SectionLabel>
        {goals.length === 0 ? (
          <EmptyState
            compact
            icon="flag-outline"
            title="No goals yet"
            message="Set what you're working toward, then break it into tasks."
          />
        ) : (
          <View style={{ gap: 10, marginBottom: 8 }}>
            {goals.map((g, i) => {
              const s = goalStats(state.tasks, g.id);
              const isPrimary = g.id === primary?.id;
              return (
                <AnimatedRow key={g.id} index={i}>
                  <Card>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <BodyStrong style={{ flex: 1, fontSize: 15 }}>{g.title}</BodyStrong>
                      <Caption style={{ fontFamily: "JetBrainsMono_500Medium" }}>
                        {s.done}/{s.total}
                      </Caption>
                      <Pressable
                        onPress={() => {
                          Haptics.selectionAsync();
                          setPrimaryGoal(g.id);
                        }}
                        hitSlop={8}
                      >
                        <Ionicons
                          name={isPrimary ? "star" : "star-outline"}
                          size={18}
                          color={isPrimary ? COLORS.coral : COLORS.subtle}
                        />
                      </Pressable>
                    </View>
                    <ProgressBar value={s.done} total={s.total} />
                  </Card>
                </AnimatedRow>
              );
            })}
          </View>
        )}
        <AddRow label="New goal" onPress={() => router.push("/add-goal")} />
      </View>
    </Screen>
  );
}
