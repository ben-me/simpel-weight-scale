import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { BackHandler, Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

import ThemedInput from "./ThemedInput";
import ThemedText from "./ThemedText";
import { useThemeColors } from "@/hooks/useTheme";
type SelectOption = {
  label: string;
  value: number;
};

type Props = {
  options: SelectOption[];
  value: number;
  placeholder?: string;
  onChange: (value: number) => void;
  style: StyleProp<ViewStyle>;
};

export default function Select({ value, onChange, options, placeholder, style }: Props) {
  const { text, backgroundLight } = useThemeColors();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const selected = options.find((option) => option.value === value);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);

  useEffect(() => {
    if (bottomSheetIndex === -1) return;
    const listener = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => listener.remove();
  }, [bottomSheetIndex]);

  const onBackPress = () => {
    if (bottomSheetModalRef) {
      bottomSheetModalRef.current?.close();
      return true;
    }
  };

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
    <>
      <Pressable onPress={handlePresentModal} style={[style, { backgroundColor: backgroundLight }]}>
        <ThemedInput
          style={[styles.input]}
          value={selected?.label ?? ""}
          placeholder={placeholder}
          editable={false}
        />
        <ThemedText style={styles.subtitle}>Stichtag</ThemedText>
      </Pressable>
      <BottomSheetModal
        animationConfigs={{ duration: 350 }}
        handleIndicatorStyle={{ backgroundColor: text }}
        backgroundStyle={{ backgroundColor: backgroundLight }}
        backdropComponent={renderBackdrop}
        ref={bottomSheetModalRef}
        onChange={(index) => {
          setBottomSheetIndex(index);
        }}
      >
        <BottomSheetView style={{ backgroundColor: backgroundLight }}>
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
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 0,
    padding: 0,
    textAlign: "left",
    fontSize: 22,
    width: "auto",
  },
  modalContent: {
    backgroundColor: "black",
  },
  option: {
    fontSize: 24,
    lineHeight: 25,
    textAlign: "center",
    width: "100%",
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: "silver",
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 14,
  },
});
