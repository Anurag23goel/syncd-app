import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AddUpdateResourceModal from "@/components/Modal/AddUpdateResourceModal";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface ResourceCardProps {
  resourceName: string;
  resourceType: string;
  quantityUsed: number;
  initialQuantity: number;
  unit: string;
  lastUpdated: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resourceName,
  resourceType,
  quantityUsed,
  initialQuantity,
  unit,
  lastUpdated,
}) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].inventory.resourceDetails;

  return (
    <TouchableOpacity
      onPress={() => router.push("/log/inventory/id")}
      style={styles.card}
    >
      <View style={{ flexDirection: "column" }}>
        <Text style={styles.resourceName}>{resourceName}</Text>
        <Text style={styles.resourceType}>({resourceType})</Text>
        <Text style={styles.resourceDetails}>
          {quantityUsed} / {initialQuantity} {unit}
        </Text>
        <Text style={styles.example}>
          ({t.example}: {quantityUsed}/{initialQuantity} {unit})
        </Text>
      </View>
      <Text style={styles.lastUpdated}>
        {t.lastUpdated}: {lastUpdated}
      </Text>
    </TouchableOpacity>
  );
};

const ResourceScreen: React.FC = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].inventory;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resources, setResources] = useState([
    {
      resourceName: t.resources.waterSupply,
      resourceType: t.resources.types.liquid,
      quantityUsed: 20,
      initialQuantity: 100,
      unit: t.resources.units.liters,
      lastUpdated: "2024-12-01 10:00 AM",
    },
    {
      resourceName: t.resources.cement,
      resourceType: t.resources.types.powder,
      quantityUsed: 50,
      initialQuantity: 200,
      unit: t.resources.units.kgs,
      lastUpdated: "2024-12-01 9:00 AM",
    },
  ]);

  const handleAddResource = (resourceData: any) => {
    setResources((prevResources) => [...prevResources, resourceData]);
    console.log("Resource Added:", resourceData);
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
          <Text style={styles.headerTitle}>{t.projects.orionTowers}</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput placeholder={t.search} style={styles.searchInput} />
        </View>

        {resources.map((resource, index) => (
          <ResourceCard
            key={index}
            resourceName={resource.resourceName}
            resourceType={resource.resourceType}
            quantityUsed={resource.quantityUsed}
            initialQuantity={resource.initialQuantity}
            unit={resource.unit}
            lastUpdated={resource.lastUpdated}
          />
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
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  resourceName: {
    fontSize: 20,
    fontFamily: "SFPro-Semibold",
    color: "#000",
  },
  resourceType: {
    fontSize: 14,
    fontFamily: "SFPro-Regular",
    color: "#8e8e8e",
    marginTop: 4,
  },
  resourceDetails: {
    fontSize: 16,
    fontFamily: "SFPro-Regular",
    color: "#000",
    marginTop: 12,
  },
  example: {
    fontSize: 14,
    fontFamily: "SFPro-Regular",
    color: "#8e8e8e",
    marginTop: 4,
  },
  lastUpdated: {
    fontSize: 14,
    fontFamily: "SFPro-Regular",
    color: "#8e8e8e",
    marginTop: 16,
    width: "40%",
    textAlign: "left",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#002D62",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ResourceScreen;
