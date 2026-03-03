import { eq } from "drizzle-orm";

import { db, opsqliteDB } from ".";
import { weightTable } from "./schema";

type InsertWeightProps = {
  date: string;
  weight?: number;
  unit: "KG" | "LB";
};

export async function insertNewWeight({
  date = new Date().toLocaleString(),
  weight = 0,
  unit = "KG",
}: InsertWeightProps) {
  await opsqliteDB.transaction(async () => {
    await db.insert(weightTable).values({ weight, unit, date });
  });
}

export async function updateWeight({ date, weight, unit = "KG" }: InsertWeightProps) {
  await opsqliteDB.transaction(async () => {
    await db.update(weightTable).set({ weight, unit }).where(eq(weightTable.date, date));
  });
}
