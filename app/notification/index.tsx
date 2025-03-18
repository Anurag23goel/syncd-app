import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const NotificationScreen = () => {
  const [selectedTab, setSelectedTab] = useState<"All" | "Mentioned">("All");
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].notification;

  const notifications = [
    {
      id: 1,
      title: "New message",
      content: "Content",
      time: "Time",
      icon: <Ionicons name="chatbubble-outline" size={24} color="#FFF" />,
      bgColor: "#3498DB",
    },
    {
      id: 2,
      title: "Meeting reminder",
      content: "Content",
      time: "Time",
      icon: <Feather name="calendar" size={24} color="#FFF" />,
      bgColor: "#0060B0",
    },
    {
      id: 3,
      title: "New member added",
      content: "Content",
      time: "Time",
      icon: <Feather name="user-plus" size={24} color="#FFF" />,
      bgColor: "#B827B8",
    },
    {
      id: 4,
      title: "Task Completed",
      content: "Content",
      time: "Time",
      icon: <Feather name="check-square" size={24} color="#FFF" />,
      bgColor: "#27AE60",
    },
    {
      id: 5,
      title: "File uploaded",
      content: "Content",
      time: "Time",
      icon: <Feather name="file-plus" size={24} color="#FFF" />,
      bgColor: "#955C34",
    },
    {
      id: 6,
      title: "Mentions",
      content: "Content",
      time: "Time",
      icon: <Feather name="info" size={24} color="#FFF" />,
      bgColor: "#969696",
    },
    {
      id: 7,
      title: "Comment",
      content: "File name / Project name",
      time: "Time",
      icon: <Ionicons name="chatbox-outline" size={24} color="#FFF" />,
      bgColor: "#D90091",
    },
    {
      id: 8,
      title: "Milestone Achievement",
      content: "Achievement Name\nProject Name",
      time: "Time",
      icon: <Feather name="star" size={24} color="#FFF" />,
      bgColor: "#FFB800",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t.title}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "All" && styles.activeTab]}
          onPress={() => setSelectedTab("All")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "All" && styles.activeTabText,
            ]}
          >
            {t.all}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Mentioned" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("Mentioned")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Mentioned" && styles.activeTabText,
            ]}
          >
            Mentioned
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <View
              style={[styles.iconContainer, { backgroundColor: item.bgColor }]}
            >
              {item.icon}
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationDescription}>{item.content}</Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 30,
    fontFamily: "SFPro-Semibold",
    marginLeft: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    width: "70%",
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 6,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  tabText: {
    fontSize: 12,
    color: "#8C8C8C",
    fontFamily: "SFPro-Medium",
  },
  activeTabText: {
    color: "#F2F2F2",
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: "SFPro-Semibold",
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 14,
    color: "#888",
    fontFamily: "SFPro-Regular",
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: "SFPro-Regular",
    color: "#AAA",
  },
});

export default NotificationScreen;
