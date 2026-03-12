import { DB, open } from "@op-engineering/op-sqlite";
import { drizzle } from "drizzle-orm/op-sqlite";
import * as schema from "./schema";

export let opsqliteDB: DB = openOPSQLiteDB();
export const db = drizzle(opsqliteDB, { schema });

function openOPSQLiteDB() {
  if (!opsqliteDB) {
    opsqliteDB = open({ name: "weight-db" });
  }
  return opsqliteDB;
}
