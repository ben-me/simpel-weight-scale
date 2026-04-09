import { getWeights } from "@/db/operations";
import { Paths, File } from "expo-file-system";
import { shareAsync } from "expo-sharing";

export default async function exportCSV() {
  const today = new Date().toISOString().slice(0, 10);
  const data = await getWeights();
  const body = data.map((entry) => [entry.date, entry.weight].join(","));
  const file = new File(Paths.cache, `weight-export-${today}.csv`);
  file.create({ overwrite: true });
  file.write(body.join("\n"));

  try {
    await shareAsync(file.uri, { mimeType: "text/csv" });
  } catch (error) {
    console.error(error);
  }
}
