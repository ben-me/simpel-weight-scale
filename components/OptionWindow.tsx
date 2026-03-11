import { BackHandler, FlatList, Pressable, Text } from "react-native";
import Animated, { Keyframe } from "react-native-reanimated";
import ThemedText from "./ThemedText";
import { useMenuStore } from "@/store/menu";
import { useEffect } from "react";

export default function OptionWindow() {
  const { menuShown, closeMenu } = useMenuStore();

  useEffect(() => {
    if (menuShown) {
      const backhandler = BackHandler.addEventListener("hardwareBackPress", () => {
        closeMenu();
        return true;
      });

      return () => backhandler.remove();
    }
  }, [menuShown]);

  if (menuShown) {
    return (
      <Pressable
        style={{
          position: "absolute",
          inset: 0,
        }}
        onPress={closeMenu}
      >
        <Animated.View
          entering={customFadeIn.duration(100)}
          exiting={customFadeOut.duration(100)}
          style={{
            transformOrigin: "top right",
            position: "absolute",
            top: 80,
            right: 24,
            backgroundColor: "grey",
            zIndex: 2,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 5,
            gap: 24,
          }}
        >
          <ThemedText style={{ fontSize: 17 }}>Importieren</ThemedText>
          <ThemedText style={{ fontSize: 17 }}>Exportieren</ThemedText>
        </Animated.View>
      </Pressable>
    );
  }
}

const customFadeIn = new Keyframe({
  0: {
    transform: [{ scaleY: 0 }, { scaleX: 0 }],
    opacity: 0,
  },
  100: {
    transform: [{ scaleY: 1 }, { scaleX: 1 }],
    opacity: 1,
  },
});

const customFadeOut = new Keyframe({
  0: {
    transform: [{ scaleY: 1 }, { scaleX: 1 }],
    opacity: 1,
  },
  100: {
    transform: [{ scaleY: 0 }, { scaleX: 0 }],
    opacity: 0,
  },
});
