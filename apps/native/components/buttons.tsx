import * as Haptics from "expo-haptics";
import { Pressable, Text } from "react-native";

import { ACCENT, ACCENT_MUTED, INK } from "@/lib/theme";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  haptic?: boolean;
};

export function PrimaryButton({ label, onPress, disabled, haptic = true }: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={({ pressed }) => ({
        backgroundColor: disabled ? ACCENT_MUTED : ACCENT,
        opacity: pressed ? 0.85 : 1,
      })}
      className="items-center rounded-2xl px-6 py-4"
    >
      <Text style={{ color: INK }} className="text-base font-semibold">
        {label}
      </Text>
    </Pressable>
  );
}

export function GhostButton({ label, onPress, disabled, haptic = false }: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      className="items-center rounded-2xl border border-neutral-700 px-6 py-4"
    >
      <Text className="text-base font-medium text-muted">{label}</Text>
    </Pressable>
  );
}
