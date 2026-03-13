import { ReactNode, Ref } from "react";
import { StyleSheet, TextInput, TextInputProps, useColorScheme, View } from "react-native";

import { Colors } from "@/constants/theme";

type Props = {
  rightIcon?: ReactNode;
  ref?: Ref<TextInput | undefined>;
} & TextInputProps;

export default function ThemedInput({ rightIcon, ref, style, ...rest }: Props) {
  const colorScheme = useColorScheme();
  const { text } = Colors[colorScheme ?? "light"];

  return (
    <View style={styles.wrapper}>
      <TextInput
        ref={ref}
        {...rest}
        style={[{ color: text, borderColor: text }, styles.default, style]}
      />
      {rightIcon && <View>{rightIcon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  default: {
    borderBottomWidth: 1,
    minWidth: 50,
    textAlign: "center",
    paddingVertical: 0,
  },
});
