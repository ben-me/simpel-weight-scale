import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import ThemedText from "./ThemedText";

type Props = {
  highlightedText: string | number;
  subtitleText: string;
  onPress?: () => void;
  style: StyleProp<ViewStyle>;
};

export default function OverviewField({ highlightedText, subtitleText, onPress, style }: Props) {
  return (
    <Pressable style={style} onPress={onPress}>
      <ThemedText style={styles.highlight}>{highlightedText}</ThemedText>
      <ThemedText style={styles.subtitle}>{subtitleText}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  highlight: {
    fontSize: 25,
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 13,
  },
});
