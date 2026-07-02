import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { DaySummaryStats, DayTimeline } from "@/components/day-summary";
import { Body, BodyMuted, Label, Title } from "@/components/typography";
import { formatDateLabel } from "@/lib/date";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";

export default function DaySummarySheet() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ flex: 1 }}>
            <Title>Today&apos;s summary</Title>
            <BodyMuted style={{ marginTop: 4 }}>That&apos;s a wrap. Here&apos;s how you did.</BodyMuted>
          </View>
          <Label style={{ marginTop: 6 }}>{formatDateLabel()}</Label>
        </View>

        <Animated.View entering={FadeInDown.duration(300)} style={{ marginTop: 20 }}>
          <DaySummaryStats />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(300)} style={{ marginTop: 24 }}>
          <DayTimeline />
        </Animated.View>
      </ScrollView>

      <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 24, paddingBottom: 12 }}>
        <Pressable
          onPress={() => router.push("/share")}
          style={({ pressed }) => ({
            flex: 1.5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderRadius: RADIUS.pill,
            backgroundColor: COLORS.coral,
            paddingVertical: 16,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Ionicons name="share-outline" size={18} color={COLORS.ink} />
          <Body style={{ fontFamily: FONTS.sansSemibold }} color={COLORS.ink}>
            Share today
          </Body>
        </Pressable>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: RADIUS.pill,
            backgroundColor: COLORS.elevated,
            paddingVertical: 16,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Body style={{ fontFamily: FONTS.sansMedium }} color={COLORS.fg}>
            Close
          </Body>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
