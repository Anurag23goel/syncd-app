import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Pressable,
} from "react-native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AnimatedProjectCardProps {
  title: string;
  date?: string;
  size: string;
  iconName: string;
  iconColor: string;
  folderSize: number;
  folderType: "DAILY_PROGRESS" | "PROJECT_STAGE";
}

const AnimatedProjectCard: React.FC<AnimatedProjectCardProps> = ({
  title,
  size,
  iconName,
  iconColor,
  folderType,
  folderSize,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].file;

  const toggleMenu = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMenuVisible(!menuVisible);
    Animated.timing(fadeAnim, {
      toValue: menuVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const path =
    folderType === "DAILY_PROGRESS" ? "dailyProgress" : "projectStages";

  return (
    <View style={styles.projectCard}>
      {menuVisible ? (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Pressable
              onPress={() => router.push(`/file/${path}`)}
              style={[styles.iconContainer1, { backgroundColor: iconColor }]}
            >
              <Feather name={iconName as any} size={24} color="#FFFFFF" />
            </Pressable>
            <View style={styles.contentContainer1}>
              <View style={styles.textContainer}>
                <Text style={styles.projectTitle}>{title}</Text>
                <Text
                  style={styles.projectInfo}
                >{`${size} - ${folderSize}`}</Text>
                <View style={styles.membersContainer}>
                  <MaterialIcons
                    name="people-outline"
                    size={16}
                    color="#B5B5B5"
                  />
                  <Text style={styles.projectMembers}>{t.entireTeam}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={toggleMenu}>
                <Ionicons name="ellipsis-vertical" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </View>

          <Animated.View style={[styles.accordionMenu]}>
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
          </Animated.View>
        </>
      ) : (
        <>
          <Pressable
            onPress={() => router.push(`/file/${path}`)}
            style={[styles.iconContainer, { backgroundColor: iconColor }]}
          >
            <Feather name={iconName as any} size={40} color="#FFFFFF" />
          </Pressable>
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.projectTitle}>{title}</Text>
              <Text
                style={styles.projectInfo}
              >{`${size} - ${folderSize}`}</Text>
              <View style={styles.membersContainer}>
                <MaterialIcons
                  name="people-outline"
                  size={16}
                  color="#B5B5B5"
                />
                <Text style={styles.projectMembers}>{t.entireTeam}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={toggleMenu}>
              <Ionicons name="ellipsis-vertical" size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  projectCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  iconContainer: {
    height: 80,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 6,
    marginBottom: 12,
  },
  iconContainer1: {
    height: 60,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    borderRadius: 6,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  contentContainer1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    paddingRight: 4,
  },
  textContainer: {
    width: "80%",
  },
  projectTitle: {
    fontSize: 18,
    fontFamily: "SFPro-Semibold",
    color: "#1A1A1A",
  },
  projectInfo: {
    fontSize: 14,
    color: "#B5B5B5",
    fontFamily: "SFPro-Medium",
    marginTop: 4,
  },
  membersContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  projectMembers: {
    fontSize: 12,
    color: "#B5B5B5",
    fontFamily: "SFPro-Regular",
  },
  accordionMenu: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuItemText: {
    marginLeft: 8,
    fontSize: 15,
    fontFamily: "SFPro-Regular",
    color: "#6B6B6B",
  },
});

export default AnimatedProjectCard;
