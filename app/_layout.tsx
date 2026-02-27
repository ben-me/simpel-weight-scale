import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { backgroundColor, text } = Colors[colorScheme as "light" | "dark"];
  const today = new Date().toLocaleDateString();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor,
        },
        headerTitle: today,
        headerTitleStyle: {
          color: text,
        },
      }}
    />
  );
}
