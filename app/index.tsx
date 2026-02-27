import { open } from "@op-engineering/op-sqlite";
import { drizzle } from "drizzle-orm/op-sqlite";
import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import { Text, View } from "react-native";

import migrations from "../drizzle/migrations";

const opsqliteDB = open({
  name: "weight-db",
});

const db = drizzle(opsqliteDB);

export default function Index() {
  const { success, error } = useMigrations(db, migrations);

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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hallo Welt</Text>
    </View>
  );
}
