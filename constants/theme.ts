/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#11181C",
    backgroundColor: "#f3f4f5",
    backgroundLight: "#fff",
    headerBackground: "#2E2E2E",
    borderColor: "#EEEEEE",
    green: "#00E676",
    gray: "#E9E9E9",
    primary: "#285A48",
    secondary: "#408A71",
    tertiary: "#B0E4CC",
  },
  dark: {
    text: "#fff",
    backgroundColor: "#091413",
    backgroundLight: "#2E2E2E",
    headerBackground: "#1b1b1d",
    borderColor: "#747474",
    green: "#00E676",
    gray: "#222",
    primary: "#285A48",
    secondary: "#408A71",
    tertiary: "#B0E4CC",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
