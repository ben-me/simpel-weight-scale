import { StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";
import { useThemeColors } from "@/hooks/useTheme";
import { Circle, Svg } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { AnchorDay, getAnchorDayNumber } from "@/constants/anchor_days";
import { toAppDayIndex } from "@/utilities/convert_days";
import normalizeWeight from "@/utilities/normalize_weight";
import { useUnitStore } from "@/store/useUnitStore";

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
  shouldShow: boolean;
  day?: { day: number; logged: boolean };
};

function TrackingProgressSlice({ index, day, shouldShow }: TrackingSliceProps) {
  const { green, red } = useThemeColors();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!shouldShow) {
      const reverseDelay = (SEGMENTS - 1 - index) * 250;
      progress.set(
        withDelay(reverseDelay, withTiming(0, { duration: 250, easing: Easing.out(Easing.cubic) })),
      );
      return;
    }
    progress.set(
      withDelay(index * 250, withTiming(1, { duration: 250, easing: Easing.out(Easing.cubic) })),
    );
  }, [index, progress, shouldShow]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: DASH * (1 - progress.get()),
  }));

  const rotation = ROTATION_OFFSET + DEGREES_PER_SEGMENT * index;

  return (
    <AnimatedCircle
      r={RADIUS}
      cx={CENTER}
      cy={CENTER}
      fill="none"
      stroke={day?.logged ? green : red}
      strokeWidth={STROKE}
      strokeDasharray={`${DASH} ${CIRCUMFERENCE}`}
      animatedProps={animatedProps}
      transform={`rotate(${rotation} ${CENTER} ${CENTER})`}
    />
  );
}

type Props = {
  currentWeight: number | undefined;
  daysLogged?: { day: number; logged: boolean }[];
  anchorDay: AnchorDay;
};

export function MainDisplay({ currentWeight, daysLogged, anchorDay }: Props) {
  const { t } = useTranslation();
  const { text, gray } = useThemeColors();
  const { unit } = useUnitStore();
  const anchorIndex = getAnchorDayNumber(anchorDay);
  const orderedWeek = Array.from({ length: 7 }, (_, i) => (anchorIndex + 1 + i) % 7);
  const todayIndex = toAppDayIndex(new Date().getDay());
  const todayPosition = orderedWeek.indexOf(todayIndex);

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        minHeight: SIZE,
        position: "relative",
        marginBlockStart: 16,
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
        {orderedWeek.map((dayIndex, position) => (
          <TrackingProgressSlice
            key={position}
            index={position}
            shouldShow={position <= todayPosition}
            day={daysLogged?.find((d) => d.day === dayIndex)}
          />
        ))}
      </Svg>
      {currentWeight ? (
        <AnimatedRollingNumber
          value={normalizeWeight(currentWeight, unit)}
          textStyle={[styles.weight, { color: text }]}
        />
      ) : (
        <ThemedText style={styles.weight}>-</ThemedText>
      )}
      <ThemedText style={styles.subtitle}>{t("currentAverage")}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  weight: {
    fontSize: 75,
    lineHeight: 80,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.8,
  },
});
