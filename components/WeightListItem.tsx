import { useState } from "react";
import { StyleSheet, Pressable, Modal, View, KeyboardAvoidingView, Platform } from "react-native";

import { insertWeight } from "@/db/operations";
import { WeightTableEntry } from "@/db/schema";
import convertWeight from "@/utilities/convert-weight";

import ThemedInput from "./ThemedInput";
import ThemedText from "./ThemedText";

export function WeightListItem({
  date = new Date().getDate().toLocaleString(),
  weight,
  unit = 0,
}: WeightTableEntry) {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState(String(weight));
  const [year, month, day] = date.split("-");
  const formatted_display_date = new Date(+year, +month - 1, +day).toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  async function handleInputChange() {
    const convertedWeight = convertWeight(inputValue);
    if (!convertWeight) return;
    await insertWeight({ date, weight: convertedWeight, unit });
    setModalVisible(false);
  }

  return (
    <View>
      <Modal
        visible={modalVisible}
        backdropColor="transparent"
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
        allowSwipeDismissal={true}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable style={styles.modal} onPress={() => setModalVisible(false)}>
            <Pressable style={styles.modal_view}>
              <ThemedText style={styles.modal_subheadline}>Gewicht anpassen</ThemedText>
              <View style={styles.modal_input_wrapper}>
                <ThemedInput
                  onBlur={handleInputChange}
                  keyboardType="number-pad"
                  style={styles.modal_input}
                  value={inputValue}
                  maxLength={6}
                  onChangeText={setInputValue}
                />
                <ThemedText style={styles.modal_input}>{unit}</ThemedText>
              </View>
              <ThemedText style={styles.modal_headline}>{date}</ThemedText>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
      <Pressable style={styles.entry} onPress={() => setModalVisible(true)}>
        <ThemedText>{formatted_display_date}:</ThemedText>
        <ThemedText style={{ marginInlineStart: "auto" }}>{weight ? weight : "-"}</ThemedText>
        <ThemedText>{unit === 0 ? "Kg" : "lbs"}</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 2,
    borderColor: "gray",
    gap: 6,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal_view: {
    backgroundColor: "gray",
    padding: 24,
    alignItems: "center",
    borderRadius: 6,
    gap: 24,
  },
  modal_headline: {
    fontSize: 20,
  },
  modal_input_wrapper: {
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
