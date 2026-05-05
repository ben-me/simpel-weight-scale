import { SplashScreen, Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import OptionsMenu from "@/components/OptionsMenu";
import OptionWindow from "@/components/OptionWindow";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useThemeColors } from "@/hooks/useTheme";
import AddWeight from "@/components/AddWeight";
import Entypo from "@expo/vector-icons/Entypo";

import "../i18n";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useSetupStore } from "@/store/useSetupStore";
import { db } from "@/db";
import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import ThemedText from "@/components/ThemedText";
import Button from "@/components/Button";
import { useTranslation } from "react-i18next";
import { useDataStore } from "@/store/useDataStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { t } = useTranslation();
  const { success, error } = useMigrations(db, migrations);
  const { setupStatus, checkSetup } = useSetupStore();
  const { headerBackground } = useThemeColors();
  const { init, initialized } = useDataStore();
  const router = useRouter();

  useEffect(() => {
    if (!success) return;
    async function setup() {
      const setup = await checkSetup();
      if (setup !== "done") {
        SplashScreen.hideAsync();
        return;
      }
      if (!initialized) {
        await init();
      }
      SplashScreen.hideAsync();
    }
    setup();
  }, [success, checkSetup, setupStatus, init, initialized]);

  if (!success) return;
  if (error) console.log(error);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <KeyboardProvider>
            <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1 }}>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: headerBackground,
                  },
                }}
              >
                <Stack.Protected guard={setupStatus !== "done"}>
                  <Stack.Screen
                    name="setup"
                    options={{ headerShown: false, animation: "slide_from_left" }}
                  />
                </Stack.Protected>
                <Stack.Protected guard={setupStatus === "done"}>
                  <Stack.Screen
                    name="index"
                    options={{
                      headerTitle: () => {
                        return (
                          <ThemedText style={{ color: "white", fontSize: 20 }}>
                            Simple Scale
                          </ThemedText>
                        );
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
                  />
                </Stack.Protected>
                <Stack.Protected guard={setupStatus === "done"}>
                  <Stack.Screen
                    name="settings"
                    options={{
                      headerLeft: () => {
                        return (
                          <Button
                            style={{
                              paddingBlock: 8,
                              paddingInlineEnd: 8,
                            }}
                            onPress={() => router.dismiss()}
                          >
                            <Entypo name="chevron-thin-left" size={24} color="white" />
                          </Button>
                        );
                      },
                      headerTitle: () => {
                        return (
                          <ThemedText style={{ color: "white", fontSize: 20 }}>
                            {t("settings")}
                          </ThemedText>
                        );
                      },
                    }}
                  />
                </Stack.Protected>
                <Stack.Protected guard={setupStatus === "done"}>
                  <Stack.Screen
                    name="entryList"
                    options={{
                      headerLeft: () => {
                        return (
                          <Button
                            style={{
                              paddingBlock: 8,
                              paddingInlineEnd: 8,
                            }}
                            onPress={() => router.dismiss()}
                          >
                            <Entypo name="chevron-thin-left" size={24} color="white" />
                          </Button>
                        );
                      },
                      headerTitle: () => {
                        return (
                          <ThemedText style={{ color: "white", fontSize: 20 }}>
                            {t("loggedWeights")}
                          </ThemedText>
                        );
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
                  />
                </Stack.Protected>
              </Stack>
              <OptionWindow />
            </SafeAreaView>
          </KeyboardProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
