import { WeightTableEntry } from "@/db/schema";

import { toAppDayIndex } from "./convert_days";
import { AnchorDay, getAnchorDayNumber } from "@/constants/anchor_days";
import { KG_TO_LBS } from "@/db/operations";

function isAnchorDay(anchor_day: number, entry: WeightTableEntry) {
  return toAppDayIndex(new Date(entry.date).getDay()) === anchor_day;
}

function findRelevantAnchorDays(anchor_day: number, sorted_entries: WeightTableEntry[]) {
  const results: WeightTableEntry[] = [];
  let last_anchor = new Date().getTime();

  for (const entry of sorted_entries) {
    if (!isAnchorDay(anchor_day, entry)) continue;

    const entry_time = new Date(entry.date).getTime();
    const difference_in_days = Math.floor((last_anchor - entry_time) / (24 * 3600 * 1000));

    if (difference_in_days >= 0 && difference_in_days <= 14) {
      results.push(entry);
      last_anchor = entry_time;
    } else {
      break;
    }
  }
  return results;
}

function dataBetweenAnchorDays(sorted_entries: WeightTableEntry[], start: WeightTableEntry) {
  const startTime = new Date(start.date).getTime();

  return sorted_entries.filter((entry) => {
    const entry_time = new Date(entry.date).getTime();
    const days_between = Math.floor((startTime - entry_time) / (24 * 3600 * 1000));
    return days_between >= 0 && days_between < 7;
  });
}

function averageWeight(entries: WeightTableEntry[]) {
  const valid_entries = entries.filter((entry) => entry.weight && entry.weight > 0);
  if (valid_entries.length === 0) {
    return undefined;
  }
  const sum = valid_entries.reduce((sum, entry) => {
    if (entry.unit === "lbs") {
      return sum + entry.weight! / KG_TO_LBS;
    }
    return sum + entry.weight!;
  }, 0);
  return Number((sum / valid_entries.length).toFixed(2));
}

export function calculateAverageWeight(anchor_day: AnchorDay, entries: WeightTableEntry[]) {
  const anchor_day_number = getAnchorDayNumber(anchor_day);
  const [anchor1, anchor2] = findRelevantAnchorDays(anchor_day_number, entries);

  if (!anchor1) {
    return { current_average_weight: undefined, previous_average_weight: undefined };
  }

  const current_data = dataBetweenAnchorDays(entries, anchor1);
  const current_average_weight = averageWeight(current_data);

  if (!anchor2) {
    return { current_average_weight, previous_average_weight: undefined };
  }

  const previous_data = dataBetweenAnchorDays(entries, anchor2);
  const previous_average_weight = averageWeight(previous_data);

  return { current_average_weight, previous_average_weight };
}

export function getLoggedDays(entries: WeightTableEntry[]) {
  if (!entries.length) return;
  const relevant_entries = dataBetweenAnchorDays(entries, entries[0]);

  return relevant_entries
    .map((e) => ({
      day: toAppDayIndex(new Date(e.date).getDay()),
      logged: e.weight !== 0,
    }))
    .sort((a, b) => a.day - b.day);
}
