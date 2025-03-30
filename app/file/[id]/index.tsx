import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  UIManager,
  LayoutAnimation,
  Animated,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import FileModal from "@/components/Modal/FileModal";
import FileItem from "@/components/Card/FileCard";
import AnimatedProjectCard from "@/components/Card/ProjectCard";
import DateCard from "@/components/Card/DateCard";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { GET_ALL_FOLDERS_FOR_PROJECT } from "@/services/project_user/file_space/folder";
import { SINGLE_FOLDER } from "@/types/NewApiTypes";

const ProjectDetailsScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].file;
  const authToken = useAuthStore.getState().token;
  const { id } = useLocalSearchParams();
  const projectID = Array.isArray(id) ? id[0] : id;
  const [folders, setFolders] = useState<SINGLE_FOLDER[]>([]);

  const dailyWorkProgressFolders = folders.find(
    (folder) => folder.FolderType === "DAILY_PROGRESS"
  );
  const projectStageFolders = folders.find(
    (folder) => folder.FolderType === "PROJECT_STAGE"
  );

  console.log(authToken);
  console.log(projectID);

  const fetch_all_folders = async () => {
    try {
      if (!authToken) {
        return;
      }
      const response = await GET_ALL_FOLDERS_FOR_PROJECT(projectID, authToken);
      setFolders(response.Folders);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  useEffect(() => {
    fetch_all_folders();
  }, [projectID, authToken]);

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
          <Text style={styles.headerTitle}>{t.projectTitle}</Text>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput placeholder={t.search} style={styles.searchInput} />
        </View>

        <AnimatedProjectCard
          title={t.dailyWorkProgress}
          date={t.date}
          size={t.folderSize}
          iconName="calendar"
          iconColor="#002D62"
        />
        <AnimatedProjectCard
          title={t.projectStage}
          date={t.date}
          size={t.folderSize}
          iconName="database"
          iconColor="#E74C3C"
        />



        {/* <Text style={styles.sectionTitle}>{t.title}</Text>
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <TouchableOpacity style={styles.activeTab}>
              <Text style={styles.tabTextActive}>{t.recent}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inactiveTab}>
              <Text style={styles.tabTextInactive}>{t.shared}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FileItem
          name="audioFile"
          date={t.date}
          size={t.fileSize}
          iconType="audio"
        />
        <FileItem
          name="videoFile"
          date={t.date}
          size={t.fileSize}
          iconType="video"
          sharedWith={1}
        />
        <FileItem
          name="imageFile"
          date={t.date}
          size={t.fileSize}
          iconType="image"
          sharedWith={2}
        />
        <FileItem
          name="document"
          date={t.date}
          size={t.fileSize}
          iconType="file"
          sharedWith="all"
        />
        <FileItem
          name="foldername"
          date={t.date}
          size={t.filesize}
          iconType="folder"
          sharedWith="all"
        />
        <Text style={styles.sectionTitle}>{t.other}</Text>
        <FileItem
          name="archive"
          date={t.date}
          size={t.filesize}
          iconType="archive"
          sharedWith="all"
        />
        <FileItem
          name="vendor"
          date={t.date}
          size={t.filesize}
          iconType="truck"
          sharedWith="all"
        /> */}



      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      <FileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
    fontFamily: "SFPro-Medium",
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "SFPro-Regular",
  },
  projectCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  projectImage: {
    width: "100%",
    height: 80,
    borderRadius: 6,
  },
  projectTitle: {
    fontSize: 18,
    fontFamily: "SFPro-Semibold",
    color: "#1A1A1A",
    marginTop: 12,
  },
  projectInfo: {
    fontSize: 14,
    color: "#B5B5B5",
    fontFamily: "SFPro-Medium",
    marginTop: 4,
  },
  projectMembers: {
    fontSize: 12,
    color: "gray",
    fontFamily: "SFPro-Regular",
  },
  accordionMenu: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
    fontFamily: "SFPro-Regular",
    color: "#000",
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "SFPro-Semibold",
    marginBottom: 8,
    color: "#1A1A1A",
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 12,
    width: "80%",
    gap: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  activeTab: {
    flex: 1,
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  inactiveTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E0E0E0",
  },
  tabTextActive: {
    color: "white",
    fontSize: 14,
    fontFamily: "SFPro-Semibold",
  },
  tabTextInactive: {
    color: "#8C8C8C",
    fontSize: 14,
    fontFamily: "SFPro-Semibold",
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  fileItemContainer: {
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
  },
  fileIcon: {
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontFamily: "SFPro-Medium",
    color: "#1A1A1A",
  },
  fileInfo: {
    fontSize: 12,
    color: "#B5B5B5",
    fontFamily: "SFPro-Regular",
  },
  sharedWith: {
    fontSize: 12,
    color: "#B5B5B5",
    fontFamily: "SFPro-Regular",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "20%",
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

export default ProjectDetailsScreen;
