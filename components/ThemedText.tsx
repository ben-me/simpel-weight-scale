import { StyleSheet, Text, TextProps } from "react-native";
import { useThemeColors } from "@/hooks/useTheme";

export default function ThemedText({ children, style, ...rest }: TextProps) {
  const { text } = useThemeColors();

  return (
    <Text style={[{ color: text }, styles.default, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 17,
  },
});
