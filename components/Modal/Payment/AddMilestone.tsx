import React, {useState} from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { LocalSvg } from "react-native-svg/css";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { useAuthStore } from "@/store/authStore";
import { createMilestone } from "@/services/project_user/milestone";

interface AddMilestoneModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface createMilestonePayload{
  ProjectID: string;
  Title:string;
  Description: string;
  Status: string;
}

export default function AddMilestoneModal({
  visible,
  onClose,
}: AddMilestoneModalProps) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs.paymentLog.milestone

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING"); // Default status
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("PENDING");
  };

  const handleSubmit = async () => {
    console.log("Submit button clicked"); // Debugging

    if (!title || !description) {
      console.log("Error", "Please fill all required fields");
      return;
    }

    const projectId = useAuthStore.getState().projectID;
    if (!projectId) {
      console.log("Error", "No project ID found.");
      return;
    }

    setIsLoading(true);

    try {
      const milestoneData: createMilestonePayload = {
        ProjectID: projectId,
        Title: title,
        Description: description,
        Status: status,
      };
      console.log("Sending milestone data:", milestoneData);
      const response = await createMilestone(milestoneData);
      console.log("Milestone created successfully:", response);
      
      console.log("Success", "Milestone added successfully!");
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Error creating milestone:", error);
      console.log("Error", error.message || "Failed to add milestone");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.title}>{t.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={moderateScale(24)} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t.enterTitle}
              placeholderTextColor="#8C8C8C"
            />

            <View style={styles.input}>
              <LocalSvg
                asset={require("../../../assets/images/details.svg")}
                width={moderateScale(20)}
                height={moderateScale(20)}
              />
              <TextInput
                placeholder={t.description}
                placeholderTextColor="#8C8C8C"
                multiline
                style={styles.textInput}
              />
            </View>

            <View style={styles.input}>
              <FontAwesome
                name="rupee"
                size={moderateScale(16)}
                color="#8C8C8C"
              />
              <TextInput
                placeholder={`${t.amount} (${t.allocated})`}
                placeholderTextColor="#8C8C8C"
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>
            <View style={styles.input}>
              <FontAwesome
                name="rupee"
                size={moderateScale(16)}
                color="#8C8C8C"
              />
              <TextInput
                placeholder={`${t.amount} (${t.utilized})`}
                placeholderTextColor="#8C8C8C"
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>{t.save}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    width: "90%",
    maxWidth: moderateScale(400),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  inputContainer: {
    gap: moderateScale(15),
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(8),
    backgroundColor: "#F9F9F9",
  },
  textInput: {
    flex: 1,
    fontSize: moderateScale(14),
  },
  saveButton: {
    backgroundColor: "#003B95",
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    alignItems: "center",
    marginTop: moderateScale(20),
  },
  saveButtonText: {
    color: "white",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
});
