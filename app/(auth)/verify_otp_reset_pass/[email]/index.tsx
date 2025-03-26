import React, { useState, useRef, useEffect } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Shield, Lock, Eye, EyeOff } from "lucide-react-native";
import { moderateScale } from "@/utils/spacing";
import { darkColors, lightColors } from "../..";
import { verifyAndChangePassword } from "@/services/auth";

const OTP_LENGTH = 6;

export default function VerifyResetPasswordScreen() {
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [otp, setOtp] = useState(""); // string instead of array const [password, setPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>(
    Array(OTP_LENGTH).fill(null)
  );
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? darkColors : lightColors;
  const { email } = useLocalSearchParams();
  const safeEmail = Array.isArray(email) ? email[0] : email;

  useEffect(() => {
    if (!safeEmail) {
      router.push("/(auth)");
    }
  });

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const otpArray = otp.split("");
    otpArray[index] = value;
    const updatedOtp = otpArray.join("").padEnd(OTP_LENGTH, "");

    setOtp(updatedOtp);

    if (value !== "" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validatePassword = () => {
    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return false;
    }

    return true;
  };
  const handleVerifyOTP = async () => {
    if (otp.length !== OTP_LENGTH) {
      Alert.alert("Error", "Please enter the complete verification code");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Integrate API call to verify OTP
      // const response = await api.verifyOTP({ email, otp: otpString });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep("password");
    } catch (error) {
      Alert.alert("Error", "Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    console.log(safeEmail, otp, password);

    setIsLoading(true);
    try {
      // TODO: Integrate API call to reset password
      const response = await verifyAndChangePassword(safeEmail, otp, password);

      if (!response.success) {
        Alert.alert("Error", response.message);
        return;
      }

      Alert.alert("Success", "Your password has been reset successfully!", [
        { text: "Login", onPress: () => router.push("/(auth)") },
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
          source={{
            uri:
              step === "otp"
                ? "https://images.unsplash.com/photo-1635424239131-32dc44986b56?w=800&auto=format&fit=crop&q=80"
                : "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop&q=80",
          }}
          style={styles.heroImage}
        />

        <View style={styles.formContainer}>
          {step === "otp" ? (
            <>
              <Shield size={40} color={colors.primary} style={styles.icon} />
              <Text style={[styles.title, { color: colors.text }]}>
                Verify Your Email
              </Text>
              <Text style={[styles.subtitle, { color: colors.text }]}>
                We've sent a verification code to your email address. Please
                enter it below.
              </Text>

              <View style={styles.otpContainer}>
                {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[
                      styles.otpInput,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    value={otp[index] || ""}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.primary },
                  isLoading && styles.disabledButton,
                ]}
                onPress={handleVerifyOTP}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>Verify Code</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: colors.text }]}>
                Create New Password
              </Text>
              <Text style={[styles.subtitle, { color: colors.text }]}>
                Your new password must be different from previously used
                passwords and at least 8 characters long.
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
                  <Lock
                    size={20}
                    color={colors.text}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your new password"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#666" : "#999"
                    }
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
                  <Lock
                    size={20}
                    color={colors.text}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Confirm your new password"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#666" : "#999"
                    }
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
                  styles.actionButton,
                  { backgroundColor: colors.primary },
                  isLoading && styles.disabledButton,
                ]}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>Reset Password</Text>
                )}
              </TouchableOpacity>
            </>
          )}
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
    alignItems: "center",
  },
  icon: {
    marginBottom: moderateScale(16),
  },
  title: {
    fontSize: moderateScale(32),
    fontFamily: "SFPro-Bold",
    marginBottom: moderateScale(12),
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Regular",
    marginBottom: moderateScale(32),
    lineHeight: moderateScale(22),
    opacity: 0.8,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: moderateScale(32),
  },
  otpInput: {
    width: moderateScale(50),
    height: moderateScale(56),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    fontSize: moderateScale(24),
    fontFamily: "SFPro-Medium",
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
  actionButton: {
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
  actionButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Semibold",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
