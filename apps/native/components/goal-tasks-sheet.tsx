import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";

import { Body, BodyStrong, Caption, Label } from "@/components/typography";
import { goalSheetTasks } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";

type Props = {
  goalId: string | null;
  onPickTask: (taskId: string) => void;
};

export const GoalTasksSheet = forwardRef<BottomSheet, Props>(function GoalTasksSheet(
  { goalId, onPickTask },
  ref,
) {
  const { state } = useApp();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(goalId);
  const snapPoints = useMemo(() => ["55%", "88%"], []);

  useEffect(() => {
    setSelectedGoalId(goalId);
  }, [goalId]);

  const tasks = goalSheetTasks(state.tasks, selectedGoalId);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: COLORS.card }}
      handleIndicatorStyle={{ backgroundColor: COLORS.line, width: 44 }}
    >
      <BottomSheetScrollView contentContainerStyle={{ padding: 20, paddingBottom: 44 }}>
        <Label>All tasks</Label>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          {state.goals.map((g) => {
            const selected = g.id === selectedGoalId;
            return (
              <Pressable
                key={g.id}
                onPress={() => setSelectedGoalId(g.id)}
                style={{
                  borderRadius: RADIUS.pill,
                  borderWidth: 1,
                  borderColor: selected ? COLORS.coral : COLORS.line,
                  backgroundColor: selected ? COLORS.coral : "transparent",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                }}
              >
                <Body
                  style={{ fontSize: 13, fontFamily: FONTS.sansMedium }}
                  color={selected ? COLORS.ink : COLORS.subtle}
                >
                  {g.title}
                </Body>
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: 18, gap: 8 }}>
          {tasks.length === 0 ? (
            <Caption>Nothing here yet.</Caption>
          ) : (
            tasks.map((t) => {
              const settled = t.status !== "pending";
              return (
                <Pressable
                  key={t.id}
                  disabled={settled}
                  onPress={() => onPickTask(t.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    borderRadius: RADIUS.lg,
                    borderWidth: 1,
                    borderColor: COLORS.line,
                    backgroundColor: settled ? "transparent" : COLORS.elevated,
                    padding: 14,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <BodyStrong
                      style={{
                        fontSize: 15,
                        textDecorationLine: settled ? "line-through" : "none",
                      }}
                      color={settled ? COLORS.subtle : COLORS.fg}
                    >
                      {t.title}
                    </BodyStrong>
                    <Caption style={{ marginTop: 2 }}>
                      {settled ? (t.status === "done" ? "done" : "skipped") : `${t.durationMin}m`}
                    </Caption>
                  </View>
                  {!settled ? <Ionicons name="play" size={16} color={COLORS.coral} /> : null}
                </Pressable>
              );
            })
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});
