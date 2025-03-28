import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { AntDesign, MaterialIcons, Ionicons, SimpleLineIcons } from "@expo/vector-icons"; // Updated Feather to AntDesign
import { SafeAreaView } from "react-native-safe-area-context";
import LanguageModal from "@/components/Modal/LanguageModal";
import { useRouter } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { useAuthStore } from "@/store/authStore";
import { editUserProfile } from "@/services/auth";
import { moderateScale } from "@/utils/spacing";

const ProfileScreen = () => {
  const router = useRouter();
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const { language, setLanguage } = useLanguageStore();
  const setToken = useAuthStore((state) => state.setToken);
  const authToken = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const [fullName, setFullName] = useState(user?.UserFullName || "");
  const [contact, setContact] = useState(user?.UserContact || "");

  const t = translations[language];

  const handleLogout = () => {
    setToken(null);
    router.push("/(auth)");
  };

  const handleSave = async () => {
    if (!authToken) {
      return;
    }
    try {
      const res = await editUserProfile(fullName, contact, authToken);
      Alert.alert(
        "Profile Updated",
        res.message || "Changes saved successfully."
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  

  const accountSettings = [
    {
      icon: <Ionicons name="settings-outline" size={20} color="#6B7280" />,
      label: t.profile.settings,
    },
    {
      icon: <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />,
      label: t.profile.privacy,
    },
  ];

  const supportOptions = [
    {
      icon: <Ionicons name="globe-outline" size={20} color="#6B7280" />,
      label: t.profile.changeLanguage,
      action: () => setLanguageModalVisible(true),
    },
    {
      icon: <Ionicons name="help-circle-outline" size={20} color="#6B7280" />,
      label: t.profile.helpAndSupport,
      action: () => router.push("/profile/help"),
    },
    {
      icon: <Ionicons name="book-outline" size={20} color="#6B7280" />,
      label: t.profile.faqs,
      action: () => router.push("/profile/faq"),
    },
    {
      icon: <MaterialIcons name="subscriptions" size={20} color="#6B7280" />,
      label: t.profile.manageSubscription,
      action: () => router.push("/(subscription)"),
    },
  ];

  const handleLanguageSelect = (selectedLang: "en" | "hi") => {
    setLanguage(selectedLang);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.profile.title}</Text>
        <TouchableOpacity onPress={() => router.push("/notification")}>
          <Ionicons name="notifications-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture */}
        <View style={styles.profileImageContainer}>
          <Image
            source={require("../../assets/images/user.png")}
            style={styles.profileImage}
          />
        </View>

        {/* Personal Details */}
        <Text style={styles.sectionTitle}>{t.profile.personalDetails}</Text>

        {/* Email (non-editable) */}
        <View style={styles.inputCard}>
          <Ionicons name="mail-outline" size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            value={user?.UserEmail || ""}
            placeholder="Email"
            editable={false}
          />
        </View>

        {/* Full Name (editable) */}
        <View style={styles.inputCard}>
          <Ionicons name="person-outline" size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            value={fullName}
            placeholder="Full Name"
            onChangeText={setFullName}
            editable={true}
          />
          <SimpleLineIcons name="pencil" size={18} color="#6B7280" />
        </View>

        {/* Contact (editable) */}
        <View style={styles.inputCard}>
          <Ionicons name="call-outline" size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            value={contact}
            placeholder="Phone Number"
            onChangeText={setContact}
            editable={true}
            keyboardType="phone-pad"
          />
          <SimpleLineIcons name="pencil" size={18} color="#6B7280" />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        {/* Account Settings */}
        <Text style={styles.sectionTitle}>{t.profile.accountSettings}</Text>
        {accountSettings.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuCard}>
            {item.icon}
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        {/* Support */}
        <Text style={styles.sectionTitle}>{t.profile.support}</Text>
        {supportOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuCard}
            onPress={option.action}
          >
            {option.icon}
            <Text style={styles.menuText}>{option.label}</Text>
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>{t.profile.logout}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Language Modal */}
      <LanguageModal
        isVisible={isLanguageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        onLanguageSelect={handleLanguageSelect}
        selectedLanguage={language}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Matches previous components
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(10),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(26),
    fontFamily: "SFPro-Bold",
    color: "#1A1A1A",
    flex: 1,
    textAlign: "center",
  },
  scrollContent: {
    paddingBottom: moderateScale(20),
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: moderateScale(20),
  },
  profileImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontFamily: "SFPro-Semibold",
    color: "#1A1A1A",
    marginBottom: moderateScale(12),
  },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(14),
    padding: moderateScale(12),
    marginBottom: moderateScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    marginLeft: moderateScale(12),
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Regular",
    color: "#333",
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(14),
    padding: moderateScale(12),
    marginBottom: moderateScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuText: {
    marginLeft: moderateScale(12),
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Regular",
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#002347", // Matches previous components
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(12),
    alignItems: "center",
    marginBottom: moderateScale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Semibold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E74C3C",
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(12),
    marginTop: moderateScale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Semibold",
    marginLeft: moderateScale(8),
  },
});

export default ProfileScreen;