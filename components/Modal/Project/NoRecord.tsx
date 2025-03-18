import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface NoRecordsModalProps {
  name?: string;
  date?: string;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

export default function NoRecordsModal({
  name = "",
  date = "",
  modalVisible,
  setModalVisible,
}: NoRecordsModalProps) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.noRecord;

  return (
    <View style={styles.container}>
      {/* Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.subtitle}>
              {t.subtitle.replace("{name}", name).replace("{date}", date)}
            </Text>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.continueButtonText}>{t.continue}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#000",
    marginBottom: moderateScale(10),
    textAlign: "center",
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: "#666",
    textAlign: "center",
    marginBottom: moderateScale(20),
  },
  continueButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(24),
    width: "100%",
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: moderateScale(16),
    color: "#A1A1A1",
  },
});
