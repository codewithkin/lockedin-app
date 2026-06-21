import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Caption, Display, Label } from "@/components/typography";
import { formatClock } from "@/lib/date";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";
import { type TimerVariantProps } from "./types";

export function AmbientTimer({
  taskTitle,
  remaining,
  index,
  count,
  timeUp,
  onDone,
  onSkip,
}: TimerVariantProps) {
  const glow = useSharedValue(0);

  useEffect(() => {
    glow.value = withRepeat(
      withTiming(1, { duration: 3800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [glow]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.06 + glow.value * 0.13,
    transform: [{ scale: 1 + glow.value * 0.14 }],
  }));

  return (
    <View style={{ flex: 1, paddingHorizontal: 28 }}>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            alignSelf: "center",
            top: "26%",
            width: 360,
            height: 360,
            borderRadius: 180,
            backgroundColor: COLORS.coral,
          },
          glowStyle,
        ]}
      />

      <View style={{ alignItems: "center", paddingTop: 16 }}>
        <Caption style={{ fontFamily: "JetBrainsMono_500Medium", letterSpacing: 1.5 }}>
          Focus · {index} of {count}
        </Caption>
      </View>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Display style={{ fontSize: 30, lineHeight: 36, textAlign: "center" }}>{taskTitle}</Display>
        <Label style={{ marginTop: 16, color: COLORS.subtle, letterSpacing: 1.5 }}>
          {timeUp ? "time's up" : `${formatClock(remaining)} left`}
        </Label>
      </View>

      <View style={{ flexDirection: "row", gap: 10, paddingBottom: 16 }}>
        <Pressable
          onPress={onSkip}
          style={({ pressed }) => ({
            flex: 1,
            alignItems: "center",
            borderRadius: RADIUS.pill,
            backgroundColor: COLORS.elevated,
            paddingVertical: 16,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ fontFamily: FONTS.sansMedium, fontSize: 16, color: COLORS.fg }}>Skip</Text>
        </Pressable>
        <Pressable
          onPress={onDone}
          style={({ pressed }) => ({
            flex: 1.6,
            alignItems: "center",
            borderRadius: RADIUS.pill,
            backgroundColor: COLORS.coral,
            paddingVertical: 16,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text style={{ fontFamily: FONTS.sansSemibold, fontSize: 16, color: COLORS.ink }}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
}
