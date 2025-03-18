import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface SelectModalProps {
  visible: boolean;
  onClose: () => void;
  onAddMilestone: () => void;
  onAddExpense: () => void;
}

export default function SelectModal({
  visible,
  onClose,
  onAddMilestone,
  onAddExpense,
}: SelectModalProps) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs.paymentLog.selectionMenu;

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

          <TouchableOpacity style={styles.option} onPress={onAddExpense}>
            <MaterialIcons
              name="arrow-downward"
              size={moderateScale(20)}
              color="gray"
            />
            <Text style={styles.optionText}>{t.addExpense}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={onAddMilestone}>
            <Feather name="flag" size={moderateScale(20)} color="gray" />
            <Text style={styles.optionText}>{t.addMilestone}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Feather name="share" size={moderateScale(20)} color="gray" />
            <Text style={styles.optionText}>{t.exportReport}</Text>
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
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(10),
    backgroundColor: "#F9F9F9",
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
    paddingHorizontal: moderateScale(8),
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  optionText: {
    marginLeft: moderateScale(15),
    fontSize: moderateScale(14),
    color: "#333",
  },
});
