import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Switch, View } from "react-native";

import { ModalScreen } from "@/components/modal-screen";
import { Card, SectionLabel } from "@/components/primitives";
import { TimerStylePicker } from "@/components/timer-style-picker";
import { BodyMuted, BodyStrong, Caption } from "@/components/typography";
import { useApp } from "@/lib/store";
import { COLORS } from "@/lib/theme";
import { type NotificationPrefs } from "@/lib/types";

const ROWS: {
  key: keyof NotificationPrefs;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
}[] = [
  {
    key: "timerEnd",
    icon: "alarm-outline",
    title: "Timer finished",
    desc: "When a focus session's time runs out.",
  },
  {
    key: "daily",
    icon: "sunny-outline",
    title: "Daily reminder",
    desc: "A morning nudge to start your first task.",
  },
  {
    key: "streakRisk",
    icon: "flame-outline",
    title: "Streak at risk",
    desc: "Evening reminder if today's streak is unfinished.",
  },
  {
    key: "taskNudge",
    icon: "list-outline",
    title: "Task nudges",
    desc: "Midday reminder while tasks are queued.",
  },
];

export default function Settings() {
  const { state, setNotificationPref } = useApp();
  const prefs = state.notifications;

  return (
    <ModalScreen title="Settings">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
        <SectionLabel>Focus theme</SectionLabel>
        <TimerStylePicker />

        <SectionLabel style={{ marginTop: 28 }}>Notifications</SectionLabel>
        <View style={{ gap: 10 }}>
          {ROWS.map((r) => (
            <Card key={r.key} style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <Ionicons name={r.icon} size={20} color={COLORS.coral} />
              <View style={{ flex: 1 }}>
                <BodyStrong style={{ fontSize: 15 }}>{r.title}</BodyStrong>
                <Caption style={{ marginTop: 2 }}>{r.desc}</Caption>
              </View>
              <Switch
                value={prefs[r.key]}
                onValueChange={(v) => setNotificationPref(r.key, v)}
                trackColor={{ false: COLORS.line, true: COLORS.coral }}
                thumbColor={COLORS.fg}
                ios_backgroundColor={COLORS.line}
              />
            </Card>
          ))}
        </View>

        <BodyMuted style={{ marginTop: 18, fontSize: 13 }}>
          Turn a reminder off and it stops scheduling immediately. You can change these anytime.
        </BodyMuted>
      </ScrollView>
    </ModalScreen>
  );
}
