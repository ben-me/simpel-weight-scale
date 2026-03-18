import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import { useEffect, useState } from "react";
import { AppState, FlatList, StyleSheet, View } from "react-native";

import ThemedText from "@/components/ThemedText";
import { WeightListItem } from "@/components/WeightListItem";
import { db, opsqliteDB } from "@/db";
import { getSetting, getWeights, insertSetting } from "@/db/operations";
import { WeightTableEntry } from "@/db/schema";
import { calculateAverageWeight, getLoggedDays } from "@/utilities/caculate-average-weight";

import migrations from "../drizzle/migrations";
import { checkAndInsertToday } from "@/utilities/check_and_insert_today";
import Overview from "@/components/Overview";
import { useThemeColors } from "@/hooks/useTheme";
import { MainDisplay } from "@/components/MainDisplay";

export default function Index() {
  const { success, error } = useMigrations(db, migrations);
  const { backgroundColor, backgroundLight } = useThemeColors();
  const [weight, setWeight] = useState("");
  const [data, setData] = useState<WeightTableEntry[]>([]);
  const [anchorDay, setAnchorDay] = useState<number>(0);
  const { current_average_weight, previous_average_weight } = calculateAverageWeight(
    anchorDay,
    data,
  );
  let weightDifference: number | undefined;

  const { daysLogged } = getLoggedDays(anchorDay, data);

  useEffect(() => {
    if (!success) return;
    const fetchData = async () => {
      try {
        const [weightEntries, dbAnchorDay] = await Promise.all([
          getWeights(),
          getSetting("anchor_day"),
          checkAndInsertToday(),
        ]);
        setData(weightEntries);

        if (dbAnchorDay) {
          setAnchorDay(dbAnchorDay.value);
        } else {
          await insertSetting({ value: 0, key: "anchor_day" });
        }
      } catch (error) {
        console.error("Init failed", error);
      }
    };
    fetchData();

    const reactive_data = opsqliteDB.reactiveExecute({
      query: "SELECT * FROM weight ORDER BY date DESC",
      fireOn: [{ table: "weight" }],
      arguments: [],
      callback: (weightResponse) => {
        setData(weightResponse.rows);
      },
    });

    return () => reactive_data();
  }, [success]);

  useEffect(() => {
    const subscribeToAppState = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkAndInsertToday();
      }
    });
    return () => subscribeToAppState.remove();
  }, []);

  if (previous_average_weight && current_average_weight) {
    weightDifference = Number((current_average_weight - previous_average_weight).toFixed(2));
  }

  if (error) {
    console.error(error);
    return (
      <View>
        <ThemedText>Migration error: {error.message}</ThemedText>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <ThemedText>Migration is in progress...</ThemedText>
      </View>
    );
  }

  return (
    <View style={[{ backgroundColor }, styles.container]}>
      <MainDisplay daysLogged={daysLogged} daysTotal={7} currentWeight={current_average_weight} />

      <Overview
        anchorDay={anchorDay}
        setAnchorDay={setAnchorDay}
        previousAverage={previous_average_weight}
        difference={weightDifference}
      />
      <FlatList
        data={data}
        renderItem={({ item }) => <WeightListItem {...item} />}
        keyExtractor={(entry) => entry.date}
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
    paddingBlock: 16,
    paddingInline: 8,
    borderTopWidth: 1,
    borderStyle: "solid",
    borderColor: "gray",
    gap: 12,
  },
  overviewContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
