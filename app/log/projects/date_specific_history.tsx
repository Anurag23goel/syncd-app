import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";
import { router } from "expo-router";
import NoRecordsModal from "../../../components/Modal/Project/NoRecord";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface Attendee {
  id: string;
  name: string;
  image: string;
  present: boolean;
}

export default function AttendanceDetails({ onBack }: { onBack: () => void }) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.dateSpecificHistory;
  const [searchQuery, setSearchQuery] = useState("");
  const [isNoRecordsModalVisible, setNoRecordsModalVisible] = useState(false);

  const attendees: Attendee[] = [
    {
      id: "1",
      name: "Name",
      image: "https://i.pravatar.cc/100?img=1",
      present: true,
    },
    {
      id: "2",
      name: "Name",
      image: "https://i.pravatar.cc/100?img=2",
      present: false,
    },
    {
      id: "3",
      name: "Name",
      image: "https://i.pravatar.cc/100?img=3",
      present: true,
    },
    {
      id: "4",
      name: "Name",
      image: "https://i.pravatar.cc/100?img=4",
      present: false,
    },
    {
      id: "5",
      name: "Name",
      image: "https://i.pravatar.cc/100?img=5",
      present: false,
    },
    {
      id: "6",
      name: "Name",
      image: "https://i.pravatar.cc/100?img=4",
      present: false,
    },
    {
      id: "7",
      name: "Name",
      image: "https://i.pravatar.cc/100?img=5",
      present: false,
    },
  ];

  const presentCount = 200;
  const absentCount = 300;
  const totalCount = presentCount + absentCount;
  const percentage = Math.round((presentCount / totalCount) * 100);

  const pieData = [
    { value: presentCount, color: "#4CAF50" },
    { value: absentCount, color: "#FF4444" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" onPress={() => router.back()}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>14-10-24</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder={t.search}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.progressContainer}>
            <PieChart
              data={pieData}
              donut
              radius={90}
              innerRadius={70}
              centerLabelComponent={() => {
                return (
                  <View style={styles.centerLabel}>
                    <Text style={styles.percentageText}>{percentage}%</Text>
                  </View>
                );
              }}
            />
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#4CAF50" }]}
              />
              <Text style={styles.legendText}>
                {t.present}: {presentCount}
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#FF4444" }]}
              />
              <Text style={styles.legendText}>
                {t.absent}: {absentCount}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView style={styles.attendeeList}>
            {attendees.map((attendee) => (
              <TouchableOpacity
                key={attendee.id}
                style={styles.attendeeItem}
                onPress={() => router.push("/log/projects/attendence_picture")}
              >
                <View style={styles.attendeeInfo}>
                  <Image
                    source={{ uri: attendee.image }}
                    style={styles.attendeeImage}
                  />
                  <Text style={styles.attendeeName}>{attendee.name}</Text>
                </View>
                <View
                  style={[
                    styles.statusIndicator,
                    {
                      backgroundColor: attendee.present ? "#E8F5E9" : "#FFEBEE",
                    },
                  ]}
                >
                  <Ionicons
                    name={attendee.present ? "checkmark" : "close"}
                    size={16}
                    color={attendee.present ? "#4CAF50" : "#FF4444"}
                    onPress={() =>
                      !attendee.present && setNoRecordsModalVisible(true)
                    }
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {isNoRecordsModalVisible && (
        <NoRecordsModal
          modalVisible={isNoRecordsModalVisible}
          setModalVisible={setNoRecordsModalVisible}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    marginHorizontal: moderateScale(12),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: moderateScale(14),
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
    paddingHorizontal: moderateScale(16),
    backgroundColor: "#fff",
    borderRadius: moderateScale(10),
    paddingVertical: moderateScale(8),
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(8),
    fontSize: moderateScale(16),
    color: "#000",
    fontFamily: "SFPro-Regular",
  },
  statsContainer: {
    padding: moderateScale(16),
    backgroundColor: "#fff",
    marginVertical: moderateScale(16),
    borderRadius: moderateScale(10),
    alignItems: "center",
  },
  progressContainer: {
    width: moderateScale(180),
    height: moderateScale(180),
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabel: {
    position: "absolute",
    top: moderateScale(-20),
    left: moderateScale(-25),
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    fontSize: moderateScale(32),
    fontFamily: "SFPro-Semibold",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: moderateScale(24),
    width: "100%",
    marginTop: moderateScale(16),
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    gap: moderateScale(8),
  },
  legendDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
  },
  legendText: {
    fontSize: moderateScale(14),
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  attendeeList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  attendeeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  attendeeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12),
  },
  attendeeImage: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
  },
  attendeeName: {
    fontSize: moderateScale(16),
    color: "#000",
    fontFamily: "SFPro-Regular",
  },
  statusIndicator: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
  },
});
