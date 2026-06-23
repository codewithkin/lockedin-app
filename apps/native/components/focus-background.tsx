import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { COLORS } from "@/lib/theme";

const blobBase = {
  position: "absolute",
  width: 340,
  height: 340,
  borderRadius: 170,
} as const;

// A deep, slow, infinite ambient drift that sits behind the focus timer.
export function FocusBackground() {
  const a = useSharedValue(0);
  const b = useSharedValue(0);

  useEffect(() => {
    a.value = withRepeat(
      withTiming(1, { duration: 15000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    b.value = withRepeat(
      withTiming(1, { duration: 22000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [a, b]);

  const blobOne = useAnimatedStyle(() => ({
    opacity: 0.05 + a.value * 0.07,
    transform: [
      { translateX: -40 + a.value * 90 },
      { translateY: -30 + a.value * 70 },
      { scale: 1 + a.value * 0.2 },
    ],
  }));

  const blobTwo = useAnimatedStyle(() => ({
    opacity: 0.04 + b.value * 0.06,
    transform: [
      { translateX: 50 - b.value * 100 },
      { translateY: 50 - b.value * 80 },
      { scale: 1.15 - b.value * 0.18 },
    ],
  }));

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }}
    >
      <Animated.View
        style={[blobBase, { top: "10%", left: "8%", backgroundColor: COLORS.coral }, blobOne]}
      />
      <Animated.View
        style={[blobBase, { bottom: "12%", right: "6%", backgroundColor: COLORS.coralDeep }, blobTwo]}
      />
    </View>
  );
}
