import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Filter_Calendar from "@/components/Tabs/home/Filter_Calendar";
import { router } from "expo-router";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface TimelineButton {
  id: string;
  label: string;
}

export default function AttendanceLog({ onBack }: { onBack: () => void }) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.attendance;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState("today");

  const timelineButtons: TimelineButton[] = [
    { id: "today", label: t.timeline.today },
    { id: "yesterday", label: t.timeline.yesterday },
    { id: "this-week", label: t.timeline.thisWeek },
    { id: "previous-week", label: t.timeline.previousWeek },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.title}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t.search}
          placeholderTextColor="#888"
        />
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
      </View>
      <View
        style={{
          backgroundColor: "#FFf",
          marginVertical: 10,
          padding: 16,
          borderRadius: 10,
        }}
      >
        <Filter_Calendar type="Attendance" />
      </View>

      <ScrollView style={styles.dateList}>
        <View
          style={styles.dateItem}
          onTouchEnd={() => router.push("/log/projects/date_specific_history")}
        >
          <Text style={styles.dateItemText}>14-10-24</Text>
        </View>
        <View style={styles.dateItem}>
          <Text style={styles.dateItemText}>Date</Text>
        </View>
        <View style={styles.dateItem}>
          <Text style={styles.dateItemText}>Date</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: moderateScale(16),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: moderateScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: moderateScale(16),
    backgroundColor: "#fff",
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(10),
  },
  searchInput: {
    flex: 1,
    height: moderateScale(40),
    fontSize: moderateScale(16),
    color: "#000",
    fontFamily: "SFPro-Regular",
  },
  searchIcon: {
    marginLeft: moderateScale(8),
  },
  dateSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: moderateScale(16),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  dateText: {
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Medium",
    color: "#000",
  },
  dateIcons: {
    flexDirection: "row",
    gap: moderateScale(16),
  },
  iconButton: {
    padding: moderateScale(4),
  },
  timelineSection: {
    padding: moderateScale(16),
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Medium",
    marginBottom: moderateScale(12),
    color: "#000",
  },
  timelineButtons: {
    gap: moderateScale(8),
  },
  timelineButton: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  selectedTimelineButton: {
    backgroundColor: "#FFB800",
    borderColor: "#FFB800",
  },
  timelineButtonText: {
    fontSize: moderateScale(14),
    color: "#000",
    textAlign: "center",
  },
  selectedTimelineButtonText: {
    color: "#000",
    fontFamily: "SFPro-Medium",
  },
  dateList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  dateItem: {
    padding: moderateScale(16),
  },
  dateItemText: {
    fontSize: moderateScale(16),
    color: "#000",
    fontFamily: "SFPro-Regular",
  },
});
