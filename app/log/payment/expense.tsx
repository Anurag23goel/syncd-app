import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import FileItem from "@/components/Card/FileCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

export default function ExpenseDetails() {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs.paymentLog;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.expenseTitle}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>{t.expenseDetails}</Text>

        <View style={styles.invoiceSection}>
          <Text style={styles.invoiceTitle}>{t.invoice}</Text>

          <FileItem
            name="Audio File"
            date={t.date}
            size="File size"
            iconType="audio"
          />
          <FileItem
            name="Audio File"
            date={t.date}
            size="File size"
            iconType="audio"
          />

          {/* Total Amount */}
          <View style={styles.totalAmount}>
            <Text style={styles.amount}>- ₹10,00,000</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 16,
  },
  invoiceSection: {
    padding: 16,
    marginBottom: 20,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fileDetails: {
    marginLeft: 12,
  },
  fileName: {
    fontSize: 16,
    color: "#333",
  },
  fileSize: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  totalAmount: {
    alignItems: "flex-end",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },
  amount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF0000",
  },
});
