import { useEffect } from "react";
import { ViewProps } from "react-native";
import Animated, {
  AnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

type Props = {
  index: number;
} & AnimatedProps<ViewProps>;

export default function StaggeredView({ children, index, style }: Props) {
  const anim = useSharedValue(0);

  useEffect(() => {
    const reveal = () => {
      anim.set(withDelay(index * 1200, withTiming(1, { duration: 600 })));
    };
    reveal();
  }, [anim, index]);

  const startingStyle = useAnimatedStyle(() => ({
    opacity: anim.get(),
    transform: [{ translateY: (1 - anim.get()) * 25 }],
  }));

  return <Animated.View style={[startingStyle, style]}>{children}</Animated.View>;
}
