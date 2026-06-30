import * as Haptics from "expo-haptics";
import { Text, View } from "react-native";

import { PressableScale } from "@/components/pressable-scale";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  haptic?: boolean;
};

export function PrimaryButton({ label, onPress, disabled, haptic = true }: Props) {
  return (
    <PressableScale
      disabled={disabled}
      onPress={() => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={{
        backgroundColor: disabled ? "#143026" : COLORS.coral,
        borderRadius: RADIUS.pill,
        overflow: "hidden",
      }}
    >
      {!disabled ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "55%",
            backgroundColor: COLORS.coralBright,
            opacity: 0.45,
          }}
        />
      ) : null}
      <Text
        style={{
          color: disabled ? "#7A5238" : COLORS.ink,
          fontFamily: FONTS.sansSemibold,
          fontSize: 16,
          textAlign: "center",
          paddingVertical: 16,
        }}
      >
        {label}
      </Text>
    </PressableScale>
  );
}

export function GhostButton({ label, onPress, disabled, haptic = false }: Props) {
  return (
    <PressableScale
      disabled={disabled}
      scaleTo={0.97}
      onPress={() => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={{
        borderRadius: RADIUS.pill,
        borderWidth: 1,
        borderColor: COLORS.line,
      }}
    >
      <Text
        style={{
          color: COLORS.subtle,
          fontFamily: FONTS.sansMedium,
          fontSize: 16,
          textAlign: "center",
          paddingVertical: 16,
        }}
      >
        {label}
      </Text>
    </PressableScale>
  );
}
