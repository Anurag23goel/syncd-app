import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import FileItem from "@/components/Card/FileCard";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const Folder = () => {
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
          <Text style={styles.headerTitle}>{t.folder}</Text>
        </View>

        <FileItem
          name="Audio File"
          date="Date"
          size="File size"
          iconType="audio"
        />
        <FileItem
          name="Video File"
          date="Date"
          size="File size"
          iconType="video"
          sharedWith={1}
        />
        <FileItem
          name="Image File"
          date="Date"
          size="File size"
          iconType="image"
          sharedWith={2}
        />
        <FileItem
          name="Document"
          date="Date"
          size="File size"
          iconType="file"
          sharedWith="all"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Folder;

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
  },
});
