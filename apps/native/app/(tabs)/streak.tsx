import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";

import { AnimatedRow, Card, SectionLabel } from "@/components/primitives";
import { Screen, ScreenHeader } from "@/components/screen";
import { Body, BodyMuted, Caption, Timer, Title } from "@/components/typography";
import { formatDuration } from "@/lib/date";
import { useApp } from "@/lib/store";
import { COLORS } from "@/lib/theme";

export default function Streak() {
  const { state } = useApp();
  const { streak, totalFocusSeconds, tasksCompleted, tasksSkipped } = state.stats;
  const history = state.history;

  return (
    <Screen>
      <ScreenHeader title="Streak" />

      <View style={{ alignItems: "center", paddingVertical: 36 }}>
        <Animated.View entering={ZoomIn.duration(360)} style={{ alignItems: "center" }}>
          <Ionicons name="flame" size={44} color={COLORS.coral} />
          <Timer style={{ marginTop: 8 }} color={COLORS.coral}>
            {streak}
          </Timer>
          <BodyMuted>day{streak === 1 ? "" : "s"} locked in</BodyMuted>
        </Animated.View>
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <MiniStat label="Tasks done" value={String(tasksCompleted)} />
        <MiniStat label="Skipped" value={String(tasksSkipped)} />
        <MiniStat label="Focus" value={formatDuration(totalFocusSeconds)} />
      </View>

      <View style={{ marginTop: 24 }}>
        <SectionLabel>History</SectionLabel>
        {history.length === 0 ? (
          <BodyMuted>No history yet. Complete a task to begin.</BodyMuted>
        ) : (
          <View style={{ gap: 8 }}>
            {history.map((h, i) => {
              const kept = h.completed > 0;
              return (
                <AnimatedRow key={h.date} index={i}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: COLORS.line,
                      padding: 16,
                    }}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginRight: 12,
                        backgroundColor: kept ? COLORS.coral : "#2a2a30",
                      }}
                    />
                    <Body style={{ flex: 1, fontSize: 15 }}>{h.date}</Body>
                    <Caption>
                      {h.completed} done · {formatDuration(h.focusSeconds)}
                    </Caption>
                  </View>
                </AnimatedRow>
              );
            })}
          </View>
        )}
      </View>
    </Screen>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <Card style={{ flex: 1, borderRadius: 20 }}>
      <Title style={{ fontSize: 22, lineHeight: 26 }}>{value}</Title>
      <Caption style={{ marginTop: 4 }}>{label}</Caption>
    </Card>
  );
}
