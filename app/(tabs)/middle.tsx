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
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { getAllUserProjects } from "@/services/project_other_user";
import { useAuthStore } from "@/store/authStore";
import { ProjectDetailsResponse } from "@/types/Apitypes";
import { SINGLE_PROJECT_DETAILS } from "@/types/NewApiTypes";

interface InventoryCardProps {
  imgSrc: string;
  title: string;
  location: string | null;
  handleClick: () => void;
  IsCompleted?: boolean; // New prop to check if it's in the Completed tab
}

const InventoryCard: React.FC<InventoryCardProps> = ({
  title,
  location,
  handleClick,
  imgSrc,
  IsCompleted,
}) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs;

  return (
    <Pressable style={styles.card} onPress={handleClick}>
      <View style={{ flexDirection: "row" }}>
        <Image
          source={
            imgSrc ? { uri: imgSrc } : require("../../assets/images/recent.png")
          }
          style={styles.projectImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.projectTitle}>{title}</Text>
          <Text style={styles.projectLocation}>{location}</Text>
        </View>
      </View>

      {/* Badge */}
      {IsCompleted ? (
        <View
          style={{
            backgroundColor: "#3498DB",
            borderRadius: 20,
            position: "absolute",
            paddingHorizontal: 10,
            paddingVertical: 4,
            top: 8,
            right: 8,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 8,
              fontFamily: "SFPro-Regular",
            }}
          >
            {t.completed}
          </Text>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: "#27AE60",
            borderRadius: 20,
            position: "absolute",
            paddingHorizontal: 10,
            paddingVertical: 4,
            top: 8,
            right: 8,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 8,
              fontFamily: "SFPro-Regular",
            }}
          >
            {t.filterOptions.active}
          </Text>
        </View>
      )}

      {/* Feedback Section */}
      {IsCompleted && (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F2F2F2",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: "#E0E0E0",
            marginTop: 6,
            width: "100%",
          }}
          onPress={() => router.push("/log/projects/feedback")}
        >
          <AntDesign name="like2" size={20} color="#B5B5B5" />
          <Text
            style={{
              color: "#333333",
              fontFamily: "SFPro-Regular",
              marginLeft: 10,
            }}
          >
            {t.feedback}
          </Text>
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

const ProjectScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs;
  const [projects, setAllProjects] = useState<SINGLE_PROJECT_DETAILS[] | null>(
    []
  );

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const authToken = useAuthStore.getState().token;

        if (!authToken) {
          console.error("No auth token found!");
          return;
        }

        const response = await getAllUserProjects(authToken);

        // Check if response contains the "projects" key and set state
        if (response.data?.projects) {
          setAllProjects(response.data.projects); // Update state with projects array
        } else {
          console.warn("No projects found in response.");
          setAllProjects([]); // Set empty array if no projects found
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchRecentProjects();
  }, []);

  // Sample project data

  const filteredProjects = projects?.filter((project) => {
    if (activeTab === "Active") return !project.IsCompleted;
    if (activeTab === "Completed") return project.IsCompleted;
    return true; // Upcoming or other tabs
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.projects}</Text>
        <TouchableOpacity onPress={() => router.push("/notification")}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="gray" />
        <TextInput placeholder={t.search} style={styles.searchInput} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { key: "Active", label: t.filterOptions.active },
          { key: "Upcoming", label: t.filterOptions.upcoming },
          { key: "Completed", label: t.completed },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Projects List */}
      <Text style={styles.headerTitle}>{t.projectsList}</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredProjects?.map((project, index) => (
          <InventoryCard
            imgSrc={project.ProjectThumbnail || ""}
            key={index}
            title={project.ProjectName}
            location={project.ProjectLocation}
            handleClick={() =>
              router.push(`/log/projects/${project.ProjectID}`)
            }
            IsCompleted={project.IsCompleted && activeTab === "Completed"}
          />
        ))}
      </ScrollView>

      {/* Add Project Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#002347",
          borderRadius: 50,
          padding: 14,
        }}
        onPress={() => router.push("/log/projects/form")}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: moderateScale(20),
    paddingHorizontal: moderateScale(16),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(20),
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontFamily: "SFPro-Bold",
    marginTop: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(20),
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(8),
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Regular",
  },
  tabsContainer: {
    flexDirection: "row",
    marginVertical: moderateScale(8),
  },
  tab: {
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(24),
    borderRadius: moderateScale(6),
    alignItems: "center",
    marginRight: moderateScale(8),
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  activeTab: {
    backgroundColor: "#007BFF",
  },
  tabText: {
    color: "#666",
    fontSize: moderateScale(12),
    fontFamily: "SFPro-Regular",
  },
  activeTabText: {
    color: "#fff",
  },
  scrollContainer: {
    paddingBottom: moderateScale(20),
  },
  card: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(12),
    alignItems: "center",
    padding: moderateScale(12),
    marginBottom: moderateScale(16),
  },
  cardContent: {
    flex: 1,
    marginTop: moderateScale(10),
  },
  projectImage: {
    width: moderateScale(100),
    height: moderateScale(70),
    borderRadius: moderateScale(8),
    marginRight: moderateScale(12),
  },
  projectTitle: {
    fontSize: moderateScale(28),
    marginBottom: moderateScale(4),
    fontFamily: "SFPro-Bold",
    color: "#1A1A1A",
  },
  projectLocation: {
    fontSize: moderateScale(12),
    color: "#6B6B6B",
    fontFamily: "SFPro-Medium",
    marginBottom: moderateScale(8),
  },
});

export default ProjectScreen;