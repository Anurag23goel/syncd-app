import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  TextInput,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { moderateScale } from "@/utils/spacing";
import Timeline from "react-native-timeline-flatlist";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const { width } = Dimensions.get("window");

interface Milestone {
  id: number;
  title: string;
  description: string;
  date: string;
}

interface MilestoneType {
  time: string;
  title: string;
  description: string;
  circleColor: string;
  lineColor: string;
}

const chartData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
  ],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43, 50, 70, 30, 60],
      color: (opacity = 1) => `rgba(0, 29, 255, ${opacity})`,
      strokeWidth: 2,
    },
    {
      data: [10, 30, 20, 50, 70, 30, 40, 60, 20, 40],
      color: (opacity = 1) => `rgba(255, 118, 100, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

export default function ProjectOverview() {
  const [activeTab, setActiveTab] = useState("graph");
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs.paymentLog.milestone;

  const generateMilestones = () => {
    const milestoneKeys = Object.keys(t.milestones);
    return milestoneKeys.map((key, index) => ({
      time: (index + 1).toString(),
      title: t.milestones[key as keyof typeof t.milestones].title,
      description: t.milestones[key as keyof typeof t.milestones].description,
      circleColor: "#FFB800",
      lineColor: "#E5E5E5",
    }));
  };

  const milestones: MilestoneType[] = generateMilestones();

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

  const renderGraph = () => (
    <View>
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>{t.progressOverview}</Text>
        <Text style={styles.graphSubtitle}>Jan 14 - Oct 30</Text>
        <View
          style={{
            flex: 1,
            position: "absolute",
            left: -30,
            bottom: 0,
          }}
        >
          <LineChart
            data={chartData}
            width={width} // Changed to take full width
            height={250}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              fillShadowGradient: "#4183D7",
              fillShadowGradientOpacity: 0.2,
              propsForBackgroundLines: {
                strokeWidth: 0, // Removes background lines
              },
              propsForDots: {
                r: "0",
              },
              propsForHorizontalLabels: {
                opacity: 0, // Hides horizontal axis labels
              },
              propsForVerticalLabels: {
                opacity: 0, // Hides vertical axis labels
              },
            }}
            bezier
            withHorizontalLabels={false} // Removes horizontal labels
            withVerticalLabels={false} // Removes vertical labels
            withInnerLines={false} // Removes gridlines
            style={styles.chart}
          />
        </View>
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
    <View style={{ flex: 1 }}>
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
    </View>
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
    flex: 1,
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
  mapContainer: {
    padding: moderateScale(16),
    flex: 1, // Make the milestone container scrollable
  },
  milestoneContainer: {
    flexDirection: "row",
    marginBottom: moderateScale(24),
  },
  milestoneIconContainer: {
    alignItems: "center",
    marginRight: moderateScale(16),
  },
  milestoneIcon: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: "#FFB340",
    justifyContent: "center",
    alignItems: "center",
  },
  milestoneIconText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Bold",
  },
  milestoneLine: {
    width: moderateScale(2),
    flex: 1,
    backgroundColor: "#FFB340",
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Bold",
  },
  milestoneDescription: {
    fontSize: moderateScale(14),
    color: "#666",
    marginBottom: moderateScale(4),
    fontFamily: "SFPro-Regular",
  },
  milestoneDate: {
    fontSize: moderateScale(12),
    color: "#999",
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
