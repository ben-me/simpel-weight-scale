import { Pressable, StyleSheet, View } from "react-native";
import { useThemeColors } from "@/hooks/useTheme";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import ThemedText from "./ThemedText";

type Props = {
  optionLeft: string;
  optionRight: string;
  onSelect: (arg: any) => void;
  selected: string;
};

export default function Switch({ optionLeft, optionRight, onSelect, selected }: Props) {
  const { backgroundLight, borderColor } = useThemeColors();
  const translate = useSharedValue(0);
  const highlightWidth = useSharedValue(0);
  console.log(optionRight, selected);

  const translateX = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(translate.get(), { duration: 250 }) }],
    };
  });

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: backgroundLight,
        borderRadius: 5,
        overflow: "hidden",
      }}
    >
      <Pressable
        onPress={() => {
          onSelect(optionLeft);
          translate.set(0);
        }}
        style={styles.option}
      >
        <ThemedText>{optionLeft}</ThemedText>
      </Pressable>
      <Pressable
        onPress={() => {
          onSelect(optionRight);
          translate.set(highlightWidth.get());
        }}
        style={styles.option}
      >
        <ThemedText>{optionRight}</ThemedText>
      </Pressable>
      <Animated.View
        onLayout={(event) => {
          highlightWidth.set(event.nativeEvent.layout.width);
        }}
        style={[
          translateX,
          {
            width: "50%",
            backgroundColor: borderColor,
            position: "absolute",
            inset: 0,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    paddingBlock: 12,
    paddingInline: 20,
    zIndex: 1,
  },
});
