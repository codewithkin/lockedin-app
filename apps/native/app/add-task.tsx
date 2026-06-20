import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/buttons";
import { Chip, DurationPicker, Field } from "@/components/inputs";
import { SectionLabel } from "@/components/primitives";
import { BodyMuted, Title } from "@/components/typography";
import { useApp } from "@/lib/store";
import { COLORS } from "@/lib/theme";

export default function AddTask() {
  const router = useRouter();
  const { state, addTask } = useApp();
  const [goalId, setGoalId] = useState<string | null>(state.goals[0]?.id ?? null);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(25);

  function submit() {
    if (title.trim().length === 0) return;
    addTask({ title, durationMin: duration, goalId });
    router.back();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }} edges={["bottom"]}>
      <View style={{ flex: 1, padding: 24 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Title>New task</Title>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <BodyMuted>Cancel</BodyMuted>
          </Pressable>
        </View>

        {state.goals.length > 0 ? (
          <View style={{ marginTop: 24 }}>
            <SectionLabel>Goal</SectionLabel>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {state.goals.map((g) => (
                <Chip key={g.id} label={g.title} selected={g.id === goalId} onPress={() => setGoalId(g.id)} />
              ))}
            </View>
          </View>
        ) : (
          <BodyMuted style={{ marginTop: 24 }}>Add a goal first from the Goals tab.</BodyMuted>
        )}

        <View style={{ marginTop: 24 }}>
          <SectionLabel>Task</SectionLabel>
          <Field
            value={title}
            onChangeText={setTitle}
            placeholder="What's the next thing?"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={submit}
          />
        </View>

        <View style={{ marginTop: 24 }}>
          <SectionLabel>Block length</SectionLabel>
          <DurationPicker value={duration} onChange={setDuration} />
        </View>

        <View style={{ flex: 1 }} />
        <PrimaryButton label="Add to queue" onPress={submit} disabled={title.trim().length === 0} />
      </View>
    </SafeAreaView>
  );
}
