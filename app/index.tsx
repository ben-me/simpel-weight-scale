import { open } from "@op-engineering/op-sqlite";
import { drizzle } from "drizzle-orm/op-sqlite";
import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from "react-native";

import IconAverage from "../components/icons/IconAverage";
import { Colors } from "../constants/theme";
import migrations from "../drizzle/migrations";

const opsqliteDB = open({
  name: "weight-db",
});

const db = drizzle(opsqliteDB);

export default function Index() {
  const colorScheme = useColorScheme();

  const { success, error } = useMigrations(db, migrations);
  const [weight, onChangeWeight] = React.useState("");
  const { text, backgroundColor } = Colors[colorScheme as "light" | "dark"];

  if (error) {
    console.error(error);
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }
  return (
    <View style={[{ backgroundColor }, styles.container]}>
      <StatusBar style="auto" />
      <View style={[{ backgroundColor }, styles.inputContainer]}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: text }}>7 Tage </Text>
          <IconAverage />
        </View>
        <TextInput
          inputMode="decimal"
          style={styles.input}
          value={weight}
          onChangeText={onChangeWeight}
        />
        <Text style={{ color: "red" }}>{backgroundColor}</Text>
      </View>
      <ScrollView style={[{ backgroundColor }]}></ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBlock: 20,
    borderTopWidth: 1,
    borderStyle: "solid",
    borderColor: "gray",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderStyle: "solid",
    borderBottomWidth: 2,
    borderBottomColor: "white",
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
