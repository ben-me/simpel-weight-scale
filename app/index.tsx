import { Picker } from "@react-native-picker/picker";
import { FlashList } from "@shopify/flash-list";
import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, StyleSheet, useColorScheme, View } from "react-native";

import ThemedInput from "@/components/ThemedInput";
import ThemedText from "@/components/ThemedText";
import { WeightListItem } from "@/components/WeightListItem";
import { ANCHOR_DAYS } from "@/constants/anchor_days";
import { db, openOPSQLiteDB } from "@/db";
import { getWeights, insertNewWeight, insertSetting } from "@/db/operations";
import { DataEntry } from "@/db/schema";
import convertWeight from "@/utilities/convert-weight";

import { Colors } from "../constants/theme";
import migrations from "../drizzle/migrations";

export default function Index() {
  const opsqliteDB = openOPSQLiteDB();
  const { success, error } = useMigrations(db, migrations);
  const colorScheme = useColorScheme();
  const { backgroundColor } = Colors[colorScheme ?? "light"];
  const [weight, setWeight] = useState("");
  const [data, setData] = useState<DataEntry[] | null>([]);
  const [anchorDay, setAnchorDay] = useState(0);

  useEffect(() => {
    if (!success) return;

    const fetchData = async () => {
      const weightEntries = await getWeights();
      setData(weightEntries);
    };

    fetchData();

    // oxlint-disable-next-line no-unused-vars
    const reactive_data = opsqliteDB.reactiveExecute({
      query: "SELECT * FROM weight ORDER BY id DESC",
      fireOn: [{ table: "weight" }],
      arguments: [],
      callback: (weightResponse) => {
        setData(weightResponse.rows);
      },
    });

    return () => reactive_data();
  }, [success]);

  async function changeAnchorDay(day: number) {
    if (anchorDay) return;
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
      await insertNewWeight({
        date: new Date().toLocaleDateString(),
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
    <View style={[{ backgroundColor }, styles.container]}>
      <StatusBar style="light" />
      <View style={[{ backgroundColor }, styles.inputContainer]}>
        <View
          style={{
            justifyContent: "center",
            borderColor: "red",
            borderWidth: 2,
            borderStyle: "solid",
          }}
        >
          <ThemedText>Aktueller Stichtag:</ThemedText>
          <Picker
            selectedValue={anchorDay}
            style={{
              alignSelf: "stretch",
            }}
            onValueChange={(itemValue) => changeAnchorDay(itemValue)}
          >
            {ANCHOR_DAYS.map((day, index) => {
              return <Picker.Item key={day} label={day} value={index} />;
            })}
          </Picker>
        </View>
        <ThemedInput
          inputMode="decimal"
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
        />
        <Button title="Add weight" color="blue" onPress={addTodaysWeight} />
      </View>
      <FlashList
        data={data}
        renderItem={({ item }) => <WeightListItem {...item} />}
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
  inputContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  input: {
    borderStyle: "solid",
    borderBottomColor: "white",
    borderBottomWidth: 2,
    width: 70,
  },
  weightList: {},
});
