import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import { Pressable, Share, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";

import { PrimaryButton } from "@/components/buttons";
import { ShareCard } from "@/components/share-card";
import { useToast } from "@/components/toast";
import { BodyMuted, Label } from "@/components/typography";
import { formatDateLabel } from "@/lib/date";
import { useApp } from "@/lib/store";
import { COLORS } from "@/lib/theme";

export default function ShareScreen() {
  const router = useRouter();
  const { state, today } = useApp();
  const { show } = useToast();
  const cardRef = useRef<View>(null);
  const [busy, setBusy] = useState(false);

  async function onShare() {
    if (busy) return;
    setBusy(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const uri = await captureRef(cardRef, { format: "png", quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: "Share your day" });
      } else {
        await Share.share({ url: uri });
      }
    } catch {
      show("Couldn't open the share sheet. Try again.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.ink }}>
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 8 }}>
          <Label>Share your day</Label>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={{ position: "absolute", right: 0 }}
          >
            <Ionicons name="close" size={24} color={COLORS.subtle} />
          </Pressable>
        </View>

        <View style={{ flex: 1, justifyContent: "center" }}>
          <Animated.View entering={FadeInUp.duration(420)}>
            <ShareCard
              ref={cardRef}
              streak={state.stats.streak}
              done={today.completed}
              focusSeconds={today.focusSeconds}
              dateLabel={formatDateLabel()}
            />
          </Animated.View>
          <Animated.View entering={FadeIn.delay(300)}>
            <BodyMuted style={{ marginTop: 16, textAlign: "center", fontSize: 14 }}>
              Opens your phone&apos;s share sheet — post it anywhere.
            </BodyMuted>
          </Animated.View>
        </View>

        <View style={{ paddingBottom: 16 }}>
          <PrimaryButton label={busy ? "Preparing…" : "Share"} onPress={onShare} disabled={busy} />
        </View>
      </View>
    </SafeAreaView>
  );
}
