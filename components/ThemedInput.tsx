import { useThemeColors } from "@/hooks/useTheme";
import { ReactNode, Ref } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

type Props = {
  rightIcon?: ReactNode;
  ref?: Ref<TextInput>;
} & TextInputProps;

export default function ThemedInput({ rightIcon, ref, style, ...rest }: Props) {
  const { text } = useThemeColors();

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
