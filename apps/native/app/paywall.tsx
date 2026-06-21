import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/buttons";
import { FadeToInk } from "@/components/gradient";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { PlanOption } from "@/components/plan-option";
import { BodyMuted, Caption, Display, Label } from "@/components/typography";
import { useApp } from "@/lib/store";
import { COLORS, FONTS } from "@/lib/theme";

// Photo by Karsten Winegeart on Unsplash (Unsplash License)
const STILL_IMAGE =
  "https://images.unsplash.com/photo-1741807117240-0aee0cd41d25?fm=jpg&q=70&w=800&auto=format&fit=crop";

type Plan = "monthly" | "annual";

export default function Paywall() {
  const router = useRouter();
  const { state } = useApp();
  const streak = state.stats.streak;
  const [plan, setPlan] = useState<Plan>("annual");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }} edges={["top", "bottom"]}>
      <View style={{ height: 200 }}>
        <ImageWithFallback
          uri={STILL_IMAGE}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "70%",
            height: 200,
            borderBottomLeftRadius: 36,
          }}
        />
        <FadeToInk height={130} />
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={{
            position: "absolute",
            top: 12,
            left: 20,
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: "rgba(10,10,10,0.6)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="close" size={20} color={COLORS.fg} />
        </Pressable>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: "flex-end", paddingBottom: 24 }}>
        <Animated.View entering={FadeInDown.duration(320)}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Ionicons name="flame" size={14} color={COLORS.coral} />
            <Label>You&apos;re on a {streak}-day streak</Label>
          </View>
          <Display style={{ fontSize: 40, lineHeight: 44 }}>Don&apos;t break{"\n"}the streak.</Display>
          <BodyMuted style={{ marginTop: 14 }}>
            Keep the loop, the streak, and your record — and unlock history, templates and sync as
            they land.
          </BodyMuted>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(320)} style={{ marginTop: 24, gap: 10 }}>
          <PlanOption
            title="Monthly"
            price="$4.99 / month"
            selected={plan === "monthly"}
            onPress={() => setPlan("monthly")}
          />
          <PlanOption
            title="Annual"
            price="$49.99 / year · $4.17 a month"
            badge="SAVE 16%"
            selected={plan === "annual"}
            onPress={() => setPlan("annual")}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(320)} style={{ marginTop: 20 }}>
          <PrimaryButton
            label="Start 2-day free trial"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.back();
            }}
          />
          <Caption style={{ marginTop: 14, textAlign: "center", fontFamily: FONTS.mono }}>
            No payment now. Cancel anytime.
          </Caption>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
