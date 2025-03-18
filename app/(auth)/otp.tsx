import OtpInputField from "@/components/OtpField";
import { moderateScale } from "@/utils/spacing";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { handleOtpVerification } from "@/services/auth";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

const VerificationScreen = () => {
  const [code, setCode] = useState<string[]>([]);
  const [pinReady, setPinReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].auth;
  const { email } = useLocalSearchParams();

  interface CodeChangeHandler {
    (name: string, value: string): void;
  }

  const handleCodeChange: CodeChangeHandler = (name, value) => {
    setCode(value.split(""));
  };

  const handleVerify = async () => {
    if (!pinReady) return;

    setIsLoading(true);
    try {
      const response = await handleOtpVerification({
        UserEmail: email as string,
        OtpCode: code.join(""),
      });

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Registration Successful",
          text2: "Your account has been verified. Please login to continue.",
          visibilityTime: 4000,
          position: "top",
        });
        router.replace("/(auth)");
      } else {
        Toast.show({
          type: "error",
          text1: "Verification Failed",
          text2: response.message || "Please try again",
          visibilityTime: 3000,
          position: "top",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong. Please try again.",
        visibilityTime: 3000,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toast />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Text */}
          <Text style={styles.headerText}>
            {t.twoStepVerification}{" "}
            <Text style={styles.headerHighlight}>{t.ultimate} </Text>
            {t.security}
          </Text>

          {/* Gradient Background with Password GIF */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/images/assets/gradient2.png")}
              style={styles.gradientBackground}
            />
            <Image
              source={require("../../assets/images/otp.gif")}
              style={styles.passwordGif}
              onError={(e) => console.log(e.nativeEvent.error)}
            />
          </View>

          {/* OTP Instructions */}
          <Text style={styles.instructionsText}>{t.enterCode}</Text>

          {/* OTP Input Field */}
          <OtpInputField
            setPinReady={setPinReady}
            code={code}
            setCode={setCode}
            maxLength={6}
            handleChange={handleCodeChange}
            handleSend={handleVerify}
          />

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              (!pinReady || isLoading) && { backgroundColor: "#A9A9A9" },
            ]}
            onPress={handleVerify}
            disabled={!pinReady || isLoading}
          >
            <Text style={styles.verifyButtonText}>
              {isLoading ? "Verifying..." : t.verify}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Custom styles for the Verification Screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: moderateScale(20),
  },
  headerText: {
    fontSize: moderateScale(28),
    fontFamily: "SFPro-Bold",
    color: "#1A1A1A",
    textAlign: "left",
    marginBottom: moderateScale(20),
  },
  headerHighlight: {
    fontFamily: "SFPro-Bold",
    color: "#9F9F9F",
  },
  imageContainer: {
    position: "relative",
    width: width * 0.9,
    height: moderateScale(200),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(30),
  },
  gradientBackground: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(20),
  },
  passwordGif: {
    position: "absolute",
    width: "50%", // Adjust size as needed
    height: "50%",
    resizeMode: "contain",
    zIndex: 100,
  },
  instructionsText: {
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Medium",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: moderateScale(20),
  },
  verifyButton: {
    width: width * 0.9,
    height: moderateScale(50),
    backgroundColor: "#002D62",
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(30),
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Medium",
  },
});

export default VerificationScreen;
