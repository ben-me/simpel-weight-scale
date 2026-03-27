import { Pressable, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useMenuStore } from "@/store/menu";
import { useThemeColors } from "@/hooks/useTheme";
import { Entypo } from "@expo/vector-icons";

export default function OptionsMenu() {
  const { headerBackground } = useThemeColors();
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
        <Entypo name="dots-three-vertical" size={24} color="white" />
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
