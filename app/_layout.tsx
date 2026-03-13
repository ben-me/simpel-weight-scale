import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, Text } from "react-native";

import { Colors } from "@/constants/theme";
import OptionsMenu from "@/components/OptionsMenu";
import OptionWindow from "@/components/OptionWindow";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { headerBackground } = Colors[colorScheme as "light" | "dark"];
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
              headerRight: () => <OptionsMenu />,
            }}
          />
          <OptionWindow />
        </KeyboardProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
