import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const { height: screenHeight } = Dimensions.get("window"); // Get screen height

const Annotation = () => {
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
          <Text style={styles.headerTitle}>{t.fileName}</Text>
        </View>

        <Image
          source={require("../../assets/images/assets/file.png")}
          style={[styles.projectImage, { height: screenHeight * 0.9 }]} // Adjust height to 40% of screen height
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Annotation;

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
  projectImage: {
    width: "100%",
    objectFit: "cover",
    borderRadius: 8,
    marginBottom: 16,
  },
});
