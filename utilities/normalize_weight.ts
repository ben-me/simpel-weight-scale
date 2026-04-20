import { KG_TO_LBS } from "@/db/operations";
import { useUnit } from "@/store/unit";

export default function normalizeWeight(weight: number) {
  const unit = useUnit.getState().unit;
  return unit === "lbs" ? Number((weight * KG_TO_LBS).toFixed(2)) : weight;
}
