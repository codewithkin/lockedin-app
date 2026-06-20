import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/buttons";
import { useApp } from "@/lib/store";
import { ACCENT, DURATIONS, INK } from "@/lib/theme";

export default function Onboarding() {
  const router = useRouter();
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [task, setTask] = useState("");
  const [duration, setDuration] = useState(25);

  function finish() {
    completeOnboarding(goal, task, duration);
    router.replace("/focus");
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-7">
        {step === 0 && (
          <View>
            <Text style={{ color: ACCENT }} className="mb-5 text-xs font-semibold uppercase tracking-[3px]">
              LockedIn
            </Text>
            <Text className="text-4xl font-bold leading-tight text-foreground">
              Stop scrolling.{"\n"}Start executing.
            </Text>
            <Text className="mt-4 text-base text-muted">
              One task at a time. A timer runs. You do the work. That&apos;s the whole thing.
            </Text>
            <View className="mt-10">
              <PrimaryButton label="Lock in" onPress={() => setStep(1)} />
            </View>
          </View>
        )}

        {step === 1 && (
          <View>
            <Text className="text-3xl font-bold leading-tight text-foreground">
              Here&apos;s how it works.
            </Text>
            <View className="mt-8 gap-5">
              <Row n="1" text="Your current task shows up. The timer starts on its own." />
              <Row n="2" text="Do the one thing in front of you. Nothing else." />
              <Row n="3" text="Hit Done or Skip. The next task loads instantly." />
            </View>
            <View className="mt-10">
              <PrimaryButton label="Got it" onPress={() => setStep(2)} />
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text className="text-3xl font-bold leading-tight text-foreground">
              What are you working toward?
            </Text>
            <Text className="mt-2 text-base text-muted">Pick one real goal for right now.</Text>

            <Text className="mt-7 mb-2 text-xs uppercase tracking-wide text-muted">Goal</Text>
            <TextInput
              value={goal}
              onChangeText={setGoal}
              placeholder="Ship the landing page"
              placeholderTextColor="#666"
              className="rounded-2xl border border-neutral-700 px-4 py-4 text-base text-foreground"
            />

            <Text className="mt-5 mb-2 text-xs uppercase tracking-wide text-muted">
              First task
            </Text>
            <TextInput
              value={task}
              onChangeText={setTask}
              placeholder="Write the hero section"
              placeholderTextColor="#666"
              className="rounded-2xl border border-neutral-700 px-4 py-4 text-base text-foreground"
            />

            <Text className="mt-5 mb-2 text-xs uppercase tracking-wide text-muted">Focus block</Text>
            <View className="flex-row gap-2">
              {DURATIONS.map((d) => {
                const selected = d === duration;
                return (
                  <Pressable
                    key={d}
                    onPress={() => setDuration(d)}
                    style={{
                      backgroundColor: selected ? ACCENT : "transparent",
                      borderColor: selected ? ACCENT : "#404040",
                    }}
                    className="flex-1 items-center rounded-xl border py-3"
                  >
                    <Text
                      style={{ color: selected ? INK : "#a3a3a3" }}
                      className="text-sm font-semibold"
                    >
                      {d}m
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View className="mt-9">
              <PrimaryButton
                label="Start the loop"
                onPress={finish}
                disabled={task.trim().length === 0}
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function Row({ n, text }: { n: string; text: string }) {
  return (
    <View className="flex-row items-start gap-4">
      <Text style={{ color: ACCENT }} className="text-lg font-bold">
        {n}
      </Text>
      <Text className="flex-1 text-base text-foreground">{text}</Text>
    </View>
  );
}
