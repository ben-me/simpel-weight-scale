import { StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";
import { useThemeColors } from "@/hooks/useTheme";
import { Circle, Svg } from "react-native-svg";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedProps,
  SharedValue,
} from "react-native-reanimated";
import { useEffect } from "react";

type Props = {
  currentWeight: number | undefined;
  daysLogged: number;
  daysTotal: number;
};

const SIZE = 320;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2 - 6;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SEGMENTS = 7;
const SEGMENT_LENGTH = CIRCUMFERENCE / SEGMENTS;
const DASH_RATIO = 0.75;
const DASH = SEGMENT_LENGTH * DASH_RATIO;
const GAP = SEGMENT_LENGTH * (1 - DASH_RATIO);
const ROTATION_OFFSET = 110;
const DEGREES_PER_SEGMENT = 360 / SEGMENTS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type TrackingSliceProps = {
  index: number;
  progress: SharedValue<number>;
};

function TrackingProgressSlice({ index, progress }: TrackingSliceProps) {
  const { green } = useThemeColors();
  const animatedProps = useAnimatedProps(() => {
    const fill = Math.min(1, Math.max(0, progress.get() - index));
    return {
      strokeDashoffset: DASH * (1 - fill),
    };
  });

  const rotation = ROTATION_OFFSET + DEGREES_PER_SEGMENT * index;

  return (
    <AnimatedCircle
      r={RADIUS}
      cx={CENTER}
      cy={CENTER}
      fill="none"
      stroke={green}
      strokeWidth={STROKE}
      strokeDasharray={`${DASH} ${CIRCUMFERENCE}`}
      animatedProps={animatedProps}
      transform={`rotate(${rotation} ${CENTER} ${CENTER})`}
    />
  );
}

export function MainDisplay({ currentWeight, daysLogged = 0 }: Props) {
  const { text, gray } = useThemeColors();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(() =>
      withTiming(daysLogged, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [daysLogged, progress]);

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        minHeight: SIZE,
        position: "relative",
      }}
    >
      <Svg
        viewBox={` 0 0 ${SIZE} ${SIZE}`}
        style={{ position: "absolute", inset: 0, justifyContent: "center", alignItems: "center" }}
      >
        <Circle
          r={RADIUS}
          cx={CENTER}
          cy={CENTER}
          fill="none"
          stroke={gray}
          strokeWidth="10"
          strokeDasharray={`${DASH} ${GAP}`}
          transform={`rotate(${ROTATION_OFFSET} ${CENTER} ${CENTER})`}
        />
      </Svg>
      <Svg
        viewBox={` 0 0 ${SIZE} ${SIZE}`}
        style={{
          position: "absolute",
          inset: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {Array.from({ length: SEGMENTS }).map((_, i) => {
          return <TrackingProgressSlice key={i} index={i} progress={progress} />;
        })}
      </Svg>
      {currentWeight ? (
        <AnimatedRollingNumber value={currentWeight} textStyle={[styles.weight, { color: text }]} />
      ) : (
        <ThemedText style={styles.weight}>-</ThemedText>
      )}
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
