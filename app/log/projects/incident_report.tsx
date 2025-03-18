import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Filter_Calendar from "@/components/Tabs/home/Filter_Calendar";
import { moderateScale } from "@/utils/spacing";
import IncidentReportModal from "@/components/Modal/Project/IncidentReportModal";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const IncidentReportScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].reports.incident;

  const data = [
    {
      id: "1",
      title: t.form.enterTitle,
      reporter: t.reportedBy,
      date: t.form.date,
      time: t.form.time,
      status: t.status.resolved,
    },
    {
      id: "2",
      title: t.form.enterTitle,
      reporter: t.reportedBy,
      date: t.form.date,
      time: t.form.time,
      status: t.status.pending,
    },
    {
      id: "3",
      title: t.form.enterTitle,
      reporter: t.reportedBy,
      date: t.form.date,
      time: t.form.time,
      status: t.status.resolved,
    },
  ];

  const renderItem = ({ item }: any) => (
    <View
      style={styles.incidentCard}
      onTouchEnd={() => router.push("/log/projects/specifyIncident")}
    >
      <View style={styles.cardContent}>
        <Text style={styles.incidentTitle}>{item.title}</Text>
        <Text
          style={styles.reportedBy}
        >{`${t.reportedBy}: ${item.reporter}`}</Text>
        <Text style={styles.dateTime}>
          {item.date} • {item.time}
        </Text>
      </View>
      <TouchableOpacity style={styles.resolvedButton}>
        <Text style={styles.resolvedText}>{item.status}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Feather name="chevron-left" size={24} color="black" />
        <Text style={styles.headerTitle}>{t.title}</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t.search}
          placeholderTextColor="#666"
        />
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
      </View>

      {/* Date and Filters */}
      <View style={styles.dateFilterContainer}>
        <Filter_Calendar type="Home" />
      </View>

      {/* Incident List */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
      <IncidentReportModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginLeft: moderateScale(10),
    fontFamily: "SFPro-Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: moderateScale(16),
    backgroundColor: "#fff",
    borderRadius: moderateScale(8),
    elevation: 2,
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
  dateFilterContainer: {
    backgroundColor: "#fff",
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#F4F4F4",
  },
  dateText: {
    fontSize: moderateScale(16),
    color: "#000",
    fontFamily: "SFPro-Regular",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterIcon: {
    marginRight: moderateScale(16),
  },
  listContainer: {
    paddingBottom: moderateScale(80),
    marginTop: moderateScale(16),
  },
  incidentCard: {
    flexDirection: "column",
    backgroundColor: "#fff",
    gap: moderateScale(8),
    marginVertical: moderateScale(8),
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
  },
  cardContent: {
    flex: 1,
  },
  incidentTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    marginBottom: moderateScale(4),
    color: "#000",
    fontFamily: "SFPro-Bold",
  },
  reportedBy: {
    fontSize: moderateScale(14),
    color: "#666",
    marginBottom: moderateScale(4),
    fontFamily: "SFPro-Regular",
  },
  dateTime: {
    fontSize: moderateScale(12),
    color: "#888",
    fontFamily: "SFPro-Regular",
  },
  resolvedButton: {
    backgroundColor: "#002D62",
    borderRadius: moderateScale(8),
    marginTop: moderateScale(8),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
  },
  resolvedText: {
    fontSize: moderateScale(14),
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "SFPro-Semibold",
  },
  floatingButton: {
    position: "absolute",
    bottom: moderateScale(16),
    right: moderateScale(16),
    backgroundColor: "#002D62",
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});

export default IncidentReportScreen;
