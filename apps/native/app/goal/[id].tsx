import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Field } from "@/components/inputs";
import { AddRow, Card, SectionLabel } from "@/components/primitives";
import { ProgressRing } from "@/components/progress-ring";
import { TaskComposer } from "@/components/task-composer";
import { BodyMuted, BodyStrong, Caption, Heading, Label, Title } from "@/components/typography";
import { goalStats, tasksForGoalAll } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { COLORS, RADIUS } from "@/lib/theme";

export default function GoalDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, editGoal, removeGoal, setPrimaryGoal, setActiveTask } = useApp();

  const goal = state.goals.find((g) => g.id === id);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(goal?.title ?? "");
  const [composer, setComposer] = useState(false);

  if (!goal) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <BodyMuted>That goal&apos;s gone.</BodyMuted>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Label>Go back</Label>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const stats = goalStats(state.tasks, goal.id);
  const tasks = tasksForGoalAll(state.tasks, goal.id);
  const isPrimary = state.primaryGoalId === goal.id;

  function saveTitle() {
    if (title.trim().length > 0) editGoal(goal!.id, title);
    setEditing(false);
  }

  function deleteGoal() {
    removeGoal(goal!.id);
    router.back();
  }

  function startTask(taskId: string) {
    setActiveTask(taskId);
    router.navigate("/focus");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }} edges={["top", "bottom"]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 8,
        }}
      >
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color={COLORS.fg} />
        </Pressable>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <Pressable onPress={() => router.push(`/share?type=goal&goalId=${goal.id}`)} hitSlop={10}>
            <Ionicons name="share-outline" size={20} color={COLORS.subtle} />
          </Pressable>
          <Pressable onPress={deleteGoal} hitSlop={10}>
            <Ionicons name="trash-outline" size={20} color={COLORS.subtle} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 8, paddingBottom: 48 }}>
        <Label>Goal</Label>
        {editing ? (
          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            <Field
              value={title}
              onChangeText={setTitle}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={saveTitle}
              style={{ flex: 1 }}
            />
            <Pressable
              onPress={saveTitle}
              style={{
                justifyContent: "center",
                paddingHorizontal: 16,
                borderRadius: RADIUS.lg,
                backgroundColor: COLORS.coral,
              }}
            >
              <Caption color={COLORS.ink} style={{ fontFamily: "HankenGrotesk_600SemiBold" }}>
                Save
              </Caption>
            </Pressable>
          </View>
        ) : (
          <Title style={{ marginTop: 6 }}>{goal.title}</Title>
        )}

        <Card style={{ marginTop: 20, flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View style={{ flex: 1 }}>
            <Heading style={{ fontSize: 18 }}>
              {stats.done} of {stats.total} done
            </Heading>
            <Caption style={{ marginTop: 6 }}>{stats.dueToday} still to do</Caption>
          </View>
          <ProgressRing value={stats.done} total={stats.total} size={60} />
        </Card>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
          <QuickAction
            icon="create-outline"
            label={editing ? "Editing…" : "Edit goal"}
            onPress={() => setEditing((e) => !e)}
          />
          <QuickAction icon="add" label="Add task" onPress={() => setComposer(true)} />
        </View>

        {!isPrimary ? (
          <Pressable
            onPress={() => setPrimaryGoal(goal.id)}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14 }}
          >
            <Ionicons name="star-outline" size={16} color={COLORS.subtle} />
            <Caption>Make this my main goal</Caption>
          </Pressable>
        ) : null}

        {composer ? (
          <View style={{ marginTop: 18 }}>
            <TaskComposer goalId={goal.id} onClose={() => setComposer(false)} />
          </View>
        ) : null}

        <SectionLabel style={{ marginTop: 28 }}>Tasks</SectionLabel>
        {tasks.length === 0 ? (
          <BodyMuted>No tasks under this goal yet. Add one below.</BodyMuted>
        ) : (
          <View style={{ gap: 8 }}>
            {tasks.map((t) => {
              if (t.status !== "pending") {
                const done = t.status === "done";
                return (
                  <View
                    key={t.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      borderRadius: RADIUS.xl,
                      borderWidth: 1,
                      borderColor: COLORS.line,
                      padding: 16,
                    }}
                  >
                    <Ionicons
                      name={done ? "checkmark-circle" : "close-circle-outline"}
                      size={18}
                      color={done ? COLORS.coral : COLORS.subtle}
                    />
                    <BodyStrong
                      style={{ flex: 1, fontSize: 15, textDecorationLine: "line-through" }}
                      color={COLORS.subtle}
                    >
                      {t.title}
                    </BodyStrong>
                  </View>
                );
              }
              return (
                <Pressable
                  key={t.id}
                  onPress={() => startTask(t.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    borderRadius: RADIUS.xl,
                    borderWidth: 1,
                    borderColor: COLORS.line,
                    backgroundColor: COLORS.card,
                    padding: 16,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <BodyStrong style={{ fontSize: 15 }}>{t.title}</BodyStrong>
                    <Caption style={{ marginTop: 2 }}>{t.durationMin}m</Caption>
                  </View>
                  <Ionicons name="play-circle" size={24} color={COLORS.coral} />
                </Pressable>
              );
            })}
          </View>
        )}

        {!composer ? (
          <View style={{ marginTop: 10 }}>
            <AddRow label="Add tasks" onPress={() => setComposer(true)} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: RADIUS.pill,
        borderWidth: 1,
        borderColor: COLORS.line,
        paddingVertical: 14,
      }}
    >
      <Ionicons name={icon} size={16} color={COLORS.coral} />
      <BodyStrong style={{ fontSize: 14 }}>{label}</BodyStrong>
    </Pressable>
  );
}
