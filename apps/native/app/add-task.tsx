import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { PrimaryButton } from "@/components/buttons";
import { Chip, DurationPicker, Field } from "@/components/inputs";
import { ModalScreen } from "@/components/modal-screen";
import { SectionLabel } from "@/components/primitives";
import { BodyMuted } from "@/components/typography";
import { playTaskAdd } from "@/lib/sounds";
import { useApp } from "@/lib/store";

export default function AddTask() {
  const router = useRouter();
  const { state, addTask } = useApp();
  const [goalId, setGoalId] = useState<string | null>(state.goals[0]?.id ?? null);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(25);

  function submit() {
    if (title.trim().length === 0) return;
    addTask({ title, durationMin: duration, goalId });
    playTaskAdd();
    router.back();
  }

  return (
    <ModalScreen title="New task">
      <View style={{ flex: 1, padding: 24 }}>
        {state.goals.length > 0 ? (
          <View>
            <SectionLabel>Goal</SectionLabel>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {state.goals.map((g) => (
                <Chip key={g.id} label={g.title} selected={g.id === goalId} onPress={() => setGoalId(g.id)} />
              ))}
            </View>
          </View>
        ) : (
          <BodyMuted>Add a goal first from the Goals tab.</BodyMuted>
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
          <SectionLabel>Focus time</SectionLabel>
          <DurationPicker value={duration} onChange={setDuration} />
        </View>

        <View style={{ flex: 1 }} />
        <PrimaryButton label="Add task" onPress={submit} disabled={title.trim().length === 0} />
      </View>
    </ModalScreen>
  );
}
