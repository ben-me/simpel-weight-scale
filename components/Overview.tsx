import { StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";
import Select from "./Select";
import { ANCHOR_DAYS } from "@/constants/anchor_days";
import { getSetting, insertSetting } from "@/db/operations";
import { useEffect, useState } from "react";
import convertUnit from "@/utilities/convert_unit";
import { useThemeColors } from "@/hooks/useTheme";

type Props = {
  anchorDay: number | undefined;
  setAnchorDay: React.Dispatch<React.SetStateAction<number | undefined>>;
  previousAverage: number | undefined;
};

export default function Overview({ anchorDay, setAnchorDay, previousAverage }: Props) {
  const { backgroundLight } = useThemeColors();
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
      <View style={[styles.info, styles.infoDay, { backgroundColor: backgroundLight }]}>
        <Select
          options={ANCHOR_DAYS.map((day, index) => ({ label: day, value: index }))}
          value={anchorDay ?? 0}
          onChange={handleAnchorDayChange}
          style={styles.highlight}
        />
        <ThemedText style={styles.subtitle}>Stichtag</ThemedText>
      </View>
      <View
        style={[
          styles.info,
          styles.infoUnit,
          { alignItems: "flex-end", backgroundColor: backgroundLight },
        ]}
      >
        <ThemedText style={styles.highlight}>{convertUnit(unit)}</ThemedText>
        <ThemedText style={styles.subtitle}>Einheit</ThemedText>
      </View>
      <View style={[styles.info, styles.infoPreviousAverage, { backgroundColor: backgroundLight }]}>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "flex-end",
          }}
        >
          <ThemedText style={styles.highlight}>{previousAverage}</ThemedText>
          <ThemedText>{convertUnit(unit)}</ThemedText>
        </View>
        <ThemedText style={styles.subtitle}>Letzter Durchschnitt</ThemedText>
      </View>
      <View
        style={[
          styles.info,
          styles.infoDifference,
          { alignItems: "flex-end", backgroundColor: backgroundLight },
        ]}
      >
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
