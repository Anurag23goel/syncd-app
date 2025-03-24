import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { useAuthStore } from "@/store/authStore";
import { ProjectDetailsResponse } from "@/types/Apitypes";
import { getAllUserProjects } from "@/services/project_other_user";

const RecentProjects = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs;
  const setToken = useAuthStore((state) => state.setToken);
  const user = useAuthStore((state) => state.user);
  const [recentProjects, setRecentProjects] = useState<
    ProjectDetailsResponse[] | null
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const Greeting = () => {
    const hour = new Date().getHours();

    let greeting;
    if (hour < 12) {
      greeting = `Good Morning, ${user.UserFullName.split(" ")[0]}`; // or t('goodMorning')
    } else if (hour < 18) {
      greeting = `Good Afternoon, ${user.UserFullName.split(" ")[0]}`; // or t('goodAfternoon')
    } else {
      greeting = `Good Evening, ${user.UserFullName.split(" ")[0]}`; // or t('goodEvening')
    }

    return <Text style={styles.greetingText}>{greeting}</Text>;
  };



  // Fetch all projects from the API
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
          setRecentProjects(response.data.projects.slice(0, 3).reverse()); // Update state with projects array
        } else {
          console.warn("No projects found in response.");
          setRecentProjects([]); // Set empty array if no projects found
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchRecentProjects();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.greetingContainer}>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Image
              source={
                user.UserProfilePicture
                  ? { uri: user.UserProfilePicture }
                  : require("../../../assets/images/avatar.png")
              }
              style={styles.avatar}
              
            />
          </TouchableOpacity>
          {Greeting()}
        </View>
        <TouchableOpacity onPress={() => router.push("/notification")}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="gray" />
        <TextInput placeholder={t.search} style={styles.searchInput} />
      </View>
      <Text style={styles.sectionTitle}>{t.recentProjects}</Text>
      {recentProjects && recentProjects.length > 0 ? (
        recentProjects.map((project) => (
          <View style={styles.projectCard} key={project.ProjectID}>
            <Image
              source={
                project.ProjectThumbnail
                  ? { uri: project.ProjectThumbnail }
                  : require("../../../assets/images/recent.png")
              }
              style={styles.projectImage}
            />
            <Text style={styles.projectTitle}>{project.ProjectName}</Text>
            <Text style={styles.projectLocation}>
              {project.ProjectLocation || "Unknown Location"}
            </Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>{t.workDone}</Text>
                <Text style={styles.infoValueGreen}>
                  {project.progress.percentage}%
                </Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>{t.deadline}</Text>
                <Text style={styles.infoValueBlue}>
                  {project.EndDate
                    ? new Date(project.EndDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Unknown Deadline"}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#002347",
                    fontFamily: "SFPro-Regular",
                  }}
                >
                  2024
                </Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text>No Projects</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  greetingText: {
    fontSize: 18,
    color: "#333",
    fontFamily: "SFPro-Bold",
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "SFPro-Semibold",
    marginBottom: 12,
  },
  projectCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 13,
  },
  projectImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 25,
    color: "#1A1A1A",
    fontFamily: "SFPro-Bold",
  },
  projectLocation: {
    fontSize: 12,
    color: "#6B6B6B",
    fontFamily: "SFPro-Regular",
    marginTop: 4,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  infoBox: {
    alignItems: "flex-start",
    backgroundColor: "#F7F7F7",
    width: "48%",
    padding: 12,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 10,
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
  infoValueGreen: {
    fontSize: 25,
    color: "#27AE60",
    fontFamily: "SFPro-Bold",
    marginTop: 4,
  },
  infoValueBlue: {
    fontSize: 20,
    color: "#002347",
    fontFamily: "SFPro-Bold",
    marginTop: 4,
  },
});

export default RecentProjects;
