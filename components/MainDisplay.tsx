import { StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";

type Props = {
  currentWeight: number | undefined;
};

export function MainDisplay({ currentWeight }: Props) {
  return (
    <View style={{ alignSelf: "center" }}>
      <ThemedText style={styles.weight}>{currentWeight}</ThemedText>
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
