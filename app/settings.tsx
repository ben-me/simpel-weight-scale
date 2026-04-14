import CustomModal from "@/components/CustomModal";
import ThemedText from "@/components/ThemedText";
import { getSetting, insertSetting } from "@/db/operations";
import { useThemeColors } from "@/hooks/useTheme";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import Animated from "react-native-reanimated";
import Button from "@/components/Button";
import { useRouter } from "expo-router";

type ModalType = "Unit" | "Language";

export default function Settings() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { backgroundColor, backgroundLight, borderColor, primary, tertiary } = useThemeColors();
  const [unit, setUnit] = useState<string | undefined>();
  const [language, setLanguage] = useState<string | undefined>();
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const isUnitModal = activeModal === "Unit";
  const modalHeadline = isUnitModal ? t("unit") : t("language");

  const dbUnitRef = useRef<string | undefined>(undefined);
  const dbLanguageRef = useRef<string | undefined>(undefined);
  const options = isUnitModal
    ? [
        { value: "KG", label: t("kilo") },
        { value: "lbs", label: t("pound") },
      ]
    : [
        { value: "de", label: t("german") },
        { value: "en", label: t("english") },
      ];

  useEffect(() => {
    const fetch = async () => {
      try {
        const [unit, language] = await Promise.all([getSetting("unit"), getSetting("language")]);
        setUnit(unit?.value);
        dbUnitRef.current = unit!.value;
        setLanguage(language?.value);
        dbLanguageRef.current = language!.value;
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

  function handleCancel() {
    setActiveModal(null);
    if (activeModal === "Language") {
      setLanguage(dbLanguageRef.current);
    } else {
      setUnit(dbUnitRef.current);
    }
  }

  async function handleSave(setting: "Unit" | "Language") {
    setActiveModal(null);
    try {
      await insertSetting({ key: setting.toLowerCase(), value: isUnitModal ? unit! : language! });
      if (activeModal === "Language") {
        i18n.changeLanguage(language);
      }
    } catch (error) {
      console.error(error);
    }
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
        visible={activeModal !== null}
        onBackdropPress={handleCancel}
        onRequestClose={handleCancel}
      >
        <Animated.View style={styles.modal}>
          <Pressable style={[styles.modalContent, { backgroundColor: backgroundLight }]}>
            <ThemedText style={{ fontSize: 24 }}>
              {t("settingsModal.heading", { setting: modalHeadline })}
            </ThemedText>
            <RadioGroupPrimitive.Root
              onValueChange={(value) => (isUnitModal ? setUnit(value) : setLanguage(value))}
              value={isUnitModal ? unit : language}
            >
              {options.map((option) => (
                <Pressable
                  onPress={() => (isUnitModal ? setUnit(option.value) : setLanguage(option.value))}
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
