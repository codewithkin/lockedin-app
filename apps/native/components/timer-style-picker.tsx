import { Pressable, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { BodyStrong, Caption } from "@/components/typography";
import { useApp } from "@/lib/store";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";
import { type TimerStyle } from "@/lib/types";

const OPTIONS: { key: TimerStyle; name: string; desc: string }[] = [
  { key: "ring", name: "Ring", desc: "Countdown arc around the task." },
  { key: "numerals", name: "Numerals", desc: "Big bold time, nothing else." },
  { key: "ambient", name: "Ambient", desc: "Calm glow, time kept quiet." },
];

function Preview({ style }: { style: TimerStyle }) {
  const size = 76;
  if (style === "ring") {
    const stroke = 5;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    return (
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <Svg width={size} height={size} style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={COLORS.elevated} strokeWidth={stroke} fill="none" />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={COLORS.coral}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={c * 0.28}
            strokeLinecap="round"
          />
        </Svg>
        <Text style={{ fontFamily: FONTS.monoMedium, fontSize: 13, color: COLORS.fg }}>25:00</Text>
      </View>
    );
  }
  if (style === "numerals") {
    return (
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontFamily: FONTS.sansBold, fontSize: 24, letterSpacing: -1, color: COLORS.fg }}>
          25:00
        </Text>
      </View>
    );
  }
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{ position: "absolute", width: 62, height: 62, borderRadius: 31, backgroundColor: COLORS.coral, opacity: 0.18 }}
      />
      <Text style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.subtle }}>25:00</Text>
    </View>
  );
}

export function TimerStylePicker() {
  const { state, setTimerStyle } = useApp();

  return (
    <View style={{ gap: 10 }}>
      {OPTIONS.map((o) => {
        const selected = state.timerStyle === o.key;
        return (
          <Pressable
            key={o.key}
            onPress={() => setTimerStyle(o.key)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              borderRadius: RADIUS.x2,
              borderWidth: 1,
              borderColor: selected ? COLORS.coral : COLORS.line,
              backgroundColor: selected ? "rgba(255,107,74,0.06)" : COLORS.card,
              padding: 14,
            }}
          >
            <Preview style={o.key} />
            <View style={{ flex: 1 }}>
              <BodyStrong>{o.name}</BodyStrong>
              <Caption style={{ marginTop: 2 }}>{o.desc}</Caption>
            </View>
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                borderWidth: 2,
                borderColor: selected ? COLORS.coral : COLORS.line,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selected ? (
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.coral }} />
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
