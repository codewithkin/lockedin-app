import "@/global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";

import { NotificationsProvider } from "@/components/notifications-provider";
import { ToastProvider } from "@/components/toast";
import { AppThemeProvider } from "@/contexts/app-theme-context";
import { PurchasesProvider } from "@/lib/purchases";
import { preloadSounds } from "@/lib/sounds";
import { AppProvider } from "@/lib/store";
import { COLORS } from "@/lib/theme";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Newsreader_500Medium: require("../assets/fonts/Newsreader-Medium.ttf"),
    Newsreader_600SemiBold: require("../assets/fonts/Newsreader-SemiBold.ttf"),
    HankenGrotesk_400Regular: require("../assets/fonts/HankenGrotesk-Regular.ttf"),
    HankenGrotesk_500Medium: require("../assets/fonts/HankenGrotesk-Medium.ttf"),
    HankenGrotesk_600SemiBold: require("../assets/fonts/HankenGrotesk-SemiBold.ttf"),
    HankenGrotesk_700Bold: require("../assets/fonts/HankenGrotesk-Bold.ttf"),
    JetBrainsMono_400Regular: require("../assets/fonts/JetBrainsMono-Regular.ttf"),
    JetBrainsMono_500Medium: require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  useEffect(() => {
    Uniwind.setTheme("dark");
    preloadSounds();
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
                <NotificationsProvider>
                  <PurchasesProvider>
                    <ToastProvider>
                    <StatusBar style="light" />
                    <Stack
                      screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: COLORS.ink },
                        animation: "slide_from_right",
                        animationDuration: 280,
                      }}
                    >
                      <Stack.Screen name="index" />
                      <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
                      <Stack.Screen name="(drawer)" options={{ animation: "fade" }} />
                      <Stack.Screen name="add-task" options={{ presentation: "modal" }} />
                      <Stack.Screen name="add-goal" options={{ presentation: "modal" }} />
                      <Stack.Screen name="compose-tasks" options={{ presentation: "modal" }} />
                      <Stack.Screen name="edit-task" options={{ presentation: "modal" }} />
                      <Stack.Screen name="share" options={{ presentation: "modal" }} />
                      <Stack.Screen name="day-summary" options={{ presentation: "modal" }} />
                      <Stack.Screen
                        name="paywall"
                        options={{ presentation: "fullScreenModal", gestureEnabled: false }}
                      />
                      <Stack.Screen
                        name="first-win"
                        options={{
                          presentation: "fullScreenModal",
                          gestureEnabled: false,
                          animation: "fade",
                        }}
                      />
                    </Stack>
                    </ToastProvider>
                  </PurchasesProvider>
                </NotificationsProvider>
              </AppProvider>
            </HeroUINativeProvider>
          </AppThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
