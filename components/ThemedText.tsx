import { Text, TextProps, useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

export default function ThemedText({ children, style, ...rest }: TextProps) {
  const colorScheme = useColorScheme();
  const { text } = Colors[colorScheme ?? "light"];

  return (
    <Text style={[style, { color: text }]} {...rest}>
      {children}
    </Text>
  );
}
