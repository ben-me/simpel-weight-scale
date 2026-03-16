import { WeightTableEntry } from "@/db/schema";

import { toAppDayIndex } from "./convert_days";

function isAnchorDay(anchor_day: number, entry: WeightTableEntry) {
  return toAppDayIndex(new Date(entry.date).getDay()) === anchor_day;
}

function findAnchorDays(anchor_day: number, sorted_entries: WeightTableEntry[]) {
  const anchors = sorted_entries.filter((e) => isAnchorDay(anchor_day, e));
  return [anchors[0], anchors[1], anchors[2]];
}

function dataBetweenAnchorDays(
  sorted_entries: WeightTableEntry[],
  start: WeightTableEntry,
  end: WeightTableEntry | undefined,
) {
  const from_index = sorted_entries.indexOf(start);
  const to_index = end ? sorted_entries.indexOf(end) : sorted_entries.length;
  return sorted_entries.slice(from_index, to_index);
}

function averageWeight(entries: WeightTableEntry[]) {
  const valid_entries = entries.filter((entry) => entry.weight && entry.weight > 0);
  if (valid_entries.length === 0) {
    return undefined;
  }
  const sum = valid_entries.reduce((sum, entry) => sum + entry.weight!, 0);
  return Number((sum / valid_entries.length).toFixed(2));
}

export default function calculateAverageWeight(anchor_day: number, entries: WeightTableEntry[]) {
  const sorted_entries = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const [anchor1, anchor2, anchor3] = findAnchorDays(anchor_day, sorted_entries);

  if (!anchor1) {
    return { current_average_weight: undefined, previous_average_weight: undefined };
  }

  const current_data = dataBetweenAnchorDays(sorted_entries, anchor1, anchor2);
  const current_average_weight = averageWeight(current_data);

  if (!anchor2) {
    return { current_average_weight, previous_average_weight: undefined };
  }

  const previous_data = dataBetweenAnchorDays(sorted_entries, anchor2, anchor3);
  const previous_average_weight = averageWeight(previous_data);

  return { current_average_weight, previous_average_weight };
}
