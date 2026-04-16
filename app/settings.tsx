import CustomModal from "@/components/CustomModal";
import ThemedText from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useTheme";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import Animated from "react-native-reanimated";
import Button from "@/components/Button";
import { useUnit } from "@/store/unit";

type ModalType = "Unit" | "Language";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { backgroundColor, backgroundLight, borderColor, primary, tertiary } = useThemeColors();
  const { unit, updateUnit } = useUnit();
  const [selectedUnit, setSelectedUnit] = useState(unit);
  const [language, setLanguage] = useState(i18n.language);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const isUnitModal = activeModal === "Unit";
  const modalHeadline = isUnitModal ? t("unit") : t("language");

  const options = isUnitModal
    ? [
        { value: "KG", label: t("kilo") },
        { value: "lbs", label: t("pound") },
      ]
    : [
        { value: "de", label: t("german") },
        { value: "en", label: t("english") },
      ];

  function handleCancel() {
    if (activeModal === "Language") {
      setLanguage(i18n.language);
    }
    if (activeModal === "Unit") {
      setSelectedUnit(unit);
    }
    setActiveModal(null);
  }

  async function handleSave(setting: "Unit" | "Language") {
    if (setting === "Language") {
      i18n.changeLanguage(language);
    } else if (setting === "Unit") {
      await updateUnit(selectedUnit);
    }
    setActiveModal(null);
  }

  return (
    <View style={[{ backgroundColor, borderColor }, styles.container]}>
      <Pressable style={styles.setting} onPress={() => setActiveModal("Language")}>
        <ThemedText style={styles.settingHeadline}>{t("language")}</ThemedText>
        <ThemedText style={styles.settingValue}>
          {language === "de" ? t("german") : t("english")}
        </ThemedText>
      </Pressable>
      <Pressable style={styles.setting} onPress={() => setActiveModal("Unit")}>
        <ThemedText style={styles.settingHeadline}>{t("unit")}</ThemedText>
        <ThemedText style={styles.settingValue}>{unit}</ThemedText>
      </Pressable>
      <CustomModal
        visible={!!activeModal}
        onBackdropPress={handleCancel}
        onRequestClose={handleCancel}
      >
        <Animated.View style={styles.modal}>
          <Pressable style={[styles.modalContent, { backgroundColor: backgroundLight }]}>
            <ThemedText style={{ fontSize: 24 }}>
              {t("settingsModal.heading", { setting: modalHeadline })}
            </ThemedText>
            <RadioGroupPrimitive.Root
              onValueChange={(value) =>
                isUnitModal ? setSelectedUnit(value as "KG" | "lbs") : setLanguage(value)
              }
              value={isUnitModal ? selectedUnit : language}
            >
              {options.map((option) => (
                <Pressable
                  onPress={() =>
                    isUnitModal
                      ? setSelectedUnit(option.value as "KG" | "lbs")
                      : setLanguage(option.value)
                  }
                  key={option.value}
                  style={styles.option}
                >
                  <RadioGroupPrimitive.Item
                    value={option.value}
                    aria-labelledby={option.label}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: borderColor,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RadioGroupPrimitive.Indicator
                      style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: tertiary }}
                    />
                  </RadioGroupPrimitive.Item>
                  <ThemedText style={styles.optionText} nativeID={option.label}>
                    {option.label}
                  </ThemedText>
                </Pressable>
              ))}
            </RadioGroupPrimitive.Root>
            <View style={styles.buttonControls}>
              <Button onPress={handleCancel} style={styles.button}>
                <ThemedText>{t("cancel")}</ThemedText>
              </Button>
              <Button
                onPress={() => handleSave(isUnitModal ? "Unit" : "Language")}
                style={[styles.button, { backgroundColor: primary }]}
              >
                <ThemedText>{t("save")}</ThemedText>
              </Button>
            </View>
          </Pressable>
        </Animated.View>
      </CustomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 1,
    paddingBlock: 8,
    borderStyle: "solid",
    gap: 16,
  },
  setting: {
    padding: 16,
    gap: 8,
  },
  settingHeadline: {
    fontSize: 18,
  },
  settingValue: {
    opacity: 0.8,
  },
  modal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    padding: 16,
    width: "75%",
    borderRadius: 5,
    gap: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 18,
  },
  buttonControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    paddingInline: 16,
    paddingBlock: 12,
    borderRadius: 5,
  },
});
