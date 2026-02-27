import { open } from "@op-engineering/op-sqlite";
import { drizzle } from "drizzle-orm/op-sqlite";
import migrations from "../drizzle/migrations";
import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import { Text, View } from "react-native";

const opsqliteDB = open({
  name: "weight-db",
});

const db = drizzle(opsqliteDB);

export default function Index() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    console.error(error);
    return (
      <View style={styles.container}>
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
