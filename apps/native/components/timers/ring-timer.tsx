import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { PrimaryButton } from "@/components/buttons";
import { Hint } from "@/components/hint";
import { BodyMuted, Caption, Display, Label, Title } from "@/components/typography";
import { formatClock } from "@/lib/date";
import { COLORS, RADIUS } from "@/lib/theme";
import { type TimerVariantProps } from "./types";

const SIZE = 248;
const STROKE = 6;

export function RingTimer({
  taskTitle,
  goalTitle,
  remaining,
  total,
  index,
  count,
  timeUp,
  onDone,
  onSkip,
}: TimerVariantProps) {
  const r = (SIZE - STROKE) / 2;
  const c = 2 * Math.PI * r;
  const pct = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
  const offset = c * (1 - pct);

  return (
    <View style={{ flex: 1, paddingHorizontal: 28 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 16 }}>
        <Label>Focus</Label>
        <Caption style={{ fontFamily: "JetBrainsMono_500Medium", letterSpacing: 1 }}>
          {index} of {count}
        </Caption>
      </View>

      {goalTitle ? (
        <View style={{ flexDirection: "row", marginTop: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              borderRadius: RADIUS.pill,
              borderWidth: 1,
              borderColor: COLORS.coralDeep,
              backgroundColor: "rgba(255,107,74,0.08)",
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Ionicons name="flag" size={11} color={COLORS.coral} />
            <Label style={{ letterSpacing: 1.5 }}>{goalTitle}</Label>
          </View>
        </View>
      ) : null}

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: SIZE, height: SIZE, alignItems: "center", justifyContent: "center" }}>
          <Svg
            width={SIZE}
            height={SIZE}
            style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}
          >
            <Circle cx={SIZE / 2} cy={SIZE / 2} r={r} stroke={COLORS.elevated} strokeWidth={STROKE} fill="none" />
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={r}
              stroke={COLORS.coral}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={c}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </Svg>
          <View style={{ alignItems: "center", paddingHorizontal: 36 }}>
            <Title style={{ fontSize: 18, lineHeight: 22, textAlign: "center" }}>{taskTitle}</Title>
            <Display style={{ fontSize: 38, lineHeight: 42, marginTop: 6 }} color={timeUp ? COLORS.coral : COLORS.fg}>
              {formatClock(remaining)}
            </Display>
          </View>
        </View>
        <Caption style={{ marginTop: 18 }}>of {formatClock(total)} block</Caption>
      </View>

      <Animated.View entering={FadeIn} style={{ marginBottom: 16 }}>
        <Hint id="focus.running">
          Don&apos;t press start — the timer&apos;s already running. Tap Done when the work is.
        </Hint>
      </Animated.View>

      <View style={{ gap: 8, paddingBottom: 12 }}>
        <PrimaryButton label="Done" onPress={onDone} haptic={false} />
        <Pressable onPress={onSkip} style={{ alignItems: "center", paddingVertical: 12 }}>
          <BodyMuted style={{ fontSize: 15 }}>Skip</BodyMuted>
        </Pressable>
      </View>
    </View>
  );
}
