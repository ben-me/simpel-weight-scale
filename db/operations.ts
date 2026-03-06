import { desc, eq } from "drizzle-orm";

import { db, opsqliteDB } from ".";
import { WeightTableEntry, settings, weightTable, SettingTableEntry } from "./schema";

export async function getWeights() {
  let result: WeightTableEntry[] = [];
  await opsqliteDB.transaction(async () => {
    result = await db.select().from(weightTable).orderBy(desc(weightTable.date));
  });
  return result;
}

export async function insertWeight({
  date = new Date().toISOString().slice(0, 10),
  weight = 0,
  unit = "KG",
}: WeightTableEntry) {
  await opsqliteDB.transaction(async () => {
    await db.insert(weightTable).values({ weight, unit, date }).onConflictDoUpdate({
      target: weightTable.date,
      set: {
        weight,
        unit,
      },
    });
  });
}

export async function getSetting(key: string) {
  let setting: SettingTableEntry[] = [];
  await opsqliteDB.transaction(async () => {
    setting = await db.select().from(settings).where(eq(settings.key, key));
  });

  return setting[0];
}

export async function insertSetting(setting: SettingTableEntry) {
  await opsqliteDB.transaction(async () => {
    await db
      .insert(settings)
      .values(setting)
      .onConflictDoUpdate({ target: settings.key, set: { value: setting.value } });
  });
}
