import { Task } from "@/types";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { BottomSheet } from "react-native-btr"; // Import BottomSheet from react-native-btr
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker from expo-image-picker
import * as DocumentPicker from "expo-document-picker"; // Import DocumentPicker from expo-document-picker
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { Ionicons } from "@expo/vector-icons";

interface ApprovalCardProps {
  task: Task;
  onApprove: (id: string) => void;
  onReassign: (id: string) => void;
  onReject: (
    id: string,
    note: string,
    photoUri?: string,
    attachmentUri?: string,
    tqab?: string
  ) => void; // Update onReject to accept tqab
}

export const ApprovalCard = ({
  task,
  onApprove,
  onReassign,
  onReject,
}: ApprovalCardProps) => {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [note, setNote] = useState("");
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [attachmentUri, setAttachmentUri] = useState<string | undefined>(
    undefined
  );
  const [tqab, setTqab] = useState(""); // Add tqab state
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tasks;

  const handleReject = (id: string) => {
    setBottomSheetVisible(true);
  };

  const submitRejection = () => {
    onReject(task.id, note, photoUri, attachmentUri, tqab); // Pass tqab to onReject
    setBottomSheetVisible(false);
    setNote("");
    setPhotoUri(undefined);
    setAttachmentUri(undefined);
    setTqab(""); // Reset tqab
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.canceled === false) {
      setAttachmentUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description}>{task.description}</Text>

        <View style={styles.timeContainer}>
          <Image
            source={{ uri: task.teamMembers?.[0]?.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.timeText}>{task.createdAt}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={() => onApprove(task.id)}
          accessibilityLabel={t.taskActions.approve}
        >
          <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.reassignButton]}
          onPress={() => onReassign(task.id)}
          accessibilityLabel={t.taskActions.reassign}
        >
          <Ionicons name="repeat" size={18} color="#007BFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleReject(task.id)}
          accessibilityLabel={t.taskActions.reject}
        >
          <Ionicons name="close-circle" size={18} color="#FF5722" />
        </TouchableOpacity>
      </View>

      <BottomSheet
        visible={isBottomSheetVisible}
        onBackButtonPress={() => setBottomSheetVisible(false)}
        onBackdropPress={() => setBottomSheetVisible(false)}
      >
        <View style={styles.bottomSheet}>
          <Text style={styles.bottomSheetTitle}>Add a note</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Enter your note here"
            value={note}
            onChangeText={setNote}
          />
          <TouchableOpacity style={styles.attachmentButton} onPress={pickImage}>
            <Text style={styles.attachmentButtonText}>Attach Photo</Text>
          </TouchableOpacity>
          {photoUri && (
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
          )}
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={pickDocument}
          >
            <Text style={styles.attachmentButtonText}>Attach Document</Text>
          </TouchableOpacity>
          {attachmentUri && (
            <Text style={styles.attachmentText}>{attachmentUri}</Text>
          )}
          <TextInput
            style={styles.noteInput}
            placeholder="Enter TQAB"
            value={tqab}
            onChangeText={setTqab}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={submitRejection}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 10,
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  header: {
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
  description: {
    fontSize: 14,
    color: "#757575",
    marginTop: 4,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#757575",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  approveButton: {
    backgroundColor: "#002D62",
  },
  approveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  reassignButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#002D62",
  },
  reassignButtonText: {
    color: "#002D62",
    fontSize: 14,
    fontWeight: "600",
  },
  rejectButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  rejectButtonText: {
    color: "#212121",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomSheet: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  noteInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  attachmentButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  attachmentButtonText: {
    color: "#212121",
    fontSize: 16,
    fontWeight: "600",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  attachmentText: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#002D62",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
