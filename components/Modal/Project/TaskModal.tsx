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

interface TaskStatus {
  label: string;
  value: number;
  color: string;
}

export default function TaskManager() {
  const [activeTab, setActiveTab] = useState("graph");
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tasks;

  const taskStatuses: TaskStatus[] = [
    { label: t.status.completed, value: 5, color: "#007BFF" },
    { label: t.status.incomplete, value: 2, color: "#E74C3C" },
    { label: t.status.pending, value: 1.5, color: "#FFB800" },
    { label: t.status.delayed, value: 1.5, color: "#6B6B6B" },
  ];

  const total = taskStatuses.reduce((sum, status) => sum + status.value, 0);

  const renderDonutChart = () => {
    const size = 200;
    const strokeWidth = 35;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    let startAngle = 0;
    const gapDegrees = 2; // Gap between segments in degrees

    return (
      <View
        style={styles.chartContainer}
        onTouchEnd={() => router.push("/(tabs)/task")}
      >
        <Svg width={size} height={size}>
          {taskStatuses.map((status, index) => {
            const percentage = (status.value / total) * 0.98; // Reduce slightly to create gaps
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
            y={center - 10}
            textAnchor="middle"
            fill="#000"
            fontSize="16"
          >
            {t.total}
          </SvgText>
          <SvgText
            x={center - 25}
            y={center + 15}
            textAnchor="middle"
            fill="#000"
            fontSize="20"
            fontWeight={700}
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
      <TouchableOpacity style={styles.taskItem}>
        <Text style={styles.taskText}>{t.task1}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.taskItem}>
        <Text style={styles.taskText}>{t.task2}</Text>
      </TouchableOpacity>
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
          style={[styles.tab, activeTab === "tasks" && styles.activeTab]}
          onPress={() => setActiveTab("tasks")}
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

      <ScrollView style={styles.content}>
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
  },
  tabs: {
    flexDirection: "row",
    borderRadius: moderateScale(8),
    backgroundColor: "#F2F2F7",
    margin: moderateScale(16),
    padding: moderateScale(5),
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
  chartContainer: {
    alignItems: "center",
    padding: moderateScale(16),
  },
  legend: {
    width: "100%",
    marginTop: moderateScale(24),
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(12),
  },
  legendDot: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    marginRight: moderateScale(8),
  },
  legendLabel: {
    fontSize: moderateScale(16),
    color: "#666",
    fontFamily: "SFPro-Medium",
  },
  tasksContainer: {
    padding: moderateScale(16),
  },
  taskItem: {
    backgroundColor: "#F2F2F7",
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(12),
  },
  taskText: {
    fontSize: moderateScale(16),
    color: "#000",
    fontFamily: "SFPro-Regular",
  },
});
