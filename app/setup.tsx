import Button from "@/components/Button";
import StaggeredView from "@/components/StaggeredView";
import Switch from "@/components/Switch";
import ThemedText from "@/components/ThemedText";
import { insertSetting } from "@/db/operations";
import { useThemeColors } from "@/hooks/useTheme";
import { useDataStore } from "@/store/useDataStore";
import { useSetupStore } from "@/store/useSetupStore";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Setup() {
  const { completeSetup } = useSetupStore();
  const { updateUnit } = useDataStore();
  const { t, i18n } = useTranslation();
  const selectedLanguage = useRef(i18n.language);
  const selectedUnit = useRef<"kg" | "lbs">("kg");
  const { backgroundColor, primary } = useThemeColors();

  function handleLanguageChange(value: "en" | "de") {
    i18n.changeLanguage(value);
    selectedLanguage.current = value;
  }

  function handleUnitChange(value: "kg" | "lbs") {
    selectedUnit.current = value;
  }

  async function handleSubmit() {
    try {
      await updateUnit(selectedUnit.current);
      await insertSetting({ key: "setup_complete", value: "1" });
      completeSetup();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={[{ backgroundColor }, styles.container]}>
      <View style={{ gap: 12 }}>
        <StaggeredView index={0}>
          <ThemedText
            style={{ paddingInline: 35, fontSize: 32, fontWeight: "600", textAlign: "center" }}
          >
            {t("setup.headline")}
          </ThemedText>
        </StaggeredView>
        <StaggeredView index={1}>
          <ThemedText style={{ textAlign: "center", paddingInline: 40 }}>
            {t("setup.languageUnitInfo")}
          </ThemedText>
        </StaggeredView>
      </View>
      <StaggeredView style={{ gap: 8 }} index={2}>
        <ThemedText style={{ fontSize: 24, fontWeight: "600", textAlign: "center" }}>
          {t("language")}:
        </ThemedText>
        <Switch
          selected={selectedLanguage.current}
          onSelect={handleLanguageChange}
          optionLeft={{ label: t("german"), value: "de" }}
          optionRight={{ label: t("english"), value: "en" }}
        />
      </StaggeredView>
      <StaggeredView style={{ gap: 8 }} index={3}>
        <ThemedText style={{ fontSize: 24, fontWeight: "600", textAlign: "center" }}>
          {t("unit")}:
        </ThemedText>
        <Switch
          selected={selectedUnit.current}
          onSelect={handleUnitChange}
          optionLeft={{ label: "KG", value: "kg" }}
          optionRight={{ label: "LBS", value: "lbs" }}
        />
      </StaggeredView>
      <StaggeredView index={4}>
        <Button style={[styles.submit, { backgroundColor: primary }]} onPress={handleSubmit}>
          <ThemedText style={{ fontWeight: 600, color: "white" }}>{t("continue")}</ThemedText>
        </Button>
      </StaggeredView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 8,
    paddingRight: 8,
    gap: 32,
  },
  submit: {
    marginTop: 80,
    paddingInline: 28,
    paddingBlock: 12,
    borderRadius: 8,
  },
});
