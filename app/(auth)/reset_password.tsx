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
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react-native";
import { moderateScale } from "@/utils/spacing";
import { darkColors, lightColors } from ".";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? darkColors : lightColors;

  const handleResetPassword = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Success", "Your password has been reset successfully!", [
        { text: "OK", onPress: () => router.push("/login") },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to reset password. Please try again.");
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
          source={{ uri: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop&q=80" }}
          style={styles.heroImage}
        />

        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Create New Password
          </Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Your new password must be different from previously used passwords and at least 8 characters long.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              New Password
            </Text>
            <View
              style={[
                styles.passwordContainer,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Lock size={20} color={colors.text} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your new password"
                placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.text} />
                ) : (
                  <Eye size={20} color={colors.text} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Confirm New Password
            </Text>
            <View
              style={[
                styles.passwordContainer,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Lock size={20} color={colors.text} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Confirm your new password"
                placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={colors.text} />
                ) : (
                  <Eye size={20} color={colors.text} />
                )}
              </TouchableOpacity>
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
              <Text style={styles.resetButtonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: moderateScale(12),
    overflow: "hidden",
    paddingHorizontal: moderateScale(16),
  },
  input: {
    flex: 1,
    paddingVertical: moderateScale(16),
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Regular",
  },
  inputIcon: {
    marginRight: moderateScale(12),
  },
  eyeIcon: {
    padding: moderateScale(8),
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
});