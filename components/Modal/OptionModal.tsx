import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AnotherModal from "./AnotherModal"; // Import the new modal
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface OptionModalProps {
  isVisible: boolean;
  onClose: () => void;
  options: string[]; // Accepts an array of options as strings
  onOptionSelect: (option: string) => void; // Callback to handle selected option
}

const OptionModal: React.FC<OptionModalProps> = ({
  isVisible,
  onClose,
  options,
  onOptionSelect,
}) => {
  const [isAnotherModalVisible, setAnotherModalVisible] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs.optionModal;

  const handleOptionSelect = (option: string) => {
    onOptionSelect(option);
    setAnotherModalVisible(true); // Open the new modal
  };

  // Map the option index to the corresponding translation
  const getTranslatedOption = (index: number) => {
    const optionKey = `option${index + 1}` as keyof typeof t.options;
    return t.options[optionKey];
  };

  return (
    <>
      <Modal visible={isVisible} transparent animationType="fade">
        <KeyboardAvoidingView behavior="padding" style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{t.createReminder}</Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Render dynamic options */}
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleOptionSelect(option)}
              >
                <Text style={styles.optionText}>
                  {getTranslatedOption(index)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <AnotherModal
        meetings={["Meeting 1", "Meeting 2", "Meeting 3", "Meeting 4"]}
        isVisible={isAnotherModalVisible}
        onClose={() => setAnotherModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "SFPro-Bold",
  },
  optionButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  optionText: {
    fontSize: 15,
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
});

export default OptionModal;
