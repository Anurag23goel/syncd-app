import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import FileModal from "@/components/Modal/FileModal";
import FolderItem from "@/components/Card/FolderCard";
import { useAuthStore } from "@/store/authStore";
import { GET_ALL_FOLDERS_FOR_PROJECT } from "@/services/project_user/file_space/folder";
import { SINGLE_FOLDER } from "@/types/NewApiTypes";

const ProjectStages = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].file;
  const projectID = useAuthStore.getState().projectID;
  const authToken = useAuthStore.getState().token;

  const [folders, setFolders] = useState<SINGLE_FOLDER[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchProjectStageFolders = async () => {
    try {
      if (!projectID || !authToken) return;
      const response = await GET_ALL_FOLDERS_FOR_PROJECT(projectID, authToken);
      const filtered = response.Folders.filter(
        (f: SINGLE_FOLDER) => f.FolderType === "PROJECT_STAGE"
      );
      setFolders(filtered);
    } catch (error: any) {
      console.log("Error fetching project stage folders:", error.message);
    }
  };

  useEffect(() => {
    fetchProjectStageFolders();
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
          <Text style={styles.headerTitle}>{t.projectStage}</Text>
        </View>

        {folders.map((folder) => (
          <FolderItem
            key={folder.FolderID}
            name={folder.FolderName}
            date={
              folder.createdAt ? new Date(folder.createdAt).toDateString() : ""
            }
            folderId={folder.FolderID}
          />
        ))}
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

export default ProjectStages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 16,
  },
  scrollContainer: {},
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "SFPro-Medium",
    marginLeft: 16,
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
