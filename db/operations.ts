import { desc, eq } from "drizzle-orm";

import { db, opsqliteDB } from ".";
import { DataEntry, settings, weightTable } from "./schema";

type InsertWeightProps = {
  weight?: number;
  unit: "KG" | "LB";
};

type UpdateWeightProps = {
  date: string;
} & InsertWeightProps;

type insertSetting = {
  key: "anchor_day" | "unit";
  value: number;
};

export async function getWeights() {
  let result: DataEntry[] = [];
  await opsqliteDB.transaction(async () => {
    result = await db.select().from(weightTable).orderBy(desc(weightTable.id));
  });
  return result;
}

export async function insertNewWeight({
  date = new Date().toISOString().slice(0, 10),
  weight = 0,
  unit = "KG",
}: InsertWeightProps & { date?: string }) {
  await opsqliteDB.transaction(async () => {
    await db.insert(weightTable).values({ weight, unit, date }).onConflictDoNothing();
  });
}

export async function updateWeight({ date, weight, unit = "KG" }: UpdateWeightProps) {
  await opsqliteDB.transaction(async () => {
    await db.update(weightTable).set({ weight, unit }).where(eq(weightTable.date, date));
  });
}

export async function insertSetting(setting: insertSetting) {
  await opsqliteDB.transaction(async () => {
    await db.insert(settings).values(setting).onConflictDoNothing();
  });
}

export async function updateSetting({ key, value }: insertSetting) {
  await opsqliteDB.transaction(async () => {
    await db.update(settings).set({ value }).where(eq(settings.key, key));
  });
}
