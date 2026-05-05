import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { BackHandler, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import ThemedInput from "./ThemedInput";
import ThemedText from "./ThemedText";
import { useThemeColors } from "@/hooks/useTheme";
import { AnchorDay } from "@/constants/anchor_days";
import { useTranslation } from "react-i18next";
import Entypo from "@expo/vector-icons/Entypo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type SelectOption = {
  label: string;
  value: string | AnchorDay;
};

type Props = {
  options: SelectOption[];
  value: SelectOption["value"];
  placeholder?: string;
  onChange: (value: AnchorDay) => void;
  style: StyleProp<ViewStyle>;
};

export default function Select({ value, onChange, options, placeholder, style }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
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
          value={selected?.label ?? "-"}
          placeholder={placeholder}
          editable={false}
          rightIcon={<Entypo name="chevron-down" size={28} color={text} />}
        />
        <ThemedText style={styles.subtitle}>{t("anchorDay")}</ThemedText>
      </Pressable>
      <BottomSheetModal
        animationConfigs={{ duration: 350 }}
        handleIndicatorStyle={{ backgroundColor: text }}
        backgroundStyle={{ backgroundColor: backgroundLight }}
        backdropComponent={renderBackdrop}
        ref={bottomSheetModalRef}
        bottomInset={insets.bottom}
        onChange={(index) => {
          setBottomSheetIndex(index);
        }}
      >
        <BottomSheetView style={{ backgroundColor: backgroundLight }}>
          <BottomSheetFlatList
            data={options}
            keyExtractor={(item: SelectOption) => item.label}
            renderItem={({ item, index }: { item: SelectOption; index: number }) => (
              <Pressable
                style={{ flex: 1 }}
                onPress={() => {
                  onChange(item.value as AnchorDay);
                  handleCloseModal();
                }}
              >
                <ThemedText style={styles.option}>{item.label}</ThemedText>
                {index !== options.length - 1 && <View style={styles.seperator} />}
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
    textAlign: "center",
    width: "100%",
    paddingVertical: 24,
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 14,
  },
  seperator: {
    width: 30,
    height: 0,
    borderBottomWidth: 1,
    borderBottomColor: "silver",
    alignSelf: "center",
  },
});
