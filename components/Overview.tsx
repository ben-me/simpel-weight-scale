import { StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";
import Select from "./Select";
import { ANCHOR_DAYS } from "@/constants/anchor_days";
import { getSetting, insertSetting } from "@/db/operations";
import { useEffect, useState } from "react";
import convertUnit from "@/utilities/convert_unit";

type Props = {
  anchorDay: number | undefined;
  setAnchorDay: React.Dispatch<React.SetStateAction<number | undefined>>;
  previousAverage: number | undefined;
};

export default function Overview({ anchorDay, setAnchorDay, previousAverage }: Props) {
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
      <View style={[styles.info, styles.infoDay]}>
        <Select
          options={ANCHOR_DAYS.map((day, index) => ({ label: day, value: index }))}
          value={anchorDay ?? 0}
          onChange={handleAnchorDayChange}
          style={styles.highlight}
        />
        <ThemedText style={{ opacity: 0.8, fontSize: 15 }}>Stichtag</ThemedText>
      </View>
      <View style={[styles.info, styles.infoUnit, { alignItems: "flex-end" }]}>
        <ThemedText style={styles.highlight}>{convertUnit(unit)}</ThemedText>
        <ThemedText style={{ opacity: 0.8, fontSize: 15 }}>Einheit</ThemedText>
      </View>
      <View style={[styles.info, styles.infoPreviousAverage]}>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "flex-end",
          }}
        >
          <ThemedText style={styles.highlight}>{previousAverage}</ThemedText>
          <ThemedText style={{ lineHeight: 19 }}>{convertUnit(unit)}</ThemedText>
        </View>
        <ThemedText style={{ opacity: 0.8, fontSize: 15 }}>Letzter Durchschnitt</ThemedText>
      </View>
      <View style={[styles.info, styles.infoDifference, { alignItems: "flex-end" }]}>
        <ThemedText>Unterschied</ThemedText>
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
    padding: 16,
    borderWidth: 1,
    borderColor: "red",
    borderStyle: "solid",
    justifyContent: "flex-end",
    borderRadius: 6,
  },
  highlight: {
    lineHeight: 27,
    fontSize: 25,
  },
  infoDay: {},
  infoUnit: {},
  infoPreviousAverage: {},
  infoDifference: {},
});
