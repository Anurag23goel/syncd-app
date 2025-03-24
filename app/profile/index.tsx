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
import {
  Feather,
  MaterialIcons,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import LanguageModal from "@/components/Modal/LanguageModal";
import { useRouter } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { useAuthStore } from "@/store/authStore";
import { editUserProfile } from "@/services/auth";

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
      icon: <Feather name="settings" size={20} color="#8C8C8C" />,
      label: t.profile.settings,
    },
    {
      icon: <Feather name="lock" size={20} color="#8C8C8C" />,
      label: t.profile.privacy,
    },
  ];

  const supportOptions = [
    {
      icon: <Feather name="globe" size={20} color="#8C8C8C" />,
      label: t.profile.changeLanguage,
      action: () => setLanguageModalVisible(true),
    },
    {
      icon: <Feather name="help-circle" size={20} color="#8C8C8C" />,
      label: t.profile.helpAndSupport,
      action: () => router.push("/profile/help"),
    },
    {
      icon: <Feather name="book-open" size={20} color="#8C8C8C" />,
      label: t.profile.faqs,
      action: () => router.push("/profile/faq"),
    },
    {
      icon: <MaterialIcons name="subscriptions" size={20} color="#8C8C8C" />,
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
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t.profile.title}</Text>
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
        <View style={styles.detailRow}>
          <Feather name="mail" size={20} color="#8C8C8C" />
          <TextInput
            style={styles.detailInput}
            value={user?.UserEmail || ""}
            placeholder="Email"
            editable={false}
          />
        </View>

        {/* Full Name (editable + pencil icon) */}
        <View style={styles.detailRow}>
          <Feather name="user" size={20} color="#8C8C8C" />
          <TextInput
            style={styles.detailInput}
            value={fullName}
            placeholder="Full Name"
            onChangeText={setFullName}
            editable={true}
          />
          <SimpleLineIcons name="pencil" size={18} color="#8C8C8C" />
        </View>

        {/* Contact (editable + pencil icon) */}
        <View style={styles.detailRow}>
          <Feather name="phone" size={20} color="#8C8C8C" />
          <TextInput
            style={styles.detailInput}
            value={contact}
            placeholder="Phone Number"
            onChangeText={setContact}
            editable={true}
            keyboardType="phone-pad"
          />
          <SimpleLineIcons name="pencil" size={18} color="#8C8C8C" />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        {/* Account Settings */}
        <Text style={styles.sectionTitle}>{t.profile.accountSettings}</Text>
        {accountSettings.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuRow}>
            {item.icon}
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        {/* Support */}
        <Text style={styles.sectionTitle}>{t.profile.support}</Text>
        {supportOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuRow}
            onPress={option.action}
          >
            {option.icon}
            <Text style={styles.menuText}>{option.label}</Text>
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="white" />
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
  saveButton: {
    backgroundColor: "#003366", // green success-style button
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    marginBottom: 10,
  },

  saveButtonText: {
    color: "white",
    fontSize: 15,
    fontFamily: "SFPro-Semibold",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "SFPro-Semibold",
    marginLeft: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "SFPro-Bold",
    marginBottom: 10,
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  detailInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontFamily: "SFPro-Regular",
    color: "#8C8C8C",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 15,
    fontFamily: "SFPro-Regular",
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E74C3C",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 15,
    fontFamily: "SFPro-Semibold",
    marginLeft: 10,
  },
});

export default ProfileScreen;
