import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const DateCard = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].dateCard;

  return (
    <View style={styles.projectCard}>
      <Pressable
        onPress={() => router.push("/file/dailyProgress")}
        style={[styles.iconContainer]}
      >
        <Feather name="image" size={24} color="#fff" />
      </Pressable>
      <View style={styles.contentContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{t.sharedBy}: (Name)</Text>
          <View style={styles.iconTextContainer}>
            <Feather name="calendar" size={12} color="#000" />
            <Text style={styles.infoText}>{t.date}</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <Feather name="clock" size={12} color="#000" />
            <Text style={styles.infoText}>{t.time}</Text>
          </View>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.iconTextContainer}>
            <Feather name="download" size={12} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconTextContainer}>
            <Feather name="share-2" size={12} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text style={styles.descriptionText}>{t.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  projectCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  iconContainer: {
    height: 120,
    padding: 4,
    backgroundColor: "#6B6B6B",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 6,
    marginBottom: 12,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    width: "100%",
  },
  infoContainer: {
    flexDirection: "row",
    gap: 8,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 4,
  },
  actionContainer: {
    flexDirection: "row",
    gap: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "SFPro-Medium",
    marginBottom: 20,
  },
});

export default DateCard;
