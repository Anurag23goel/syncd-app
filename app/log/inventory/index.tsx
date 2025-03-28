import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { useAuthStore } from "@/store/authStore";
import { getAllUserProjects } from "@/services/project_other_user";
import { ProjectDetailsResponse, SingleProjectDetails } from "@/types/Apitypes";
import { moderateScale } from "@/utils/spacing";

interface InventoryCardProps {
  title: string;
  location: string;
  imgSrc: string;
  handleClick: () => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({
  title,
  location,
  imgSrc,
  handleClick,
}) => (
  <Pressable style={styles.card} onPress={handleClick}>
    <Image
      source={
        imgSrc ? { uri: imgSrc } : require("../../../assets/images/recent.png")
      }
      style={styles.projectImage}
    />
    <View style={styles.cardContent}>
      <Text style={styles.projectTitle}>{title}</Text>
      <Text style={styles.projectLocation}>{location}</Text>
    </View>
  </Pressable>
);

const Inventory_Projects_Screen: React.FC = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].inventory;

  const [inventoryProjects, setInventoryProjects] = useState<
    SingleProjectDetails[] | null
  >([]);
  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const authToken = useAuthStore.getState().token;
        console.log("Token:", authToken);

        if (!authToken) {
          console.error("No auth token found!");
          return;
        }

        const response = await getAllUserProjects(authToken);

        // Check if response contains the "projects" key and set state
        if (response.data?.projects) {
          setInventoryProjects(response.data.projects); // Update state with projects array
        } else {
          console.warn("No projects found in response.");
          setInventoryProjects([]); // Set empty array if no projects found
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchRecentProjects();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.title}</Text>
        <TouchableOpacity onPress={() => router.push("/notification")}>
          <Ionicons name="notifications-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="gray" />
        <TextInput placeholder={t.search} style={styles.searchInput} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {inventoryProjects?.map((project) => (
          <InventoryCard
            key={project.ProjectID}
            title={project.ProjectName}
            imgSrc={project.ProjectThumbnail || ""}
            location={project.ProjectLocation || "Unknown Location"}
            handleClick={() =>
              router.push(`/log/inventory/resource/${project.ProjectID}`)
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Keeps back button, title, and notification balanced
    marginBottom: moderateScale(16), // Updated to moderateScale for consistency
  },
  headerTitle: {
    fontSize: moderateScale(26), // Updated to moderateScale
    fontFamily: "SFPro-Bold",
    color: "#1A1A1A",
    flex: 1, // Allows title to take available space
    textAlign: "center", // Centers the title
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "SFPro-Regular",
    color: "#333",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14, // Slightly larger for bigger card
    alignItems: "center",
    padding: 16, // Increased padding for larger card
    marginBottom: 14, // Slightly increased spacing between cards
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 100, // Added minimum height to ensure larger size
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  projectImage: {
    width: moderateScale(130), // Slightly larger for impact
    height: moderateScale(90),
    borderRadius: 10, // Slightly larger for bigger image
    marginRight: 16, // Increased spacing from text
    backgroundColor: "#F0F0F0",
  },
  projectTitle: {
    fontSize: 20, // Increased for larger card
    fontFamily: "SFPro-Semibold",
    color: "#1A1A1A",
    marginBottom: 4, // Slightly increased spacing
  },
  projectLocation: {
    fontSize: 16, // Increased for larger card
    color: "#6B6B6B",
    fontFamily: "SFPro-Regular",
  },
});

export default Inventory_Projects_Screen;
