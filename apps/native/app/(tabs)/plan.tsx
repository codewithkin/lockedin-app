import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useApp } from "@/lib/store";
import { ACCENT, DURATIONS, INK } from "@/lib/theme";

export default function Plan() {
  const { state, queue, addGoal, addTask, removeTask, moveTask } = useApp();

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState("");
  const [newTask, setNewTask] = useState("");
  const [duration, setDuration] = useState(25);

  useEffect(() => {
    if (!selectedGoalId && state.goals.length > 0) setSelectedGoalId(state.goals[0].id);
  }, [state.goals, selectedGoalId]);

  function onAddGoal() {
    if (newGoal.trim().length === 0) return;
    const g = addGoal(newGoal);
    setSelectedGoalId(g.id);
    setNewGoal("");
  }

  function onAddTask() {
    if (newTask.trim().length === 0 || !selectedGoalId) return;
    addTask({ title: newTask, durationMin: duration, goalId: selectedGoalId });
    setNewTask("");
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-foreground">Plan</Text>
        <Text className="mt-1 text-base text-muted">Set goals, queue the work.</Text>

        <Text className="mt-8 mb-2 text-xs uppercase tracking-wide text-muted">Goals</Text>
        <View className="flex-row flex-wrap gap-2">
          {state.goals.map((g) => {
            const selected = g.id === selectedGoalId;
            return (
              <Pressable
                key={g.id}
                onPress={() => setSelectedGoalId(g.id)}
                style={{
                  backgroundColor: selected ? ACCENT : "transparent",
                  borderColor: selected ? ACCENT : "#404040",
                }}
                className="rounded-full border px-4 py-2"
              >
                <Text
                  style={{ color: selected ? INK : "#a3a3a3" }}
                  className="text-sm font-medium"
                >
                  {g.title}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-3 flex-row gap-2">
          <TextInput
            value={newGoal}
            onChangeText={setNewGoal}
            placeholder="New goal"
            placeholderTextColor="#666"
            className="flex-1 rounded-xl border border-neutral-700 px-4 py-3 text-base text-foreground"
          />
          <Pressable
            onPress={onAddGoal}
            style={{ borderColor: "#404040" }}
            className="items-center justify-center rounded-xl border px-4"
          >
            <Ionicons name="add" size={22} color="#a3a3a3" />
          </Pressable>
        </View>

        <Text className="mt-8 mb-2 text-xs uppercase tracking-wide text-muted">Add a task</Text>
        <TextInput
          value={newTask}
          onChangeText={setNewTask}
          placeholder={selectedGoalId ? "What's the next thing?" : "Create a goal first"}
          placeholderTextColor="#666"
          editable={!!selectedGoalId}
          className="rounded-xl border border-neutral-700 px-4 py-3 text-base text-foreground"
        />
        <View className="mt-3 flex-row gap-2">
          {DURATIONS.map((d) => {
            const selected = d === duration;
            return (
              <Pressable
                key={d}
                onPress={() => setDuration(d)}
                style={{
                  backgroundColor: selected ? ACCENT : "transparent",
                  borderColor: selected ? ACCENT : "#404040",
                }}
                className="flex-1 items-center rounded-xl border py-3"
              >
                <Text
                  style={{ color: selected ? INK : "#a3a3a3" }}
                  className="text-sm font-semibold"
                >
                  {d}m
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable
          onPress={onAddTask}
          disabled={!selectedGoalId || newTask.trim().length === 0}
          style={{
            backgroundColor: !selectedGoalId || newTask.trim().length === 0 ? "#3A2418" : ACCENT,
          }}
          className="mt-3 items-center rounded-xl py-3"
        >
          <Text style={{ color: INK }} className="text-base font-semibold">
            Add to queue
          </Text>
        </Pressable>

        <Text className="mt-9 mb-2 text-xs uppercase tracking-wide text-muted">
          Queue ({queue.length})
        </Text>
        {queue.length === 0 ? (
          <Text className="text-base text-muted">Nothing queued yet.</Text>
        ) : (
          <View className="gap-2">
            {queue.map((t, i) => {
              const goal = state.goals.find((g) => g.id === t.goalId);
              return (
                <View
                  key={t.id}
                  style={{ borderColor: "#1f1f1f", backgroundColor: "#121212" }}
                  className="flex-row items-center rounded-2xl border p-4"
                >
                  <View className="flex-1">
                    <Text className="text-base font-medium text-foreground">{t.title}</Text>
                    <Text className="mt-0.5 text-xs text-muted">
                      {goal ? `${goal.title} · ` : ""}
                      {t.durationMin}m
                    </Text>
                  </View>
                  <Pressable onPress={() => moveTask(t.id, "up")} disabled={i === 0} className="px-2">
                    <Ionicons name="chevron-up" size={20} color={i === 0 ? "#333" : "#a3a3a3"} />
                  </Pressable>
                  <Pressable
                    onPress={() => moveTask(t.id, "down")}
                    disabled={i === queue.length - 1}
                    className="px-2"
                  >
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={i === queue.length - 1 ? "#333" : "#a3a3a3"}
                    />
                  </Pressable>
                  <Pressable onPress={() => removeTask(t.id)} className="pl-2">
                    <Ionicons name="trash-outline" size={18} color="#7a7a7a" />
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
