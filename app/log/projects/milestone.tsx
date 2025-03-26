import { moderateScale } from "@/utils/spacing";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Timeline from "react-native-timeline-flatlist";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { router } from "expo-router";

interface MilestoneType {
  time: string;
  title: string;
  description: string;
  circleColor: string;
  lineColor: string;
}

const Milestone = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.milestone;

  const milestones: MilestoneType[] = [
    {
      time: "1",
      title: "Project Kickoff",
      description: "Initial meeting and planning with stakeholders.",
      circleColor: "#FFB800",
      lineColor: "#E5E5E5",
    },
    {
      time: "2",
      title: "Design Phase Completion",
      description: "Completion of preliminary designs for approval.",
      circleColor: "#FFB800",
      lineColor: "#E5E5E5",
    },
    {
      time: "3",
      title: "Permit Approvals",
      description: "Securing necessary building permits.",
      circleColor: "#FFB800",
      lineColor: "#E5E5E5",
    },
    {
      time: "4",
      title: "Final Design Approval",
      description: "Approval of the finalized architectural plans.",
      circleColor: "#FFB800",
      lineColor: "#E5E5E5",
    },
    {
      time: "5",
      title: "Site Preparation",
      description: "Clearing and preparing the site for construction.",
      circleColor: "#FFB800",
      lineColor: "#E5E5E5",
    },
    {
      time: "6",
      title: "Foundation Work",
      description: "Completion of foundational elements.",
      circleColor: "#FFB800",
      lineColor: "#E5E5E5",
    },
    {
      time: "7",
      title: "Structural Framing",
      description: "Installing the main structural details (beams, roof).",
      circleColor: "#FFB800",
      lineColor: "#E5E5E5",
    },
    {
      time: "8",
      title: "MEP Installation",
      description:
        "Installation of mechanical, electrical, and plumbing systems.",
      circleColor: "#FFB800",
      lineColor: "#E5E5E5",
    },
    {
      time: "9",
      title: "Exterior Finishes",
      description: "Completion of exterior elements (walls, windows, roofing).",
      circleColor: "#FFB800",
      lineColor: "#E5E5E5",
    },
    {
      time: "10",
      title: "Interior Finishes",
      description: "Installing interior elements (drywall, paint).",
      circleColor: "#FFB800",
      lineColor: "#E5E5E5",
    },
    {
      time: "11",
      title: "Final Inspections",
      description: "Ensuring compliance with codes and standards.",
      circleColor: "#FFB800",
      lineColor: "#E5E5E5",
    },
    {
      time: "12",
      title: "Project Handover",
      description: "Final walkthrough and handover to the client.",
      circleColor: "#FFB800",
      lineColor: "#E5E5E5",
    },
  ];

  const renderDetail = (rowData: MilestoneType) => {
    return (
      <View style={styles.detailContainer}>
        <Text style={styles.title}>{rowData.title}</Text>
        <Text style={styles.description}>{rowData.description}</Text>
        <Text
          style={{
            fontSize: 12,
            color: "#666",
            fontFamily: "SFPro-Light",
            marginTop: 8,
          }}
        >
          {t.timeDate}
        </Text>
      </View>
    );
  };

  const renderTime = (rowData: MilestoneType) => {
    return (
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{rowData.time}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollableContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" onPress={() => router.back()}/>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.title}</Text>
        </View>
        <View style={{ paddingHorizontal: 24 }}>
          <Timeline
            data={milestones}
            circleSize={40}
            circleColor="#FFB800"
            lineColor="#E8E8E8"
            lineWidth={6}
            timeContainerStyle={styles.timeContainerStyle}
            descriptionStyle={styles.descriptionStyle}
            style={styles.timelineStyle}
            innerCircle="dot"
            renderDetail={renderDetail}
            renderTime={renderTime}
          />
        </View>
        <Text style={styles.timeDate}>{t.timeDate}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Milestone;

const styles = StyleSheet.create({
  timeContainerStyle: {
    minWidth: 70,
  },
  scrollableContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(16),
  },
  backButton: {
    marginRight: moderateScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Bold",
  },
  descriptionStyle: {
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  timelineStyle: {
    paddingTop: 16,
  },
  timeContainer: {
    alignItems: "center",
    position: "absolute",
    left: 18,
    paddingTop: 12,
    zIndex: 100,
  },
  timeText: {
    fontSize: 13,
    color: "#000",
    fontFamily: "SFPro-Black",
    zIndex: 100,
  },
  detailContainer: {
    flex: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: "SFPro-Bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  timeDate: {
    fontSize: 12,
    color: "#666",
    fontFamily: "SFPro-Regular",
    marginTop: 16,
    paddingHorizontal: 24,
  },
});
