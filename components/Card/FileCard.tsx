import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  TouchableOpacity,
  Animated,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FileItemProps {
  name: string;
  date: string;
  size: string;
  iconType:
    | "audio"
    | "video"
    | "file"
    | "image"
    | "folder"
    | "truck"
    | "archive"
    | "date";
  sharedWith?: "all" | number;
}

const FileItem: React.FC<FileItemProps> = ({
  name,
  date,
  size,
  iconType,
  sharedWith,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].file;

  const toggleMenu = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const toggleStar = () => {
    setIsStarred(!isStarred);
    toggleMenu(); // Optional: Close menu after selecting star
  };

  // Choose the icon based on the type
  const renderIcon = () => {
    switch (iconType) {
      case "video":
        return <Feather name="video" size={20} color="#FFFFFF" />;
      case "file":
        return <Feather name="file" size={20} color="#FFFFFF" />;
      case "image":
        return <Feather name="image" size={20} color="#FFFFFF" />;
      case "folder":
        return <Feather name="folder" size={24} color="#FFFFFF" />;
      case "truck":
        return <Feather name="truck" size={24} color="#FFFFFF" />;
      case "archive":
        return <Feather name="archive" size={24} color="#FFFFFF" />;
      case "date":
        return <Feather name="folder" size={24} color="#FFFFFF" />;
      default:
        return <Feather name="file" size={20} color="#FFFFFF" />;
    }
  };

  // Helper function to get colors for different file types
  const getIconColor = (type: string) => {
    switch (type) {
      case "video":
        return "#0060B0";
      case "file":
        return "#27AE60";
      case "image":
        return "#FFB800";
      case "folder":
        return "#8C8C8C";
      case "truck":
        return "#3498DB";
      case "archive":
        return "#D99600";
      case "date":
        return "#FFB800";
      default:
        return "#27AE60";
    }
  };

  // Navigate based on icon type
  const handlePress = () => {
    if (iconType === "date") {
      router.push("/file/date");
    }
    if (iconType === "folder") {
      router.push("/file/folder");
    } else {
      router.push("/file/annoation");
    }
  };

  const renderSharedWith = () => {
    if (sharedWith === "all") {
      return t.entireTeam;
    } else if (typeof sharedWith === "number") {
      return `${sharedWith} ${sharedWith === 1 ? t.person : t.people}`;
    }
    return "";
  };

  // Helper function to get translation key for file names
  const getTranslatedName = (name: string) => {
    // First try direct translation
    const directKey = name.toLowerCase().replace(/ /g, "") as keyof typeof t;
    if (t[directKey]) {
      return t[directKey];
    }

    // If no direct translation, try mapping file types
    switch (iconType) {
      case "audio":
        return t.audioFile;
      case "video":
        return t.videoFile;
      case "image":
        return t.imageFile;
      case "file":
        return t.document;
      case "folder":
        return t.folder;
      case "truck":
        return t.vendor;
      case "archive":
        return t.archive;
      default:
        return name;
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.fileItemContainer}>
      <View style={styles.fileItem}>
        <View
          style={[
            styles.fileIcon,
            {
              backgroundColor: getIconColor(iconType),
              width:
                iconType === "folder" ||
                iconType === "truck" ||
                iconType === "archive" ||
                iconType === "date"
                  ? 60
                  : 40,
              height:
                iconType === "folder" ||
                iconType === "truck" ||
                iconType === "archive" ||
                iconType === "date"
                  ? 60
                  : 40,
            },
          ]}
        >
          {renderIcon()}
        </View>
        <View style={styles.fileDetails}>
          <Text style={styles.fileName}>{getTranslatedName(name)}</Text>
          <Text style={styles.fileInfo}>
            {t.date} • {t.fileSize}
          </Text>
          {sharedWith && (
            <Text style={styles.sharedWith}>
              {t.sharedWith} {renderSharedWith()}
            </Text>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={toggleStar}
            style={{ position: "absolute", right: 30 }}
          >
            {isStarred && <Feather name="star" size={18} color="#B5B5B5" />}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMenu}>
            <Ionicons name="ellipsis-vertical" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      {expanded && (
        <Animated.View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Feather name="download" size={20} color="#6B6B6B" />
            <Text style={styles.menuItemText}>{t.download}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Feather name="save" size={20} color="#6B6B6B" />
            <Text style={styles.menuItemText}>{t.save}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Feather name="share-2" size={20} color="#6B6B6B" />
            <Text style={styles.menuItemText}>{t.share}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Feather name="star" size={20} color="#6B6B6B" />
            <Text style={styles.menuItemText}>{t.star}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Feather name="edit" size={20} color="#6B6B6B" />
            <Text style={styles.menuItemText}>{t.edit}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Feather name="message-square" size={20} color="#6B6B6B" />
            <Text style={styles.menuItemText}>{t.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Feather name="trash-2" size={20} color="#6B6B6B" />
            <Text style={styles.menuItemText}>{t.delete}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fileItemContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  fileItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  fileIcon: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginRight: 16,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  fileInfo: {
    fontSize: 12,
    color: "#999",
  },
  sharedWith: {
    fontSize: 12,
    color: "#B5B5B5",
  },
  actions: {
    position: "relative",
    top: -7,
  },
  menu: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuItemText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#6B6B6B",
  },
});

export default FileItem;
