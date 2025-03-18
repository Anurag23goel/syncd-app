import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface LanguageModalProps {
  isVisible: boolean;
  onClose: () => void;
  onLanguageSelect: (language: "en" | "hi") => void;
  selectedLanguage: "en" | "hi";
}

const LanguageModal: React.FC<LanguageModalProps> = ({
  isVisible,
  onClose,
  onLanguageSelect,
  selectedLanguage,
}) => {
  const { language } = useLanguageStore();
  const t = translations[language];

  const languages = [
    {
      code: "en",
      label: language === "hi" ? "अंग्रेज़ी" : "English",
    },
    {
      code: "hi",
      label: language === "hi" ? "हिंदी" : "Hindi",
    },
  ];

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.language.modalTitle}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Language Options */}
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageOption,
                selectedLanguage === lang.code && styles.selectedLanguageOption,
              ]}
              onPress={() => onLanguageSelect(lang.code as "en" | "hi")}
            >
              <Text style={styles.languageText}>{lang.label}</Text>
              {selectedLanguage === lang.code && (
                <Feather name="check" size={20} color="#8C8C8C" />
              )}
            </TouchableOpacity>
          ))}

          {/* Confirm Button */}
          <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
            <Text style={styles.confirmButtonText}>{t.language.confirm}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LanguageModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "SFPro-Semibold",
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: "100%",
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedLanguageOption: {
    borderWidth: 1,
  },
  languageText: {
    fontSize: 16,
    fontFamily: "SFPro-Medium",
    color: "#8C8C8C",
  },
  confirmButton: {
    backgroundColor: "#002D62",
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "SFPro-Semibold",
  },
});
