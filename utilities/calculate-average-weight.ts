import { WeightTableEntry } from "@/db/schema";

import { toAppDayIndex } from "./convert_days";
import { AnchorDay, getAnchorDayNumber } from "@/constants/anchor_days";

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

function dataBetweenAnchorDays(
  sorted_entries: WeightTableEntry[],
  start: WeightTableEntry,
  end: WeightTableEntry | undefined,
) {
  const from_index = sorted_entries.indexOf(start);
  const to_index =
    end && sorted_entries.indexOf(end) !== 0 ? sorted_entries.indexOf(end) : sorted_entries.length;
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

export function calculateAverageWeight(anchor_day: AnchorDay, entries: WeightTableEntry[]) {
  const anchor_day_number = getAnchorDayNumber(anchor_day);
  const [anchor1, anchor2, anchor3] = findRelevantAnchorDays(anchor_day_number, entries);

  if (!anchor1 && !anchor2) {
    return { current_average_weight: undefined, previous_average_weight: undefined };
  }

  const current_data = dataBetweenAnchorDays(entries, anchor1, anchor2);
  const current_average_weight = averageWeight(current_data);

  if (!anchor3) {
    return { current_average_weight, previous_average_weight: undefined };
  }

  const previous_data = dataBetweenAnchorDays(entries, anchor2, anchor3);
  const previous_average_weight = averageWeight(previous_data);

  return { current_average_weight, previous_average_weight };
}

export function getLoggedDays(anchor_day: AnchorDay, entries: WeightTableEntry[]) {
  const anchor_day_number = getAnchorDayNumber(anchor_day);
  const [anchor1, anchor2] = findRelevantAnchorDays(anchor_day_number, entries);
  const isTodayAnchorDay = toAppDayIndex(new Date().getDay()) === anchor_day_number;

  let relevant_entries: WeightTableEntry[];
  if (isTodayAnchorDay && anchor2) {
    relevant_entries = dataBetweenAnchorDays(entries, anchor1, anchor2);
  } else {
    relevant_entries = dataBetweenAnchorDays(entries, entries[0], anchor1);
  }

  return relevant_entries
    .map((e) => ({
      day: toAppDayIndex(new Date(e.date).getDay()),
      logged: e.weight !== 0,
    }))
    .sort((a, b) => a.day - b.day);
}
