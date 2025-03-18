import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DateCard from "@/components/Card/DateCard";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const Date = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].file;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.date}</Text>
        </View>

        <DateCard />
        <DateCard />
        <DateCard />
        <DateCard />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Date;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 16,
  },
  scrollContainer: {},
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "SFPro-Medium",
    marginLeft: 16,
  },
});
