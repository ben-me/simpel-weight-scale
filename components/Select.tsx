import { useState } from "react";
import { Modal, Pressable, StyleSheet, View, FlatList } from "react-native";

import ThemedInput from "./ThemedInput";
import ThemedText from "./ThemedText";
type SelectOption = {
  label: string;
  value: number;
};

type Props = {
  label?: string;
  options: SelectOption[];
  value: number;
  placeholder?: string;
  onChange: (value: number) => void;
};

export default function Select({ value, label, onChange, options, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View>
      <Pressable onPress={() => setOpen(true)}>
        <ThemedInput
          style={styles.input}
          value={selected?.label ?? ""}
          placeholder={placeholder}
          editable={false}
          rightIcon={<ThemedText style={{ fontSize: 20 }}>▼</ThemedText>}
        />
      </Pressable>

      <Modal visible={open} onRequestClose={() => setOpen(false)} transparent animationType="slide">
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <View style={[styles.modalContent]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <ThemedText style={{ fontSize: 24, textAlign: "center" }}>
                    {item.label}
                  </ThemedText>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 0,
    padding: 0,
    textAlign: "left",
    fontSize: 24,
    width: "auto",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000088",
  },
  modalContent: {
    paddingBlock: 24,
    backgroundColor: "gray",
    maxHeight: "50%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  option: {
    paddingVertical: 12,
  },
});
