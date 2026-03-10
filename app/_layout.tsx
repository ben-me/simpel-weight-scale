import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, Text } from "react-native";

import { Colors } from "@/constants/theme";
import OptionsMenu from "@/components/OptionsMenu";
import OptionWindow from "@/components/OptionWindow";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { headerBackground } = Colors[colorScheme as "light" | "dark"];
  return (
    <>
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
    </>
  );
}
