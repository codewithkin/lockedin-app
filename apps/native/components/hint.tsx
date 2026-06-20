import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";

import { Body, Caption } from "@/components/typography";
import { useApp } from "@/lib/store";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";

type Props = {
  id: string;
  children: string;
};

export function Hint({ id, children }: Props) {
  const { state, hideHintForever } = useApp();
  const [sessionHidden, setSessionHidden] = useState(false);

  if (sessionHidden || state.dismissedHints.includes(id)) return null;

  return (
    <Animated.View exiting={FadeOut} style={card}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Ionicons name="bulb-outline" size={16} color={COLORS.coral} style={{ marginTop: 2 }} />
        <Body style={{ flex: 1, fontSize: 14, lineHeight: 20 }} color={COLORS.subtle}>
          {children}
        </Body>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <Pressable
          onPress={() => setSessionHidden(true)}
          style={({ pressed }) => [ghostChip, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Caption style={{ fontFamily: FONTS.sansMedium }}>Hide</Caption>
        </Pressable>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            hideHintForever(id);
          }}
          style={({ pressed }) => [coralChip, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Caption style={{ fontFamily: FONTS.sansSemibold }} color={COLORS.ink}>
            Hide forever
          </Caption>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const card = {
  borderRadius: RADIUS.lg,
  borderWidth: 1,
  borderColor: COLORS.line,
  backgroundColor: COLORS.elevated,
  padding: 14,
} as const;

const ghostChip = {
  borderRadius: RADIUS.pill,
  borderWidth: 1,
  borderColor: COLORS.line,
  paddingHorizontal: 14,
  paddingVertical: 7,
} as const;

const coralChip = {
  borderRadius: RADIUS.pill,
  backgroundColor: COLORS.coral,
  paddingHorizontal: 14,
  paddingVertical: 7,
} as const;
