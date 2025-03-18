import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].profile.faq;

  const faqs = [
    {
      question: "Question 1",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus porttitor leo nec rutrum accumsan. Aenean cursus elit nec ipsum pulvinar tincidunt. Integer et feugiat sem, at ullamcorper velit.",
    },
    {
      question: "Question 2",
      answer:
        "Integer et feugiat sem, at ullamcorper velit. Cras porttitor leo dui, sit amet ultricies mi fringilla sit amet.",
    },
    {
      question: "Question 3",
      answer:
        "Curabitur venenatis neque non ex vestibulum, et condimentum mauris consectetur.",
    },
    {
      question: "Question 4",
      answer:
        "Cras porttitor leo dui, sit amet ultricies mi fringilla sit amet.",
    },
  ];

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t.title}</Text>
      </View>

      {/* FAQ List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {t.questions.map((faq, index) => (
          <View key={index} style={styles.card}>
            {/* Question */}
            <TouchableOpacity
              style={styles.questionContainer}
              onPress={() => toggleExpand(index)}
            >
              <Text style={styles.questionText}>{faq.question}</Text>
              <Ionicons
                name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                size={20}
                color="black"
              />
            </TouchableOpacity>

            {/* Answer */}
            {expandedIndex === index && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerText}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "SFPro-Semibold",
    marginLeft: 10,
    color: "#333",
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  questionText: {
    fontSize: 16,
    fontFamily: "SFPro-Regular",
    color: "#333",
  },
  answerContainer: {
    padding: 10,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
  },
  answerText: {
    fontSize: 14,
    fontFamily: "SFPro-Regular",
    color: "#555",
  },
});

export default FAQScreen;
