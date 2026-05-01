import { useEffect } from "react";
import { AppState, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { calculateAverageWeight, getLoggedDays } from "@/utilities/calculate-average-weight";

import { checkAndInsertToday } from "@/utilities/check_and_insert_today";
import Overview from "@/components/Overview";
import { useThemeColors } from "@/hooks/useTheme";
import { MainDisplay } from "@/components/MainDisplay";
import { WeightListItem } from "@/components/WeightListItem";
import ThemedText from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import { Link } from "expo-router";
import { useDataStore } from "@/store/useDataStore";

export default function Index() {
  const { t } = useTranslation();
  const { backgroundColor, backgroundLight, borderColor } = useThemeColors();
  const { weights: data, anchorDay, setAnchorDay } = useDataStore();
  const loggedDays = getLoggedDays(data);
  const { current_average_weight, previous_average_weight } = calculateAverageWeight(
    anchorDay,
    data,
  );
  let weightDifference: number | undefined;

  useEffect(() => {
    checkAndInsertToday();

    const subscribeToAppState = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkAndInsertToday();
      }
    });

    return () => {
      subscribeToAppState.remove();
    };
  }, []);

  if (previous_average_weight && current_average_weight) {
    weightDifference = Number((current_average_weight - previous_average_weight).toFixed(2));
  }

  return (
    <ScrollView
      style={{ backgroundColor, borderTopColor: borderColor }}
      contentContainerStyle={styles.container}
    >
      <MainDisplay
        anchorDay={anchorDay}
        daysLogged={loggedDays}
        currentWeight={current_average_weight}
      />
      <Overview
        anchorDay={anchorDay}
        setAnchorDay={setAnchorDay}
        previousAverage={previous_average_weight}
        difference={weightDifference}
      />
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 8, paddingBottom: 4 }}>
          <ThemedText>{t("loggedWeights")}</ThemedText>

          <Link href={"/entryList"} asChild>
            <Pressable>
              <ThemedText style={{ color: "#0969da" }}>{t("seeFullList")}</ThemedText>
            </Pressable>
          </Link>
        </View>
        <View style={{ borderRadius: 6, backgroundColor: backgroundLight }}>
          {data.slice(0, 14).map((entry) => {
            return <WeightListItem key={entry.date} {...entry} anchorDay={anchorDay} />;
          })}
        </View>
      </View>
    </ScrollView>
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
