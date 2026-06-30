import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeInDown, SlideInRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/buttons";
import { Body, BodyMuted, Caption, Display, Label } from "@/components/typography";
import { ensureNotificationSetup } from "@/lib/notifications";
import { playStartFocus } from "@/lib/sounds";
import { useApp } from "@/lib/store";
import { COLORS, DURATIONS, FONTS, RADIUS } from "@/lib/theme";

type IconName = keyof typeof Ionicons.glyphMap;

const AREAS: { label: string; icon: IconName }[] = [
  { label: "Fitness", icon: "barbell" },
  { label: "Studying", icon: "school" },
  { label: "Work & business", icon: "briefcase" },
  { label: "Reading", icon: "book" },
  { label: "Mindfulness", icon: "leaf" },
  { label: "Waking up early", icon: "alarm" },
  { label: "Creative work", icon: "color-palette" },
  { label: "Breaking a habit", icon: "close-circle" },
];

const REASONS = [
  "To get healthier",
  "To build something of my own",
  "To finish what I start",
  "To make my family proud",
  "To become someone I respect",
];

const TOTAL_STEPS = 7;

export default function Onboarding() {
  const router = useRouter();
  const { completeOnboarding } = useApp();

  const [step, setStep] = useState(0);
  const [areas, setAreas] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [habit, setHabit] = useState("");
  const [habitArea, setHabitArea] = useState("");
  const [duration, setDuration] = useState(25);

  const effectiveArea = areas.includes(habitArea) ? habitArea : (areas[0] ?? "");

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function toggleArea(label: string) {
    setAreas((cur) =>
      cur.includes(label) ? cur.filter((a) => a !== label) : [...cur, label],
    );
  }

  function finish() {
    completeOnboarding({
      focusAreas: areas,
      reason: reason.trim() || null,
      areaForHabit: effectiveArea,
      habitTitle: habit,
      durationMin: duration,
    });
    playStartFocus();
    router.replace("/focus");
  }

  async function finishWithNotifications() {
    await ensureNotificationSetup();
    finish();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
      <View style={{ paddingHorizontal: 28, paddingTop: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, height: 24 }}>
          {step > 0 ? (
            <Pressable onPress={back} hitSlop={10}>
              <Ionicons name="chevron-back" size={22} color={COLORS.subtle} />
            </Pressable>
          ) : (
            <Label>ExcuseLess</Label>
          )}
          <View style={{ flex: 1, flexDirection: "row", gap: 5 }}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: i <= step ? COLORS.green : COLORS.line,
                }}
              />
            ))}
          </View>
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 28, paddingBottom: 32 }}
      >
        {step === 0 && (
          <Animated.View key="s0" entering={FadeIn.duration(360)} style={stepWrap}>
            <GlowMark icon="flash" />
            <Display style={{ marginTop: 28 }}>Become{"\n"}unstoppable.</Display>
            <Body color={COLORS.subtle} style={{ marginTop: 16 }}>
              The habits you keep build the person you become. ExcuseLess makes you keep them.
            </Body>
            <View style={{ marginTop: 32 }}>
              <PrimaryButton label="I'm in" onPress={next} />
            </View>
            <Caption style={{ marginTop: 16, textAlign: "center", fontFamily: FONTS.mono }}>
              Takes 60 seconds. Worth every one.
            </Caption>
          </Animated.View>
        )}

        {step === 1 && (
          <StepShell key="s1">
            <GlowMark icon="trending-up" />
            <Display style={{ marginTop: 24, fontSize: 38, lineHeight: 42 }}>Motivation lies.</Display>
            <Body color={COLORS.subtle} style={{ marginTop: 16 }}>
              It shows up when things are easy and disappears when they count. Discipline doesn&apos;t.
              ExcuseLess builds the part of you that shows up anyway.
            </Body>
            <View style={{ marginTop: 32 }}>
              <PrimaryButton label="Keep going" onPress={next} />
            </View>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell key="s2">
            <Display style={{ fontSize: 34, lineHeight: 38 }}>What are you building?</Display>
            <BodyMuted style={{ marginTop: 12 }}>
              Pick everything that matters. We&apos;ll shape ExcuseLess around it.
            </BodyMuted>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
              {AREAS.map((a) => {
                const on = areas.includes(a.label);
                return (
                  <Pressable key={a.label} onPress={() => toggleArea(a.label)} style={areaChip(on)}>
                    <Ionicons name={a.icon} size={16} color={on ? COLORS.ink : COLORS.subtle} />
                    <Body
                      style={{ fontSize: 14, fontFamily: FONTS.sansMedium }}
                      color={on ? COLORS.ink : COLORS.fg}
                    >
                      {a.label}
                    </Body>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ marginTop: 30 }}>
              <PrimaryButton label="Build around these" onPress={next} disabled={areas.length === 0} />
            </View>
            <Caption style={{ marginTop: 14, textAlign: "center", fontFamily: FONTS.mono }}>
              Pick at least one. Add more anytime.
            </Caption>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell key="s3">
            <Display style={{ fontSize: 34, lineHeight: 38 }}>Why does this matter?</Display>
            <BodyMuted style={{ marginTop: 12 }}>
              When it gets hard, this is what you&apos;ll come back to. Be honest.
            </BodyMuted>

            <View style={{ gap: 10, marginTop: 22 }}>
              {REASONS.map((r) => {
                const on = reason === r;
                return (
                  <Pressable key={r} onPress={() => setReason(r)} style={reasonRow(on)}>
                    <Ionicons
                      name={on ? "radio-button-on" : "radio-button-off"}
                      size={18}
                      color={on ? COLORS.green : COLORS.subtle}
                    />
                    <Body color={on ? COLORS.fg : COLORS.subtle} style={{ flex: 1 }}>
                      {r}
                    </Body>
                  </Pressable>
                );
              })}
            </View>

            <Label style={{ marginTop: 22, marginBottom: 8 }}>Or write your own</Label>
            <TextInput
              value={REASONS.includes(reason) ? "" : reason}
              onChangeText={setReason}
              placeholder="The real reason"
              placeholderTextColor={COLORS.subtle}
              returnKeyType="done"
              style={inputStyle}
            />

            <View style={{ marginTop: 26 }}>
              <PrimaryButton label="That's my why" onPress={next} disabled={reason.trim().length === 0} />
            </View>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell key="s4">
            <Display style={{ fontSize: 34, lineHeight: 38 }}>Make your first move.</Display>
            <BodyMuted style={{ marginTop: 12 }}>
              Name one thing you&apos;ll do today. Keep it small, specific, and impossible to talk
              yourself out of.
            </BodyMuted>

            <TextInput
              value={habit}
              onChangeText={setHabit}
              placeholder="Read 10 pages"
              placeholderTextColor={COLORS.subtle}
              autoCorrect={false}
              returnKeyType="done"
              style={inputStyle}
            />
            <Caption style={{ marginTop: 8 }}>
              Phrase it like an action — &quot;Read 10 pages,&quot; &quot;Gym at 6am.&quot; This is what
              you&apos;ll see every day.
            </Caption>

            {areas.length > 1 ? (
              <>
                <Label style={{ marginTop: 22, marginBottom: 10 }}>Under which one?</Label>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {areas.map((a) => {
                    const on = effectiveArea === a;
                    return (
                      <Pressable key={a} onPress={() => setHabitArea(a)} style={tagChip(on)}>
                        <Body
                          style={{ fontSize: 13, fontFamily: FONTS.sansMedium }}
                          color={on ? COLORS.ink : COLORS.subtle}
                        >
                          {a}
                        </Body>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            ) : (
              <View style={{ flexDirection: "row", marginTop: 18 }}>
                <View style={staticTag}>
                  <Label color={COLORS.green} style={{ letterSpacing: 1.2 }}>
                    Under · {effectiveArea || "your focus"}
                  </Label>
                </View>
              </View>
            )}

            <Label style={{ marginTop: 22, marginBottom: 10 }}>Focus time</Label>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {DURATIONS.map((d) => (
                <Pressable key={d} onPress={() => setDuration(d)} style={durationChip(d === duration)}>
                  <Body
                    style={{ fontFamily: FONTS.monoMedium, fontSize: 14 }}
                    color={d === duration ? COLORS.ink : COLORS.subtle}
                  >
                    {d}m
                  </Body>
                </Pressable>
              ))}
            </View>

            <View style={{ marginTop: 28 }}>
              <PrimaryButton
                label="Lock in my first habit"
                onPress={next}
                disabled={habit.trim().length === 0}
              />
            </View>
          </StepShell>
        )}

        {step === 5 && (
          <StepShell key="s5">
            <GlowMark icon="rocket" />
            <Display style={{ marginTop: 24, fontSize: 36, lineHeight: 40 }}>This is how you win.</Display>
            <Body color={COLORS.subtle} style={{ marginTop: 16 }}>
              Most people quit a new habit inside a week. The ones who don&apos;t all do the same thing —
              they make it impossible to negotiate. You just did.
            </Body>

            <View style={whyCard}>
              <Label style={{ marginBottom: 6 }}>Every time you want to skip</Label>
              <Body style={{ fontFamily: FONTS.sansMedium }}>
                {reason.trim()
                  ? `We'll put this back in front of you: ${reason.trim()}.`
                  : "We'll remind you why you started."}
              </Body>
            </View>

            <View style={{ marginTop: 28 }}>
              <PrimaryButton label="Start day one" onPress={next} />
            </View>
          </StepShell>
        )}

        {step === 6 && (
          <StepShell key="s6">
            <GlowMark icon="notifications" />
            <Display style={{ marginTop: 24, fontSize: 36, lineHeight: 40 }}>We&apos;ll keep you honest.</Display>
            <Body color={COLORS.subtle} style={{ marginTop: 16 }}>
              Not spam. A nudge when it&apos;s time to show up — and the moment a streak you&apos;ve built
              is about to break.
            </Body>

            <View style={{ marginTop: 32 }}>
              <PrimaryButton label="Keep me accountable" onPress={finishWithNotifications} />
            </View>
            <Pressable onPress={finish} hitSlop={10} style={{ marginTop: 18, alignItems: "center" }}>
              <BodyMuted style={{ fontSize: 14 }}>Not yet</BodyMuted>
            </Pressable>
          </StepShell>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StepShell({ children }: { children: React.ReactNode }) {
  return (
    <Animated.View entering={SlideInRight.duration(260)} style={stepWrap}>
      {children}
    </Animated.View>
  );
}

function GlowMark({ icon }: { icon: IconName }) {
  return (
    <Animated.View entering={FadeInDown.duration(360)} style={{ alignSelf: "flex-start" }}>
      <View style={glowBlob} />
      <View style={glowMark}>
        <Ionicons name={icon} size={26} color={COLORS.green} />
      </View>
    </Animated.View>
  );
}

const stepWrap = { flex: 1, justifyContent: "center" as const, paddingVertical: 24 };

const inputStyle = {
  marginTop: 18,
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

function areaChip(on: boolean) {
  return {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: on ? COLORS.green : COLORS.line,
    backgroundColor: on ? COLORS.green : "transparent",
    paddingHorizontal: 14,
    paddingVertical: 10,
  } as const;
}

function reasonRow(on: boolean) {
  return {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: on ? COLORS.green : COLORS.line,
    backgroundColor: on ? "rgba(52,211,153,0.06)" : COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 16,
  } as const;
}

function tagChip(on: boolean) {
  return {
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: on ? COLORS.green : COLORS.line,
    backgroundColor: on ? COLORS.green : "transparent",
    paddingHorizontal: 14,
    paddingVertical: 9,
  } as const;
}

function durationChip(on: boolean) {
  return {
    flex: 1,
    alignItems: "center" as const,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: on ? COLORS.green : COLORS.line,
    backgroundColor: on ? COLORS.green : "transparent",
    paddingVertical: 14,
  } as const;
}

const staticTag = {
  borderRadius: RADIUS.pill,
  borderWidth: 1,
  borderColor: COLORS.greenDeep,
  backgroundColor: "rgba(52,211,153,0.08)",
  paddingHorizontal: 12,
  paddingVertical: 6,
} as const;

const whyCard = {
  marginTop: 22,
  borderRadius: RADIUS.lg,
  borderWidth: 1,
  borderColor: COLORS.line,
  backgroundColor: COLORS.card,
  padding: 18,
} as const;

const glowBlob = {
  position: "absolute" as const,
  width: 92,
  height: 92,
  borderRadius: 46,
  backgroundColor: COLORS.green,
  opacity: 0.16,
  top: -12,
  left: -12,
} as const;

const glowMark = {
  width: 58,
  height: 58,
  borderRadius: RADIUS.lg,
  borderWidth: 1,
  borderColor: COLORS.line,
  backgroundColor: COLORS.elevated,
  alignItems: "center" as const,
  justifyContent: "center" as const,
} as const;
