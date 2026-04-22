import { BackHandler, Pressable, PressableProps, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  Keyframe,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import ThemedText from "./ThemedText";
import { useMenuStore } from "@/store/useMenuStore";
import { useEffect, useState } from "react";
import CustomModal from "./CustomModal";
import Button from "./Button";
import { importCSV } from "@/utilities/import_csv";
import { useThemeColors } from "@/hooks/useTheme";
import exportCSV from "@/utilities/export";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

function OptionEntry({ children, ...rest }: PressableProps) {
  const { backgroundLight, backgroundColor } = useThemeColors();
  const settingEntryBackground = useSharedValue(backgroundLight);

  const animatedBackground = useAnimatedStyle(() => ({
    backgroundColor: settingEntryBackground.get(),
  }));

  return (
    <Animated.View style={animatedBackground}>
      <Pressable
        style={[styles.settingsButton]}
        {...rest}
        onPressIn={() => {
          settingEntryBackground.set(
            withSequence(
              withTiming(backgroundColor, { duration: 150 }),
              withTiming(backgroundLight, { duration: 150 }),
            ),
          );
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function OptionWindow() {
  const { t } = useTranslation();
  const router = useRouter();
  const { menuShown, closeMenu } = useMenuStore();
  const { backgroundLight, borderColor, primary } = useThemeColors();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (menuShown) {
      const backhandler = BackHandler.addEventListener("hardwareBackPress", () => {
        closeMenu();
        return true;
      });

      return () => backhandler.remove();
    }
  }, [menuShown, closeMenu]);

  async function handleImport() {
    setShowConfirmModal(false);
    await importCSV();
  }

  if (menuShown) {
    return (
      <Pressable
        style={{
          position: "absolute",
          inset: 0,
        }}
        onPress={closeMenu}
      >
        <Animated.View
          entering={customFadeIn.duration(200)}
          exiting={customFadeOut.duration(200)}
          style={[styles.settingsMenu, { backgroundColor: backgroundLight, borderColor }]}
        >
          <OptionEntry
            onPress={() => {
              closeMenu();
              setShowConfirmModal(true);
            }}
          >
            <ThemedText style={{ fontSize: 19, lineHeight: 22 }}>{t("import")}</ThemedText>
          </OptionEntry>
          <OptionEntry
            onPress={() => {
              exportCSV();
              closeMenu();
            }}
          >
            <ThemedText style={{ fontSize: 19, lineHeight: 22 }}>{t("export")}</ThemedText>
          </OptionEntry>
          <OptionEntry
            onPress={() => {
              router.navigate("/settings");
              closeMenu();
            }}
          >
            <ThemedText style={{ fontSize: 19, lineHeight: 22 }}>{t("settings")}</ThemedText>
          </OptionEntry>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <CustomModal
      visible={showConfirmModal}
      onBackdropPress={() => setShowConfirmModal(false)}
      onRequestClose={() => setShowConfirmModal(false)}
    >
      <Animated.View
        style={styles.modalView}
        entering={FadeIn.duration(150)}
        exiting={FadeOut.duration(150)}
      >
        <View style={[styles.modalText, { backgroundColor: backgroundLight }]}>
          <View>
            <ThemedText
              style={{ fontSize: 24, lineHeight: 25, fontWeight: "bold", marginBottom: 4 }}
            >
              {t("importWindow.confirm")}
            </ThemedText>
            <ThemedText>{t("importWindow.explanation1")}</ThemedText>
          </View>

          <View>
            <ThemedText
              style={{ fontSize: 18, lineHeight: 19, fontWeight: "bold", marginBottom: 4 }}
            >
              {t("importWindow.example")}:
            </ThemedText>
            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: "row" }}>
                <ThemedText style={styles.tableCell}>{t("importWindow.col1.header")}</ThemedText>
                <ThemedText style={styles.tableCell}>{t("importWindow.col2.header")}</ThemedText>
                <ThemedText style={styles.tableCell}>{t("importWindow.col3.header")}</ThemedText>
              </View>
              <View style={{ flexDirection: "row" }}>
                <ThemedText style={styles.tableCell}>{t("importWindow.col1.row1")}</ThemedText>
                <ThemedText style={styles.tableCell}>{t("importWindow.col2.row1")}</ThemedText>
                <ThemedText style={styles.tableCell}>{t("importWindow.col3.row1")}</ThemedText>
              </View>
            </View>
          </View>
          <View>
            <ThemedText
              style={{
                fontSize: 20,
                lineHeight: 21,
                fontWeight: "bold",
                textDecorationLine: "underline",
                marginBottom: 4,
              }}
            >
              {t("importWindow.important")}:
            </ThemedText>
            <ThemedText>{t("importWindow.explanation3")}</ThemedText>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Button
              style={[styles.button, styles.cancel]}
              onPress={() => setShowConfirmModal(false)}
            >
              <ThemedText>{t("cancel")}</ThemedText>
            </Button>
            <Button style={[styles.button, { backgroundColor: primary }]} onPress={handleImport}>
              <ThemedText style={{ color: "white" }}>{t("continue")}</ThemedText>
            </Button>
          </View>
        </View>
      </Animated.View>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsMenu: {
    transformOrigin: "top right",
    position: "absolute",
    top: 80,
    right: 24,
    backgroundColor: "grey",
    zIndex: 2,
    borderRadius: 5,
    borderWidth: 1,
  },
  settingsButton: {
    padding: 16,
  },
  modalText: {
    padding: 24,
    marginInline: 40,
    borderRadius: 6,
    gap: 32,
  },
  tableCell: {
    flex: 1,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  continue: {
    backgroundColor: "dodgerblue",
    borderColor: "dodgerblue",
    borderWidth: 1,
  },
  cancel: {
    borderColor: "white",
  },
});

const customFadeIn = new Keyframe({
  0: {
    transform: [{ scaleY: 0 }, { scaleX: 0 }],
    opacity: 0,
  },
  100: {
    transform: [{ scaleY: 1 }, { scaleX: 1 }],
    opacity: 1,
  },
});

const customFadeOut = new Keyframe({
  0: {
    transform: [{ scaleY: 1 }, { scaleX: 1 }],
    opacity: 1,
  },
  100: {
    transform: [{ scaleY: 0 }, { scaleX: 0 }],
    opacity: 0,
  },
});
