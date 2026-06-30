import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { AnimatedRow, Card, SectionLabel } from "@/components/primitives";
import { TaskRow } from "@/components/task-row";
import { Display, Label, Title } from "@/components/typography";
import { formatDuration, isToday } from "@/lib/date";
import { useApp } from "@/lib/store";
import { COLORS, RADIUS } from "@/lib/theme";

export function DaySummaryStats() {
  const { state, today } = useApp();
  const streak = state.stats.streak;

  return (
    <View>
      <Card style={{ borderColor: COLORS.coralDeep, backgroundColor: "rgba(52,211,153,0.07)" }}>
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
    </View>
  );
}

export function DayTimeline() {
  const { state } = useApp();
  const todayTasks = state.tasks.filter(
    (t) => isToday(t.completedAt) && (t.status === "done" || t.status === "skipped"),
  );
  const goalTitle = (goalId: string | null) =>
    state.goals.find((g) => g.id === goalId)?.title ?? undefined;

  return (
    <View>
      <SectionLabel>Timeline</SectionLabel>
      {todayTasks.length === 0 ? (
        <EmptyState
          compact
          icon="time-outline"
          title="Nothing logged yet"
          message="Finish or skip a task and it lands here — your record for the day."
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
