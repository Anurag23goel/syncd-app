import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Mail, ArrowLeft } from "lucide-react-native";
import { moderateScale } from "@/utils/spacing";
import { darkColors, lightColors } from ".";
import { forgotPassword } from "@/services/auth";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? darkColors : lightColors;

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await forgotPassword(email.trim());

      Alert.alert(
        "Success",
        response.message || "Check your email for reset instructions.",
        [{ text: "OK", onPress: () => router.push(`/(auth)/verify_forgot_password_otp/${email}`) }]
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Failed to send reset instructions. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&auto=format&fit=crop&q=80",
          }}
          style={styles.heroImage}
        />

        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Reset Password
          </Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Enter your email address and we'll send you instructions to reset
            your password.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Email Address
            </Text>
            <View
              style={[
                styles.emailContainer,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Mail size={20} color={colors.text} style={styles.mailIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your email"
                placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.resetButton,
              { backgroundColor: colors.primary },
              isLoading && styles.disabledButton,
            ]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.resetButtonText}>
                Send Reset Instructions
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text }]}>
              Remember your password?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(20),
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  heroImage: {
    width: "100%",
    height: moderateScale(200),
    resizeMode: "cover",
    marginBottom: moderateScale(24),
  },
  formContainer: {
    paddingHorizontal: moderateScale(24),
  },
  title: {
    fontSize: moderateScale(32),
    fontFamily: "SFPro-Bold",
    marginBottom: moderateScale(12),
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Regular",
    marginBottom: moderateScale(32),
    lineHeight: moderateScale(22),
    opacity: 0.8,
  },
  inputContainer: {
    width: "100%",
    marginBottom: moderateScale(24),
  },
  label: {
    fontSize: moderateScale(14),
    marginBottom: moderateScale(8),
    fontFamily: "SFPro-Medium",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: moderateScale(12),
    overflow: "hidden",
    paddingHorizontal: moderateScale(16),
  },
  mailIcon: {
    marginRight: moderateScale(12),
  },
  input: {
    flex: 1,
    paddingVertical: moderateScale(16),
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Regular",
  },
  resetButton: {
    width: "100%",
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(16),
    alignItems: "center",
    marginBottom: moderateScale(24),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Semibold",
  },
  disabledButton: {
    opacity: 0.7,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(8),
  },
  footerText: {
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Regular",
  },
  footerLink: {
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Semibold",
  },
});
