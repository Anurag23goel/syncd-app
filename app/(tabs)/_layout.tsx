import { router, Tabs } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Platform, // Import Platform
} from "react-native";
import { moderateScale } from "@/utils/spacing"; // Import moderateScale
import {
  HomeIcon,
  SecondIcon,
  ChatIcon,
  TaskIcon,
} from "@/components/navigation/Icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs;

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.popupContainer}>
                <View style={styles.iconRow}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.push("/log/projects")}
                  >
                    <View style={styles.iconImageButton}>
                      <Image
                        source={require("../../assets/images/assets/projects.png")}
                        style={styles.iconImage}
                      />
                    </View>
                    <Text style={styles.iconLabel}>{t.projects}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.push("/log/inventory")}
                  >
                    <View style={styles.iconImageButton}>
                      <Image
                        source={require("../../assets/images/assets/inventory.png")}
                        style={styles.iconImage}
                      />
                    </View>
                    <Text style={styles.iconLabel}>{t.inventoryLog}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.push("/log/payment")}
                  >
                    <View style={styles.iconImageButton}>
                      <Image
                        source={require("../../assets/images/assets/Payment.png")}
                        style={styles.iconImage}
                      />
                    </View>
                    <Text style={styles.iconLabel}>{t.paymentLog.title}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: themeColors.tabIconSelected,
          tabBarInactiveTintColor: themeColors.tabIconDefault,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: Platform.OS === "ios" ? 90 : 80, // Adjust height for iOS
            backgroundColor: themeColors.background,
            paddingBottom: Platform.OS === "ios" ? 20 : 0, // Adjust padding for iOS
          },
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t.home,
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.tabIconContainer,
                  focused && styles.focusedTabIcon,
                ]}
              >
                <HomeIcon
                  width={28}
                  height={28}
                  color={focused ? "#fff" : themeColors.tabIconDefault}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="second"
          options={{
            title: t.projects,
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.tabIconContainer,
                  focused && styles.focusedTabIcon,
                ]}
              >
                <SecondIcon
                  width={28}
                  height={28}
                  color={focused ? "#fff" : themeColors.tabIconDefault}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="middle"
          options={{
            title: t.projects,
            tabBarIcon: ({ focused }) => (
              <TouchableOpacity onPress={toggleModal}>
                <View
                  style={[
                    styles.syncIconContainer,
                    focused && styles.focusedSyncIcon,
                  ]}
                >
                  <Image
                    source={require("../../assets/images/sync.png")}
                    style={[
                      styles.syncIcon,
                      focused && styles.focusedSyncIconImage,
                    ]}
                  />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="task"
          options={{
            title: t.tasks,
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.tabIconContainer,
                  focused && styles.focusedTabIcon,
                ]}
              >
                <TaskIcon
                  width={28}
                  height={28}
                  color={focused ? "#fff" : themeColors.tabIconDefault}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: t.chat,
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.tabIconContainer,
                  focused && styles.focusedTabIcon,
                ]}
              >
                <ChatIcon
                  width={28}
                  height={28}
                  color={focused ? "#fff" : themeColors.tabIconDefault}
                />
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
  },
  popupContainer: {
    backgroundColor: "#FFFFFF",
    padding: moderateScale(20),
    marginHorizontal: moderateScale(10),
    marginBottom:
      Platform.OS === "ios" ? moderateScale(120) : moderateScale(100),
    borderRadius: moderateScale(20),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(10),
    elevation: 5,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  iconButton: {
    alignItems: "center",
  },
  iconImageButton: {
    backgroundColor: "#EDEDED",
    borderRadius: moderateScale(60),
    marginBottom: moderateScale(6),
    padding: moderateScale(18),
  },
  iconImage: {
    width: moderateScale(30),
    height: moderateScale(30),
  },
  iconLabel: {
    fontSize: moderateScale(12),
    color: "#1A1A1A",
    fontFamily: "SFPro-Medium",
  },
  tabIconContainer: {
    borderRadius: moderateScale(8),
    padding: moderateScale(8),
  },
  focusedTabIcon: {
    backgroundColor: Colors.light.tint,
  },
  syncIconContainer: {
    width: moderateScale(28),
    height: moderateScale(28),
    justifyContent: "center",
    alignItems: "center",
  },
  focusedSyncIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(10),
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  syncIcon: {
    width: moderateScale(28),
    height: moderateScale(28),
  },
  focusedSyncIconImage: {
    width: moderateScale(36),
    height: moderateScale(36),
  },
});
