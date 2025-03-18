import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import AnimatedSlideButton from "@/components/AnimatedSlideButton";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { moderateScale } from "@/utils/spacing";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const images = [
  require("../../assets/images/assets/image1.png"),
  require("../../assets/images/assets/image2.png"),
  require("../../assets/images/assets/image2.png"),
  require("../../assets/images/assets/image2.png"),
  require("../../assets/images/assets/image2.png"),
];

const App = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].onboarding;
  const { setLanguage } = useLanguageStore();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Language Switch Button */}
      <TouchableOpacity
        style={[
          styles.languageSwitch,
          { backgroundColor: language === "en" ? "#002D62" : "#FF6B6B" },
        ]}
        onPress={toggleLanguage}
      >
        <View style={styles.languageSwitchInner}>
          <Text style={[styles.languageSwitchText, { color: "#FFFFFF" }]}>
            {language === "en" ? "हिंदी" : "ENG"}
          </Text>
          <View style={styles.languageIconContainer}>
            <Ionicons name="language" size={18} color="#FFFFFF" />
          </View>
        </View>
      </TouchableOpacity>

      {/* Logo and Title */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/sync.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>SYNC-D</Text>
        </View>
        <Text
          style={{
            // fontFamily: "SFPro-Regular",
            fontWeight: 300,
            fontSize: moderateScale(16),
            color: "#6B6B6B",
            fontStyle: "italic",
            marginBottom: moderateScale(20),
          }}
        >
          {t.tagline}
        </Text>
      </View>

      {/* Image Carousel */}
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={moderateScale(200)}
          height={height / 3.2}
          autoPlay={true}
          autoPlayInterval={100}
          data={images}
          scrollAnimationDuration={1000}
          style={styles.carousel}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={item} style={styles.image} />
            </View>
          )}
          pagingEnabled={true}
        />
      </View>

      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={moderateScale(200)}
          height={height / 3.2}
          autoPlay={true}
          autoPlayInterval={100}
          data={images}
          scrollAnimationDuration={1000}
          style={styles.carousel}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={item} style={styles.image} />
            </View>
          )}
          pagingEnabled={true}
        />
      </View>

      {/* Slide to Dive In Button */}
      <View style={styles.buttonContainer}>
        <AnimatedSlideButton
          onToggle={() => router.push("/(auth)/register")}
          slideText={t.slideToStart}
          completedText={t.letsGo}
        />
        <TouchableOpacity onPress={() => router.push("/(auth)")}>
          <Text style={styles.loginText}>{t.login}</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    paddingTop: moderateScale(20),
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: moderateScale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(6),
    marginTop: moderateScale(30),
  },
  logo: {
    width: moderateScale(40),
    height: moderateScale(40),
    marginRight: moderateScale(10),
  },
  title: {
    fontFamily: "SFPro-Bold",
    fontSize: moderateScale(32),
  },
  carouselContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: moderateScale(20),
  },
  carousel: {
    width: "100%",
    alignContent: "center",
    justifyContent: "center",
  },
  imageContainer: {
    borderRadius: moderateScale(10),
    overflow: "hidden",
    alignItems: "center",
    objectFit: "contain",
    justifyContent: "center",
  },
  image: {
    width: "90%",
    height: height / 3.2,
    borderRadius: moderateScale(10),
    objectFit: "cover",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: moderateScale(20),
  },
  loginText: {
    color: "#1B1B1B",
    marginTop: moderateScale(16),
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Semibold",
  },
  languageSwitch: {
    position: "absolute",
    top: moderateScale(40),
    right: moderateScale(20),
    borderRadius: moderateScale(25),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 1000,
  },
  languageSwitchInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(25),
  },
  languageSwitchText: {
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Bold",
    marginRight: moderateScale(4),
  },
  languageIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: moderateScale(15),
    padding: moderateScale(4),
    marginLeft: moderateScale(2),
  },
});

export default App;
