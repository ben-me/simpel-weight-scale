import { Pressable, StyleSheet, useColorScheme } from "react-native";

import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Colors } from "@/constants/theme";
import IconOptions from "./icons/IconOptions";
import { useMenuStore } from "@/store/menu";

export default function OptionsMenu() {
  const colorScheme = useColorScheme();
  const { headerBackground } = Colors[colorScheme ?? "light"];
  const backgroundColor = useSharedValue<string>(headerBackground);
  const { openMenu } = useMenuStore();

  const animatedBackground = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.get(),
    };
  });

  return (
    <Animated.View style={[styles.wrapper, animatedBackground]}>
      <Pressable
        onPress={openMenu}
        style={{ padding: 4 }}
        aria-label="Open Menu"
        onPressIn={() => backgroundColor.set(() => withTiming("grey", { duration: 150 }))}
        onPressOut={() =>
          backgroundColor.set(() => withTiming(headerBackground, { duration: 150 }))
        }
      >
        <IconOptions />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    transform: [{ translateX: 8 }],
    borderRadius: 24,
    overflow: "visible",
  },
});
