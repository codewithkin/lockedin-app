import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { Hint } from "@/components/hint";
import { AnimatedRow, Card, SectionLabel } from "@/components/primitives";
import { Screen, ScreenHeader } from "@/components/screen";
import { TaskRow } from "@/components/task-row";
import { Body, Display, Label, Title } from "@/components/typography";
import { formatDateLabel, formatDuration, isToday } from "@/lib/date";
import { useApp } from "@/lib/store";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";

export default function Day() {
  const router = useRouter();
  const { state, today } = useApp();
  const streak = state.stats.streak;

  const todayTasks = state.tasks.filter(
    (t) => isToday(t.completedAt) && (t.status === "done" || t.status === "skipped"),
  );
  const goalTitle = (goalId: string | null) =>
    state.goals.find((g) => g.id === goalId)?.title ?? undefined;

  return (
    <Screen>
      <ScreenHeader
        title="Today's summary"
        subtitle="An honest mirror of the day."
        right={<Label style={{ marginTop: 8 }}>{formatDateLabel()}</Label>}
      />

      <Card
        style={{
          marginTop: 20,
          borderColor: COLORS.coralDeep,
          backgroundColor: "rgba(255,107,74,0.07)",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Ionicons name="flame" size={28} color={COLORS.coral} />
          <View>
            <Display style={{ fontSize: 30, lineHeight: 32 }} color={COLORS.coral}>
              {streak} day{streak === 1 ? "" : "s"}
            </Display>
            <Label style={{ marginTop: 2 }}>
              Streak · {today.completed > 0 ? "still alive" : "at risk"}
            </Label>
          </View>
        </View>
      </Card>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
        <Stat label="Done" value={String(today.completed)} />
        <Stat label="Skipped" value={String(today.skipped)} />
        <Stat label="Focused" value={formatDuration(today.focusSeconds)} />
      </View>

      <Pressable
        onPress={() => router.push("/share")}
        style={({ pressed }) => ({
          marginTop: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          borderRadius: RADIUS.pill,
          backgroundColor: COLORS.coral,
          paddingVertical: 16,
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <Ionicons name="share-outline" size={18} color={COLORS.ink} />
        <Body style={{ fontFamily: FONTS.sansSemibold }} color={COLORS.ink}>
          Share today
        </Body>
      </Pressable>

      <View style={{ marginTop: 18 }}>
        <Hint id="day.share">Tap Share to turn today into a clean image for your story.</Hint>
      </View>

      <View style={{ marginTop: 24 }}>
        <SectionLabel>Timeline</SectionLabel>
        {todayTasks.length === 0 ? (
          <EmptyState
            compact
            icon="time-outline"
            title="Nothing logged yet"
            message="Finish or skip a task and it shows up here as your record for the day."
          />
        ) : (
          <View style={{ gap: 8 }}>
            {todayTasks.map((t, i) => (
              <AnimatedRow key={t.id} index={i}>
                <TaskRow
                  task={t}
                  variant={t.status === "done" ? "done" : "skipped"}
                  goalTitle={goalTitle(t.goalId)}
                />
              </AnimatedRow>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card style={{ flex: 1, borderRadius: RADIUS.xl }}>
      <Title style={{ fontSize: 26, lineHeight: 30 }}>{value}</Title>
      <Label style={{ marginTop: 4, color: COLORS.subtle }}>{label}</Label>
    </Card>
  );
}
