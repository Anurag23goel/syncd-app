import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "../../constants/translations";

interface ReminderModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  isVisible,
  onClose,
}) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.reminder;

  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null); // Initialize with null
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date
  ) => {
    setShowTimePicker(false);
    if (selectedTime) setDate(selectedTime);
  };

  const handleCreateReminder = () => {
    console.log("Reminder created:", { title, date });
    onClose(); // Close the modal after creating the reminder
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <KeyboardAvoidingView behavior="padding" style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder={t.enterTitle}
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateTimeText}>
                {date ? date.toDateString() : t.date}
              </Text>
              <Feather name="calendar" size={20} color="gray" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateTimeInput}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateTimeText}>
                {date
                  ? date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : t.time}
              </Text>
              <Feather name="clock" size={20} color="gray" />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date || new Date()} // Fallback to current date if null
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={date || new Date()} // Fallback to current time if null
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateReminder}
          >
            <Text style={styles.createButtonText}>{t.createButton}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "SFPro-Bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 20,
    fontSize: 15,
    fontFamily: "SFPro-Regular",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  dateTimeInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    justifyContent: "space-between",
    backgroundColor: "#F9F9F9",
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 8,
    flex: 1,
    marginRight: 6,
  },
  dateTimeText: {
    color: "gray",
    fontFamily: "SFPro-Regular",
    fontSize: 13,
  },
  createButton: {
    backgroundColor: "#002D62",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "SFPro-Semibold",
  },
});

export default ReminderModal;
