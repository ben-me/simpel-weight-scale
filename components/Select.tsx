import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";

import { Colors } from "@/constants/theme";

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

export default function Select({ value, onChange, options, placeholder }: Props) {
  const colorScheme = useColorScheme();
  const { text } = Colors[colorScheme ?? "light"];
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const selected = options.find((option) => option.value === value);

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }

  function handleCloseModal() {
    bottomSheetModalRef.current?.close();
  }

  function renderBackdrop(props: BottomSheetBackdropProps) {
    return (
      <BottomSheetBackdrop
        pressBehavior="close"
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    );
  }

  return (
    <View>
      <Pressable onPress={handlePresentModal}>
        <ThemedInput
          style={styles.input}
          value={selected?.label ?? ""}
          placeholder={placeholder}
          editable={false}
          rightIcon={<ThemedText style={{ fontSize: 20 }}>▼</ThemedText>}
        />
      </Pressable>
      <BottomSheetModal
        animationConfigs={{ duration: 350 }}
        handleIndicatorStyle={{ backgroundColor: text }}
        backgroundStyle={{ backgroundColor: "black" }}
        backdropComponent={renderBackdrop}
        ref={bottomSheetModalRef}
      >
        <BottomSheetView style={[styles.modalContent]}>
          <BottomSheetFlatList
            data={options}
            keyExtractor={(item: SelectOption) => item.label}
            renderItem={({ item }: { item: SelectOption }) => (
              <Pressable
                style={{ flex: 1 }}
                onPress={() => {
                  onChange(item.value);
                  handleCloseModal();
                }}
              >
                <ThemedText style={styles.option}>{item.label}</ThemedText>
              </Pressable>
            )}
          />
        </BottomSheetView>
      </BottomSheetModal>
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
  modalContent: {
    backgroundColor: "black",
  },
  option: {
    fontSize: 24,
    textAlign: "center",
    width: "100%",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "silver",
  },
});
