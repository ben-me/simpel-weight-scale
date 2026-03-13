import { FlashList } from "@shopify/flash-list";
import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import { useEffect, useState } from "react";
import { AppState, Pressable, StyleSheet, useColorScheme, View } from "react-native";

import { IconAdd } from "@/components/icons/IconPlus";
import Select from "@/components/Select";
import ThemedText from "@/components/ThemedText";
import { WeightListItem } from "@/components/WeightListItem";
import { ANCHOR_DAYS } from "@/constants/anchor_days";
import { db, opsqliteDB } from "@/db";
import { getSetting, getWeights, insertSetting } from "@/db/operations";
import { WeightTableEntry } from "@/db/schema";
import calculateAverageWeight from "@/utilities/caculate-average-weight";

import { Colors } from "../constants/theme";
import migrations from "../drizzle/migrations";
import { checkAndInsertToday } from "@/utilities/check_and_insert_today";

export default function Index() {
  const { success, error } = useMigrations(db, migrations);
  const colorScheme = useColorScheme();
  const { backgroundColor } = Colors[colorScheme ?? "light"];
  const [weight, setWeight] = useState("");
  const [data, setData] = useState<WeightTableEntry[]>([]);
  const [anchorDay, setAnchorDay] = useState<number>();
  let average_weight: number | undefined;

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
          setAnchorDay(0);
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

  if (data && data.length >= 7) {
    average_weight = calculateAverageWeight(anchorDay!, data);
  }

  async function handleAnchorDayChange(day: number) {
    if (day === anchorDay) return;
    try {
      await insertSetting({ key: "anchor_day", value: day });
      setAnchorDay(day);
    } catch (e) {
      console.error(e as Error);
    }
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
      <View style={[{ backgroundColor }, styles.overviewContainer]}>
        <View>
          <ThemedText>Stichtag:</ThemedText>
          <Select
            options={ANCHOR_DAYS.map((day, index) => ({ label: day, value: index }))}
            value={anchorDay!}
            onChange={handleAnchorDayChange}
          />
        </View>
        <ThemedText>{average_weight}</ThemedText>
        <Pressable>
          <IconAdd />
        </Pressable>
      </View>
      <FlashList
        data={data}
        renderItem={({ item }) => <WeightListItem key={item.date} {...item} />}
        keyExtractor={(entry) => entry.date}
        style={{ backgroundColor }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBlock: 16,
    borderTopWidth: 1,
    borderStyle: "solid",
    borderColor: "gray",
  },
  overviewContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
