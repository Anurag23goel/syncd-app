import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";
import { moderateScale } from "@/utils/spacing";
import { router } from "expo-router";
import { translations } from "@/constants/translations";
import { useLanguageStore } from "@/store/useLanguageStore";
import { Task_Record, TaskStats } from "@/types/NewApiTypes";

interface TaskManagerProps {
  tasksStats?: TaskStats; // Made optional to handle undefined case
  taskRecords?: Task_Record[]; // Made optional to handle undefined case
}

interface TaskStatus {
  label: string;
  value: number;
  color: string;
}

export default function TaskManager({
  tasksStats,
  taskRecords,
}: TaskManagerProps) {
  const [activeTab, setActiveTab] = useState<"graph" | "tasks">("graph");
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tasks;

  // Default to empty stats and records if undefined
  const safeStats = tasksStats || {
    completed: 0,
    pending: 0,
    delayed: 0,
    upcoming: 0,
    totalTasks: 0,
  };
  const safeRecords = taskRecords || [];

  // Dynamically map task stats to taskStatuses
  const taskStatuses: TaskStatus[] = [
    { label: t.status.completed, value: safeStats.completed, color: "#007BFF" },
    { label: t.status.pending, value: safeStats.pending, color: "#FFB800" },
    { label: t.status.delayed, value: safeStats.delayed, color: "#6B6B6B" },
    { label: "Upcoming", value: safeStats.upcoming, color: "#E74C3C" },
  ];

  const total = safeStats.totalTasks;

  const renderDonutChart = () => {
    const size = moderateScale(200);
    const strokeWidth = moderateScale(35);
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    let startAngle = 0;
    const gapDegrees = 2;

    return (
      <View
        style={styles.chartContainer}
        onTouchEnd={() => router.push("/(tabs)/task")}
      >
        <Svg width={size} height={size}>
          {taskStatuses.map((status, index) => {
            const percentage = total > 0 ? (status.value / total) * 0.98 : 0;
            const dashArray = `${circumference * percentage} ${
              circumference * (1 - percentage)
            }`;
            const rotate = startAngle * 360 + index * gapDegrees;
            startAngle += percentage;

            return (
              <G key={index} rotation={rotate} origin={`${center}, ${center}`}>
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={status.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  fill="none"
                />
              </G>
            );
          })}
          <SvgText
            x={center}
            y={center - moderateScale(5)}
            textAnchor="middle"
            fill="#000"
            fontSize={moderateScale(16)}
            fontFamily="SFPro-Regular"
          >
            {t.total}
          </SvgText>
          <SvgText
            x={center}
            y={center + moderateScale(15)}
            textAnchor="middle"
            fill="#000"
            fontSize={moderateScale(20)}
            fontFamily="SFPro-Bold"
          >
            {total} {t.tasksCount}
          </SvgText>
        </Svg>

        <View style={styles.legend}>
          {taskStatuses.map((status, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: status.color }]}
              />
              <Text style={styles.legendLabel}>
                {status.label}: {status.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderTasks = () => (
    <View style={styles.tasksContainer}>
      {safeRecords.length > 0 ? (
        safeRecords.map((task) => (
          <TouchableOpacity
            key={task.TaskID}
            style={styles.taskItem}
            accessibilityLabel={`${task.Title}, Status: ${task.Status}`}
          >
            <Text style={styles.taskText}>{task.Title}</Text>
            <Text style={styles.taskStatus}>
              {t.status[task.Status.toLowerCase()] || task.Status}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noTasksText}>No Tasks</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "graph" && styles.activeTab]}
          onPress={() => setActiveTab("graph")}
          accessibilityLabel={t.graph}
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
          style={[styles.tab, activeTab === "tasks" && styles.activeTab]}
          onPress={() => setActiveTab("tasks")}
          accessibilityLabel={t.tasks}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "tasks" && styles.activeTabText,
            ]}
          >
            {t.tasks}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === "graph" ? renderDonutChart() : renderTasks()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    overflow: "hidden", // Prevents content from spilling out of rounded corners
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(16),
    marginBottom: moderateScale(8), // Reduced bottom margin for tighter layout
    borderRadius: moderateScale(8),
    padding: moderateScale(4), // Slightly reduced padding for compactness
  },
  tab: {
    flex: 1,
    paddingVertical: moderateScale(10),
    alignItems: "center",
    justifyContent: "center", // Ensures vertical centering of text
    borderRadius: moderateScale(6),
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: moderateScale(14), // Slightly larger for readability
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  activeTabText: {
    color: "#fff",
    fontFamily: "SFPro-Semibold",
  },
  content: {
    paddingBottom: moderateScale(16),
    flexGrow: 1, // Ensures ScrollView content takes full height if needed
  },
  chartContainer: {
    alignItems: "center",
    paddingVertical: moderateScale(20), // Unified padding for consistency
    paddingHorizontal: moderateScale(16),
  },
  legend: {
    width: "100%",
    marginTop: moderateScale(20), // Slightly reduced for tighter layout
    paddingHorizontal: moderateScale(16),
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(10), // Slightly reduced spacing
  },
  legendDot: {
    width: moderateScale(10), // Slightly smaller for elegance
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    marginRight: moderateScale(8),
  },
  legendLabel: {
    fontSize: moderateScale(14), // Slightly smaller for balance
    color: "#333", // Darker gray for better contrast
    fontFamily: "SFPro-Regular", // Switched to Regular for consistency
  },
  tasksContainer: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12), // Added vertical padding
  },
  taskItem: {
    backgroundColor: "#F2F2F7",
    padding: moderateScale(14), // Slightly reduced for compactness
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(10),
    flexDirection: "row", // Align title and status horizontally
    justifyContent: "space-between", // Space out title and status
    alignItems: "center",
  },
  taskText: {
    fontSize: moderateScale(16),
    color: "#000",
    fontFamily: "SFPro-Regular",
    flex: 1, // Allows text to take available space
  },
  taskStatus: {
    fontSize: moderateScale(12),
    color: "#666",
    fontFamily: "SFPro-Regular",
    marginLeft: moderateScale(8), // Space between title and status
  },
  noTasksText: {
    fontSize: moderateScale(16),
    color: "#666",
    fontFamily: "SFPro-Regular",
    textAlign: "center",
    paddingVertical: moderateScale(20),
  },
});
