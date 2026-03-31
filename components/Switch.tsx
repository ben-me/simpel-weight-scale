import { Pressable, StyleSheet, View } from "react-native";
import { useThemeColors } from "@/hooks/useTheme";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import ThemedText from "./ThemedText";
import { useEffect } from "react";

type Props = {
  optionLeft: { label: string; value: string };
  optionRight: { label: string; value: string };
  onSelect: (arg: any) => void;
  selected: string;
};

export default function Switch({ optionLeft, optionRight, onSelect, selected }: Props) {
  const { backgroundLight, tertiary, primary, secondary } = useThemeColors();
  const translate = useSharedValue(0);
  const highlightWidth = useSharedValue(0);
  const rightOptionSelected = selected === optionRight.value;

  useEffect(() => {
    translate.set(withSpring(rightOptionSelected ? highlightWidth.get() : 0, { duration: 250 }));
  }, [rightOptionSelected, translate, highlightWidth]);

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
          onSelect(optionLeft.value);
          translate.set(0);
        }}
        style={styles.option}
      >
        <ThemedText style={!rightOptionSelected && { color: "white" }}>
          {optionLeft.label}
        </ThemedText>
      </Pressable>
      <Pressable
        onPress={() => {
          onSelect(optionRight.value);
          translate.set(highlightWidth.get());
        }}
        style={styles.option}
      >
        <ThemedText style={rightOptionSelected && { color: "white" }}>
          {optionRight.label}
        </ThemedText>
      </Pressable>
      <Animated.View
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          highlightWidth.set(width);
          translate.set(rightOptionSelected ? width : 0);
        }}
        style={[
          translateX,
          {
            width: "50%",
            backgroundColor: primary,
            position: "absolute",
            inset: 0,
            borderRadius: 5,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    paddingBlock: 16,
    paddingInline: 24,
    zIndex: 1,
    alignItems: "center",
  },
});
