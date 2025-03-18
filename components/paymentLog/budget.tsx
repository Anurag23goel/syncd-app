import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BarChartExample } from "../Chart/BarChartCard";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const BudgetScreen = () => {
  const [activeTab, setActiveTab] = useState("graph");
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs.paymentLog.budget;

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
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
          style={[styles.tab, activeTab === "budget" && styles.activeTab]}
          onPress={() => setActiveTab("budget")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "budget" && styles.activeTabText,
            ]}
          >
            {t.budget}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Rendering */}
      {activeTab === "budget" && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t.totalBudget}</Text>
          <Text style={styles.totalAmount}>₹15,00,000</Text>

          <View style={styles.budgetRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="shield-outline" size={20} color="#000" />
              <Text style={styles.rowLabel}>{t.budget}</Text>
            </View>
            <Text style={styles.amount}>₹20,00,000</Text>
          </View>

          <View style={styles.budgetRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="arrow-up" size={20} color="#4CAF50" />
              <Text style={styles.rowLabel}>{t.boost}</Text>
            </View>
            <Text style={styles.amount}>₹5,00,000</Text>
          </View>

          <View style={styles.budgetRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="arrow-down" size={20} color="#F44336" />
              <Text style={styles.rowLabel}>{t.expenses}</Text>
            </View>
            <Text style={styles.amount}>₹10,00,000</Text>
          </View>
        </View>
      )}

      {activeTab === "graph" && <BarChartExample />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: moderateScale(16),
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: moderateScale(20),
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: moderateScale(4),
  },
  tab: {
    flex: 1,
    paddingVertical: moderateScale(8),
    alignItems: "center",
    borderRadius: 6,
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: moderateScale(20),
    width: "100%",
  },
  cardLabel: {
    fontSize: moderateScale(16),
    color: "#666",
    marginBottom: moderateScale(8),
    fontFamily: "SFPro-Medium",
  },
  totalAmount: {
    fontSize: moderateScale(28),
    marginBottom: moderateScale(20),
    fontFamily: "SFPro-Bold",
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(16),
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
  },
  rowLabel: {
    fontSize: moderateScale(16),
    color: "#000",
    fontFamily: "SFPro-Regular",
  },
  amount: {
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Semibold",
  },
});

export default BudgetScreen;
