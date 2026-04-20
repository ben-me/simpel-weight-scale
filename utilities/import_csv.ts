import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { Entry } from "./validation_schemas";
import { insertMultipleWeights } from "@/db/operations";
import { WeightTableEntry } from "@/db/schema";

export async function importCSV() {
  const picker = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: false,
    type: ["text/csv", "text/comma-separated-values"],
  });
  if (picker.canceled) {
    return;
  }

  const { uri } = picker.assets[0];
  const textContent = new File(uri)
    .textSync()
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  const entries: WeightTableEntry[] = [];
  const parse = textContent.map((entry, i) => {
    const [date, weight, unit] = entry.split(",");

    const result = Entry.safeParse({ date, weight: Number(weight), unit });
    if (!result.success) {
      console.error(`Line ${i + 1}: failed`, { date, weight }, result.error.issues);
    } else {
      entries.push(result.data);
    }
  });

  if (parse) {
    try {
      await insertMultipleWeights(entries);
    } catch (error) {
      console.log(error);
    }
  }
}
