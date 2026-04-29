import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import CustomModal from "./CustomModal";
import ThemedText from "./ThemedText";
import { useThemeColors } from "@/hooks/useTheme";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import ThemedInput from "./ThemedInput";
import { insertWeight } from "@/db/operations";
import convertWeight from "@/utilities/convert-weight";
import Animated, {
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { useTranslation } from "react-i18next";
import { Entypo } from "@expo/vector-icons";
import Button from "./Button";
import { useDataStore } from "@/store/useDataStore";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AddWeight() {
  const { t } = useTranslation();
  const { unit } = useDataStore();
  const { backgroundLight, primary, text } = useThemeColors();
  const [weight, setWeight] = useState<string>("0");
  const today = new Date();
  const [date, setDate] = useState(today);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { height } = useReanimatedKeyboardAnimation();
  const iconScale = useSharedValue(1);

  async function handleSubmit() {
    const convertedWeight = convertWeight(weight);
    if (!convertWeight) return;
    await insertWeight({
      date: date.toISOString().slice(0, 10),
      weight: convertedWeight,
      unit,
    });
    setModalIsOpen(false);
  }

  const showPicker = () => {
    DateTimePickerAndroid.open({
      mode: "date",
      value: date,
      onChange: (_, selectedDate) => setDate(selectedDate ?? today),
      maximumDate: today,
    });
  };

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: height.get() / 3 }],
  }));

  const scale = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.get() }],
  }));

  function handlePress() {
    iconScale.set(() =>
      withSequence(withTiming(0.7, { duration: 175 }), withTiming(1, { duration: 175 })),
    );
    setModalIsOpen(true);
  }

  function handleCancel() {
    setWeight("0");
    setDate(today);
    setModalIsOpen(false);
  }

  return (
    <>
      <AnimatedPressable
        style={[scale, { padding: 8, borderRadius: "100%" }]}
        onPressIn={handlePress}
      >
        <Entypo name="circle-with-plus" size={24} color="white" />
      </AnimatedPressable>
      <CustomModal
        onRequestClose={() => setModalIsOpen(false)}
        visible={modalIsOpen}
        onBackdropPress={() => setModalIsOpen(false)}
      >
        <Animated.View
          exiting={FadeOut.duration(150)}
          style={[styles.wrapper, translateY, { flex: 1 }]}
        >
          <Pressable style={[styles.content, { backgroundColor: backgroundLight }]}>
            <ThemedText style={styles.headline}>{t("newEntry")}</ThemedText>
            <Pressable style={styles.entryRow} onPress={showPicker}>
              <ThemedText style={styles.overline}>{t("date")}:</ThemedText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <ThemedText style={styles.date}>{date.toLocaleDateString()}</ThemedText>
                <Entypo name="chevron-down" size={22} color={text} />
              </View>
            </Pressable>
            <Pressable style={styles.entryRow}>
              <ThemedText style={styles.overline}>{t("weight")}:</ThemedText>
              <ThemedInput
                keyboardType="number-pad"
                value={weight ?? "-"}
                maxLength={6}
                onChangeText={setWeight}
                style={styles.weight}
              />
            </Pressable>
            <View style={styles.controls}>
              <Button style={styles.button} onPress={handleCancel}>
                <ThemedText>{t("cancel")}</ThemedText>
              </Button>
              <Button style={[styles.button, { backgroundColor: primary }]} onPress={handleSubmit}>
                <ThemedText style={{ color: "white" }}>{t("save")}</ThemedText>
              </Button>
            </View>
          </Pressable>
        </Animated.View>
      </CustomModal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    zIndex: 2,
    padding: 20,
    gap: 16,
    width: "80%",
    borderRadius: 5,
    alignItems: "center",
  },
  headline: {
    fontSize: 18,
    lineHeight: 20,
    opacity: 0.7,
  },
  overline: {
    textAlign: "center",
    fontSize: 18,
  },
  entryRow: {
    alignItems: "center",
  },
  date: {
    textAlign: "center",
    fontSize: 24,
    marginBlockStart: 4,
  },
  weight: {
    fontSize: 24,
    lineHeight: 26,
    maxHeight: 26,
    marginBlock: 4,
    width: 80,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 5,
    marginBlockStart: 12,
  },
  button: {
    borderRadius: 5,
    paddingBlock: 10,
    paddingInline: 18,
    fontSize: 18,
  },
});
