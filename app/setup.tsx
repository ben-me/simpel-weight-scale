import StaggeredView from "@/components/StaggeredView";
import Switch from "@/components/Switch";
import ThemedText from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useTheme";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Setup() {
  const selectedLanguage = useRef("english");
  const { t, i18n } = useTranslation();
  const { backgroundColor } = useThemeColors();

  function handleLanguageChange(newSelected: "german" | "english") {
    i18n.changeLanguage(newSelected.toLowerCase() === "german" ? "de" : "en");
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
          optionLeft={t("german")}
          optionRight={t("english")}
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
