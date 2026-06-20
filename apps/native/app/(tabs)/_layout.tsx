import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { ACCENT } from "@/lib/theme";

export const unstable_settings = {
  initialRouteName: "focus",
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACCENT,
        tabBarInactiveTintColor: "#666666",
        tabBarStyle: {
          backgroundColor: "#0A0A0A",
          borderTopColor: "#1F1F1F",
        },
      }}
    >
      <Tabs.Screen
        name="focus"
        options={{
          title: "Focus",
          tabBarIcon: ({ color, size }) => <Ionicons name="flash" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "Plan",
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="day"
        options={{
          title: "Day",
          tabBarIcon: ({ color, size }) => <Ionicons name="today" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="streak"
        options={{
          title: "Streak",
          tabBarIcon: ({ color, size }) => <Ionicons name="flame" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
