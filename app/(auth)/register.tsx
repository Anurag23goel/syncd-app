import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { DarkTheme } from "@react-navigation/native";
import { moderateScale } from "@/utils/spacing";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { handleRegistration } from "@/services/auth";
import Toast from "react-native-toast-message";

export default function SignUpScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const themeColors = isDarkMode ? DarkTheme.colors : lightColors;
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].auth;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await handleRegistration({
        UserEmail: email,
        UserPassword: password,
        UserFullName: fullName,
      });

      if (response.success && response.data) {
        Toast.show({
          type: "success",
          text1: "Verification Email Sent",
          text2: "Please check your email for the OTP code",
          visibilityTime: 4000,
          position: "top",
        });

        // INTEGRATE API TO SEND OTP

        // Store email for OTP verification
        router.push({
          pathname: "/(auth)/otp",
          params: { email: email },
        });
      } else {
        Alert.alert("Error", response.message || "Registration failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedView
            style={[
              styles.content,
              { backgroundColor: themeColors.background },
            ]}
          >
            <View style={styles.titleContainer}>
              <ThemedText type="title" style={styles.title}>
                {t.readyToTurn}{" "}
                <ThemedText
                  type="title"
                  style={[styles.title, styles.highlightText]}
                >
                  {t.blueprints}
                </ThemedText>
              </ThemedText>

              <ThemedText
                type="title"
                style={[styles.title, { marginTop: moderateScale(4) }]}
              >
                {t.intoBrilliance}
                {"\n"}
                {t.getSyncd}
              </ThemedText>
            </View>

            <View style={styles.inputContainer}>
              <ThemedText type="default" style={styles.label}>
                {t.fullName}
              </ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: themeColors.card }]}
                value={fullName}
                onChangeText={setFullName}
                placeholder={t.enterFullName}
                placeholderTextColor={isDarkMode ? "#666" : "#999"}
              />

              <ThemedText type="default" style={styles.label}>
                {t.emailAddress}
              </ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: themeColors.card }]}
                value={email}
                onChangeText={setEmail}
                placeholder={t.enterEmail}
                placeholderTextColor={isDarkMode ? "#666" : "#999"}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <ThemedText type="default" style={styles.label}>
                Password
              </ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: themeColors.card }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={isDarkMode ? "#666" : "#999"}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                { backgroundColor: themeColors.primary },
                isLoading && { opacity: 0.7 },
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <ThemedText style={styles.continueButtonText}>
                {isLoading ? "Registering..." : t.continue}
              </ThemedText>
            </TouchableOpacity>

            {/* <View style={styles.dividerContainer}>
              <ThemedText type="default" style={styles.dividerText}>
                {t.or}
              </ThemedText>
            </View>

            <TouchableOpacity
              style={[styles.socialButton, { borderColor: themeColors.border }]}
            >
              <Image
                source={require("../../assets/images/assets/google.png")}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButtonDark}>
              <FontAwesome5
                name="apple"
                size={moderateScale(24)}
                color={"white"}
              />
            </TouchableOpacity> */}

            <View style={styles.termsContainer}>
              <ThemedText style={styles.termsText}>
                {t.termsAgreement}{" "}
                <TouchableOpacity onPress={() => router.push("/(auth)/terms")}>
                  <ThemedText
                    style={[styles.termsText, { color: themeColors.primary }]}
                  >
                    {t.termsAndConditions}
                  </ThemedText>
                </TouchableOpacity>
              </ThemedText>
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const lightColors = {
  primary: "#002D62",
  background: "#f5f5f5",
  card: "#fff",
  text: "#0D0D0D",
  border: "#e1e1e1",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: moderateScale(24),
  },
  content: {
    width: "90%",
    alignItems: "flex-start",
    height: "100%",
    backgroundColor: "#F2F2F2",
    marginTop: moderateScale(24),
  },
  titleContainer: {
    alignItems: "flex-start",
    marginBottom: moderateScale(24),
    width: "100%",
  },
  title: {
    fontSize: moderateScale(28),
    fontFamily: "SFPro-Bold",
    lineHeight: moderateScale(36),
    flexWrap: "wrap",
  },
  highlightText: {
    color: "#9F9F9F",
    fontFamily: "SFPro-Semibold",
  },
  inputContainer: {
    width: "100%",
    marginBottom: moderateScale(10),
  },
  label: {
    fontSize: moderateScale(14),
    color: "#666",
    marginBottom: moderateScale(8),
    fontFamily: "SFPro-Regular",
  },
  input: {
    width: "100%",
    borderRadius: moderateScale(6),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(14),
    fontSize: moderateScale(16),
    marginBottom: moderateScale(16),
    borderWidth: 1,
    fontFamily: "SFPro-Regular",
  },
  continueButton: {
    width: "100%",
    borderRadius: moderateScale(6),
    paddingVertical: moderateScale(14),
    alignItems: "center",
    marginBottom: moderateScale(24),
  },
  continueButtonText: {
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Semibold",
    color: "#fff",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: moderateScale(16),
  },
  dividerText: {
    fontSize: moderateScale(18),
    color: "#151515",
    fontFamily: "SFPro-Medium",
    textAlign: "center",
  },
  socialButton: {
    width: "100%",
    borderRadius: moderateScale(6),
    paddingVertical: moderateScale(12),
    alignItems: "center",
    marginBottom: moderateScale(12),
    borderWidth: 1,
  },
  socialButtonDark: {
    width: "100%",
    backgroundColor: "#000",
    borderRadius: moderateScale(6),
    paddingVertical: moderateScale(12),
    alignItems: "center",
    marginBottom: moderateScale(24),
  },
  termsContainer: {
    width: "100%",
    paddingHorizontal: moderateScale(10),
    marginTop: moderateScale(12),
  },
  termsText: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(18),
    textAlign: "center",
    color: "#0D0D0D",
    fontFamily: "SFPro-Regular",
    flexWrap: "wrap",
  },
  termsLink: {
    color: "#001FD9",
    fontSize: moderateScale(12),
    textDecorationLine: "underline",
    fontFamily: "SFPro-Regular",
  },
});
