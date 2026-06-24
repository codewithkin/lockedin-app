import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Pressable } from "react-native";

import { COLORS } from "@/lib/theme";

type MaybeDrawerNav = {
  openDrawer?: () => void;
  getParent?: () => MaybeDrawerNav | undefined;
};

export function MenuButton() {
  const navigation = useNavigation() as unknown as MaybeDrawerNav;

  function openDrawer() {
    let nav: MaybeDrawerNav | undefined = navigation;
    while (nav && typeof nav.openDrawer !== "function") {
      nav = nav.getParent?.();
    }
    nav?.openDrawer?.();
  }

  return (
    <Pressable hitSlop={10} onPress={openDrawer}>
      <Ionicons name="menu" size={24} color={COLORS.subtle} />
    </Pressable>
  );
}
