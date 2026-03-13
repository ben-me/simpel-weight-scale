import { WeightTableEntry } from "@/db/schema";

import { toAppDayIndex } from "./convert_days";

export default function calculateAverageWeight(anchor_day: number, entries: WeightTableEntry[]) {
  const sorted_entries = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  const anchor_entry = sorted_entries.find(
    (entry) => toAppDayIndex(new Date(entry.date).getDay()) === anchor_day,
  );

  if (!anchor_entry) {
    return;
  }

  const anchor_index = sorted_entries.indexOf(anchor_entry);
  const relevant_calc_entries = sorted_entries.slice(anchor_index, anchor_index + 7);

  const non_zero_entries = relevant_calc_entries.filter(
    (entry) => entry.weight && entry.weight > 0,
  );
  const average_weight =
    non_zero_entries.reduce((sum, entry) => sum + entry.weight!, 0) / non_zero_entries.length;

  return Number(average_weight.toFixed(2));
}
