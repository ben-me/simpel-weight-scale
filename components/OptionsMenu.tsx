import React from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { readString } from "react-native-csv";

import { WeightTableEntry } from "@/db/schema";
import { importCSV } from "@/utilities/import_csv";
import { insertMultipleWeights } from "@/db/operations";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Colors } from "@/constants/theme";
import IconOptions from "./icons/IconOptions";

export default function OptionsMenu() {
  const colorScheme = useColorScheme();
  const { headerBackground } = Colors[colorScheme ?? "light"];
  const backgroundColor = useSharedValue<string>(headerBackground);
  const [optionsVisible, changeOptionsVisible] = React.useState(false);

  const animatedBackground = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.get(),
    };
  });

  async function handleClick() {
    changeOptionsVisible(true);
    // const file = await importCSV();
    // if (file) {
    //   const fileContentAsString = file.textSync();
    //   const json = readString(fileContentAsString);
    //   if (json.errors.length === 0) {
    //     const corrected_data = json.data.map(([date, weight]) => ({
    //       date,
    //       weight,
    //       unit: "kg",
    //     }));
    //     // await clearWeightTable();
    //     await insertMultipleWeights(corrected_data as WeightTableEntry[]);
    //   }
    // }
  }

  return (
    <Animated.View style={[styles.wrapper, animatedBackground]}>
      <Pressable
        onPress={handleClick}
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
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateX: 8 }],
    borderRadius: 24,
  },
  popup: {
    position: "absolute",
  },
});
