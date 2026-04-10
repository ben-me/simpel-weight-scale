import { Pressable, PressableProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function Button({ children, ...rest }: PressableProps) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  function animate() {
    scale.set(withSequence(withTiming(0.9, { duration: 120 }), withSpring(1)));
  }

  return (
    <Animated.View style={style}>
      <Pressable {...rest} onPressIn={animate}>
        {children}
      </Pressable>
    </Animated.View>
  );
}
