import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface TaskStatus {
  label: string;
  value: number;
  color: string;
}

export default function RenderComparison() {
  const [activeTab, setActiveTab] = useState("real");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.comparison;

  const taskStatuses: TaskStatus[] = [
    { label: "Completed", value: 5, color: "#007BFF" },
    { label: "Incomplete", value: 2, color: "#E74C3C" },
    { label: "Pending", value: 1.5, color: "#FFB800" },
    { label: "Delayed", value: 1.5, color: "#6B6B6B" },
  ];

  const total = taskStatuses.reduce((sum, status) => sum + status.value, 0);

  const renderReal = () => {
    return (
      <View style={styles.tasksContainer}>
        <View style={styles.imageContainer}>
          <Feather name="image" size={24} color="black" />
        </View>
        <TouchableOpacity
          style={styles.taskItem}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.taskText}>{t.update}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRender = () => (
    <View style={styles.tasksContainer}>
      <View style={styles.imageContainer}>
        <Ionicons name="cube-outline" size={24} color="black" />
      </View>
      <TouchableOpacity
        style={styles.taskItem}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.taskText}>{t.update}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "real" && styles.activeTab]}
          onPress={() => setActiveTab("real")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "real" && styles.activeTabText,
            ]}
          >
            {t.real}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "render" && styles.activeTab]}
          onPress={() => setActiveTab("render")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "render" && styles.activeTabText,
            ]}
          >
            {t.render}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "real" ? renderReal() : renderRender()}
      </ScrollView>

      {/* Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.editFiles}</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={20} color="black" />
              </TouchableOpacity>
            </View>
            {/* Input Fields */}
            <TextInput
              style={styles.input}
              placeholder={t.real}
              placeholderTextColor="#A3A3A3"
            />
            <TextInput
              style={styles.input}
              placeholder={t.render}
              placeholderTextColor="#A3A3A3"
            />
            {/* Update Button */}
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.updateButtonText}>{t.update}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
  },
  tabs: {
    flexDirection: "row",
    borderRadius: moderateScale(8),
    backgroundColor: "#F2F2F7",
    margin: moderateScale(16),
    padding: moderateScale(5),
  },
  tab: {
    flex: 1,
    paddingVertical: moderateScale(8),
    alignItems: "center",
    borderRadius: moderateScale(6),
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: moderateScale(12),
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  activeTabText: {
    color: "#fff",
    fontFamily: "SFPro-Semibold",
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: "#F2F2F2",
    height: 300,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tasksContainer: {
    padding: moderateScale(16),
  },
  taskItem: {
    backgroundColor: "#F2F2F7",
    marginTop: moderateScale(12),
    padding: moderateScale(16),
    borderRadius: moderateScale(30),
    alignItems: "center",
    marginBottom: moderateScale(12),
  },
  taskText: {
    fontSize: moderateScale(16),
    color: "#000",
    fontFamily: "SFPro-Regular",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Semibold",
    color: "#000",
  },
  closeButton: {
    padding: 5,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Regular",
    color: "#000",
  },
  updateButton: {
    backgroundColor: "#002D62",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Semibold",
  },
});
