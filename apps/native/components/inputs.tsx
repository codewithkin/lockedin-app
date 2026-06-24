import { useState } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";

import { Body, Caption } from "@/components/typography";
import { COLORS, DURATIONS, FONTS, RADIUS } from "@/lib/theme";

export function Field(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={COLORS.subtle}
      autoCorrect={false}
      {...props}
      style={[
        {
          borderWidth: 1,
          borderColor: COLORS.line,
          backgroundColor: COLORS.elevated,
          borderRadius: RADIUS.lg,
          paddingHorizontal: 16,
          paddingVertical: 16,
          fontFamily: FONTS.sans,
          fontSize: 16,
          color: COLORS.fg,
        },
        props.style,
      ]}
    />
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: RADIUS.pill,
        borderWidth: 1,
        borderColor: selected ? COLORS.coral : COLORS.line,
        backgroundColor: selected ? COLORS.coral : "transparent",
        paddingHorizontal: 16,
        paddingVertical: 10,
      }}
    >
      <Body style={{ fontSize: 14, fontFamily: FONTS.sansMedium }} color={selected ? COLORS.ink : COLORS.subtle}>
        {label}
      </Body>
    </Pressable>
  );
}

export function DurationPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (d: number) => void;
}) {
  const isPreset = DURATIONS.includes(value);
  const [custom, setCustom] = useState(!isPreset);

  function setCustomMinutes(text: string) {
    const n = parseInt(text.replace(/[^0-9]/g, ""), 10);
    if (Number.isNaN(n)) {
      onChange(0);
      return;
    }
    onChange(Math.min(180, n));
  }

  return (
    <View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {DURATIONS.map((d) => {
          const selected = !custom && d === value;
          return (
            <Pressable
              key={d}
              onPress={() => {
                setCustom(false);
                onChange(d);
              }}
              style={chipStyle(selected)}
            >
              <Body style={{ fontFamily: FONTS.monoMedium, fontSize: 14 }} color={selected ? COLORS.ink : COLORS.subtle}>
                {d}
              </Body>
            </Pressable>
          );
        })}
        <Pressable onPress={() => setCustom(true)} style={chipStyle(custom)}>
          <Body style={{ fontFamily: FONTS.sansMedium, fontSize: 13 }} color={custom ? COLORS.ink : COLORS.subtle}>
            Custom
          </Body>
        </Pressable>
      </View>

      {custom ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 }}>
          <TextInput
            keyboardType="number-pad"
            value={value > 0 ? String(value) : ""}
            onChangeText={setCustomMinutes}
            placeholder="30"
            placeholderTextColor={COLORS.subtle}
            style={{
              width: 88,
              borderWidth: 1,
              borderColor: COLORS.line,
              backgroundColor: COLORS.elevated,
              borderRadius: RADIUS.md,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontFamily: FONTS.monoMedium,
              fontSize: 16,
              color: COLORS.fg,
              textAlign: "center",
            }}
          />
          <Caption>minutes</Caption>
        </View>
      ) : null}
    </View>
  );
}

function chipStyle(selected: boolean) {
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
