import { BackHandler, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut, Keyframe } from "react-native-reanimated";
import ThemedText from "./ThemedText";
import { useMenuStore } from "@/store/menu";
import { useEffect, useState } from "react";
import CustomModal from "./CustomModal";
import Button from "./Button";
import { importCSV } from "@/utilities/import_csv";
import { useThemeColors } from "@/hooks/useTheme";

export default function OptionWindow() {
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
  }, [menuShown]);

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
            style={{ fontSize: 19, lineHeight: 20 }}
            onPress={() => {
              closeMenu();
              setShowConfirmModal(true);
            }}
          >
            Importieren
          </ThemedText>
          <ThemedText style={{ fontSize: 19, lineHeight: 20 }}>Exportieren</ThemedText>
        </Animated.View>
      </Pressable>
    );
  }

  if (showConfirmModal) {
    return (
      <CustomModal
        onBackdropPress={() => setShowConfirmModal(false)}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <Animated.View
          style={styles.modalView}
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
        >
          <View style={[styles.modalText, { backgroundColor: backgroundLight }]}>
            <ThemedText
              style={{ fontSize: 24, lineHeight: 25, fontWeight: "bold", marginBottom: 4 }}
            >
              Import bestätigen
            </ThemedText>
            <ThemedText>Daten können nur über eine CSV-Datei (Excel) importiert werden.</ThemedText>
            <ThemedText style={{ fontSize: 18, lineHeight: 19, marginTop: 12, fontWeight: "bold" }}>
              Beispiel:
            </ThemedText>

            <ThemedText>Spalte A (Datum) - "2025-12-31"</ThemedText>
            <ThemedText>Spalte B (Gewicht) - "80.0"</ThemedText>
            <ThemedText
              style={{
                fontSize: 20,
                lineHeight: 21,
                fontWeight: "bold",
                marginTop: 12,
                textDecorationLine: "underline",
              }}
            >
              Wichtig:
            </ThemedText>
            <ThemedText>Bestehende Daten werden beim Import gelöscht.</ThemedText>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
              <Button
                style={[styles.button, styles.cancel]}
                onPress={() => setShowConfirmModal(false)}
              >
                <ThemedText>Abbrechen</ThemedText>
              </Button>
              <Button style={[styles.button, styles.continue]} onPress={handleImport}>
                <ThemedText>Fortfahren</ThemedText>
              </Button>
            </View>
          </View>
        </Animated.View>
      </CustomModal>
    );
  }
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    gap: 32,
  },
  modalText: {
    padding: 18,
    marginInline: 40,
    borderRadius: 6,
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
