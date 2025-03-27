import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { moderateScale } from "@/utils/spacing";
import Timeline from "react-native-timeline-flatlist";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { MilestoneData } from "@/types/NewApiTypes"; // Ensure correct path

const { width } = Dimensions.get("window");

interface MilestoneType {
  time: string;
  title: string;
  description: string;
  circleColor: string;
  lineColor: string;
}

export default function ProjectOverview({ milestoneData }: { milestoneData?: MilestoneData }) {
  
  const [activeTab, setActiveTab] = useState("graph");
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs.paymentLog.milestone;

  // Dynamic chart data based on milestone records
  const generateChartData = () => {
    if (!milestoneData?.records.length) {
      return {
        labels: ["No Data"],
        datasets: [
          { data: [0], color: (opacity = 1) => `rgba(0, 29, 255, ${opacity})`, strokeWidth: 2 },
          { data: [0], color: (opacity = 1) => `rgba(255, 118, 100, ${opacity})`, strokeWidth: 2 },
        ],
      };
    }

    // Sort milestones by date (assuming a date field like `dueDate` or `createdAt`)
    const sortedMilestones = milestoneData.records.sort((a, b) => {
      const dateA = new Date(a.dueDate || a.createdAt || "2025-01-01").getTime();
      const dateB = new Date(b.dueDate || b.createdAt || "2025-01-01").getTime();
      return dateA - dateB;
    });

    const labels = sortedMilestones.map((m) =>
      new Date(m.dueDate || m.createdAt || "2025-01-01").toLocaleString("default", { month: "short" })
    );
    const completedData = sortedMilestones.map((m) => (m.status === "completed" ? 100 : 0));
    const pendingData = sortedMilestones.map((m) => (m.status === "pending" ? 100 : 0));

    return {
      labels: [...new Set(labels)], // Remove duplicate months
      datasets: [
        {
          data: completedData,
          color: (opacity = 1) => `rgba(0, 29, 255, ${opacity})`, // Blue for completed
          strokeWidth: 2,
        },
        {
          data: pendingData,
          color: (opacity = 1) => `rgba(255, 118, 100, ${opacity})`, // Red for pending
          strokeWidth: 2,
        },
      ],
    };
  };

  const chartData = generateChartData();

  // Dynamic timeline data based on milestone records
  const generateMilestones = (): MilestoneType[] => {
    if (!milestoneData?.records.length) {
      return [
        {
          time: "N/A",
          title: t.noMilestones || "No Milestones",
          description: "No milestones available",
          circleColor: "#666",
          lineColor: "#E5E5E5",
        },
      ];
    }

    return milestoneData.records.map((m, index) => ({
      time: new Date(m.dueDate || m.createdAt || "2025-01-01").toLocaleDateString(),
      title: m.title || `Milestone ${index + 1}`,
      description: m.description || "No description provided",
      circleColor: m.status === "completed" ? "#4CAF50" : "#FFB800", // Green for completed, yellow for pending
      lineColor: "#E5E5E5",
    }));
  };

  const milestones = generateMilestones();

  const renderDetail = (rowData: MilestoneType) => (
    <View style={styles.detailContainer}>
      <Text style={styles.title}>{rowData.title}</Text>
      <Text style={styles.description}>{rowData.description}</Text>
      <Text style={{ fontSize: 12, color: "#666", fontFamily: "SFPro-Light", marginTop: 8 }}>
        {rowData.time}
      </Text>
    </View>
  );

  const renderTime = (rowData: MilestoneType) => (
    <View style={styles.timeContainer}>
      <Text style={styles.timeText}>
        {rowData.time === "N/A" ? "N/A" : new Date(rowData.time).getDate()}
      </Text>
    </View>
  );

  const renderGraph = () => (
    <View>
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>{t.progressOverview}</Text>
        <Text style={styles.graphSubtitle}>
          {milestoneData?.records.length
            ? `${new Date(milestoneData.records[0].dueDate || milestoneData.records[0].createdAt || "2025-01-01").toLocaleString("default", { month: "short" })} - ${new Date(
                milestoneData.records[milestoneData.records.length - 1].dueDate || milestoneData.records[milestoneData.records.length - 1].createdAt || "2025-01-01"
              ).toLocaleString("default", { month: "short" })}`
            : "No Data"}
        </Text>
        <LineChart
          data={chartData}
          width={width}
          height={250}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            fillShadowGradient: "#4183D7",
            fillShadowGradientOpacity: 0.2,
            propsForBackgroundLines: { strokeWidth: 0 },
            propsForDots: { r: "0" },
            propsForHorizontalLabels: { opacity: 0 },
            propsForVerticalLabels: { opacity: 0 },
          }}
          bezier
          withHorizontalLabels={false}
          withVerticalLabels={false}
          withInnerLines={false}
          style={styles.chart}
        />
      </View>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#4183D7" }]} />
          <Text style={styles.legendText}>{t.progress}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#E74C3C" }]} />
          <Text style={styles.legendText}>{t.delayed}</Text>
        </View>
      </View>
    </View>
  );

  const renderMap = () => (
    <ScrollView contentContainerStyle={styles.scrollableContent}>
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
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "graph" && styles.activeTab]}
          onPress={() => setActiveTab("graph")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "graph" && styles.activeTabText,
            ]}
          >
            {t.graph}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "map" && styles.activeTab]}
          onPress={() => setActiveTab("map")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "map" && styles.activeTabText,
            ]}
          >
            {t.map}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === "graph" ? renderGraph() : renderMap()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: moderateScale(10),
    borderRadius: moderateScale(12),
    overflow: "hidden",
  },
  tabs: {
    flexDirection: "row",
    borderRadius: moderateScale(8),
    backgroundColor: "#F2F2F7",
    margin: moderateScale(16),
    padding: moderateScale(2),
  },
  tab: {
    flex: 1,
    paddingVertical: moderateScale(8),
    alignItems: "center",
    borderRadius: moderateScale(6),
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: moderateScale(12),
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  activeTabText: {
    color: "#fff",
    fontFamily: "SFPro-Semibold",
  },
  content: {
    flex: 1,
  },
  scrollableContent: {
    paddingBottom: moderateScale(20),
  },
  graphContainer: {
    padding: moderateScale(16),
    backgroundColor: "#fff",
    height: 300,
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(16),
  },
  graphTitle: {
    fontSize: moderateScale(20),
    fontFamily: "SFPro-Bold",
    textAlign: "center",
    marginBottom: moderateScale(4),
  },
  graphSubtitle: {
    fontSize: moderateScale(14),
    color: "#666",
    fontFamily: "SFPro-Regular",
    textAlign: "center",
    marginBottom: moderateScale(16),
  },
  chart: {
    borderRadius: moderateScale(12),
    marginVertical: moderateScale(8),
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: moderateScale(20),
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: moderateScale(16),
  },
  legendDot: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    marginRight: moderateScale(8),
  },
  legendText: {
    fontSize: moderateScale(14),
    color: "#666",
    fontFamily: "SFPro-Regular",
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
  timeContainerStyle: {
    minWidth: 70,
  },
  descriptionStyle: {
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  timelineStyle: {
    paddingTop: 16,
  },
});