import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface Contact {
  name: string;
  phone: string;
  email: string;
  role: string;
  location: string;
}

export interface EditContactModalProps {
  visible: boolean;
  onClose: () => void;
  contact: Contact;
  onUpdate: (contact: Contact) => void;
}

const EditContactModal: React.FC<EditContactModalProps> = ({
  visible,
  onClose,
  contact,
  onUpdate,
}) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].editContact;

  const [formData, setFormData] = useState<Contact>(contact);

  const handleChange = (key: keyof Contact, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = () => {
    onUpdate(formData);
    onClose();
  };

  const isFormValid = Object.values(formData).every((value) => value.trim());

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.editContact}</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder={t.name}
                value={formData.name}
                onChangeText={(value) => handleChange("name", value)}
                placeholderTextColor="#8C8C8C"
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="phone" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder={t.phone}
                value={formData.phone}
                onChangeText={(value) => handleChange("phone", value)}
                keyboardType="phone-pad"
                placeholderTextColor="#8C8C8C"
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder={t.email}
                value={formData.email}
                onChangeText={(value) => handleChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#8C8C8C"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="briefcase-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder={t.role}
                value={formData.role}
                onChangeText={(value) => handleChange("role", value)}
                placeholderTextColor="#8C8C8C"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder={t.location}
                value={formData.location}
                onChangeText={(value) => handleChange("location", value)}
                placeholderTextColor="#8C8C8C"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.updateButton,
                !isFormValid && styles.updateButtonDisabled,
              ]}
              onPress={handleUpdate}
              disabled={!isFormValid}
            >
              <Text style={styles.updateButtonText}>{t.update}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "SFPro-Bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    paddingLeft: 10,
    fontFamily: "SFPro-Regular",
  },
  updateButton: {
    backgroundColor: "#002D62",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  updateButtonDisabled: {
    backgroundColor: "#B8B8B8",
  },
  updateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "SFPro-Semibold",
  },
});

export default EditContactModal;
