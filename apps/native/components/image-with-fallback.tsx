import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, View, type ImageStyle, type StyleProp, type ViewStyle } from "react-native";

import { Label } from "@/components/typography";
import { COLORS } from "@/lib/theme";

type Props = {
  uri: string;
  style?: StyleProp<ImageStyle>;
  resizeMode?: "cover" | "contain";
};

export function ImageWithFallback({ uri, style, resizeMode = "cover" }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <View
        style={[
          { backgroundColor: COLORS.card, alignItems: "center", justifyContent: "center" },
          style as StyleProp<ViewStyle>,
        ]}
      >
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -60,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: COLORS.coral,
            opacity: 0.12,
          }}
        />
        <Ionicons name="image-outline" size={28} color={COLORS.subtle} />
        <Label style={{ marginTop: 8 }}>ExcuseLess</Label>
      </View>
    );
  }

  return (
    <Image source={{ uri }} style={style} resizeMode={resizeMode} onError={() => setFailed(true)} />
  );
}
