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
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { getAllUserProjects } from "@/services/project_other_user";
import { ProjectDetailsResponse } from "@/types/Apitypes";
import { useAuthStore } from "@/store/authStore";

interface ProjectCardProps {
  title: string;
  location: string;
  imgSrc:string
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
      source={imgSrc
        ? { uri: imgSrc }
        : require("../../assets/images/recent.png")}
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
    ProjectDetailsResponse[] | null
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const authToken = useAuthStore.getState().token;

        if (!authToken) {
          console.error("No auth token found!");
          return;
        }

        const response = await getAllUserProjects(authToken);

        // Check if response contains the "projects" key and set state
        if (response.data?.projects) {
          setAllProjects(response.data.projects); // ✅ Update state with projects array
        } else {
          console.warn("No projects found in response.");
          setAllProjects([]); // Set empty array if no projects found
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
        <Text style={styles.headerTitle}>{t.fileSpace}</Text>
        <TouchableOpacity onPress={() => router.push("/notification")}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="gray" />
        <TextInput placeholder={t.search} style={styles.searchInput} />
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {allProjects?.map((project) => (
          <ProjectCard
            key={project.ProjectID}
            title={project.ProjectName}
            imgSrc={project.ProjectThumbnail || ""}
            location={project.ProjectLocation}
            handleClick={() => router.push(`/file`)}
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
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "SFPro-Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "SFPro-Regular",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    padding: 12,
    marginBottom: 16,
  },
  cardContent: {
    flex: 1,
  },
  projectImage: {
    width: 100,
    height: 130,
    borderRadius: 8,
    marginRight: 12,
  },
  projectTitle: {
    fontSize: 28,
    marginBottom: 4,
    fontFamily: "SFPro-Bold",
    color: "#1A1A1A",
  },
  projectLocation: {
    fontSize: 12,
    color: "#6B6B6B",
    fontFamily: "SFPro-Medium",
    marginBottom: 8,
  },
});

export default FileSpaceScreen;
