import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Share, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatDuration, isToday } from "@/lib/date";
import { useApp } from "@/lib/store";
import { ACCENT, INK } from "@/lib/theme";

export default function Day() {
  const { state, today } = useApp();
  const streak = state.stats.streak;

  const todayTasks = state.tasks.filter(
    (t) => isToday(t.completedAt) && (t.status === "done" || t.status === "skipped"),
  );

  async function onShare() {
    const message = `Today on LockedIn\nCompleted: ${today.completed}\nSkipped: ${today.skipped}\nFocus: ${formatDuration(today.focusSeconds)}\nStreak: ${streak} day${streak === 1 ? "" : "s"}`;
    try {
      await Share.share({ message });
    } catch {
      // user dismissed
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
        <Text className="text-3xl font-bold text-foreground">Today</Text>
        <Text className="mt-1 text-base text-muted">Your record for the day.</Text>

        <View
          style={{ borderColor: "#1f1f1f", backgroundColor: "#121212" }}
          className="mt-6 rounded-3xl border p-6"
        >
          <View className="flex-row justify-between">
            <Stat label="Completed" value={String(today.completed)} />
            <Stat label="Skipped" value={String(today.skipped)} />
          </View>
          <View className="mt-6 flex-row justify-between">
            <Stat label="Focus time" value={formatDuration(today.focusSeconds)} />
            <Stat label="Streak" value={`${streak}`} accent />
          </View>
        </View>

        <Pressable
          onPress={onShare}
          style={{ backgroundColor: ACCENT }}
          className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl py-4"
        >
          <Ionicons name="share-outline" size={18} color={INK} />
          <Text style={{ color: INK }} className="text-base font-semibold">
            Share today
          </Text>
        </Pressable>

        <Text className="mt-9 mb-2 text-xs uppercase tracking-wide text-muted">Timeline</Text>
        {todayTasks.length === 0 ? (
          <Text className="text-base text-muted">Nothing logged yet today.</Text>
        ) : (
          <View className="gap-2">
            {todayTasks.map((t) => {
              const done = t.status === "done";
              return (
                <View
                  key={t.id}
                  style={{ borderColor: "#1f1f1f" }}
                  className="flex-row items-center rounded-2xl border p-4"
                >
                  <Ionicons
                    name={done ? "checkmark-circle" : "close-circle-outline"}
                    size={20}
                    color={done ? ACCENT : "#666"}
                  />
                  <Text className="ml-3 flex-1 text-base text-foreground">{t.title}</Text>
                  <Text className="text-xs text-muted">{done ? `${t.durationMin}m` : "skipped"}</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View>
      <Text
        style={accent ? { color: ACCENT } : undefined}
        className="text-4xl font-bold text-foreground"
      >
        {value}
      </Text>
      <Text className="mt-1 text-xs uppercase tracking-wide text-muted">{label}</Text>
    </View>
  );
}
