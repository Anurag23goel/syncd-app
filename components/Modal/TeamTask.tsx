import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import {
  AntDesign,
  Feather,
  Ionicons,
  EvilIcons,
  FontAwesome6,
  Entypo,
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import {createTeamTask} from "@/services/task/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreateTeamTaskPayload, Priority } from "@/types/Apitypes";
import { useAuthStore } from "@/store/authStore";
import { ProjectDetailsResponse, SingleProjectDetails } from "@/types/Apitypes";
import { getTeamsByProjectId } from "@/services/meetings/search";

interface TaskModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isVisible, onClose }) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].teamTask;

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedPriority, setSelectedPriority] = useState<string>(
    t.highPriority
  );
  const [attachments, setAttachments] = useState<
    { name: string; category: string }[]
  >([]);
  const [newAttachment, setNewAttachment] = useState<string>(""); // For displaying the selected file name in input
  const [entireTeam, setEntireTeam] = useState(false);
  const [creatorNotes, setCreatorNotes] = useState<string>("");
  const [selectedPeople, setSelectedPeople] = useState([
    "Person 1",
    "Person 2",
  ]);
  const [newPerson, setNewPerson] = useState("");

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  const handleOpenFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();

      if (!result.canceled && result.assets?.length) {
        const file = result.assets[0]; // Access the first file picked
        const { name, mimeType } = file;

        setNewAttachment(name); // Show the file name in the input field
        console.log("Selected File:", { name, mimeType });
      } else {
        console.log("File picker was canceled.");
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Something went wrong while picking the file.");
    }
  };

  const handleOpenImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length) {
        const file = result.assets[0]; // Access the first image picked
        const { uri, type } = file;

        setNewAttachment(uri); // Show the image URI in the input field
        console.log("Selected Image:", { uri, type });
      } else {
        console.log("Image picker was canceled.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Something went wrong while picking the image.");
    }
  };

  const handleAddAttachment = () => {
    if (!newAttachment.trim()) return; // Do nothing if the input is empty

    let category = "File"; // Default category

    if (
      newAttachment.endsWith(".jpg") ||
      newAttachment.endsWith(".jpeg") ||
      newAttachment.endsWith(".png")
    ) {
      category = "Image";
    } else if (
      newAttachment.endsWith(".mp4") ||
      newAttachment.endsWith(".avi")
    ) {
      category = "Video";
    } else if (
      newAttachment.endsWith(".mp3") ||
      newAttachment.endsWith(".wav")
    ) {
      category = "Audio";
    }

    setAttachments((prev) => [...prev, { name: newAttachment, category }]); // Add to attachments
    setNewAttachment(""); // Clear the input
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPerson = () => {
    if (newPerson.trim() !== "") {
      setSelectedPeople((prev) => [...prev, newPerson.trim()]);
      setNewPerson("");
    }
  };

  const handleRemovePerson = (index: number) => {
    setSelectedPeople((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateTask = async () => {
    if (!title || !description || !projectName || !selectedPriority) {
      Alert.alert("Error", "All required fields must be filled!");
      return;
    }
    // Get user ID from storage
    const userId = await AsyncStorage.getItem('userId') || "default-user";
    const projectId = useAuthStore.getState().projectID;
    if (!projectId) {
      Alert.alert("Error", "No project ID found.");
      return;
    }
    
    const teamTaskData: CreateTeamTaskPayload = {
      Title: title,
      Description: description,
      StartDate: startDate ? startDate.toISOString().split("T")[0] : "",
      EndDate: endDate ? endDate.toISOString().split("T")[0] : "",
      Priority: selectedPriority, // Add this
      ProjectID: projectId,
      CreatorNotes: creatorNotes || "",
      AssignmentType: "USER", // Default to USER as per your example
      AssignedUserID: userId || undefined,
    };
    
    try {
      console.log("Sending team task data:", teamTaskData);
      const response = await createTeamTask(teamTaskData);
      console.log("Team task created successfully:", response);
      Alert.alert("Success", "Team task created successfully!");
      onClose(); // Close modal after success
    } catch (error: any) {
      console.error("Error creating team task:", error);
      Alert.alert("Error", error.message || "Failed to create task.");
    }
  };





  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <KeyboardAvoidingView behavior="padding" style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.createTeamTask}</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width: "100%" }}
          >
            <TextInput
              style={styles.input}
              placeholder={t.taskTitle}
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#8C8C8C"
            />

            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder={t.projectName}
              value={projectName}
              onChangeText={setProjectName}
              placeholderTextColor="#8C8C8C"
            />

            <TextInput
              style={[styles.input, { marginBottom: 10, marginTop: 10 }]}
              placeholder={t.description}
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#8C8C8C"
              maxLength={120}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {startDate ? formatDate(startDate) : t.startDate}
                </Text>
                <Feather name="calendar" size={20} color="gray" />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  onChange={handleStartDateChange}
                />
              )}

              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {endDate ? formatDate(endDate) : t.endDate}
                </Text>
                <Feather name="calendar" size={20} color="gray" />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  onChange={handleEndDateChange}
                />
              )}
            </View>

            <View style={styles.addPeopleContainer}>
              <View style={styles.addPeopleLeft}>
                <EvilIcons name="spinner" size={24} color="#8C8C8C" />
                <Text style={styles.addPeopleText}>{t.entireProject}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setEntireTeam(!entireTeam)}
                style={{ position: "absolute", right: 10 }}
              >
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
                  placeholder={t.assignees}
                  value={newPerson}
                  onChangeText={setNewPerson}
                  placeholderTextColor="#8C8C8C"
                  style={styles.addPeopleInput}
                />
              </View>
              <TouchableOpacity onPress={handleAddPerson}>
                <Text style={styles.addButtonText}>{t.add}</Text>
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

            <View style={styles.addPeopleContainer}>
              <View style={styles.addPeopleLeft}>
                <Feather name="file" size={20} color="#8C8C8C" />
                <TextInput
                  placeholder={t.addAttachment}
                  value={newAttachment}
                  onChangeText={setNewAttachment}
                  placeholderTextColor="#8C8C8C"
                  style={styles.addPeopleInput}
                />
              </View>
              <TouchableOpacity onPress={handleOpenFilePicker}>
                <Text style={styles.addButtonText}>{t.file}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.addPeopleContainer}>
              <View style={styles.addPeopleLeft}>
                <Feather name="camera" size={20} color="#8C8C8C" />
                <TextInput
                  placeholder={t.addPhoto}
                  value={newAttachment}
                  onChangeText={setNewAttachment}
                  placeholderTextColor="#8C8C8C"
                  style={styles.addPeopleInput}
                />
              </View>
              <TouchableOpacity onPress={handleOpenImagePicker}>
                <Text style={styles.addButtonText}>{t.photo}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.priorityContainer}>
              {[t.highPriority, t.mediumPriority, t.lowPriority].map(
                (priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      selectedPriority === priority &&
                        styles.priorityButtonSelected,
                    ]}
                    onPress={() => setSelectedPriority(priority)}
                  >
                    <Text
                      style={[
                        styles.priorityButtonText,
                        selectedPriority === priority &&
                          styles.priorityButtonTextSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {priority}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateTask}
            >
              <Text style={styles.createButtonText}>{t.createTask}</Text>
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
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontFamily: "SFPro-Bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    fontFamily: "SFPro-Regular",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    justifyContent: "space-between",
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 10,
    width: "50%",
    marginBottom: 10,
  },
  dateText: {
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
    fontSize: 15,
  },
  addPeopleContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    position: "relative",
    height: 45,
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  addPeopleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  addPeopleText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "SFPro-Regular",
    color: "#8C8C8C",
  },
  addPeopleInput: {
    flex: 1,
  },
  addButtonText: {
    color: "#007AFF",
    fontSize: 15,
    position: "absolute",
    right: 4,
    top: -8,
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
  },
  personText: {
    marginRight: 5,
    fontSize: 12,
    fontFamily: "SFPro-Medium",
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priorityButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 6,
    paddingVertical: 10,
    marginHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  priorityButtonSelected: {
    backgroundColor: "#F2F2F2",
  },
  priorityButtonText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    fontFamily: "SFPro-Regular",
  },
  priorityButtonTextSelected: {
    color: "#1A1A1A",
  },
  createButton: {
    backgroundColor: "#002D62",
    borderRadius: 8,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "SFPro-Semibold",
  },
});

export default TaskModal;
