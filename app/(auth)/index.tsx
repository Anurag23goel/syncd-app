import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { moderateScale } from "@/utils/spacing";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { login } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { LoginRequest, LoginResponse } from "@/types/Apitypes";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const themeColors = isDarkMode ? darkColors : lightColors;
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].auth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loginUser = useAuthStore((state) => state.login);
  const authToken = useAuthStore((state) => state.token);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password");
      return;
    }

    setIsLoading(true);
    try {
      const loginData: LoginRequest = {
        UserEmail: email,
        UserPassword: password,
      };
      const response = await login(loginData);
      console.log(response);
      loginUser(response.token, response);
      router.replace("/(tabs)");
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Login failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(authToken) {
      router.replace("/(tabs)");
    }
    return () => {
      setIsLoading(false);
    };
  }, []);

  // FORGOT PASSWORD INTEGRATION
  const forgotPasswordHandler = async () => {
    console.log("Forgot password");
    router.push("/(auth)/forgot_password");
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
            <ThemedText type="title" style={styles.title}>
              {t.welcomeBack}
              {"\n"}
              {t.timeToSyncUp}{" "}
              <ThemedText style={styles.highlightText}>{t.syncUp}</ThemedText>.
            </ThemedText>

            {/* Input Fields */}
            <View style={styles.inputContainer}>
              <ThemedText type="default" style={styles.label}>
                {t.emailAddress}
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeColors.card,
                    color: themeColors.text,
                    borderColor: themeColors.border,
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder={t.enterEmail}
                placeholderTextColor={isDarkMode ? "#888" : "#999"}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <ThemedText type="default" style={styles.label}>
                {t.password}
              </ThemedText>
              <View
                style={[
                  styles.passwordContainer,
                  {
                    backgroundColor: themeColors.card,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <TextInput
                  style={[styles.passwordInput, { color: themeColors.text }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t.enterPassword}
                  placeholderTextColor={isDarkMode ? "#888" : "#999"}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color={themeColors.text}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={forgotPasswordHandler}
              >
                <ThemedText style={styles.forgotPasswordText}>
                  {t.forgotPassword}
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                { backgroundColor: themeColors.primary },
                isLoading && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <ThemedText style={styles.continueButtonText}>
                  {t.continue}
                </ThemedText>
              )}
            </TouchableOpacity>

            {/* OR Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.line} />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                { backgroundColor: themeColors.primary },
              ]}
              onPress={() => router.push("/(auth)/register")}
            >
              <ThemedText style={styles.registerButtonText}>
                Register
              </ThemedText>
            </TouchableOpacity>
            
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export const lightColors = {
  primary: "#003366",
  background: "#f5f5f5",
  card: "#fff",
  text: "#0D0D0D",
  border: "#e1e1e1",
};

export const darkColors = {
  primary: "#0A84FF",
  background: "#1C1C1E",
  card: "#2C2C2E",
  text: "#F2F2F7",
  border: "#3A3A3C",
};
const styles = StyleSheet.create({
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },

  registerButton: {
    width: "100%",
    borderRadius: moderateScale(6),
    paddingVertical: moderateScale(14),
    alignItems: "center",
    marginBottom: moderateScale(24),
  },
  registerButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Semibold",
  },
  container: {
    flex: 1,
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
  },
  title: {
    fontSize: moderateScale(28),
    fontFamily: "SFPro-Bold",
    marginBottom: moderateScale(32),
    lineHeight: moderateScale(34),
  },
  highlightText: {
    color: "#9F9F9F",
    fontSize: moderateScale(28),
    fontFamily: "SFPro-Semibold",
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    fontSize: moderateScale(14),
    color: "#1A1A1A",
    marginBottom: moderateScale(8),
    fontFamily: "SFPro-Medium",
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: moderateScale(6),
    borderWidth: 1,
    marginBottom: moderateScale(8),
  },
  passwordInput: {
    flex: 1,
    padding: moderateScale(12),
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Regular",
  },
  eyeIcon: {
    padding: moderateScale(12),
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: moderateScale(16),
  },
  forgotPasswordText: {
    color: "#E74C3C",
    fontSize: moderateScale(14),
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
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Semibold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: moderateScale(24),
  },
  dividerText: {
    fontSize: moderateScale(18),
    color: "#151515",
    fontFamily: "SFPro-Medium",
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
    borderRadius: moderateScale(6),
    paddingVertical: moderateScale(12),
    alignItems: "center",
    marginBottom: moderateScale(24),
  },
  disabledButton: {
    opacity: 0.7,
  },
});
