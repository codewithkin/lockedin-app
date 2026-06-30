import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";

import { COLORS } from "@/lib/theme";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        swipeEdgeWidth: 50,
        drawerStyle: { backgroundColor: COLORS.ink, width: 280 },
        drawerActiveTintColor: COLORS.coral,
        drawerInactiveTintColor: COLORS.subtle,
        drawerActiveBackgroundColor: "rgba(52,211,153,0.08)",
        drawerLabelStyle: { fontFamily: "HankenGrotesk_600SemiBold", fontSize: 15 },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color, size }) => <Ionicons name="flash-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
