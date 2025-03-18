import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LocalSvg } from "react-native-svg/css";
import { moderateScale } from "@/utils/spacing";
import ExportReportModal from "./ExportModal";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface MenuModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

export default function MenuModal({
  modalVisible,
  setModalVisible,
}: MenuModalProps) {
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.projectOptions;

  const menuItems = [
    {
      id: "6",
      label: t.exportReport,
      link: "" as const,
      icon: <Feather name="share-2" size={18} color="#8C8C8C" />,
    },
    {
      id: "2",
      label: t.incidentReport,
      link: "/log/projects/incident_report" as const,
      icon: (
        <LocalSvg
          asset={require("../../../assets/images/damage.svg")}
          width={18}
          height={20}
        />
      ),
    },
    {
      id: "1",
      label: t.laborAttendance,
      link: "/log/projects/attendence_report" as const,
      icon: <Feather name="user-check" size={18} color="#8C8C8C" />,
    },
    {
      id: "4",
      label: t.maintenanceList,
      link: "/log/projects/maintance_list" as const,
      icon: <Feather name="book" size={18} color="#8C8C8C" />,
    },
    {
      id: "3",
      label: t.paymentLog,
      link: "/log/payment/id" as const,
      icon: <Ionicons name="cash-outline" size={20} color="#8C8C8C" />,
    },
    {
      id: "5",
      label: t.teamDashboard,
      link: "/log/projects/team_dashboard" as const,
      icon: <Feather name="book" size={18} color="#8C8C8C" />,
    },
  ];

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.menu}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-outline" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={menuItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setModalVisible(false);
                    if (item.label === "Export report") {
                      setExportModalVisible(true);
                    } else {
                      router.push(item.link as any);
                    }
                  }}
                >
                  {item.icon}
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      <ExportReportModal
        modalVisible={exportModalVisible}
        setModalVisible={setExportModalVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(16),
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#000",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    marginBottom: moderateScale(8),
    gap: moderateScale(6),
  },
  menuIcon: {
    marginRight: moderateScale(12),
  },
  menuLabel: {
    fontSize: moderateScale(14),
    color: "#8C8C8C",
  },
  openButton: {
    backgroundColor: "#007AFF",
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(8),
  },
  openButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
  },
});
