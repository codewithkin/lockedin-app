import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { PrimaryButton } from "@/components/buttons";
import { DurationPicker, Field } from "@/components/inputs";
import { BodyMuted, Caption } from "@/components/typography";
import { useApp } from "@/lib/store";
import { COLORS, RADIUS } from "@/lib/theme";

type Draft = { title: string; durationMin: number };

export function TaskComposer({ goalId, onClose }: { goalId: string | null; onClose: () => void }) {
  const { addTasks } = useApp();
  const [rows, setRows] = useState<Draft[]>([{ title: "", durationMin: 25 }]);

  function update(i: number, patch: Partial<Draft>) {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function save() {
    addTasks(rows.map((r) => ({ title: r.title, durationMin: r.durationMin || 25, goalId })));
    onClose();
  }

  const canSave = rows.some((r) => r.title.trim().length > 0);

  return (
    <View
      style={{
        gap: 14,
        borderRadius: RADIUS.x2,
        borderWidth: 1,
        borderColor: COLORS.line,
        backgroundColor: COLORS.card,
        padding: 14,
      }}
    >
      {rows.map((r, i) => (
        <View key={i} style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Field
              value={r.title}
              onChangeText={(t) => update(i, { title: t })}
              placeholder="What needs doing?"
              autoFocus={i === rows.length - 1}
              style={{ flex: 1, paddingVertical: 12 }}
            />
            {rows.length > 1 ? (
              <Pressable
                onPress={() => setRows((rs) => rs.filter((_, idx) => idx !== i))}
                hitSlop={8}
              >
                <Ionicons name="close-circle" size={22} color={COLORS.subtle} />
              </Pressable>
            ) : null}
          </View>
          <DurationPicker value={r.durationMin} onChange={(d) => update(i, { durationMin: d })} />
        </View>
      ))}

      <Pressable
        onPress={() => setRows((rs) => [...rs, { title: "", durationMin: 25 }])}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          borderRadius: RADIUS.lg,
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: COLORS.line,
          paddingVertical: 12,
        }}
      >
        <Ionicons name="add" size={16} color={COLORS.subtle} />
        <Caption>Add another</Caption>
      </Pressable>

      <PrimaryButton label="Save tasks" onPress={save} disabled={!canSave} />
      <Pressable onPress={onClose} style={{ alignItems: "center", paddingVertical: 4 }}>
        <BodyMuted style={{ fontSize: 14 }}>Cancel</BodyMuted>
      </Pressable>
    </View>
  );
}
