import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReorderableList, {
  reorderItems,
  useIsActive,
  useReorderableDrag,
  type ReorderableListReorderEvent,
} from "react-native-reorderable-list";

import { EmptyState } from "@/components/empty-state";
import { Hint } from "@/components/hint";
import { AddRow, SectionLabel } from "@/components/primitives";
import { ScreenHeader } from "@/components/screen";
import { Label } from "@/components/typography";
import { TaskRow } from "@/components/task-row";
import { formatClock } from "@/lib/date";
import { completedToday } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { useCountdown } from "@/lib/use-countdown";
import { COLORS } from "@/lib/theme";
import { type Task } from "@/lib/types";

export default function Tasks() {
  const router = useRouter();
  const { state, currentTask, queue, removeTask, reorderQueue } = useApp();
  const countdown = useCountdown();

  const upNext = queue.filter((t) => t.id !== currentTask?.id);
  const done = completedToday(state.tasks);
  const goalTitle = (goalId: string | null) =>
    state.goals.find((g) => g.id === goalId)?.title ?? undefined;

  function onReorder({ from, to }: ReorderableListReorderEvent) {
    const next = reorderItems(upNext, from, to);
    const ids = [currentTask?.id, ...next.map((t) => t.id)].filter(
      (id): id is string => Boolean(id),
    );
    reorderQueue(ids);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }} edges={["top"]}>
      <ReorderableList
        data={upNext}
        keyExtractor={(t) => t.id}
        onReorder={onReorder}
        contentContainerStyle={{ padding: 24, paddingBottom: 56 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <DraggableTaskRow
            task={item}
            index={index}
            goalTitle={goalTitle(item.goalId)}
            onRemove={() => removeTask(item.id)}
            onEdit={() => router.push({ pathname: "/edit-task", params: { id: item.id } })}
          />
        )}
        ListHeaderComponent={
          <View>
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
                Hold the handle to drag. Whatever sits on top runs next.
              </Hint>
            </View>

            {currentTask ? (
              <View style={{ marginTop: 20, marginBottom: 4 }}>
                <SectionLabel>In progress</SectionLabel>
                <Pressable onPress={() => router.push("/focus")}>
                  <TaskRow
                    task={currentTask}
                    variant="running"
                    timer={countdown.active ? formatClock(countdown.remaining) : undefined}
                    goalTitle={goalTitle(currentTask.goalId)}
                  />
                </Pressable>
              </View>
            ) : null}

            <View style={{ marginTop: 16 }}>
              <SectionLabel>Up next</SectionLabel>
              {upNext.length === 0 ? (
                <EmptyState
                  compact
                  icon="list-outline"
                  title={currentTask ? "Queue's clear" : "Nothing queued"}
                  message={
                    currentTask
                      ? "Line up your next task to keep the loop going."
                      : "Add your first task and the timer starts the moment you open Focus."
                  }
                />
              ) : null}
            </View>
          </View>
        }
        ListFooterComponent={
          <View>
            <View style={{ marginTop: upNext.length === 0 ? 0 : 8 }}>
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
          </View>
        }
      />
    </SafeAreaView>
  );
}

function DraggableTaskRow({
  task,
  index,
  goalTitle,
  onRemove,
  onEdit,
}: {
  task: Task;
  index: number;
  goalTitle?: string;
  onRemove: () => void;
  onEdit: () => void;
}) {
  const drag = useReorderableDrag();
  const isActive = useIsActive();

  return (
    <Pressable onPress={onEdit} style={{ marginBottom: 8 }}>
      <TaskRow
        task={task}
        index={index}
        goalTitle={goalTitle}
        active={isActive}
        onRemove={onRemove}
        dragHandle={
          <Pressable onLongPress={drag} delayLongPress={120} hitSlop={10} style={{ paddingLeft: 4 }}>
            <Ionicons name="reorder-three" size={22} color={COLORS.subtle} />
          </Pressable>
        }
      />
    </Pressable>
  );
}
