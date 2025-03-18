import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import ReminderModal from "@/components/Modal/ReminderModal";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface ReminderCardProps {
  title: string;
  time: string;
  color: string;
  onDelete: () => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  title,
  time,
  color,
  onDelete,
}) => (
  <View style={styles.reminderCard}>
    <View style={[styles.reminderIndicator, { backgroundColor: color }]} />
    <View style={styles.reminderContent}>
      <Text style={styles.reminderTitle}>{title}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          marginTop: 4,
        }}
      >
        <Ionicons name="time-outline" size={12} color="#B5B5B5" />
        <Text style={styles.reminderTime}>{time}</Text>
      </View>
    </View>
    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
      <Ionicons name="trash-outline" size={18} color="#FF6347" />
    </TouchableOpacity>
  </View>
);

const TodaysReminders: React.FC = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs;

  const [fontsLoaded] = useFonts({
    "SFPro-Bold": require("../../../assets/fonts/SF-Pro-Display-Bold.ttf"),
    "SFPro-Regular": require("../../../assets/fonts/SF-Pro-Display-Regular.ttf"),
    "SFPro-Semibold": require("../../../assets/fonts/SF-Pro-Display-Semibold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const [isModalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.reminderContainer}>
        <Text style={styles.sectionTitle}>{t.todaysReminders}</Text>
        <ReminderCard
          title="Pay Quarterly Taxes"
          time="8:00 AM"
          color="#D99600"
          onDelete={() => console.log("Delete Pay Quarterly Taxes")}
        />
        <ReminderCard
          title="Renew Domain Certificate"
          time="8:30 AM"
          color="#3498DB"
          onDelete={() => console.log("Delete Renew Domain Certificate")}
        />
        <ReminderCard
          title="Book flight to Mumbai"
          time="9:00 AM"
          color="#1A1A1A"
          onDelete={() => console.log("Delete Book flight to Mumbai")}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#1A1A1A" />
        </TouchableOpacity>

        <ReminderModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#F5F5F5",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "SFPro-Bold",
    marginBottom: 12,
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: 6,
    borderBottomColor: "#B6B8BD81",
  },
  reminderContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  reminderIndicator: {
    width: 6,
    height: 40,
    borderRadius: 3,
    marginRight: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontFamily: "SFPro-Medium",
    color: "#333",
  },
  reminderTime: {
    fontSize: 12,
    fontFamily: "SFPro-Regular",
    color: "#B5B5B5",
  },
  deleteButton: {
    backgroundColor: "#F2F2F2",
    borderRadius: 30,
    padding: 8,
  },
  addButton: {
    marginTop: 16,
    alignSelf: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    padding: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TodaysReminders;
