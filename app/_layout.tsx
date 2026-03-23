import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

import OptionsMenu from "@/components/OptionsMenu";
import OptionWindow from "@/components/OptionWindow";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useThemeColors } from "@/hooks/useTheme";
import AddWeight from "@/components/AddWeight";

export default function RootLayout() {
  const { headerBackground } = useThemeColors();
  return (
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
                  <View style={{ gap: 12, flexDirection: "row", alignItems: "center" }}>
                    <AddWeight />
                    <OptionsMenu />
                  </View>
                );
              },
            }}
          />
          <OptionWindow />
        </KeyboardProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
