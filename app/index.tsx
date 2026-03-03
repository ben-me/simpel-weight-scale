import { desc } from "drizzle-orm";
import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, useColorScheme, View } from "react-native";

import ThemedInput from "@/components/ThemedInput";
import ThemedText from "@/components/ThemedText";
import { WeightListItem } from "@/components/WeightListItem";
import { db, opsqliteDB } from "@/db";
import { insertNewWeight } from "@/db/operations";
import { DataEntry, weightTable } from "@/db/schema";
import convertWeight from "@/utilities/convert-weight";

import { Colors } from "../constants/theme";
import migrations from "../drizzle/migrations";

export default function Index() {
  const { success, error } = useMigrations(db, migrations);
  const colorScheme = useColorScheme();
  const { backgroundColor } = Colors[colorScheme ?? "light"];
  const [weight, setWeight] = useState("");
  const [data, setData] = useState<DataEntry[] | null>([]);

  useEffect(() => {
    if (!success) return;
    db.select()
      .from(weightTable)
      .orderBy(desc(weightTable.date))
      .then((result) => {
        setData(result);
      });

    // oxlint-disable-next-line no-unused-vars
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

  async function addTodaysWeight() {
    if (weight === "") {
      return;
    }
    const converted_weight = convertWeight(weight);

    try {
      await insertNewWeight({
        date: new Date().toLocaleString(),
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
        <View style={{ flexDirection: "row" }}>
          <ThemedText>Aktueller Stichtag:</ThemedText>
        </View>
        <ThemedInput
          inputMode="decimal"
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
        />
        <Button title="Add weight" color="blue" onPress={addTodaysWeight} />
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <WeightListItem weight={item.weight} unit={item.unit} date={item.date} />
        )}
        keyExtractor={(entry) => entry.date}
        style={[{ backgroundColor }]}
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
  display: {},
  weightList: {},
});
