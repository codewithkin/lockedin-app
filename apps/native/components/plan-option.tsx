import { Pressable, View } from "react-native";

import { BodyStrong, Caption, Label } from "@/components/typography";
import { COLORS, RADIUS } from "@/lib/theme";

type Props = {
  title: string;
  price: string;
  sub?: string;
  badge?: string;
  selected: boolean;
  onPress: () => void;
};

export function PlanOption({ title, price, sub, badge, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderRadius: RADIUS.x2,
        borderWidth: 1,
        borderColor: selected ? COLORS.coral : COLORS.line,
        backgroundColor: selected ? "rgba(52,211,153,0.06)" : COLORS.card,
        paddingHorizontal: 18,
        paddingVertical: 16,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      {badge ? (
        <View
          style={{
            position: "absolute",
            top: -9,
            right: 16,
            backgroundColor: COLORS.coral,
            borderRadius: RADIUS.pill,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <Label color={COLORS.ink} style={{ fontSize: 9, letterSpacing: 1 }}>
            {badge}
          </Label>
        </View>
      ) : null}

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <BodyStrong>{title}</BodyStrong>
          <Caption style={{ marginTop: 2 }}>
            {price}
            {sub ? ` · ${sub}` : ""}
          </Caption>
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
            <View
              style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.coral }}
            />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
