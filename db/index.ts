import { open } from "@op-engineering/op-sqlite";
import { drizzle } from "drizzle-orm/op-sqlite";

let opsqliteDB = open({ name: "weight-db" });
export const db = drizzle(opsqliteDB);

export function openOPSQLiteDB() {
  if (!opsqliteDB) {
    opsqliteDB = open({ name: "weight-db" });
  }
  return opsqliteDB;
}
