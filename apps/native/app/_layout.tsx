import "@/global.css";
import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
} from "@expo-google-fonts/hanken-grotesk";
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
} from "@expo-google-fonts/jetbrains-mono";
import {
  Newsreader_500Medium,
  Newsreader_600SemiBold,
  useFonts,
} from "@expo-google-fonts/newsreader";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";

import { ToastProvider } from "@/components/toast";
import { AppThemeProvider } from "@/contexts/app-theme-context";
import { PurchasesProvider } from "@/lib/purchases";
import { AppProvider } from "@/lib/store";
import { COLORS } from "@/lib/theme";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Newsreader_500Medium,
    Newsreader_600SemiBold,
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
  });

  useEffect(() => {
    Uniwind.setTheme("dark");
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: COLORS.ink }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <AppThemeProvider>
            <HeroUINativeProvider>
              <AppProvider>
                <PurchasesProvider>
                  <ToastProvider>
                    <StatusBar style="light" />
                    <Stack
                      screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: COLORS.ink },
                      }}
                    >
                      <Stack.Screen name="index" />
                      <Stack.Screen name="onboarding" />
                      <Stack.Screen name="(tabs)" />
                      <Stack.Screen name="add-task" options={{ presentation: "modal" }} />
                      <Stack.Screen name="add-goal" options={{ presentation: "modal" }} />
                      <Stack.Screen name="edit-task" options={{ presentation: "modal" }} />
                      <Stack.Screen name="share" options={{ presentation: "modal" }} />
                      <Stack.Screen
                        name="paywall"
                        options={{ presentation: "fullScreenModal", gestureEnabled: false }}
                      />
                      <Stack.Screen
                        name="first-win"
                        options={{ presentation: "fullScreenModal", gestureEnabled: false }}
                      />
                    </Stack>
                  </ToastProvider>
                </PurchasesProvider>
              </AppProvider>
            </HeroUINativeProvider>
          </AppThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
