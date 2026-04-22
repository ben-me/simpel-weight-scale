import { KG_TO_LBS } from "@/db/operations";

export default function normalizeWeight(weight: number, unit: "kg" | "lbs") {
  return unit === "lbs" ? Number((weight * KG_TO_LBS).toFixed(2)) : weight;
}
