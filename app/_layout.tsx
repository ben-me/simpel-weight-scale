import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, Text } from "react-native";

import IconOptions from "@/components/icons/IconOptions";
import { Colors } from "@/constants/theme";

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
          headerRight: () => <IconOptions />,
        }}
      />
    </>
  );
}
