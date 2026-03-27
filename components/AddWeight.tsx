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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AddWeight() {
  const { t } = useTranslation();
  const { backgroundLight } = useThemeColors();
  const [weight, setWeight] = useState<string>("0");
  const [date, setDate] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { height } = useReanimatedKeyboardAnimation();
  const iconScale = useSharedValue(1);

  async function handleSubmit() {
    const convertedWeight = convertWeight(weight);
    if (!convertWeight) return;
    await insertWeight({
      date: date.toISOString().slice(0, 10),
      weight: convertedWeight,
      unit: "KG",
    });
    setModalIsOpen(false);
  }

  const showPicker = () => {
    DateTimePickerAndroid.open({
      mode: "date",
      value: date,
      onChange: (_, selectedDate) => setDate(selectedDate!),
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
            <Pressable onPress={showPicker}>
              <ThemedText style={styles.overline}>{t("date")}:</ThemedText>
              <ThemedText style={styles.date}>{date.toLocaleDateString()}</ThemedText>
            </Pressable>
            <Pressable style={{ alignItems: "center", gap: 5 }}>
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
              <Pressable>
                <ThemedText style={styles.button}>{t("cancel")}</ThemedText>
              </Pressable>
              <Pressable>
                <ThemedText style={[styles.saveButton, styles.button]} onPress={handleSubmit}>
                  {t("save")}
                </ThemedText>
              </Pressable>
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
    gap: 20,
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
    fontSize: 24,
    lineHeight: 25,
  },
  date: {
    textAlign: "center",
    fontSize: 32,
    lineHeight: 33,
    fontWeight: "bold",
    marginBlockStart: 8,
  },
  weight: {
    lineHeight: 33,
    fontSize: 32,
    maxHeight: 33,
    fontWeight: "bold",
    marginBlock: 8,
    width: 100,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 5,
  },
  button: {
    borderRadius: 5,
    paddingBlock: 12,
    paddingInline: 12,
  },
  saveButton: {
    backgroundColor: "dodgerblue",
    color: "white",
  },
});
