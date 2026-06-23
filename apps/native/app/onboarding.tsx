import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { AvatarStack } from "@/components/avatar-stack";
import { PrimaryButton } from "@/components/buttons";
import { FadeToInk } from "@/components/gradient";
import { Hint } from "@/components/hint";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { Body, BodyMuted, Caption, Display, Label } from "@/components/typography";
import { playStartFocus } from "@/lib/sounds";
import { useApp } from "@/lib/store";
import { COLORS, DURATIONS, FONTS, RADIUS } from "@/lib/theme";

const STARTERS = ["Get fit", "Write every day", "Launch a side project", "Read more"];

// Photo by Cemrecan Yurtman on Unsplash (Unsplash License)
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1739296408127-b6cc9c5c094b?fm=jpg&q=70&w=1200&auto=format&fit=crop";

export default function Onboarding() {
  const router = useRouter();
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [task, setTask] = useState("");
  const [duration, setDuration] = useState(25);

  const goalReady = goal.trim().length > 0;
  const taskReady = task.trim().length > 0;

  function finish() {
    if (!taskReady) return;
    completeOnboarding(goal, task, duration);
    playStartFocus();
    router.replace("/focus");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
      <View style={{ paddingHorizontal: 28 }}>
        <Progress step={step} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 28 }}
      >
        {step === 0 && (
          <Animated.View key="s0" entering={FadeIn.duration(320)} style={{ flex: 1 }}>
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 320 }}>
              <ImageWithFallback
                uri={HERO_IMAGE}
                style={{ width: "100%", height: "100%", borderRadius: RADIUS.x2 }}
              />
              <FadeToInk height={200} />
            </View>
            <View style={{ position: "absolute", top: 14, left: 4 }}>
              <Label>LockedIn</Label>
            </View>

            <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <AvatarStack />
                <Label>12,000 people show up daily</Label>
              </View>
            <Display>Stop planning.{"\n"}Start executing.</Display>
            <Body color={COLORS.subtle} style={{ marginTop: 16 }}>
              One task. A timer runs. You hit Done or Skip. That&apos;s the whole app.
            </Body>
            <View style={{ marginTop: 28 }}>
              <PrimaryButton label="Lock in" onPress={() => setStep(1)} />
            </View>
            <Caption style={{ marginTop: 16, textAlign: "center", fontFamily: FONTS.mono }}>
                No account. No setup. Nothing to lose but the excuses.
              </Caption>
            </View>
          </Animated.View>
        )}

        {step === 1 && (
          <Animated.View
            key="s1"
            entering={FadeInDown.duration(280)}
            style={{ flex: 1, justifyContent: "center", paddingVertical: 24 }}
          >
            <Display style={{ fontSize: 34, lineHeight: 38 }}>What are you working toward?</Display>
            <BodyMuted style={{ marginTop: 12 }}>
              Tasks live under a goal. Start with one — add more later.
            </BodyMuted>

            <TextInput
              value={goal}
              onChangeText={setGoal}
              placeholder="Ship LockedIn v1"
              placeholderTextColor={COLORS.subtle}
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => goalReady && setStep(2)}
              style={inputStyle}
            />

            <Label style={{ marginTop: 24, marginBottom: 10 }}>Or pick a starter</Label>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {STARTERS.map((s) => (
                <Pressable key={s} onPress={() => setGoal(s)} style={chip(goal === s)}>
                  <Body
                    style={{ fontSize: 14, fontFamily: FONTS.sansMedium }}
                    color={goal === s ? COLORS.ink : COLORS.subtle}
                  >
                    {s}
                  </Body>
                </Pressable>
              ))}
            </View>

            <View style={{ marginTop: 28 }}>
              <PrimaryButton label="Next" onPress={() => setStep(2)} disabled={!goalReady} />
            </View>
            <Caption style={{ marginTop: 16, textAlign: "center", fontFamily: FONTS.mono }}>
              One goal is enough to begin.
            </Caption>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View
            key="s2"
            entering={FadeInDown.duration(280)}
            style={{ flex: 1, justifyContent: "center", paddingVertical: 24 }}
          >
            <Display style={{ fontSize: 34, lineHeight: 38 }}>What&apos;s the one thing?</Display>
            <BodyMuted style={{ marginTop: 12 }}>
              Something real you can do right now — not a someday.
            </BodyMuted>

            <View style={{ flexDirection: "row", marginTop: 18 }}>
              <View style={goalTag}>
                <Label color={COLORS.coral} style={{ letterSpacing: 1.5 }}>
                  Under · {goal.trim() || "your goal"}
                </Label>
              </View>
            </View>

            <TextInput
              value={task}
              onChangeText={setTask}
              placeholder="Write the Q3 narrative"
              placeholderTextColor={COLORS.subtle}
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={finish}
              style={inputStyle}
            />

            <View style={{ marginTop: 16 }}>
              <Hint id="onboarding.first-task">
                Pick something you can actually finish today — not a someday.
              </Hint>
            </View>

            <Label style={{ marginTop: 24, marginBottom: 10 }}>Focus time</Label>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {DURATIONS.map((d) => (
                <Pressable key={d} onPress={() => setDuration(d)} style={durationChip(d === duration)}>
                  <Body
                    style={{ fontFamily: FONTS.monoMedium, fontSize: 14 }}
                    color={d === duration ? COLORS.ink : COLORS.subtle}
                  >
                    {d}
                  </Body>
                </Pressable>
              ))}
            </View>

            <View style={{ marginTop: 28 }}>
              <PrimaryButton label="Start the timer" onPress={finish} disabled={!taskReady} />
            </View>
            <Caption style={{ marginTop: 16, textAlign: "center", fontFamily: FONTS.mono }}>
              The clock runs the second you tap.
            </Caption>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 6, paddingTop: 12 }}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 2,
            backgroundColor: i <= step ? COLORS.coral : COLORS.line,
          }}
        />
      ))}
    </View>
  );
}

const inputStyle = {
  marginTop: 20,
  borderWidth: 1,
  borderColor: COLORS.line,
  backgroundColor: COLORS.elevated,
  borderRadius: RADIUS.lg,
  paddingHorizontal: 16,
  paddingVertical: 16,
  fontFamily: FONTS.sans,
  fontSize: 16,
  color: COLORS.fg,
} as const;

function chip(selected: boolean) {
  return {
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: selected ? COLORS.coral : COLORS.line,
    backgroundColor: selected ? COLORS.coral : "transparent",
    paddingHorizontal: 16,
    paddingVertical: 10,
  } as const;
}

function durationChip(selected: boolean) {
  return {
    flex: 1,
    alignItems: "center",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: selected ? COLORS.coral : COLORS.line,
    backgroundColor: selected ? COLORS.coral : "transparent",
    paddingVertical: 14,
  } as const;
}

const goalTag = {
  borderRadius: RADIUS.pill,
  borderWidth: 1,
  borderColor: COLORS.coralDeep,
  backgroundColor: "rgba(255,107,74,0.08)",
  paddingHorizontal: 12,
  paddingVertical: 6,
} as const;
