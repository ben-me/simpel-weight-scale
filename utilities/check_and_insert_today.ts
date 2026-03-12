import { insertWeight } from "@/db/operations";
import { WeightTableEntry } from "@/db/schema";

export async function checkAndInsertToday(data: WeightTableEntry[] | null) {
  if (data && data.length > 0) {
    const today = new Date().toISOString().slice(0, 10);
    const lastEntry = data[0];
    const todayExists = today === lastEntry.date;
    if (todayExists) {
      return;
    }
  }
  await insertWeight({
    date: new Date().toISOString().slice(0, 10),
    weight: 0,
    unit: 0,
  });
}
