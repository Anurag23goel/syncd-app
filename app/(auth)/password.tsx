import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const { width } = Dimensions.get("window");

const PasswordCreationScreen = () => {
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].auth;

  // Calculate password strength based on length and characters
  const getPasswordStrength = () => {
    if (password.length === 0) return "";
    if (password.length < 6) return t.passwordStrength.weak;
    if (password.length < 10) return t.passwordStrength.moderate;
    return t.passwordStrength.strong;
  };

  const passwordStrength = getPasswordStrength();

  // Set color based on password strength
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "Weak":
        return "#FF4D4F"; // Red for weak
      case "Moderate":
        return "#FFA500"; // Yellow for moderate
      case "Strong":
        return "#4CAF50"; // Green for strong
      default:
        return "#8C8C8C"; // Gray for no input
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Gradient Background with Password GIF */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/images/assets/gradient.png")}
              style={styles.gradientBackground}
            />
            <Image
              source={require("../../assets/images/password.gif")}
              style={styles.passwordGif}
            />
          </View>

          {/* Password Instruction */}
          <View style={styles.passwordContainer}>
            <View style={styles.passwordHeader}>
              <Text style={styles.passwordLabel}>{t.choosePassword}</Text>
              <Text
                style={[
                  styles.passwordStrength,
                  { color: getPasswordStrengthColor() },
                ]}
              >
                {passwordStrength}
              </Text>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={t.minCharacters}
                secureTextEntry={!isPasswordVisible}
                onChangeText={setPassword}
                value={password}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="#8C8C8C"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.push("/(auth)/otp")}
          >
            <Text style={styles.continueButtonText}>{t.continue}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: moderateScale(20), // Updated
  },
  imageContainer: {
    position: "relative",
    width: width * 0.9,
    height: moderateScale(200), // Updated
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(30), // Updated
  },
  gradientBackground: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(20), // Updated
  },
  passwordGif: {
    position: "absolute",
    width: moderateScale(100), // Updated
    height: moderateScale(100), // Updated
    resizeMode: "contain",
    zIndex: 100,
  },
  passwordContainer: {
    width: width * 0.9,
    paddingHorizontal: moderateScale(10), // Updated
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(10), // Updated
    alignItems: "center",
  },
  passwordLabel: {
    fontSize: moderateScale(16), // Updated
    color: "#1A1A1A",
    fontFamily: "SFPro-Regular",
  },
  passwordStrength: {
    fontSize: moderateScale(14), // Updated
    fontFamily: "SFPro-Regular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: moderateScale(6), // Updated
    paddingHorizontal: moderateScale(10), // Updated
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    height: moderateScale(50), // Updated
    fontSize: moderateScale(16), // Updated
    color: "#1A1A1A",
    fontFamily: "SFPro-Regular",
  },
  eyeIcon: {
    marginLeft: moderateScale(10), // Updated
  },
  continueButton: {
    width: width * 0.85,
    height: moderateScale(50), // Updated
    backgroundColor: "#002D62",
    borderRadius: moderateScale(6), // Updated
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(30), // Updated
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: moderateScale(18), // Updated
    fontFamily: "SFPro-Medium",
  },
});

export default PasswordCreationScreen;
