import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function IconOptions() {
  const [optionsVisible, changeOptionsVisible] = React.useState(false);
  return (
    <Pressable
      onPress={() => changeOptionsVisible((prev) => !prev)}
      aria-label="Open Menu"
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "rgb(210, 230, 255)" : "#f000",
        },
        styles.wrapper,
      ]}
    >
      <Svg width="24px" height="24px" viewBox="0 0 24 24">
        <Path
          fill="white"
          d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0-6c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0 12c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"
        />
      </Svg>
      {/* TODO: Options pop up  */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 6,
    position: "relative",
    transitionDuration: "0.2s",
    transitionProperty: "backgroundColor",
    transitionTimingFunction: "ease-in",
  },
  popup: {
    position: "absolute",
  },
});
