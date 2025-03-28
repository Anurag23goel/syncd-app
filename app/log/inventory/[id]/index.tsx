import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomGaugeChart from "@/components/Chart/GaugeChart";
import { AntDesign, Ionicons } from "@expo/vector-icons"; // Updated imports
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FileItem from "@/components/Card/FileCard";
import AddUpdateResourceModal from "@/components/Modal/AddUpdateResourceModal";
import ResourceModal from "@/components/Modal/ResourceModal";
import PopUpModal from "@/components/Modal/PopUpModal";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { useAuthStore } from "@/store/authStore";
import { GET_INVENTORY_HISTORY_FOR_USER } from "@/services/project_user/inventory";
import { INVENTORY_HISTORY } from "@/types/NewApiTypes";
import { moderateScale } from "@/utils/spacing";

const Id = () => {

  const [modalVisible, setModalVisible] = React.useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [resourceModalVisible, setResourceModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [resourceTitle, setResourceTitle] = useState("");
  const inventoryID = useLocalSearchParams();
  const { id } = useLocalSearchParams();
  const actualInventoryID = typeof id === "string" ? id : "";
  console.log("YE HAI INVENTORY ID - ", actualInventoryID);

  const language = useLanguageStore((state) => state.language);
  const t = translations[language].inventory;
  const authToken = useAuthStore.getState().token;
  const [inventoryDetails, setInventoryDetails] =
    useState<INVENTORY_HISTORY | null>(null);
  const details = inventoryDetails?.inventoryDetails;
  const transactions = inventoryDetails?.transactions || [];

  const fetchInventoryDetails = async () => {
    if (!authToken) {
      return;
    }

    const response = await GET_INVENTORY_HISTORY_FOR_USER(
      actualInventoryID,
      authToken
    );

    setInventoryDetails(response.data);
  };

  useEffect(() => {
    fetchInventoryDetails();
  }, []);

  const handleActionPress = (action: string) => {
    if (
      action === t.resourceDetails.addUsage ||
      action === t.resourceDetails.addDamaged
    ) {
      setResourceTitle(
        action.includes("usage")
          ? t.resourceDetails.resourceUsed
          : t.resourceDetails.damageReport
      );
      setResourceModalVisible(true);
    } else if (action === t.resourceDetails.editResource) {
      setEditModalVisible(true);
    }
    setActionModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {inventoryDetails?.inventoryDetails?.ResourceName || t.title}
          </Text>
          <TouchableOpacity onPress={() => router.push("/notification")}>
            <Ionicons name="notifications-outline" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput placeholder={t.search} style={styles.searchInput} />
        </View>

        {/* Gauge Chart */}
        <View style={styles.chartContainer}>
          <CustomGaugeChart
            total={inventoryDetails?.Added || 0}
            used={inventoryDetails?.Used || 0}
            left={inventoryDetails?.Left || 0}
            damaged={inventoryDetails?.Damaged || 0}
          />
        </View>

        {/* Resource Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cost: ₹{details?.Cost ?? "N/A"}</Text>
          <Text style={styles.cardSubtitle}>
            {details ? new Date(details.createdAt).toLocaleString() : ""}
          </Text>
        </View>

        {/* File Card */}
        <View style={styles.card}>
          <FileItem
            name={details?.InvoiceLink ?? ""}
            date={details?.createdAt ?? ""}
            size={t.resourceDetails.fileSize}
            iconType="file"
            sharedWith="all"
          />
        </View>

        {/* Usage History */}
        <Text style={styles.sectionTitle}>{t.resourceDetails.usageHistory}</Text>
        {transactions
          .filter((trx) => trx.TransactionType === "ADDED")
          .map((trx) => (
            <View key={trx.TransactionID} style={styles.card}>
              <Text style={styles.cardTitle}>Quantity: {trx.Quantity}</Text>
              <Text style={styles.cardSubtitle}>
                Date: {new Date(trx.TransactionDate).toLocaleDateString()}
              </Text>
            </View>
          ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setActionModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <PopUpModal
        isVisible={actionModalVisible}
        onClose={() => setActionModalVisible(false)}
        onActionPress={handleActionPress}
      />
      <ResourceModal
        isVisible={resourceModalVisible}
        onClose={() => setResourceModalVisible(false)}
        title={resourceTitle}
      />
      <AddUpdateResourceModal
        isVisible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSubmit={(data) => {
          console.log("Edit Resource Data: ", data);
          setEditModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default Id;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Matches previous components
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(10),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Centers title with back and notification
    marginBottom: moderateScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(26), // Matches previous components
    fontFamily: "SFPro-Bold",
    color: "#1A1A1A",
    flex: 1,
    textAlign: "center", // Centers the title
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(8),
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Regular",
    color: "#333",
  },
  scrollContainer: {
    paddingBottom: moderateScale(80), // Space for floating button
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(14),
    padding: moderateScale(16),
    marginBottom: moderateScale(14),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(14),
    padding: moderateScale(16),
    marginBottom: moderateScale(14),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: moderateScale(80), // Consistent card height
  },
  cardTitle: {
    fontSize: moderateScale(20),
    fontFamily: "SFPro-Semibold",
    color: "#1A1A1A",
    marginBottom: moderateScale(4),
  },
  cardSubtitle: {
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Regular",
    color: "#6B6B6B",
  },
  sectionTitle: {
    fontSize: moderateScale(22),
    fontFamily: "SFPro-Semibold",
    color: "#1A1A1A",
    marginBottom: moderateScale(10),
  },
  addButton: {
    position: "absolute",
    bottom: moderateScale(20),
    right: moderateScale(20),
    backgroundColor: "#002347", // Matches previous components
    borderRadius: 50,
    padding: moderateScale(14),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});