import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView } from "react-native";

import { ModalScreen } from "@/components/modal-screen";
import { TaskComposer } from "@/components/task-composer";

export default function ComposeTasks() {
  const router = useRouter();
  const { goalId } = useLocalSearchParams<{ goalId?: string }>();

  return (
    <ModalScreen title="Add tasks">
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        <TaskComposer goalId={goalId ?? null} onClose={() => router.back()} />
      </ScrollView>
    </ModalScreen>
  );
}
