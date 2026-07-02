import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/buttons";
import { Card } from "@/components/primitives";
import { BodyMuted, Caption, Display, Label, Title } from "@/components/typography";
import { formatClock } from "@/lib/date";
import { lastCompletedToday, skippedToday } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { COLORS, FONTS } from "@/lib/theme";

export default function FirstWin() {
  const router = useRouter();
  const { state, today } = useApp();
  const streak = state.stats.streak;
  const task = lastCompletedToday(state.tasks);
  const skips = skippedToday(state.tasks).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
      {/* green glow */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -120,
          alignSelf: "center",
          width: 360,
          height: 360,
          borderRadius: 180,
          backgroundColor: COLORS.coral,
          opacity: 0.12,
        }}
      />

      <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: "center" }}>
        <View style={{ alignItems: "center" }}>
          <Animated.View
            entering={ZoomIn.duration(360)}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              borderWidth: 1,
              borderColor: COLORS.coralDeep,
              backgroundColor: "rgba(52,211,153,0.1)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="flame" size={26} color={COLORS.coral} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).duration(320)} style={{ alignItems: "center" }}>
            <Display style={{ marginTop: 20, fontSize: 52, lineHeight: 56 }}>Day {streak}.</Display>
            <BodyMuted style={{ marginTop: 6, textAlign: "center" }}>
              {streak <= 1 ? "You showed up. Your streak is live." : "Back at it. Keep the streak alive."}
            </BodyMuted>
          </Animated.View>
        </View>

        {task ? (
          <Animated.View entering={FadeIn.delay(320).duration(360)} style={{ marginTop: 36 }}>
            <Card style={{ alignItems: "center", paddingVertical: 24 }}>
              <Label>#{today.completed} · Today</Label>
              <Title style={{ marginTop: 10, textAlign: "center" }}>{task.title}</Title>
              <Caption style={{ marginTop: 10, fontFamily: FONTS.monoMedium, letterSpacing: 1 }}>
                {formatClock(task.focusSeconds ?? task.durationMin * 60).toUpperCase()} FOCUSED ·{" "}
                {skips === 0 ? "NO SKIPS" : `${skips} SKIPPED`}
              </Caption>
            </Card>
          </Animated.View>
        ) : null}
      </View>

      <View style={{ paddingHorizontal: 28, paddingBottom: 28, gap: 6 }}>
        <PrimaryButton label="Keep going" onPress={() => router.back()} />
        <Pressable
          onPress={() => router.push("/share?type=task")}
          style={{ alignItems: "center", paddingVertical: 12 }}
        >
          <BodyMuted style={{ fontSize: 15 }}>Share it</BodyMuted>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
