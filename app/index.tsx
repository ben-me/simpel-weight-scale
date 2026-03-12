import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { IconAdd } from "@/components/icons/IconPlus";
import Select from "@/components/Select";
import ThemedText from "@/components/ThemedText";
import { WeightListItem } from "@/components/WeightListItem";
import { ANCHOR_DAYS } from "@/constants/anchor_days";
import { db, opsqliteDB } from "@/db";
import { getSetting, getWeights, insertWeight, insertSetting } from "@/db/operations";
import { WeightTableEntry } from "@/db/schema";
import calculateAverageWeight from "@/utilities/caculate-average-weight";
import convertWeight from "@/utilities/convert-weight";

import { Colors } from "../constants/theme";
import migrations from "../drizzle/migrations";

export default function Index() {
  const { success, error } = useMigrations(db, migrations);
  const colorScheme = useColorScheme();
  const { backgroundColor } = Colors[colorScheme ?? "light"];
  const [weight, setWeight] = useState("");
  const [data, setData] = useState<WeightTableEntry[] | null>([]);
  const [anchorDay, setAnchorDay] = useState<number>();
  let average_weight: number | undefined;

  useEffect(() => {
    if (!success) return;
    const fetchData = async () => {
      try {
        const [weightEntries, anchorDay] = await Promise.all([
          getWeights(),
          getSetting("anchor_day"),
        ]);
        setData(weightEntries);

        if (anchorDay) {
          setAnchorDay(anchorDay.value);
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

  async function addTodaysWeight() {
    if (weight === "") return;
    const converted_weight = convertWeight(weight);

    try {
      await insertWeight({
        date: new Date().toISOString().slice(0, 10),
        weight: converted_weight,
        unit: "KG",
      });
      setWeight("");
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
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={[{ backgroundColor }, styles.container]}>
          <View style={[{ backgroundColor }, styles.inputContainer]}>
            <View>
              <ThemedText>Stichtag:</ThemedText>
              <Select
                options={ANCHOR_DAYS.map((day, index) => ({ label: day, value: index }))}
                value={anchorDay!}
                onChange={handleAnchorDayChange}
              />
            </View>
            <ThemedText>{average_weight}</ThemedText>
            <Pressable onPress={addTodaysWeight}>
              <IconAdd />
            </Pressable>
          </View>
          <FlashList
            data={data}
            renderItem={({ item }) => <WeightListItem {...item} />}
            keyExtractor={(entry) => entry.date}
            style={{ backgroundColor }}
          />
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
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
  inputContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
