import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].subscription;

  const Feature = ({ children }: { children: string }) => (
    <View style={styles.featureRow}>
      <Feather name="check" size={12} style={styles.checkmark} />
      <Text style={styles.featureText}>{children}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => {}}>
          <Ionicons name="chevron-back" size={24} color="#000" />
          <Text style={styles.backText}>{t.back}</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>
          {t.choosePlan}
          {"\n"}
          {t.fitsNeeds} <Text style={styles.titleGray}>{t.projectNeeds}</Text>
        </Text>

        {/* Current Plan */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t.currentPlan} • {t.basic}
          </Text>
          <Text style={styles.cardDescription}>{t.basicDescription}</Text>
          <View style={styles.featuresList}>
            <Feature>{t.features.taskManagement}</Feature>
            <Feature>{t.features.fileSharing}</Feature>
            <Feature>{t.features.cloudIntegration}</Feature>
            <Feature>{t.features.dailyLogs}</Feature>
            <Feature>{t.features.laborAttendance}</Feature>
          </View>
          <View style={styles.statusRow}>
            <View style={styles.activeStatus}>
              <Ionicons name="happy-outline" size={16} color="#34C759" />
              <Text style={styles.activeText}>{t.active}</Text>
            </View>
            <View style={styles.activeStatus}>
              <Text style={styles.billingDate}>{t.billingDate} 6/11/24</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => router.push("/(subscription)/manage")}
          >
            <Ionicons name="settings-outline" size={16} color="#666" />
            <Text style={styles.manageButtonText}>{t.manageSubscription}</Text>
          </TouchableOpacity>
        </View>

        {/* Billing Cycle */}
        <View style={styles.cycleContainer}>
          <TouchableOpacity
            style={[
              styles.cycleButton,
              billingCycle === "Monthly" && styles.cycleButtonActive,
            ]}
            onPress={() => setBillingCycle("Monthly")}
          >
            <Text
              style={[
                styles.cycleText,
                billingCycle === "Monthly" && styles.cycleTextActive,
              ]}
            >
              {t.monthly}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.cycleButton,
              billingCycle === "Yearly" && styles.cycleButtonActive,
            ]}
            onPress={() => setBillingCycle("Yearly")}
          >
            <Text
              style={[
                styles.cycleText,
                billingCycle === "Yearly" && styles.cycleTextActive,
              ]}
            >
              {t.yearly}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Discover Plans */}
        <Text style={styles.sectionTitle}>{t.discoverPlans}</Text>

        {/* Basic Plan */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.basic}</Text>
          <Text style={styles.cardDescription}>{t.basicDescription}</Text>
          <View style={styles.featuresList}>
            <Feature>{t.features.taskManagement}</Feature>
            <Feature>{t.features.fileSharing}</Feature>
            <Feature>{t.features.cloudIntegration}</Feature>
            <Feature>{t.features.dailyLogs}</Feature>
            <Feature>{t.features.laborAttendance}</Feature>
          </View>
          <TouchableOpacity style={styles.priceButton}>
            <Text style={styles.price}>₹499/month</Text>
          </TouchableOpacity>
        </View>

        {/* Professional Plan */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, styles.professionalTitle]}>
            {t.professional} Plan
          </Text>
          <Text style={styles.cardDescription}>
            {t.professionalDescription}
          </Text>
          <View style={styles.featuresList}>
            <Feature>{t.features.taskManagement}</Feature>
            <Feature>{t.features.fileSharing}</Feature>
            <Feature>{t.features.cloudIntegration}</Feature>
            <Feature>{t.features.dailyLogs}</Feature>
            <Feature>{t.features.laborAttendance}</Feature>
          </View>
          <TouchableOpacity style={styles.priceButton}>
            <Text style={styles.price}>₹999/month</Text>
          </TouchableOpacity>
        </View>

        {/* Enterprise Plan */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, styles.enterpriseTitle]}>
            {t.enterprise} Plan
          </Text>
          <Text style={styles.cardDescription}>{t.enterpriseDescription}</Text>
          <View style={styles.featuresList}>
            <Feature>{t.features.taskManagement}</Feature>
            <Feature>{t.features.fileSharing}</Feature>
            <Feature>{t.features.cloudIntegration}</Feature>
            <Feature>{t.features.dailyLogs}</Feature>
            <Feature>{t.features.laborAttendance}</Feature>
          </View>
          <TouchableOpacity style={styles.priceButton}>
            <Text style={styles.price}>₹1499/month</Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Conditions */}
        <TouchableOpacity style={styles.termsButton}>
          <Text style={styles.termsText}>Terms and Condition</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
    color: "#666",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    lineHeight: 34,
  },
  titleGray: {
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 24,
    color: "#8C8C8C",
    fontWeight: "600",
    marginBottom: 4,
  },
  professionalTitle: {
    color: "#0060B0",
  },
  enterpriseTitle: {
    color: "#D99600",
  },
  cardDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 32,
    lineHeight: 24,
  },
  featuresList: {
    marginBottom: 16,
    fontSize: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkmark: {
    fontSize: 12,
    marginRight: 6,
    color: "#000",
  },
  featureText: {
    fontSize: 12,
    color: "#000",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
    borderRadius: 16,
  },
  activeStatus: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 9,
    width: "48%",
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
  },
  activeText: {
    color: "#27AE60",
    fontSize: 14,
    marginLeft: 8,
  },
  billingDate: {
    color: "#666",
    fontSize: 14,
  },
  manageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    padding: 16,
  },
  manageButtonText: {
    color: "#6B6B6B",
    fontSize: 14,
    marginLeft: 8,
  },
  cycleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 9,
    padding: 4,
    gap: 12,
    marginBottom: 24,
  },
  cycleButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,

    borderRadius: 8,
    width: "48%",
  },
  cycleButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  cycleText: {
    textAlign: "center",
    color: "#8C8C8C",
    fontWeight: "600",
  },
  cycleTextActive: {
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  price: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  priceButton: {
    backgroundColor: "#FFF600",
    borderRadius: 16,
    alignSelf: "flex-start",
    padding: 16,
  },
  termsButton: {
    marginVertical: 24,
    alignItems: "center",
  },
  termsText: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
