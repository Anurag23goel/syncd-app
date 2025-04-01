import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Feather, EvilIcons, FontAwesome6, Entypo } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { CREATE_MEETING } from "@/services/meetings";
import { useAuthStore } from "@/store/authStore";
import { MEETING_PAYLOAD } from "@/types/NewApiTypes";

interface MeetingModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface MeetingModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const MeetingModal: React.FC<MeetingModalProps> = ({ isVisible, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [entireTeam, setEntireTeam] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [newPerson, setNewPerson] = useState("");

  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.createMeeting;

  const authToken = useAuthStore((state) => state.token);
  const currentUserId = useAuthStore((state) => state.user?.UserID);

  const handleAddPerson = () => {
    if (newPerson.trim() !== "") {
      setSelectedPeople((prev) => [...prev, newPerson.trim()]);
      setNewPerson("");
    }
  };

  const handleRemovePerson = (index: number) => {
    setSelectedPeople((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate)
      setDate((prev) => {
        const time = prev ? new Date(prev) : new Date();
        return new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          time.getHours(),
          time.getMinutes()
        );
      });
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime)
      setDate((prev) => {
        const base = prev || new Date();
        return new Date(
          base.getFullYear(),
          base.getMonth(),
          base.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes()
        );
      });
  };

  const handleCreateMeeting = async () => {
    if (
      !title ||
      !date ||
      !selectedPlatform ||
      (!entireTeam && selectedPeople.length === 0)
    ) {
      Alert.alert("Missing Fields", "Please fill all required fields.");
      return;
    }

    const payload: MEETING_PAYLOAD = {
      Title: title,
      Description: description,
      Date: date.toISOString().split("T")[0],
      StartTime: date.toISOString(),
      EndTime: new Date(date.getTime() + 90 * 60000).toISOString(),
      MeetingType: "VIRTUAL",
      MeetingPlatform:
        selectedPlatform === "zoom"
          ? "ZOOM"
          : selectedPlatform === "meet"
          ? "GMEET"
          : selectedPlatform === "ms"
          ? "MS_TEAMS"
          : "OTHER",
      MeetingLink: meetingLink,
      Location: meetingLocation,
      Participants: selectedPeople,
      TeamIDs: entireTeam ? ["team-g2pc66t8m8b1f60h"] : [],
      CreatedBy: currentUserId,
      UpdatedAt: new Date().toISOString(),
      CreatedAt: new Date().toISOString(),
    };

    try {
      if (!authToken) {
        return;
      }
      const response = await CREATE_MEETING(payload, authToken);
      Alert.alert("Success", "Meeting created successfully!");
      onClose();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong.");
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <Text style={styles.modalTitle}>{t.title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color="#8C8C8C" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder={t.enterTitle}
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#8C8C8C"
            />

            <TextInput
              style={styles.input}
              placeholder="Add description (max 100 characters)"
              value={description}
              onChangeText={setDescription}
              maxLength={100}
              placeholderTextColor="#8C8C8C"
            />

            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {date ? date.toLocaleDateString() : "Date"}
                </Text>
                <Feather name="calendar" size={20} color="#8C8C8C" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {date
                    ? date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Time"}
                </Text>
                <Feather name="clock" size={20} color="#8C8C8C" />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                onChange={handleDateChange}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="time"
                onChange={handleTimeChange}
              />
            )}

            <View style={styles.addPeopleContainer}>
              <View style={styles.addPeopleLeft}>
                <EvilIcons name="spinner" size={24} color="#8C8C8C" />
                <Text style={styles.addPeopleText}>Entire project</Text>
              </View>
              <TouchableOpacity onPress={() => setEntireTeam(!entireTeam)}>
                {entireTeam ? (
                  <FontAwesome6 name="check-circle" size={20} color="#007BFF" />
                ) : (
                  <Entypo name="circle" size={20} color="#007BFF" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.addPeopleContainer}>
              <View style={styles.addPeopleLeft}>
                <Feather name="users" size={20} color="#8C8C8C" />
                <TextInput
                  placeholder="Add People"
                  value={newPerson}
                  onChangeText={setNewPerson}
                  placeholderTextColor="#8C8C8C"
                  style={styles.addPeopleInput}
                  onSubmitEditing={handleAddPerson}
                />
              </View>
              <TouchableOpacity onPress={handleAddPerson}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.selectedPeopleContainer}>
              {selectedPeople.map((person, index) => (
                <View key={index} style={styles.personTag}>
                  <Text style={styles.personText}>{person}</Text>
                  <TouchableOpacity onPress={() => handleRemovePerson(index)}>
                    <Feather name="x" size={16} color="#B5B5B5" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.linkContainer}>
              <TextInput
                style={styles.linkInput}
                placeholder="Enter meeting link"
                value={meetingLink}
                onChangeText={setMeetingLink}
                placeholderTextColor="#8C8C8C"
              />
              <Feather name="link-2" size={24} color="#6B6B6B" />
            </View>

            <View style={styles.platformIcons}>
              {["zoom", "meet", "ms", "users"].map((platform) => (
                <TouchableOpacity
                  key={platform}
                  style={[
                    styles.platformOption,
                    selectedPlatform === platform
                      ? styles.selected
                      : styles.notSelected,
                  ]}
                  onPress={() => setSelectedPlatform(platform)}
                >
                  {platform === "users" ? (
                    <Feather
                      name="users"
                      size={24}
                      color={selectedPlatform === "users" ? "#FFF" : "#6B6B6B"}
                    />
                  ) : (
                    <Image
                      source={
                        platform === "zoom"
                          ? require("../../assets/images/assets/zoom.png")
                          : platform === "meet"
                          ? require("../../assets/images/assets/meet.png")
                          : require("../../assets/images/assets/ms.png")
                      }
                      style={styles.platformIcon}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.linkContainer}>
              <TextInput
                style={styles.linkInput}
                placeholder="Meeting Location"
                value={meetingLocation}
                onChangeText={setMeetingLocation}
                placeholderTextColor="#8C8C8C"
              />
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateMeeting}
            >
              <Text style={styles.createButtonText}>Create meeting</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: "SFPro-Semibold",
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 15,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    marginRight: 10,
    fontFamily: "SFPro-Regular",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    fontFamily: "SFPro-Regular",
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateTimeText: {
    fontSize: 15,
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
  addPeopleContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    height: 45,
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  addPeopleLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
  },
  addPeopleInput: {
    marginLeft: 10,
    flex: 1,
  },
  addPeopleText: {
    fontSize: 15,
    fontFamily: "SFPro-Regular",
    color: "#8C8C8C",
  },
  addButtonText: {
    color: "#007AFF",
    fontSize: 15,
    fontFamily: "SFPro-Regular",
  },
  selectedPeopleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  personTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  personText: {
    marginRight: 5,
    fontSize: 12,
    fontFamily: "SFPro-Medium",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 20,
  },
  linkInput: {
    flex: 1,
    fontSize: 15,
  },
  platformIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  platformOption: {
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    backgroundColor: "#002D62",
  },
  notSelected: {
    backgroundColor: "#F7F7F7",
  },
  platformIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  createButton: {
    backgroundColor: "#002D62",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "SFPro-Semibold",
  },
});

export default MeetingModal;
