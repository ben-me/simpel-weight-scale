import { Colors } from "@/constants/theme";
import { useColorScheme } from "react-native";

export function useThemeColors() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme ?? "light"];
}
