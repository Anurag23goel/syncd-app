import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface ExportReportModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

export default function ExportReportModal({
  modalVisible,
  setModalVisible,
}: ExportReportModalProps) {
  const [selectedReport, setSelectedReport] = useState("");
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].reports.export;

  const reports = [
    t.types.attendance,
    t.types.attendanceLogs,
    t.types.inventory,
    t.types.milestone,
    t.types.budget,
  ];

  return (
    <View style={styles.container}>
      {/* Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.headerContainer}>
              <Text style={styles.modalTitle}>{t.title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {reports.map((report, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reportOption}
                onPress={() => setSelectedReport(report)}
              >
                <Text style={styles.reportText}>{report}</Text>
                <View
                  style={[
                    styles.radioButton,
                    selectedReport === report && styles.radioButtonSelected,
                  ]}
                >
                  {selectedReport === report && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#007AFF"
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.exportButton,
                !selectedReport && styles.exportButtonDisabled,
              ]}
              onPress={() => {
                if (selectedReport) {
                  console.log("Exporting:", selectedReport);
                  setModalVisible(false);
                }
              }}
              disabled={!selectedReport}
            >
              <Text style={styles.exportButtonText}>{t.export}</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  reportOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: moderateScale(12),
  },
  reportText: {
    fontSize: moderateScale(16),
    color: "#000",
  },
  radioButton: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    backgroundColor: "#E3F2FF",
  },
  exportButton: {
    backgroundColor: "#002B5B",
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(24),
    marginTop: moderateScale(20),
    width: "100%",
    alignItems: "center",
  },
  exportButtonDisabled: {
    backgroundColor: "#A1A1A1",
  },
  exportButtonText: {
    fontSize: moderateScale(16),
    color: "#fff",
    fontWeight: "600",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: moderateScale(16),
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#000",
    fontFamily: "SFPro-Bold",
  },
});
