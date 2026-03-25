import { useEffect, useRef, useState } from "react";
import { StyleSheet, Pressable, Modal, View, TextInput, Keyboard } from "react-native";

import { insertWeight } from "@/db/operations";
import { WeightTableEntry } from "@/db/schema";
import convertWeight from "@/utilities/convert-weight";

import ThemedInput from "./ThemedInput";
import ThemedText from "./ThemedText";
import { prettifyDate } from "@/utilities/prettify_date";
import Animated, { FadeOut, useAnimatedStyle } from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { useThemeColors } from "@/hooks/useTheme";
import { toAppDayIndex } from "@/utilities/convert_days";
import { AnchorDay, getAnchorDayNumber } from "@/constants/anchor_days";

export function WeightListItem({
  date = new Date().getDate().toLocaleString(),
  weight,
  unit = "KG",
  anchorDay = "Montag",
}: WeightTableEntry & { anchorDay: AnchorDay }) {
  const { backgroundLight, borderColor } = useThemeColors();
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState(String(weight));
  const inputRef = useRef<TextInput>(null);
  const { height } = useReanimatedKeyboardAnimation();
  const prettyDate = prettifyDate(date);
  const [year, month, day] = date.split("-");
  const isAnchorEntry =
    toAppDayIndex(new Date(+year, +month - 1, +day).getDay()) === getAnchorDayNumber(anchorDay);

  useEffect(() => {
    if (!modalVisible) {
      return;
    }

    const keyboardListener = Keyboard.addListener("keyboardDidHide", () => {
      setTimeout(() => setModalVisible(false), 240);
    });
    setInputValue(String(weight));
    const keyboardFocus = setTimeout(() => inputRef.current?.focus(), 100);

    return () => {
      clearTimeout(keyboardFocus);
      keyboardListener.remove();
    };
  }, [modalVisible, weight]);

  async function handleInputChange() {
    const convertedWeight = convertWeight(inputValue);
    if (!convertWeight) return;
    await insertWeight({ date, weight: convertedWeight, unit });
    setModalVisible(false);
  }

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: height.get() / 3 }],
  }));

  return (
    <View>
      <Modal
        visible={modalVisible}
        backdropColor="transparent"
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
        allowSwipeDismissal={true}
      >
        <Animated.View exiting={FadeOut.duration(150)} style={[translateY, { flex: 1 }]}>
          <Pressable style={styles.modal} onPress={() => setModalVisible(false)}>
            <Pressable style={[styles.modal_view, { backgroundColor: backgroundLight }]}>
              <ThemedText style={styles.modal_headline}>{prettyDate}</ThemedText>
              <View style={styles.modal_input_wrapper}>
                <ThemedInput
                  ref={inputRef}
                  onSubmitEditing={handleInputChange}
                  keyboardType="number-pad"
                  style={styles.modal_input}
                  value={inputValue}
                  maxLength={6}
                  onChangeText={setInputValue}
                />
                <ThemedText style={styles.modal_input}>{unit}</ThemedText>
              </View>
              <ThemedText style={styles.modal_subheadline}>Gewicht anpassen</ThemedText>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Modal>
      <Pressable
        style={[styles.entry, isAnchorEntry && styles.highlight, { borderColor }]}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText>{prettyDate}:</ThemedText>
        <ThemedText style={{ marginInlineStart: "auto" }}>{weight ? weight : "-"}</ThemedText>
        <ThemedText>{unit}</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    gap: 6,
  },
  highlight: {
    backgroundColor: "hsla(185 100% 90% / 0.4)",
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal_view: {
    padding: 24,
    alignItems: "center",
    borderRadius: 6,
    gap: 24,
  },
  modal_headline: {
    fontSize: 20,
  },
  modal_input_wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modal_input: {
    fontSize: 52,
    height: 50,
    lineHeight: 55,
    paddingVertical: 0,
  },
  modal_subheadline: {
    opacity: 0.7,
  },
});
