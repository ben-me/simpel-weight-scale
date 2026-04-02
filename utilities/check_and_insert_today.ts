import { getSetting, getSingleWeight, insertWeight } from "@/db/operations";

export async function checkAndInsertToday() {
  const today = new Date().toISOString().slice(0, 10);
  const todayExists = await getSingleWeight(today);
  if (!todayExists) {
    const unit = await getSetting("unit");

    await insertWeight({
      date: new Date().toISOString().slice(0, 10),
      weight: 0,
      unit: unit?.value!,
    });
  }
}
