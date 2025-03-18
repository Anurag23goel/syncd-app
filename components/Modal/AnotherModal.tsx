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
import MOMModal from "./MOMModal"; // Import the new MOMModal component
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface AnotherModalProps {
  isVisible: boolean;
  onClose: () => void;
  meetings: string[];
}
const meetings = ["Meeting 1", "Meeting 2", "Meeting 3", "Meeting 4"];

const AnotherModal: React.FC<AnotherModalProps> = ({ isVisible, onClose }) => {
  const [isSecondModalVisible, setSecondModalVisible] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.meetings;

  const handleMeetingPress = () => {
    setSecondModalVisible(true);
    onClose(); // Close the first modal when the second modal appears
  };

  const handleCloseSecondModal = () => {
    setSecondModalVisible(false);
  };

  return (
    <>
      <Modal visible={isVisible} transparent animationType="fade">
        <KeyboardAvoidingView behavior="padding" style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{t.title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.meetingsContainer}>
              {meetings.map((meeting, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.meetingButton}
                  onPress={handleMeetingPress}
                >
                  <Text style={styles.meetingText}>{meeting}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <MOMModal
        isVisible={isSecondModalVisible}
        onClose={handleCloseSecondModal}
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
  meetingsContainer: {
    marginTop: 20,
    width: "100%",
  },
  meetingButton: {
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
  meetingText: {
    fontSize: 15,
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
});

export default AnotherModal;
