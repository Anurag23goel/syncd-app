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
import { Ionicons, AntDesign } from "@expo/vector-icons"; // Added AntDesign for back button
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { getAllUserProjects } from "@/services/project_other_user";
import { ProjectDetailsResponse } from "@/types/Apitypes";
import { useAuthStore } from "@/store/authStore";
import { SINGLE_PROJECT_DETAILS } from "@/types/NewApiTypes";
import { moderateScale } from "@/utils/spacing";

interface ProjectCardProps {
  title: string;
  location: string | null;
  imgSrc: string;
  handleClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  location,
  imgSrc,
  handleClick,
}) => (
  <Pressable style={styles.card} onPress={handleClick}>
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
  </Pressable>
);

const FileSpaceScreen: React.FC = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs;

  const [allProjects, setAllProjects] = useState<
    SINGLE_PROJECT_DETAILS[] | null
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const authToken = useAuthStore.getState().token;

        if (!authToken) {
          console.error("No auth token found!");
          return;
        }

        const response = await getAllUserProjects(authToken);

        if (response.data?.projects) {
          setAllProjects(response.data.projects);
        } else {
          console.warn("No projects found in response.");
          setAllProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.fileSpace}</Text>
        <TouchableOpacity onPress={() => router.push("/notification")}>
          <Ionicons name="notifications-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6B7280" />
        <TextInput placeholder={t.search} style={styles.searchInput} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {allProjects?.map((project) => (
          <ProjectCard
            key={project.ProjectID}
            title={project.ProjectName}
            imgSrc={project.ProjectThumbnail || ""}
            location={project.ProjectLocation || "Unknown Location"}
            handleClick={() => router.push(`/file/${project.ProjectID}`)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Matches inventory log
    paddingHorizontal: moderateScale(16), // Updated to moderateScale
    paddingTop: moderateScale(10), // Updated to moderateScale
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Centers title with back and notification icons
    marginBottom: moderateScale(16), // Updated to moderateScale
  },
  headerTitle: {
    fontSize: moderateScale(26), // Matches inventory log
    fontFamily: "SFPro-Bold",
    color: "#1A1A1A", // Matches inventory log
    flex: 1, // Allows title to take available space
    textAlign: "center", // Centers the title
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: moderateScale(12), // Matches inventory log
    paddingVertical: moderateScale(10), // Matches inventory log
    borderRadius: moderateScale(12), // Matches inventory log
    marginBottom: moderateScale(20), // Matches inventory log
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 }, // Matches inventory log
    shadowOpacity: 0.1, // Matches inventory log
    shadowRadius: 3, // Matches inventory log
    elevation: 2, // Matches inventory log
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(8), // Matches inventory log
    fontSize: moderateScale(16), // Matches inventory log
    fontFamily: "SFPro-Regular",
    color: "#333", // Matches inventory log
  },
  scrollContainer: {
    paddingBottom: moderateScale(20), // Matches inventory log
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(14), // Matches inventory log
    alignItems: "center",
    padding: moderateScale(16), // Matches inventory log
    marginBottom: moderateScale(14), // Matches inventory log
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // Matches inventory log
    shadowOpacity: 0.1, // Matches inventory log
    shadowRadius: 4, // Matches inventory log
    elevation: 3, // Matches inventory log
    minHeight: moderateScale(100), // Matches inventory log
  },
  cardContent: {
    flex: 1,
    justifyContent: "center", // Matches inventory log
  },
  projectImage: {
    width: moderateScale(130), // Matches inventory log
    height: moderateScale(90), // Matches inventory log
    borderRadius: moderateScale(10), // Matches inventory log
    marginRight: moderateScale(16), // Matches inventory log
    backgroundColor: "#F0F0F0", // Matches inventory log
  },
  projectTitle: {
    fontSize: moderateScale(20), // Matches inventory log
    fontFamily: "SFPro-Semibold",
    color: "#1A1A1A", // Matches inventory log
    marginBottom: moderateScale(4), // Matches inventory log
  },
  projectLocation: {
    fontSize: moderateScale(16), // Matches inventory log
    color: "#6B6B6B", // Matches inventory log
    fontFamily: "SFPro-Regular",
  },
});

export default FileSpaceScreen;