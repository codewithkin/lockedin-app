import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { Body, BodyStrong, Caption, Label } from "@/components/typography";
import { type Task } from "@/lib/types";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";

type Variant = "next" | "running" | "done" | "skipped";

type Props = {
  task: Task;
  goalTitle?: string;
  index?: number;
  variant?: Variant;
  timer?: string;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
  dragHandle?: React.ReactNode;
  active?: boolean;
};

export function TaskRow({
  task,
  goalTitle,
  index = 0,
  variant = "next",
  timer,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onRemove,
  dragHandle,
  active,
}: Props) {
  const running = variant === "running";
  const done = variant === "done";
  const skipped = variant === "skipped";
  const struck = done || skipped;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderRadius: RADIUS.xl,
        borderWidth: 1,
        borderColor: active ? COLORS.coral : running ? COLORS.coral : COLORS.line,
        backgroundColor: active
          ? COLORS.elevated
          : running
            ? "rgba(255,107,74,0.07)"
            : done || skipped
              ? "transparent"
              : COLORS.card,
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: "#000",
        shadowOpacity: active ? 0.4 : 0,
        shadowRadius: active ? 12 : 0,
        shadowOffset: { width: 0, height: active ? 6 : 0 },
        elevation: active ? 8 : 0,
      }}
    >
      {running ? (
        <Ionicons name="flame" size={18} color={COLORS.coral} />
      ) : done ? (
        <Ionicons name="checkmark-circle" size={20} color={COLORS.coral} />
      ) : skipped ? (
        <Ionicons name="close-circle-outline" size={20} color={COLORS.subtle} />
      ) : (
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 1,
            borderColor: COLORS.line,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Caption style={{ fontFamily: FONTS.monoMedium }}>{index + 1}</Caption>
        </View>
      )}

      <View style={{ flex: 1 }}>
        {running ? <Label style={{ marginBottom: 2 }}>Now · Focusing</Label> : null}
        <BodyStrong
          style={{
            fontSize: 15,
            textDecorationLine: struck ? "line-through" : "none",
          }}
          color={struck ? COLORS.subtle : COLORS.fg}
        >
          {task.title}
        </BodyStrong>
        {goalTitle && !running ? (
          <Caption style={{ marginTop: 2 }}>{goalTitle}</Caption>
        ) : null}
      </View>

      {running && timer ? (
        <Body style={{ fontFamily: FONTS.monoMedium, fontSize: 22 }} color={COLORS.coral}>
          {timer}
        </Body>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Caption style={{ fontFamily: FONTS.monoMedium }}>
            {skipped ? "skip" : `${task.durationMin}m`}
          </Caption>
          {onMoveUp ? (
            <Pressable onPress={onMoveUp} disabled={!canMoveUp} hitSlop={6} style={{ paddingHorizontal: 2 }}>
              <Ionicons name="chevron-up" size={18} color={canMoveUp ? COLORS.subtle : "#33333a"} />
            </Pressable>
          ) : null}
          {onMoveDown ? (
            <Pressable onPress={onMoveDown} disabled={!canMoveDown} hitSlop={6} style={{ paddingHorizontal: 2 }}>
              <Ionicons name="chevron-down" size={18} color={canMoveDown ? COLORS.subtle : "#33333a"} />
            </Pressable>
          ) : null}
          {onRemove ? (
            <Pressable onPress={onRemove} hitSlop={6} style={{ paddingLeft: 2 }}>
              <Ionicons name="trash-outline" size={16} color="#6b6b73" />
            </Pressable>
          ) : null}
          {dragHandle ?? null}
        </View>
      )}
    </View>
  );
}
