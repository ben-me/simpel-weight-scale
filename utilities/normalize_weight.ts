import { KG_TO_LBS } from "@/db/operations";
import { useUnitStore } from "@/store/useUnitStore";

export default function normalizeWeight(weight: number) {
  const unit = useUnitStore.getState().unit;
  return unit === "lbs" ? Number((weight * KG_TO_LBS).toFixed(2)) : weight;
}
