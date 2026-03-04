import { eq } from "drizzle-orm";

import { db, opsqliteDB } from ".";
import { settings, weightTable } from "./schema";

type InsertWeightProps = {
  date: string;
  weight?: number;
  unit: "KG" | "LB";
};

type insertSetting = {
  key: "anchor_day" | "unit";
  value: string;
};

export async function insertNewWeight({
  date = new Date().toLocaleString(),
  weight = 0,
  unit = "KG",
}: InsertWeightProps) {
  await opsqliteDB.transaction(async () => {
    await db.insert(weightTable).values({ weight, unit, date }).onConflictDoNothing();
  });
}

export async function updateWeight({ date, weight, unit = "KG" }: InsertWeightProps) {
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
