import { StyleSheet, TextInput, TextInputProps, useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

export default function ThemedInput({ style, ...rest }: TextInputProps) {
  const colorScheme = useColorScheme();
  const { text } = Colors[colorScheme ?? "light"];

  return (
    <TextInput {...rest} style={[{ color: text, borderColor: text }, styles.default, style]} />
  );
}

const styles = StyleSheet.create({
  default: {
    borderBottomWidth: 1,
    width: 160,
    textAlign: "center",
    paddingVertical: 0,
  },
});
