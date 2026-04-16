import { getSingleWeight, insertWeight } from "@/db/operations";
import { useUnit } from "@/store/unit";

export async function checkAndInsertToday() {
  const unit = useUnit.getState().unit;
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
