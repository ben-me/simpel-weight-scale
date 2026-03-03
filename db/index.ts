import { open } from "@op-engineering/op-sqlite";
import { drizzle } from "drizzle-orm/op-sqlite";

export const opsqliteDB = open({ name: "weight-db" });
export const db = drizzle(opsqliteDB);
