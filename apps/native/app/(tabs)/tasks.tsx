import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import { Hint } from "@/components/hint";
import { AddRow, AnimatedRow, SectionLabel } from "@/components/primitives";
import { Screen, ScreenHeader } from "@/components/screen";
import { BodyMuted, Label } from "@/components/typography";
import { TaskRow } from "@/components/task-row";
import { completedToday } from "@/lib/selectors";
import { useApp } from "@/lib/store";

export default function Tasks() {
  const router = useRouter();
  const { state, currentTask, queue, moveTask, removeTask } = useApp();

  const upNext = queue.filter((t) => t.id !== currentTask?.id);
  const done = completedToday(state.tasks);
  const goalTitle = (goalId: string | null) =>
    state.goals.find((g) => g.id === goalId)?.title ?? undefined;

  return (
    <Screen>
      <ScreenHeader
        title="Today"
        right={
          <Label style={{ marginTop: 8 }}>
            {currentTask ? "1 running · " : ""}
            {upNext.length} next
          </Label>
        }
      />

      <View style={{ marginTop: 16 }}>
        <Hint id="tasks.reorder">
          Reorder with the arrows. Whatever sits on top runs next.
        </Hint>
      </View>

      {currentTask ? (
        <View style={{ marginTop: 20 }}>
          <SectionLabel>In progress</SectionLabel>
          <Pressable onPress={() => router.push("/focus")}>
            <TaskRow task={currentTask} variant="running" goalTitle={goalTitle(currentTask.goalId)} />
          </Pressable>
        </View>
      ) : null}

      <View style={{ marginTop: 20 }}>
        <SectionLabel>Up next</SectionLabel>
        {upNext.length === 0 ? (
          <BodyMuted style={{ marginBottom: 12 }}>Nothing queued.</BodyMuted>
        ) : (
          <View style={{ gap: 8, marginBottom: 8 }}>
            {upNext.map((t, i) => (
              <AnimatedRow key={t.id} index={i}>
                <TaskRow
                  task={t}
                  index={i}
                  goalTitle={goalTitle(t.goalId)}
                  canMoveUp
                  canMoveDown={i < upNext.length - 1}
                  onMoveUp={() => moveTask(t.id, "up")}
                  onMoveDown={() => moveTask(t.id, "down")}
                  onRemove={() => removeTask(t.id)}
                />
              </AnimatedRow>
            ))}
          </View>
        )}
        <AddRow label="Add a task" onPress={() => router.push("/add-task")} />
      </View>

      {done.length > 0 ? (
        <View style={{ marginTop: 24 }}>
          <SectionLabel>Completed</SectionLabel>
          <View style={{ gap: 8 }}>
            {done.map((t) => (
              <TaskRow key={t.id} task={t} variant="done" goalTitle={goalTitle(t.goalId)} />
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}
