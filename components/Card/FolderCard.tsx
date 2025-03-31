import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { useRouter } from "expo-router";

interface FolderItemProps {
  name: string;
  date: string;
  folderId: string;
}

const FolderItem: React.FC<FolderItemProps> = ({ name, date, folderId }) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].file;
  const router = useRouter();

  const handleOpenFolder = () => {
    router.push(`/file/folder/${folderId}`);
  };

  return (
    <TouchableOpacity onPress={handleOpenFolder} style={styles.folderItem}>
      <View style={[styles.iconContainer]}>
        <Feather name="folder" size={24} color="#fff" />
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>{date}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  folderItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
  },
  iconContainer: {
    backgroundColor: "#8C8C8C",
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  meta: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
});

export default FolderItem;
