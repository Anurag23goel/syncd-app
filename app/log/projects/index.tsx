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
import { SINGLE_PROJECT_DETAILS } from "@/types/NewApiTypes";

interface InventoryCardProps {
  title: string;
  location: string | null;
  handleClick: () => void;
  imgSrc?: string;
  IsCompleted?: boolean;
}

const InventoryCard: React.FC<InventoryCardProps> = ({
  title,
  location,
  handleClick,
  imgSrc,
  IsCompleted,
}) => (
  <Pressable style={styles.card} onPress={handleClick}>
    <View style={{ flexDirection: "row" }}>
      <Image
        source={
          imgSrc
            ? { uri: imgSrc }
            : require("../../../assets/images/recent.png")
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
      <View style={styles.badgeCompleted}>
        <Text style={styles.badgeText}>Completed</Text>
      </View>
    ) : (
      <View style={styles.badgeActive}>
        <Text style={styles.badgeText}>Active</Text>
      </View>
    )}

    {/* Feedback Section */}
    {IsCompleted && (
      <TouchableOpacity
        style={styles.feedbackButton}
        onPress={() => router.push("/log/projects/feedback")}
      >
        <AntDesign name="like2" size={20} color="#6B7280" />
        <Text style={styles.feedbackText}>Feedback from Review</Text>
      </TouchableOpacity>
    )}
  </Pressable>
);

const ProjectScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.projects;
  const [projects, setProjectsData] = useState<SINGLE_PROJECT_DETAILS[]>([]);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const authToken = useAuthStore.getState().token;

        if (!authToken) {
          console.error("No auth token found!");
          return;
        }
        console.log(authToken);

        const response = await getAllUserProjects(authToken);

        if (response.data?.projects) {
          setProjectsData(response.data?.projects);
        } else {
          console.warn("No projects found in response.");
          setProjectsData([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchRecentProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (activeTab === "Active") return !project.IsCompleted;
    if (activeTab === "Completed") return project.IsCompleted;
    return true; // Upcoming or other tabs
  });

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
        <Ionicons name="search-outline" size={20} color="#6B7280" />
        <TextInput placeholder={t.search} style={styles.searchInput} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {[t.tabs.active, t.tabs.upcoming, t.tabs.completed].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Projects List */}
      <Text style={styles.headerTitle}>{t.projectsList}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredProjects.map((project) => (
          <InventoryCard
            key={project.ProjectID}
            title={project.ProjectName}
            location={project.ProjectLocation}
            imgSrc={project.ProjectThumbnail || ""}
            handleClick={() =>
              router.push(`/log/projects/${project.ProjectID}`)
            }
            IsCompleted={project.IsCompleted && activeTab === "Completed"}
          />
        ))}
      </ScrollView>

      {/* Add Project Button */}
      <TouchableOpacity
        style={styles.addButton}
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
    backgroundColor: "#F5F5F5", // Matches inventory log
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
    fontSize: moderateScale(26), // Matches inventory log
    fontFamily: "SFPro-Bold",
    color: "#1A1A1A",
    flex: 1, // Allows title to take available space
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
  tabsContainer: {
    flexDirection: "row",
    marginBottom: moderateScale(16),
    backgroundColor: "#FFFFFF",
    padding: moderateScale(6),
    borderRadius: moderateScale(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
    justifyContent: "space-around",
  },
  tab: {
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(18),
    borderRadius: moderateScale(8),
    backgroundColor: "transparent",
  },
  activeTab: {
    backgroundColor: "#007BFF",
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    color: "#666",
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Medium",
  },
  activeTabText: {
    color: "#fff",
    fontFamily: "SFPro-Semibold",
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
    minHeight: moderateScale(100), // Matches inventory log
  },
  cardContent: {
    flex: 1,
    marginLeft: moderateScale(12),
    justifyContent: "center", // Matches inventory log
  },
  projectImage: {
    width: moderateScale(130),
    height: moderateScale(90),
    borderRadius: moderateScale(10),
    backgroundColor: "#F0F0F0",
  },
  projectTitle: {
    fontSize: moderateScale(20), // Matches inventory log
    fontFamily: "SFPro-Semibold",
    color: "#1A1A1A",
    marginBottom: moderateScale(4),
  },
  projectLocation: {
    fontSize: moderateScale(16), // Matches inventory log
    color: "#6B6B6B",
    fontFamily: "SFPro-Regular",
  },
  badgeCompleted: {
    backgroundColor: "#3498DB",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: "absolute",
    top: 8,
    right: 8,
  },
  badgeActive: {
    backgroundColor: "#27AE60",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: "absolute",
    top: 8,
    right: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: moderateScale(10),
    fontFamily: "SFPro-Regular",
  },
  feedbackButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginTop: moderateScale(8),
    width: "100%",
  },
  feedbackText: {
    color: "#333333",
    fontFamily: "SFPro-Regular",
    fontSize: moderateScale(14),
    marginLeft: moderateScale(8),
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
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

export default ProjectScreen;
