import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface AttendeeType {
  id: string;
  name: string;
  credentials: string;
  avatar: string;
  isPresent: boolean;
}

export default function Attendance({ onBack }: { onBack: () => void }) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.attendance.report;

  const [attendees, setAttendees] = useState<AttendeeType[]>([
    {
      id: "1",
      name: "Name",
      credentials: "Credentials",
      avatar: "https://i.pravatar.cc/100?img=1",
      isPresent: false,
    },
    {
      id: "2",
      name: "Name",
      credentials: "Credentials",
      avatar: "https://i.pravatar.cc/100?img=2",
      isPresent: false,
    },
    // Add more attendees as needed
  ]);

  const [modalVisible, setModalVisible] = useState(false);

  const toggleAttendance = (id: string) => {
    setAttendees(
      attendees.map((attendee) =>
        attendee.id === id
          ? { ...attendee, isPresent: !attendee.isPresent }
          : attendee
      )
    );
  };

  const submitAttendance = () => {
    setModalVisible(true); // Show modal when checkmark is pressed
  };

  const confirmSubmission = () => {
    setModalVisible(false); // Close modal
    console.log("Submitting attendance:", attendees);
    // Add actual submission logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.title}</Text>
      </View>

      <ScrollView style={styles.content}>
        {attendees.map((attendee) => (
          <TouchableOpacity
            key={attendee.id}
            style={styles.attendeeCard}
            onPress={() => toggleAttendance(attendee.id)}
          >
            <View style={styles.attendeeInfo}>
              <Image source={{ uri: attendee.avatar }} style={styles.avatar} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{attendee.name}</Text>
                <Text style={styles.credentials}>{attendee.credentials}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => toggleAttendance(attendee.id)}>
              {attendee.isPresent ? (
                <AntDesign name="checkcircle" size={20} color="#007BFF" />
              ) : (
                <Feather name="circle" size={20} color="#007BFF" />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {attendees.some((attendee) => attendee.isPresent) && (
        <TouchableOpacity style={styles.fab} onPress={submitAttendance}>
          <Ionicons name="checkmark" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Modal Component */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{t.confirmTitle}</Text>
            <Text style={styles.modalText}>{t.confirmMessage}</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.secondaryButtonText}>{t.reviewAgain}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={confirmSubmission}
              >
                <Text style={styles.primaryButtonText}>{t.confirmUpload}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(16),
  },
  backButton: { marginRight: moderateScale(16) },
  headerTitle: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Bold",
  },
  content: { flex: 1, padding: moderateScale(16) },
  attendeeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(12),
  },
  attendeeInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
  },
  textContainer: { marginLeft: moderateScale(12) },
  name: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Medium",
  },
  credentials: {
    fontSize: moderateScale(12),
    color: "#666",
    marginTop: moderateScale(2),
    fontFamily: "SFPro-Regular",
  },
  checkbox: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(2),
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { backgroundColor: "#007AFF" },
  checkboxInner: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    backgroundColor: "#fff",
  },
  fab: {
    position: "absolute",
    right: moderateScale(16),
    bottom: moderateScale(16),
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: "#002B5B",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(4),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    alignItems: "center",
  },
  modalTitle: {
    fontSize: moderateScale(18),
    color: "#000000",
    marginBottom: moderateScale(10),
    fontFamily: "SFPro-Bold",
  },
  modalText: {
    fontSize: moderateScale(14),
    textAlign: "center",
    marginBottom: moderateScale(20),
    color: "#6B6B6B",
    fontFamily: "SFPro-Regular",
  },
  modalButtonContainer: {
    flexDirection: "column",
    alignItems: "stretch",
    width: "100%",
  },
  secondaryButton: {
    marginBottom: moderateScale(10),
    backgroundColor: "#F2F2F2",
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#1A1A1A",
    fontFamily: "SFPro-Regular",
  },
  primaryButton: {
    backgroundColor: "#27AE60",
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#F2F2F2",
    fontFamily: "SFPro-Semibold",
  },
});
