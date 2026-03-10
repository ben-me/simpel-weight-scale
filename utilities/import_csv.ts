import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";

export async function importCSV() {
  try {
    const file = await DocumentPicker.getDocumentAsync();
    if (!file.canceled) {
      const { uri } = file.assets[0];
      return new File(uri);
    }
  } catch (error) {
    console.error(error);
  }
}
