import { StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";
import Select from "./Select";
import { ANCHOR_DAYS } from "@/constants/anchor_days";
import { getSetting, insertSetting } from "@/db/operations";
import { useEffect, useState } from "react";
import convertUnit from "@/utilities/convert_unit";
import { useThemeColors } from "@/hooks/useTheme";
import AnimatedRollingNumber from "react-native-animated-rolling-numbers";
import OverviewField from "./OverviewField";

type Props = {
  anchorDay: number | undefined;
  setAnchorDay: React.Dispatch<React.SetStateAction<number>>;
  previousAverage: number | undefined;
  difference: number | undefined;
};

export default function Overview({ anchorDay, setAnchorDay, previousAverage, difference }: Props) {
  const { backgroundLight, text } = useThemeColors();
  const [unit, setUnit] = useState(0);

  useEffect(() => {
    async function fetchUnit() {
      const dbUnit = await getSetting("unit");
      if (!dbUnit || dbUnit?.value === unit) {
        return;
      }
      setUnit(dbUnit.value);
    }
    fetchUnit();
  }, [unit]);

  async function handleAnchorDayChange(day: number) {
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
        options={ANCHOR_DAYS.map((day, index) => ({ label: day, value: index }))}
        value={anchorDay ?? 0}
        onChange={handleAnchorDayChange}
        style={styles.info}
      />
      <OverviewField
        highlightedText={convertUnit(unit)}
        subtitleText="Einheit"
        style={[styles.info, { backgroundColor: backgroundLight, alignItems: "flex-end" }]}
      />
      <OverviewField
        highlightedText={previousAverage ? previousAverage : "-"}
        subtitleText="Letzter Durchschnitt"
        style={[styles.info, { backgroundColor: backgroundLight }]}
      />
      <View
        style={[
          styles.info,
          styles.infoDifference,
          { alignItems: "flex-end", backgroundColor: backgroundLight },
        ]}
      >
        <AnimatedRollingNumber
          showPlusSign={true}
          value={difference ? difference : 0}
          textStyle={[styles.highlight, { color: text }]}
        />
        <ThemedText style={styles.subtitle}>Unterschied</ThemedText>
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
  infoDay: {},
  infoUnit: {},
  infoPreviousAverage: {},
  infoDifference: {},
});
