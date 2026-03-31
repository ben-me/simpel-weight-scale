import StaggeredView from "@/components/StaggeredView";
import Switch from "@/components/Switch";
import ThemedText from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useTheme";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Setup() {
  const { t, i18n } = useTranslation();
  const selectedLanguage = useRef(i18n.language);
  const { backgroundColor } = useThemeColors();

  function handleLanguageChange(newSelected: "en" | "de") {
    i18n.changeLanguage(newSelected);
    selectedLanguage.current = newSelected;
  }

  return (
    <SafeAreaView style={[{ backgroundColor, paddingLeft: 8, paddingRight: 8 }, styles.container]}>
      <StaggeredView index={0}>
        <ThemedText style={{ fontSize: 32, fontWeight: "600", textAlign: "center" }}>
          {t("setup.headline")}
        </ThemedText>
      </StaggeredView>
      <StaggeredView index={1}>
        <ThemedText style={{ textAlign: "center", paddingInline: 40 }}>
          {t("setup.languageUnitInfo")}
        </ThemedText>
      </StaggeredView>
      <StaggeredView index={2}>
        <ThemedText style={{ fontSize: 24, fontWeight: "600", textAlign: "center" }}>
          {t("language")}:
        </ThemedText>
      </StaggeredView>
      <StaggeredView index={3}>
        <Switch
          selected={selectedLanguage.current}
          onSelect={handleLanguageChange}
          optionLeft={{ label: t("german"), value: "de" }}
          optionRight={{ label: t("english"), value: "en" }}
        />
      </StaggeredView>
      <StaggeredView index={4}></StaggeredView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});
