import { StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";
import { useThemeColors } from "@/hooks/useTheme";

type Props = {
  currentWeight: number | undefined;
};

export function MainDisplay({ currentWeight }: Props) {
  const { text } = useThemeColors();
  return (
    <View style={{ alignSelf: "center" }}>
      <AnimatedRollingNumber
        value={currentWeight ? currentWeight : 0}
        textStyle={[styles.weight, { color: text }]}
      />
      <ThemedText style={styles.subtitle}>Aktueller Durchschnitt</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  weight: {
    fontSize: 90,
    lineHeight: 91,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.8,
  },
});
