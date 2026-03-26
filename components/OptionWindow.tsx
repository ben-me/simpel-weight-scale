import { BackHandler, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut, Keyframe } from "react-native-reanimated";
import ThemedText from "./ThemedText";
import { useMenuStore } from "@/store/menu";
import { useEffect, useState } from "react";
import CustomModal from "./CustomModal";
import Button from "./Button";
import { importCSV } from "@/utilities/import_csv";
import { useThemeColors } from "@/hooks/useTheme";
import exportCSV from "@/utilities/export";
import { useTranslation } from "react-i18next";

export default function OptionWindow() {
  const { t } = useTranslation();
  const { menuShown, closeMenu } = useMenuStore();
  const { backgroundLight, borderColor } = useThemeColors();
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
          entering={customFadeIn.duration(100)}
          exiting={customFadeOut.duration(100)}
          style={[styles.settingsMenu, { backgroundColor: backgroundLight, borderColor }]}
        >
          <ThemedText
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: borderColor,
              borderStyle: "solid",
              fontSize: 19,
              lineHeight: 20,
            }}
            onPress={() => {
              closeMenu();
              setShowConfirmModal(true);
            }}
          >
            {t("import")}
          </ThemedText>
          <ThemedText
            style={{
              padding: 16,
              fontSize: 19,
              lineHeight: 20,
            }}
            onPress={exportCSV}
          >
            {t("export")}
          </ThemedText>
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
          <ThemedText style={{ fontSize: 24, lineHeight: 25, fontWeight: "bold", marginBottom: 4 }}>
            {t("importWindow.confirm")}
          </ThemedText>
          <ThemedText>{t("importWindow.explanation1")}</ThemedText>
          <ThemedText style={{ fontSize: 18, lineHeight: 19, marginTop: 12, fontWeight: "bold" }}>
            {t("importWindow.example")}:
          </ThemedText>

          <View style={{ gap: 5 }}>
            <View style={{ flexDirection: "row" }}>
              <ThemedText style={{ flex: 1 }}>{t("importWindow.col1.header")}</ThemedText>
              <ThemedText style={{ flex: 1 }}>{t("importWindow.col2.header")}</ThemedText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <ThemedText style={{ flex: 1 }}>{t("importWindow.col1.row1")}</ThemedText>
              <ThemedText style={{ flex: 1 }}>{t("importWindow.col2.row1")}</ThemedText>
            </View>
          </View>
          <ThemedText
            style={{
              fontSize: 20,
              lineHeight: 21,
              fontWeight: "bold",
              marginTop: 12,
              textDecorationLine: "underline",
            }}
          >
            {t("importWindow.important")}:
          </ThemedText>
          <ThemedText>{t("importWindow.explanation3")}</ThemedText>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            <Button
              style={[styles.button, styles.cancel]}
              onPress={() => setShowConfirmModal(false)}
            >
              <ThemedText>{t("cancel")}</ThemedText>
            </Button>
            <Button style={[styles.button, styles.continue]} onPress={handleImport}>
              <ThemedText>{t("continue")}</ThemedText>
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
  modalText: {
    padding: 18,
    marginInline: 40,
    borderRadius: 6,
    gap: 8,
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
