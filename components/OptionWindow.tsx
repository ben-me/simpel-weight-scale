import { FlatList, Pressable } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import ThemedText from "./ThemedText";
import { useMenuStore } from "@/store/menu";

export default function OptionWindow() {
  const { menuShown, closeMenu } = useMenuStore();

  if (menuShown) {
    return (
      <Animated.View
        entering={FadeInUp}
        exiting={FadeOutUp}
        style={{ position: "absolute", top: "9%", right: 24 }}
      >
        <FlatList
          data={["Import", "Export", "Einheit ändern"]}
          renderItem={({ item }) => (
            <Pressable onPress={closeMenu}>
              <ThemedText style={{ fontSize: 16 }}>{item}</ThemedText>
            </Pressable>
          )}
          style={{ backgroundColor: "grey", padding: 12, borderRadius: 5 }}
          contentContainerStyle={{ gap: 24 }}
        />
      </Animated.View>
    );
  }
}
