import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
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

const Id = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [resourceModalVisible, setResourceModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [resourceTitle, setResourceTitle] = useState("");
  const inventoryID = useLocalSearchParams();
  const actualInventoryID = Array.isArray(inventoryID) ? inventoryID[0] : inventoryID;
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].inventory;
  const authToken = useAuthStore.getState().token;

  console.log(actualInventoryID, authToken);

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

        <CustomGaugeChart total={12} used={2} left={2} damaged={3} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.resourceDetails.cost}</Text>
          <Text style={styles.sectionTitle1}>
            {t.resourceDetails.purchaseDate}
          </Text>
        </View>
        <FileItem
          name={t.resourceDetails.invoice}
          date={t.resourceDetails.date}
          size={t.resourceDetails.fileSize}
          iconType="file"
          sharedWith="all"
        />

        <Text style={[styles.sectionTitle, { fontSize: 22 }]}>
          {t.resourceDetails.usageHistory}
        </Text>
        <View style={[styles.section, { flexDirection: "column", gap: 20 }]}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.sectionTitle}>
              {t.resourceDetails.quantity}
            </Text>
            <Text style={styles.sectionTitle1}>{t.resourceDetails.usedOn}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.sectionTitle}>
              {t.resourceDetails.quantity}
            </Text>
            <Text style={styles.sectionTitle1}>{t.resourceDetails.usedOn}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.sectionTitle}>
              {t.resourceDetails.quantity}
            </Text>
            <Text style={styles.sectionTitle1}>{t.resourceDetails.usedOn}</Text>
          </View>
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
