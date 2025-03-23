import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import {
  Feather,
  MaterialIcons,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import LanguageModal from "@/components/Modal/LanguageModal";
import { router } from "expo-router";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const ProfileScreen = () => {
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const { language, setLanguage } = useLanguageStore();
  const t = translations[language];

  // Personal details
  const personalDetails: {
    icon: "user" | "mail" | "phone" | "tag";
    placeholder: string;
  }[] = [
    { icon: "user", placeholder: "Shlok Agheda" },
    { icon: "mail", placeholder: "aghedashlok30@gmail.com" },
    { icon: "phone", placeholder: "+91 987654321" },
  ];

  // Menu sections
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
        {personalDetails.map((detail, index) => (
          <View key={index} style={styles.detailRow}>
            <Feather name={detail.icon} size={20} color="#8C8C8C" />
            <TextInput
              style={styles.detailInput}
              placeholder={detail.placeholder}
              editable={false}
            />
            <TouchableOpacity>
              <SimpleLineIcons name="pencil" size={20} color="#8C8C8C" />
            </TouchableOpacity>
          </View>
        ))}

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
        <TouchableOpacity style={styles.logoutButton}>
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
