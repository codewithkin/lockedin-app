import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { PaywallGate } from "@/components/paywall-gate";
import { useApp } from "@/lib/store";
import { COLORS } from "@/lib/theme";

export const unstable_settings = {
  initialRouteName: "focus",
};

const TAB_BAR = {
  backgroundColor: COLORS.ink,
  borderTopColor: "#17171c",
};

export default function TabsLayout() {
  const { currentTask } = useApp();
  const focusing = !!currentTask;

  return (
    <PaywallGate>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.coral,
          tabBarInactiveTintColor: "#5b5b63",
          tabBarStyle: TAB_BAR,
          tabBarLabelStyle: { fontFamily: "JetBrainsMono_500Medium", fontSize: 10 },
        }}
      >
        <Tabs.Screen
          name="focus"
          options={{
            title: "Focus",
            tabBarIcon: ({ color, size }) => <Ionicons name="flash" size={size} color={color} />,
            // Fullscreen, distraction-free while a session is running.
            tabBarStyle: focusing ? { display: "none" } : TAB_BAR,
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: "Goals",
            tabBarIcon: ({ color, size }) => <Ionicons name="flag" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: "Tasks",
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
    </PaywallGate>
  );
}
