import { router, SplashScreen, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

import OptionsMenu from "@/components/OptionsMenu";
import OptionWindow from "@/components/OptionWindow";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useThemeColors } from "@/hooks/useTheme";
import AddWeight from "@/components/AddWeight";

import "../i18n";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSetup } from "@/hooks/useSetup";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const setupStatus = useSetup();
  const segments = useSegments();
  const { headerBackground } = useThemeColors();

  useEffect(() => {
    if (setupStatus === "loading") {
      return;
    }

    SplashScreen.hide();

    const inSetup = segments[0] === "setup";

    if (setupStatus === "new" && !inSetup) {
      router.replace("/setup");
    } else if (setupStatus === "done" && inSetup) {
      router.replace("/");
    }
  }, [setupStatus, segments]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <KeyboardProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: headerBackground,
                },
                headerTitle: () => {
                  return <Text style={{ color: "white", fontSize: 20 }}>Simple Scale</Text>;
                },
                headerRight: () => {
                  return (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <AddWeight />
                      <OptionsMenu />
                    </View>
                  );
                },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="setup" options={{ headerShown: false }} />
            </Stack>
            <OptionWindow />
          </KeyboardProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
