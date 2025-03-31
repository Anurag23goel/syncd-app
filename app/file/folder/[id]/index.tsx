import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import FileItem, { FileItemProps } from "@/components/Card/FileCard";
import { router, useLocalSearchParams } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { GET_FILES_OF_FOLDER } from "@/services/project_user/file_space/file";
import { useAuthStore } from "@/store/authStore";
import { SINGLE_FILE } from "@/types/NewApiTypes";

const Folder = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].file;
  const { id } = useLocalSearchParams();
  const folderID = Array.isArray(id) ? id[0] : id;
  const projectID = useAuthStore.getState().projectID;
  const authToken = useAuthStore.getState().token;

  const [files, setFiles] = useState<SINGLE_FILE[]>([]);

  const fetchFilesOfFolder = async () => {
    try {
      if (!projectID || !folderID || !authToken) return;
      const response = await GET_FILES_OF_FOLDER(
        projectID,
        folderID,
        authToken
      );
      setFiles(response.files || []);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchFilesOfFolder();
  }, [projectID, folderID, authToken]);

  // Optional helper to determine icon type based on MIME type
  const getIconType = (fileType: string): FileItemProps["iconType"] => {
    if (fileType.startsWith("image")) return "image";
    if (fileType.startsWith("video")) return "video";
    if (fileType.startsWith("audio")) return "audio";
    if (fileType === "application/pdf") return "file";
    return "file";
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
          <Text style={styles.headerTitle}>{t.folder}</Text>
        </View>

        {files.length === 0 ? (
          <Text style={{ color: "#999", textAlign: "center" }}>
            {t.noFilesFound || "No files found"}
          </Text>
        ) : (
          files.map((file) => (
            <FileItem
              key={file.FileID}
              name={file.FileName}
              date={new Date(file.createdAt).toDateString()}
              size="--" // Replace with actual size if available
              iconType={getIconType(file.FileType)}
              sharedWith="all" // Replace with actual data if available
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Folder;

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
  },
});
