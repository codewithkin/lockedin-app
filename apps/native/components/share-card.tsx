import { forwardRef } from "react";
import { View } from "react-native";

import { Caption, Display, Label, Title } from "@/components/typography";
import { formatDuration } from "@/lib/date";
import { COLORS, FONTS, RADIUS } from "@/lib/theme";

type Props = {
  streak: number;
  done: number;
  focusSeconds: number;
  dateLabel: string;
};

export const ShareCard = forwardRef<View, Props>(function ShareCard(
  { streak, done, focusSeconds, dateLabel },
  ref,
) {
  return (
    <View
      ref={ref}
      collapsable={false}
      style={{
        borderRadius: RADIUS.x2,
        borderWidth: 1,
        borderColor: COLORS.coralDeep,
        backgroundColor: COLORS.card,
        padding: 28,
        overflow: "hidden",
      }}
    >
      {/* coral glow */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -90,
          right: -60,
          width: 240,
          height: 240,
          borderRadius: 120,
          backgroundColor: COLORS.coral,
          opacity: 0.14,
        }}
      />

      <Label>ExcuseLess</Label>
      <Display style={{ marginTop: 14, fontSize: 56, lineHeight: 58 }}>Day {streak}.</Display>
      <Caption style={{ marginTop: 8, fontSize: 14 }} color={COLORS.subtle}>
        {streak <= 1 ? "Day one. No excuses." : `${streak} days unbroken. No excuses.`}
      </Caption>

      <View style={{ flexDirection: "row", gap: 28, marginTop: 28 }}>
        <Stat value={String(done)} label="Done" />
        <Stat value={formatDuration(focusSeconds)} label="Focused" />
        <Stat value={String(streak)} label="Streak" accent />
      </View>

      <Caption style={{ marginTop: 24, fontFamily: FONTS.monoMedium, letterSpacing: 1 }}>
        {dateLabel}
      </Caption>
    </View>
  );
});

function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <View>
      <Title style={{ fontSize: 24, lineHeight: 28 }} color={accent ? COLORS.coral : COLORS.fg}>
        {value}
      </Title>
      <Label style={{ marginTop: 4, color: COLORS.subtle }}>{label}</Label>
    </View>
  );
}
