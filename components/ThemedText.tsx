import { StyleSheet, Text, TextProps, useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

export default function ThemedText({ children, style, ...rest }: TextProps) {
  const colorScheme = useColorScheme();
  const { text } = Colors[colorScheme ?? "light"];

  return (
    <Text style={[{ color: text }, styles.default, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
});
