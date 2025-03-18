import React from "react";
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

interface AddMilestoneModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddMilestoneModal({
  visible,
  onClose,
}: AddMilestoneModalProps) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs.paymentLog.milestone;

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

          <TouchableOpacity style={styles.saveButton} onPress={onClose}>
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
