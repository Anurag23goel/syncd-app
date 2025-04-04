import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { moderateScale } from "@/utils/spacing";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";
import { router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import Filter_Calendar from "@/components/Tabs/home/Filter_Calendar";
import { SafeAreaView } from "react-native-safe-area-context";
import TaskManagement from "@/components/Card/TaskManagement";
import TaskModal from "@/components/Modal/TeamTask";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { SEND_TEST_NOTIFICATION } from "@/services/notifications";
import { useAuthStore } from "@/store/authStore";

interface TaskStatus {
  label: string;
  value: number;
  color: string;
}

const Index = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].task;
  const authToken = useAuthStore.getState().token;
  console.log("AUTH TOKEN - ", authToken);

  const taskStatuses: TaskStatus[] = [
    { label: t.completed, value: 5, color: "#007BFF" },
    { label: t.incomplete, value: 2, color: "#E74C3C" },
    { label: t.pending, value: 1.5, color: "#FFB800" },
    { label: t.delayed, value: 1.5, color: "#6B6B6B" },
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
            {total}
          </SvgText>
          <SvgText
            x={center + 15}
            y={center + 15}
            textAnchor="middle"
            fill="#000"
            fontSize="20"
            fontWeight={700}
          >
            {t.tasksLabel}
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.tasks}</Text>
          <TouchableOpacity>
            <Ionicons
              name="notifications-outline"
              size={24}
              onPress={() =>
                SEND_TEST_NOTIFICATION(
                  {
                    title: "idk",
                    body: "test notif",
                    data: {
                      message: "this data will be passing when user clicks on it",
                      type: "custom",
                      additionalInfo: "whatever you need",
                    },
                  },
                  authToken
                )
              }
              color="#000"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput placeholder={t.search} style={styles.searchInput} />
        </View>

        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <Text
            style={{ color: "#080808", fontSize: 20, fontFamily: "SFPro-Bold" }}
          >
            {t.progress}
          </Text>
          {renderDonutChart()}
        </View>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 20,
            marginTop: 10,
          }}
        >
          <Filter_Calendar type="Home" />
        </View>
        <TaskManagement />
      </ScrollView>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#002347",
          borderRadius: 50,
          padding: 14,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>
      <TaskModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "SFPro-Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "SFPro-Regular",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default Index;
