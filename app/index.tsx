import { useEffect, useState } from "react";
import { AppState, FlatList, StyleSheet, View } from "react-native";

import { WeightListItem } from "@/components/WeightListItem";
import { opsqliteDB } from "@/db";
import { getSetting, getWeights, insertSetting } from "@/db/operations";
import { WeightTableEntry } from "@/db/schema";
import { calculateAverageWeight, getLoggedDays } from "@/utilities/calculate-average-weight";

import { checkAndInsertToday } from "@/utilities/check_and_insert_today";
import Overview from "@/components/Overview";
import { useThemeColors } from "@/hooks/useTheme";
import { MainDisplay } from "@/components/MainDisplay";
import { AnchorDay } from "@/constants/anchor_days";

export default function Index() {
  const { backgroundColor, backgroundLight, borderColor } = useThemeColors();
  const [data, setData] = useState<WeightTableEntry[]>([]);
  const [anchorDay, setAnchorDay] = useState<AnchorDay>("monday");
  const loggedDays = getLoggedDays(data);
  const { current_average_weight, previous_average_weight } = calculateAverageWeight(
    anchorDay,
    data,
  );
  let weightDifference: number | undefined;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weightEntries, dbAnchorDay, _] = await Promise.all([
          getWeights(),
          getSetting("anchor_day"),
          checkAndInsertToday(),
        ]);
        setData(weightEntries);

        if (dbAnchorDay) {
          setAnchorDay(dbAnchorDay.value as AnchorDay);
        } else {
          await insertSetting({ value: "monday", key: "anchor_day" });
        }
      } catch (error) {
        console.error("Init failed", error);
      }
    };
    fetchData();

    const subscribeToAppState = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkAndInsertToday();
      }
    });

    const reactive_data = opsqliteDB.reactiveExecute({
      query: "SELECT * FROM weight ORDER BY date DESC",
      fireOn: [{ table: "weight" }],
      arguments: [],
      callback: (weightResponse) => {
        setData(weightResponse.rows);
      },
    });

    return () => {
      reactive_data();
      subscribeToAppState.remove();
    };
  }, []);

  if (previous_average_weight && current_average_weight) {
    weightDifference = Number((current_average_weight - previous_average_weight).toFixed(2));
  }

  return (
    <View style={[{ backgroundColor, borderTopColor: borderColor }, styles.container]}>
      <MainDisplay
        anchorDay={anchorDay}
        daysLogged={loggedDays}
        currentWeight={current_average_weight}
      />

      <Overview
        anchorDay={anchorDay}
        setAnchorDay={setAnchorDay}
        previousAverage={previous_average_weight}
        difference={weightDifference}
      />
      <FlatList
        data={data}
        renderItem={({ item }) => <WeightListItem anchorDay={anchorDay} {...item} />}
        keyExtractor={(item) => item.date}
        style={{
          backgroundColor: backgroundLight,
          borderRadius: 6,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 1,
    paddingLeft: 8,
    paddingRight: 8,
    borderStyle: "solid",
    gap: 16,
  },
});
