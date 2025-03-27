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
import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { getAllInventoryItems } from "@/services/project_user/inventory"; // Adjust path as needed
import { useLanguageStore } from "@/store/useLanguageStore";
import { useAuthStore } from "@/store/authStore";
import { translations } from "@/constants/translations";
import AddUpdateResourceModal from "@/components/Modal/AddUpdateResourceModal";
import type { InventoryItemNew } from "@/types/Apitypes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SINGLE_INVENTORY_ITEM } from "@/types/NewApiTypes";

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
      <View style={{ flex: 1 }}>
        <Text style={styles.resourceName}>{ResourceName}</Text>
        <Text style={styles.resourceBrand}>{BrandName}</Text>

        <Text style={styles.resourceDetails}>Quantity: {TotalQuantity}</Text>
        <Text style={styles.resourceDetails}>Cost: ₹{Cost}</Text>
        <Text style={styles.resourceDetails}>Category: {Category}</Text>
        <Text style={styles.resourceDetails}>Payment: {PaymentMode}</Text>

        {InvoiceLink && (
          <Text
            style={styles.link}
            onPress={() => Linking.openURL(InvoiceLink)}
          >
            View Invoice
          </Text>
        )}

        {PhotoLink && (
          <Image
            source={{ uri: PhotoLink }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}

        <Text style={styles.lastUpdated}>
          {t.lastUpdated}: {new Date(updatedAt).toLocaleDateString()}
        </Text>
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

  useEffect(() => {
    const fetchResources = async () => {
      if (!authToken || !projectID) return;
      try {
        const response = await getAllInventoryItems(projectID, authToken);
        setResources(response.data?.inventory || []);
        
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.projects.orionTowers}</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput placeholder={t.search} style={styles.searchInput} />
        </View>

        {resources.map((resource, index) => (
          <ResourceCard key={index} {...resource} />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
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
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Ensure space for floating button + bottom insets
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  resourceName: {
    fontSize: 20,
    fontFamily: "SFPro-Semibold",
    color: "#000",
  },
  resourceBrand: {
    fontSize: 16,
    fontFamily: "SFPro-Regular",
    color: "#4A4A4A",
    marginTop: 4,
  },
  resourceDetails: {
    fontSize: 15,
    fontFamily: "SFPro-Regular",
    color: "#000",
    marginTop: 6,
  },
  link: {
    color: "#007AFF",
    marginTop: 8,
    fontSize: 14,
    textDecorationLine: "underline",
    fontFamily: "SFPro-Regular",
  },
  thumbnail: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginTop: 10,
  },
  lastUpdated: {
    fontSize: 14,
    fontFamily: "SFPro-Regular",
    color: "#8e8e8e",
    marginTop: 12,
  },
  addButton: {
    position: "absolute",
    bottom: 30, // Can add insets.bottom dynamically if needed
    right: 30,
    backgroundColor: "#002D62",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});

export default ResourceScreen;
