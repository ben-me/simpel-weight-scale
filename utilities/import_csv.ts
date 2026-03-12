import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { Entry } from "./validation_schemas";
import { getSetting, insertMultipleWeights } from "@/db/operations";
import { WeightTableEntry } from "@/db/schema";

export async function importCSV() {
  const picker = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: false,
  });
  if (picker.canceled) {
    return;
  }

  const { uri } = picker.assets[0];
  const textContent = new File(uri)
    .textSync()
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  const settingUnit = (await getSetting("unit"))?.value ?? 0;

  const entries: WeightTableEntry[] = [];
  const parse = textContent.map((entry, i) => {
    const commaIndex = entry.indexOf(",");
    const date = entry.slice(0, commaIndex).trim();
    const weight = entry.slice(commaIndex + 1).trim() || null;
    const unit = settingUnit;

    const result = Entry.safeParse({ date, weight: Number(weight), unit });
    if (!result.success) {
      console.error(`Line ${i + 1}: failed`, { date, weight }, result.error.issues);
    } else {
      entries.push(result.data);
    }
  });

  if (parse) {
    await insertMultipleWeights(entries);
  }
}
