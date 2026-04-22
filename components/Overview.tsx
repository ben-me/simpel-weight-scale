import { StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";
import Select from "./Select";
import { ANCHOR_DAYS, AnchorDay } from "@/constants/anchor_days";
import { insertSetting } from "@/db/operations";
import { useThemeColors } from "@/hooks/useTheme";
import AnimatedRollingNumber from "react-native-animated-rolling-numbers";
import OverviewField from "./OverviewField";
import { useTranslation } from "react-i18next";
import { useUnitStore } from "@/store/useUnitStore";
import normalizeWeight from "@/utilities/normalize_weight";

type Props = {
  anchorDay: AnchorDay | undefined;
  setAnchorDay: React.Dispatch<React.SetStateAction<AnchorDay>>;
  previousAverage: number | undefined;
  difference: number | undefined;
};

export default function Overview({ anchorDay, setAnchorDay, previousAverage, difference }: Props) {
  const { unit } = useUnitStore();
  const { t } = useTranslation();
  const { backgroundLight, text } = useThemeColors();

  async function handleAnchorDayChange(day: AnchorDay) {
    if (day === anchorDay) return;
    try {
      await insertSetting({ key: "anchor_day", value: day });
      setAnchorDay(day);
    } catch (e) {
      console.error(e as Error);
    }
  }

  return (
    <View style={styles.container}>
      <Select
        options={ANCHOR_DAYS.map((day) => ({ label: t(`anchorDays.${day}`), value: day }))}
        value={anchorDay ?? "monday"}
        onChange={handleAnchorDayChange}
        style={styles.info}
      />
      <OverviewField
        highlightedText={unit.toUpperCase()}
        subtitleText={t("unit")}
        style={[styles.info, { backgroundColor: backgroundLight, alignItems: "flex-end" }]}
      />
      <OverviewField
        highlightedText={previousAverage ? normalizeWeight(previousAverage, unit) : "-"}
        subtitleText={t("previousAverage")}
        style={[styles.info, { backgroundColor: backgroundLight }]}
      />
      <View style={[styles.info, { alignItems: "flex-end", backgroundColor: backgroundLight }]}>
        <AnimatedRollingNumber
          showPlusSign={true}
          value={difference ? normalizeWeight(difference, unit) : 0}
          textStyle={[styles.highlight, { color: text }]}
        />
        <ThemedText style={styles.subtitle}>{t("difference")}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  info: {
    minWidth: "48%",
    flexGrow: 1,
    paddingBlock: 20,
    paddingInline: 16,
    justifyContent: "flex-end",
    borderRadius: 6,
    gap: 6,
  },
  highlight: {
    lineHeight: 27,
    fontSize: 25,
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 14,
  },
});
