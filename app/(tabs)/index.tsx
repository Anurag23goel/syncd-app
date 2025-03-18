import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecentProjects from "@/components/Tabs/home/RecentProjects";
import UpcomingActivities from "@/components/Tabs/home/UpcomingActivities";
import TodaysReminders from "@/components/Tabs/home/TodaysReminders";
import { FlatList } from "react-native";
import { AddIcon } from "@/components/navigation/Icons";
import OptionModal from "@/components/Modal/OptionModal";
import GaugeChart from "@/components/Chart/GaugeChart";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

export default function HomeScreen() {
  // Define the sections to be rendered
  const sections = [
    { key: "recentProjects", component: RecentProjects },
    { key: "upcomingActivities", component: UpcomingActivities },
    { key: "todaysReminders", component: TodaysReminders },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs.optionModal;

  const options = [
    t.options.option1,
    t.options.option2,
    t.options.option3,
    t.options.option4,
    t.options.option5,
  ];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsModalVisible(false); // Close the modal after selection
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          const SectionComponent = item.component;
          return (
            <View style={styles.sectionContainer}>
              <SectionComponent />
            </View>
          );
        }}
        contentContainerStyle={styles.scrollContainer}
      />
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#002347",
          borderRadius: 50,
          padding: 14,
        }}
        onPress={() => setIsModalVisible(true)}
      >
        <AddIcon />
      </TouchableOpacity>
      <OptionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        options={options}
        onOptionSelect={handleOptionSelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  scrollContainer: {},
  sectionContainer: {},
});
