import { getSingleWeight, insertWeight } from "@/db/operations";
import { useUnitStore } from "@/store/useUnitStore";

export async function checkAndInsertToday() {
  const unit = useUnitStore.getState().unit;
  const today = new Date().toISOString().slice(0, 10);
  const todayExists = await getSingleWeight(today);
  if (!todayExists) {
    await insertWeight({
      date: new Date().toISOString().slice(0, 10),
      weight: 0,
      unit,
    });
  }
}
