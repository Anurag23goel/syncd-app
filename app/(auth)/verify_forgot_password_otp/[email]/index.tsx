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
  Keyboard,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Shield } from "lucide-react-native";
import { moderateScale } from "@/utils/spacing";
import { darkColors, lightColors } from "../..";

const OTP_LENGTH = 6;

export default function VerifyOTPScreen() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<Array<TextInput | null>>(
    Array(OTP_LENGTH).fill(null)
  );
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? darkColors : lightColors;
  const { email } = useLocalSearchParams();

  console.log(email);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== OTP_LENGTH) {
      Alert.alert("Error", "Please enter the complete verification code");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Success", "OTP verified successfully!", [
        { text: "OK", onPress: () => router.push("/(auth)/reset_password") },
      ]);
    } catch (error) {
      Alert.alert("Error", "Invalid verification code. Please try again.");
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
            uri: "https://images.unsplash.com/photo-1635424239131-32dc44986b56?w=800&auto=format&fit=crop&q=80",
          }}
          style={styles.heroImage}
        />

        <View style={styles.formContainer}>
          <Shield size={40} color={colors.primary} style={styles.icon} />
          <Text style={[styles.title, { color: colors.text }]}>
            Verify Your Email
          </Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            We've sent a verification code to your email address. Please enter
            it below.
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
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
                value={digit}
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
              styles.verifyButton,
              { backgroundColor: colors.primary },
              isLoading && styles.disabledButton,
            ]}
            onPress={handleVerifyOTP}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify Code</Text>
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
  verifyButton: {
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
  verifyButtonText: {
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
  resendButton: {
    padding: moderateScale(4),
  },
});
