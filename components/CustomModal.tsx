import { Modal, ModalProps, Pressable, StyleSheet } from "react-native";

type Props = {
  onBackdropPress?: () => void;
} & ModalProps;

export default function CustomModal({ children, onBackdropPress, ...rest }: Props) {
  return (
    <Modal animationType="fade" backdropColor="transparent" {...rest}>
      <Pressable style={styles.backdrop} onPress={onBackdropPress}>
        {children}
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
});
