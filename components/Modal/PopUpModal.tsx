import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TextInput,
} from "react-native";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const { width } = Dimensions.get("window");

interface PopUpModalProps {
  isVisible: boolean;
  onClose: () => void;
  onActionPress: (action: string) => void;
}

const PopUpModal: React.FC<PopUpModalProps> = ({
  isVisible,
  onClose,
  onActionPress,
}) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].inventory.resourceDetails;

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onActionPress(t.addUsage)}
          >
            <Text style={styles.actionText}>{t.addUsage}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onActionPress(t.addDamaged)}
          >
            <Text style={styles.actionText}>{t.addDamaged}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onActionPress(t.editResource)}
          >
            <Text style={styles.actionText}>{t.editResource}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  actionButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  actionText: {
    fontSize: 16,
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
});

export default PopUpModal;
