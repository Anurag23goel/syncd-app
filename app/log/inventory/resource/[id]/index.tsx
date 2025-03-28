import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Image,
  Linking,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { getAllResouceItems } from "@/services/project_user/inventory";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useAuthStore } from "@/store/authStore";
import { translations } from "@/constants/translations";
import AddUpdateResourceModal from "@/components/Modal/AddUpdateResourceModal";
import type { InventoryItemNew } from "@/types/Apitypes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SINGLE_INVENTORY_ITEM } from "@/types/NewApiTypes";
import { moderateScale } from "@/utils/spacing";

const ResourceCard: React.FC<SINGLE_INVENTORY_ITEM> = ({
  InventoryID,
  ResourceName,
  BrandName,
  TotalQuantity,
  Cost,
  Category,
  PaymentMode,
  InvoiceLink,
  PhotoLink,
  updatedAt,
}) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].inventory.resourceDetails;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/log/inventory/${InventoryID}`)}
      style={styles.card}
    >
      <View style={styles.cardContent}>
        {/* Thumbnail (if available) */}
        {PhotoLink && (
          <Image
            source={{ uri: PhotoLink }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}
        {/* Main Resource Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {ResourceName}
          </Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {BrandName || "No Brand"}
          </Text>
          <View style={styles.keyInfo}>
            <Text style={styles.keyDetail}>
              {t.quantity}: {TotalQuantity}
            </Text>
            <Text style={styles.keyDetail}>₹{Cost}</Text>
          </View>
          {/* Additional Details */}
          <View style={styles.extraInfo}>
            <Text style={styles.extraDetail}>
              Category: {Category || "N/A"}
            </Text>
            <Text style={styles.extraDetail}>
              Mode of Payment: {PaymentMode || "N/A"}
            </Text>
            {InvoiceLink && (
              <Text
                style={styles.link}
                onPress={() => Linking.openURL(InvoiceLink)}
                numberOfLines={1}
              >
                {InvoiceLink}
              </Text>
            )}
            <Text style={styles.lastUpdated}>
              {t.lastUpdated}: {new Date(updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ResourceScreen: React.FC = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].inventory;
  const { id } = useLocalSearchParams();
  const projectID = Array.isArray(id) ? id[0] : id;
  const authToken = useAuthStore.getState().token;
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resources, setResources] = useState<SINGLE_INVENTORY_ITEM[]>([]);
  const [projectName, setProjectName] = useState("Project Name");

  useEffect(() => {
    const fetchResources = async () => {
      if (!authToken || !projectID) return;
      try {
        const response = await getAllResouceItems(projectID, authToken);
        setResources(response.data?.inventory || []);
        setProjectName(
          response.data?.inventory[0]?.ProjectID || "Project Name"
        );
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchResources();
  }, [projectID]);

  const handleAddResource = (resourceData: InventoryItemNew) => {
    setResources((prevResources) => [...prevResources, resourceData]);
    console.log("Resource Added:", resourceData);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{projectName}</Text>
          <TouchableOpacity onPress={() => router.push("/notification")}>
            <Ionicons name="notifications-outline" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput placeholder={t.search} style={styles.searchInput} />
        </View>

        {/* Resource Cards */}
        {resources.map((resource, index) => (
          <ResourceCard key={index} {...resource} />
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <AddUpdateResourceModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddResource}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: moderateScale(16),
  },
  scrollContainer: {
    paddingBottom: moderateScale(80),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(26),
    fontFamily: "SFPro-Bold",
    color: "#1A1A1A",
    flex: 1,
    textAlign: "center",
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(14),
    marginBottom: moderateScale(14),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(12),
  },
  thumbnail: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(12),
    backgroundColor: "#F0F0F0",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Semibold",
    color: "#1A1A1A",
    marginBottom: moderateScale(4),
  },
  cardSubtitle: {
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Regular",
    color: "#6B7280",
    marginBottom: moderateScale(6),
  },
  keyInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(6),
  },
  keyDetail: {
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Regular",
    color: "#333",
  },
  extraInfo: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: moderateScale(6),
  },
  extraDetail: {
    fontSize: moderateScale(12),
    fontFamily: "SFPro-Regular",
    color: "#6B7280",
    marginBottom: moderateScale(2),
  },
  link: {
    fontSize: moderateScale(12),
    fontFamily: "SFPro-Regular",
    color: "#007AFF",
    textDecorationLine: "underline",
    marginBottom: moderateScale(2),
  },
  lastUpdated: {
    fontSize: moderateScale(12),
    fontFamily: "SFPro-Regular",
    color: "#6B7280",
  },
  addButton: {
    position: "absolute",
    bottom: moderateScale(20),
    right: moderateScale(20),
    backgroundColor: "#002347",
    borderRadius: 50,
    padding: moderateScale(14),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});

export default ResourceScreen;