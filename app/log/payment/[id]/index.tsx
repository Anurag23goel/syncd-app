import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import BudgetScreen from "@/components/paymentLog/budget";
import ProjectOverview from "@/components/Modal/Project/MilestoneModal";
import Filter_Calendar from "@/components/Tabs/home/Filter_Calendar";
import SelectModal from "@/components/Modal/Payment/SelectionMenuModal";
import AddMilestoneModal from "@/components/Modal/Payment/AddMilestone";
import AddExpenseModal from "@/components/Modal/Payment/AddExpense"; // Import AddExpenseModal
import { moderateScale } from "@/utils/spacing"; // Import moderateScale
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const Id = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs.paymentLog;

  const [isSelectionModalVisible, setIsSelectionModalVisible] = useState(false);
  const [isMilestoneModalVisible, setIsMilestoneModalVisible] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false); // New state

  const handleAddMilestone = () => {
    setIsSelectionModalVisible(false);
    setIsMilestoneModalVisible(true);
  };

  const handleAddExpense = () => {
    setIsSelectionModalVisible(false);
    setIsExpenseModalVisible(true);
  };

  const handleCardPress = (title: string) => {
    if (title === "Expense Title") {
      router.push("/log/payment/expense");
    }
  };

  const data = [
    { key: "budget" },
    { key: "filter" },
    { key: "cards" },
    { key: "milestone" },
  ];

  interface CardProps {
    title: string;
    amount: string;
    isPositive: boolean;
  }

  const renderCard = ({ title, amount, isPositive }: CardProps) => {
    return (
      <TouchableOpacity onPress={() => handleCardPress(title)}>
        <View style={styles.card}>
          <View>
            <Text style={styles.cardDate}>Date</Text>
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
          <Text
            style={[
              styles.cardAmount,
              isPositive ? styles.positive : styles.negative,
            ]}
          >
            {isPositive ? "+" : "-"} ₹{amount}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: { key: string } }) => {
    if (item.key === "budget") {
      return <BudgetScreen />;
    } else if (item.key === "filter") {
      return (
        <View style={styles.filterContainer}>
          <Filter_Calendar type="Payment" />
        </View>
      );
    } else if (item.key === "cards") {
      return (
        <View>
          {renderCard({
            title: "Expense Title",
            amount: "10,00,000",
            isPositive: false,
          })}
          {renderCard({
            title: "Boost Title",
            amount: "5,00,000",
            isPositive: true,
          })}
        </View>
      );
    } else if (item.key === "milestone") {
      return <ProjectOverview />;
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Feather name="chevron-left" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{t.orionTowers}</Text>
            </View>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="gray" />
              <TextInput placeholder={t.search} style={styles.searchInput} />
            </View>
          </>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsSelectionModalVisible(true)}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>
      <SelectModal
        visible={isSelectionModalVisible}
        onClose={() => setIsSelectionModalVisible(false)}
        onAddMilestone={handleAddMilestone}
        onAddExpense={handleAddExpense} // Pass the handler
      />
      <AddMilestoneModal
        visible={isMilestoneModalVisible}
        onClose={() => setIsMilestoneModalVisible(false)}
      />
      <AddExpenseModal
        visible={isExpenseModalVisible}
        onClose={() => setIsExpenseModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Id;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  scrollContainer: {
    padding: moderateScale(16),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(24),
    marginLeft: moderateScale(16),
    fontFamily: "SFPro-Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(16),
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(8),
    fontFamily: "SFPro-Regular",
  },
  filterContainer: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    marginBottom: moderateScale(10),
    marginTop: moderateScale(10),
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: moderateScale(8),
    padding: moderateScale(16),
    marginBottom: moderateScale(8),
  },
  cardDate: {
    fontSize: moderateScale(12),
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  cardTitle: {
    fontSize: moderateScale(20),
    marginTop: moderateScale(4),
    fontFamily: "SFPro-Bold",
  },
  cardAmount: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Bold",
  },
  positive: {
    color: "green",
  },
  negative: {
    color: "red",
  },
  addButton: {
    position: "absolute",
    bottom: moderateScale(20),
    right: moderateScale(20),
    backgroundColor: "#002347",
    borderRadius: moderateScale(50),
    padding: moderateScale(14),
  },
});
