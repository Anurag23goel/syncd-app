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
import { Feather, Ionicons } from "@expo/vector-icons";
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

const Id = () => {
  console.log(" INVENTORY KE ANDAR [id] KE ANDAR");

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
  const [inventoryDetails, setInventoryDetails] = useState<INVENTORY_HISTORY | null>(null);
  const details = inventoryDetails?.history.inventoryDetails;
  const transactions = inventoryDetails?.history.transactions || [];

  const fetchInventoryDetails = async () => {
    if (!authToken) {
      return;
    }

    const response = await GET_INVENTORY_HISTORY_FOR_USER(
      actualInventoryID,
      authToken
    );
    console.log(response.data);

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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.resourceName}</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput placeholder={t.search} style={styles.searchInput} />
        </View>

        <CustomGaugeChart
          total={inventoryDetails?.history.summary.totalAdded || 0}
          used={inventoryDetails?.history.summary.totalUsed || 0}
          left={100} //total Left
          damaged={inventoryDetails?.history.summary.totalDamaged || 0}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>₹ {details?.Cost ?? "N/A"}</Text>
          <Text style={styles.sectionTitle1}>
            {details ? new Date(details.createdAt).toLocaleString() : ""}
          </Text>
        </View>
        <FileItem
          name={details?.InvoiceLink ?? ""}
          date={details?.createdAt ?? ""}
          size={t.resourceDetails.fileSize}
          iconType="file"
          sharedWith="all"
        />

        <Text style={[styles.sectionTitle, { fontSize: 22 }]}>
          {t.resourceDetails.usageHistory}
        </Text>
        <View style={[styles.section, { flexDirection: "column", gap: 20 }]}>
          {transactions
            .filter((trx) => trx.TransactionType === "USED")
            .map((trx) => (
              <View
                key={trx.TransactionID}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.sectionTitle}>{trx.Quantity}</Text>
                <Text style={styles.sectionTitle1}>
                  {new Date(trx.TransactionDate).toLocaleDateString()}
                </Text>
              </View>
            ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setActionModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
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

      {/* Edit Resource Modal */}
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
    position: "relative",
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "SFPro-Semibold",
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "SFPro-Regular",
  },
  scrollContainer: {
    paddingBottom: 80,
  },

  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "SFPro-Semibold",
    color: "#333",
  },
  sectionTitle1: {
    fontSize: 11,
    fontFamily: "SFPro-Regular",
    marginBottom: 10,
    color: "#6B6B6B",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#002D62",
    borderWidth: 1,
    borderColor: "#002347",
    width: 60,
    height: 60,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
