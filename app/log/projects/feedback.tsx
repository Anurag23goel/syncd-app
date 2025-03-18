import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const FeedbackForm = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.feedback;

  const [rating, setRating] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t.title}</Text>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder={t.projectName} />
          <Feather
            name="map"
            size={moderateScale(18)}
            color="#8C8C8C"
            style={styles.icon}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder={t.projectLocation} />
          <Feather
            name="map-pin"
            size={moderateScale(18)}
            color="#8C8C8C"
            style={styles.icon}
          />
        </View>

        <View style={styles.dateContainer}>
          <TouchableOpacity
            style={[
              styles.inputContainer,
              { flex: 1, marginRight: moderateScale(5), alignItems: "center" },
            ]}
            onPress={() => setShowStartDatePicker(true)}
          >
            <TextInput
              style={styles.input}
              placeholder={t.startDate}
              value={startDate.toDateString()}
              editable={false}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.inputContainer,
              { flex: 1, marginLeft: moderateScale(5), alignItems: "center" },
            ]}
            onPress={() => setShowEndDatePicker(true)}
          >
            <TextInput
              style={styles.input}
              placeholder={t.endDate}
              value={endDate.toDateString()}
              editable={false}
            />
          </TouchableOpacity>
        </View>

        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartDatePicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndDatePicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        {[1, 2].map((num) => (
          <View key={num} style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {num}. {t.question}
            </Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        ))}

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            3. {t.questionWithRating}{" "}
            <Text style={styles.subText}>
              (1= Strongly Agree, 5 = Strongly Disagree.)
            </Text>
          </Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.ratingCircle,
                  rating >= num && styles.ratingCircleSelected,
                ]}
                onPress={() => setRating(num)}
              >
                <Text
                  style={[
                    styles.ratingText,
                    { color: rating >= num ? "#fff" : "#000" },
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            4. {t.questionWithOption}{" "}
            <Text style={styles.subText}>(select 1 option)</Text>{" "}
          </Text>
          {["Option 1", "Option 2", "Option 3", "Option 4"].map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionContainer}
              onPress={() => setSelectedOption(option)}
            >
              {selectedOption === option ? (
                <AntDesign
                  name="checkcircle"
                  size={moderateScale(20)}
                  color="#007AFF"
                  style={styles.radioButton}
                />
              ) : (
                <Feather
                  name="circle"
                  size={moderateScale(20)}
                  color="#007AFF"
                  style={styles.radioButton}
                />
              )}
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>{t.submit}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginBottom: moderateScale(20),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#E0E0E0",
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
    paddingHorizontal: moderateScale(10),
  },
  icon: {
    marginRight: moderateScale(5),
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    height: moderateScale(40),
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(10),
  },
  questionContainer: {
    marginBottom: moderateScale(15),
  },
  questionText: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    marginBottom: moderateScale(5),
  },
  subText: {
    fontFamily: "SFPro-Light",
    fontStyle: "italic",
    fontSize: moderateScale(12),
    color: "#686868",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: moderateScale(10),
    backgroundColor: "#fff",
    fontFamily: "SFPro-Regular",
    padding: moderateScale(10),
    minHeight: moderateScale(100),
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingCircle: {
    width: moderateScale(40),
    height: moderateScale(40),
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingCircleSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  ratingText: {
    fontSize: moderateScale(16),
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(10),
  },
  radioButton: {
    marginRight: moderateScale(10),
  },
  optionText: {
    fontSize: moderateScale(16),
  },
  submitButton: {
    backgroundColor: "#003366",
    padding: moderateScale(15),
    borderRadius: moderateScale(6),
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Semibold",
  },
});

export default FeedbackForm;
