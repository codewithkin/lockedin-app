import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";

import { EmptyState } from "@/components/empty-state";
import { AnimatedRow, Card, SectionLabel } from "@/components/primitives";
import { Screen, ScreenHeader } from "@/components/screen";
import { Body, BodyMuted, BodyStrong, Caption, Timer, Title } from "@/components/typography";
import { dayKey, enumerateDays, formatDuration } from "@/lib/date";
import { usePurchases } from "@/lib/purchases";
import { useApp } from "@/lib/store";
import { type DayRecord } from "@/lib/types";
import { COLORS, RADIUS } from "@/lib/theme";

export default function Streak() {
  const router = useRouter();
  const { state } = useApp();
  const { isPro, paywallAvailable, presentPaywall, presentCustomerCenter } = usePurchases();
  const { streak, totalFocusSeconds, tasksCompleted, tasksSkipped } = state.stats;
  const history = state.history;

  async function openProCta() {
    if (isPro) {
      await presentCustomerCenter();
      return;
    }
    if (paywallAvailable) {
      await presentPaywall();
    } else {
      router.push("/paywall");
    }
  }

  const todayKey = dayKey();
  const recorded = new Map(history.map((h) => [h.date, h]));
  const earliest = history.length ? history[history.length - 1].date : todayKey;
  const historyRows: DayRecord[] = history.length
    ? enumerateDays(earliest, todayKey)
        .map(
          (d) =>
            recorded.get(d) ?? {
              date: d,
              completed: 0,
              skipped: 0,
              focusSeconds: 0,
              streakAfter: 0,
            },
        )
        .reverse()
    : [];

  return (
    <Screen>
      <ScreenHeader
        title="Streak"
        right={
          <Pressable onPress={() => router.push("/settings")} hitSlop={10} style={{ marginTop: 6 }}>
            <Ionicons name="settings-outline" size={22} color={COLORS.subtle} />
          </Pressable>
        }
      />

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

      <Pressable
        onPress={openProCta}
        style={({ pressed }) => ({
          marginTop: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          borderRadius: RADIUS.x2,
          borderWidth: 1,
          borderColor: COLORS.coralDeep,
          backgroundColor: "rgba(255,107,74,0.06)",
          padding: 16,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Ionicons name={isPro ? "checkmark-circle" : "sparkles"} size={18} color={COLORS.coral} />
        <View style={{ flex: 1 }}>
          <BodyStrong style={{ fontSize: 14 }}>
            {isPro ? "LockedIn Pro" : "Unlock history, templates & sync"}
          </BodyStrong>
          <Caption style={{ marginTop: 2 }}>
            {isPro ? "Active · tap to manage your subscription" : "Keep your streak going with Pro"}
          </Caption>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
      </Pressable>

      <View style={{ marginTop: 24 }}>
        <SectionLabel>History</SectionLabel>
        {history.length === 0 ? (
          <EmptyState
            compact
            icon="flame-outline"
            title="No streak yet"
            message="Finish one task today and your streak starts. Miss a day and it resets."
          />
        ) : (
          <View style={{ gap: 8 }}>
            {historyRows.map((h, i) => {
              const kept = h.completed > 0;
              const isToday = h.date === todayKey;
              return (
                <AnimatedRow key={h.date} index={Math.min(i, 8)}>
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
                    <Body style={{ flex: 1, fontSize: 15 }} color={kept ? COLORS.fg : COLORS.subtle}>
                      {isToday ? "Today" : h.date}
                    </Body>
                    <Caption>
                      {kept ? `${h.completed} done · ${formatDuration(h.focusSeconds)}` : "missed"}
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
