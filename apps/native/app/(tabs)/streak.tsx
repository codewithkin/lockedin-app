import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatDuration } from "@/lib/date";
import { useApp } from "@/lib/store";
import { ACCENT } from "@/lib/theme";

export default function Streak() {
  const { state } = useApp();
  const { streak, totalFocusSeconds, tasksCompleted, tasksSkipped } = state.stats;
  const history = state.history;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
        <Text className="text-3xl font-bold text-foreground">Streak</Text>

        <View className="items-center py-10">
          <Ionicons name="flame" size={48} color={ACCENT} />
          <Text style={{ color: ACCENT }} className="mt-3 text-7xl font-bold">
            {streak}
          </Text>
          <Text className="text-base text-muted">
            day{streak === 1 ? "" : "s"} locked in
          </Text>
        </View>

        <View className="flex-row gap-3">
          <MiniStat label="Tasks done" value={String(tasksCompleted)} />
          <MiniStat label="Skipped" value={String(tasksSkipped)} />
          <MiniStat label="Focus" value={formatDuration(totalFocusSeconds)} />
        </View>

        <Text className="mt-9 mb-2 text-xs uppercase tracking-wide text-muted">History</Text>
        {history.length === 0 ? (
          <Text className="text-base text-muted">No history yet. Complete a task to begin.</Text>
        ) : (
          <View className="gap-2">
            {history.map((h) => {
              const kept = h.completed > 0;
              return (
                <View
                  key={h.date}
                  style={{ borderColor: "#1f1f1f" }}
                  className="flex-row items-center rounded-2xl border p-4"
                >
                  <View
                    style={{ backgroundColor: kept ? ACCENT : "#2a2a2a" }}
                    className="mr-3 h-2.5 w-2.5 rounded-full"
                  />
                  <Text className="flex-1 text-base text-foreground">{h.date}</Text>
                  <Text className="text-xs text-muted">
                    {h.completed} done · {formatDuration(h.focusSeconds)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{ borderColor: "#1f1f1f", backgroundColor: "#121212" }}
      className="flex-1 rounded-2xl border p-4"
    >
      <Text className="text-xl font-bold text-foreground">{value}</Text>
      <Text className="mt-1 text-xs text-muted">{label}</Text>
    </View>
  );
}
