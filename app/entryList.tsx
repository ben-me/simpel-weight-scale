import { WeightListItem } from "@/components/WeightListItem";
import { useThemeColors } from "@/hooks/useTheme";
import { useDataStore } from "@/store/useDataStore";
import { FlatList, StyleSheet, View } from "react-native";

export default function EntryList() {
  const { weights, anchorDay } = useDataStore();
  const { backgroundColor } = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor, flex: 1 }]}>
      <FlatList
        data={weights}
        renderItem={({ item }) => <WeightListItem anchorDay={anchorDay} {...item} />}
        keyExtractor={(item) => item.date}
        initialNumToRender={25}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    padding: 8,
    borderStyle: "solid",
    gap: 12,
  },
});
