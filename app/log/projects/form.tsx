import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Modal,
  FlatList,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Ionicons,
  Feather,
  FontAwesome5,
  EvilIcons,
  AntDesign,
} from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { moderateScale } from "@/utils/spacing"; // Import moderateScale
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface Assignee {
  id: string;
  name: string;
}

interface Attachment {
  id: string;
  type: "file" | "image" | "video";
  name: string;
}

interface DropdownOption {
  label: string;
  value: string;
}

const projectSectors: DropdownOption[] = [
  { label: "Technology", value: "tech" },
  { label: "Healthcare", value: "health" },
  { label: "Education", value: "edu" },
];

const projectAreas: DropdownOption[] = [
  { label: "North", value: "north" },
  { label: "South", value: "south" },
  { label: "East", value: "east" },
  { label: "West", value: "west" },
];

const measurementUnits: DropdownOption[] = [
  { label: "Metric", value: "metric" },
  { label: "Imperial", value: "imperial" },
];

const currencies: DropdownOption[] = [
  { label: "USD", value: "usd" },
  { label: "EUR", value: "eur" },
  { label: "GBP", value: "gbp" },
];

export default function NewProject() {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.form as unknown as {
    submitButton: string;
    projectTitle: string;
    projectCode: string;
    projectSector: string;
    description: string;
    startDate: string;
    endDate: string;
    projectArea: string;
    measurementUnits: string;
    budget: string;
    currency: string;
    location: string;
    mapLink: string;
    submit: string;
    thumbnail: { title: string; add: string };
    assignees: { title: string; add: string };
    attachments: {
      addLabel: string;
      addButton: string;
      types: Record<string, string>;
    };
  };

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [assignees, setAssignees] = useState<Assignee[]>([
    { id: "1", name: "Person 1" },
    { id: "2", name: "Person 2" },
    { id: "3", name: "Person 3" },
  ]);
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: "1", type: "file", name: "File" },
    { id: "2", type: "image", name: "Image" },
    { id: "3", type: "video", name: "Video" },
  ]);

  const [projectSector, setProjectSector] = useState("");
  const [projectArea, setProjectArea] = useState("");
  const [measurementUnit, setMeasurementUnit] = useState("");
  const [currency, setCurrency] = useState("");

  const [showSectorModal, setShowSectorModal] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const [isCurrencyDropdownVisible, setIsCurrencyDropdownVisible] =
    useState(false);
  const currencyDropdownHeight = useRef(new Animated.Value(0)).current;
  const currencyRotationAnim = useRef(new Animated.Value(0)).current;

  const [isUnitDropdownVisible, setIsUnitDropdownVisible] = useState(false);
  const unitDropdownHeight = useRef(new Animated.Value(0)).current;
  const unitRotationAnim = useRef(new Animated.Value(0)).current;

  const [newAttachment, setNewAttachment] = useState("");

  const handleAddAttachment = () => {
    if (!newAttachment.trim()) return;

    let category = "File";

    if (
      newAttachment.endsWith(".jpg") ||
      newAttachment.endsWith(".jpeg") ||
      newAttachment.endsWith(".png")
    ) {
      category = "Image";
    } else if (
      newAttachment.endsWith(".mp4") ||
      newAttachment.endsWith(".avi")
    ) {
      category = "Video";
    } else if (
      newAttachment.endsWith(".mp3") ||
      newAttachment.endsWith(".wav")
    ) {
      category = "Audio";
    }

    setAttachments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: category.toLowerCase() as "file" | "image" | "video",
        name: newAttachment,
      },
    ]);
    setNewAttachment("");
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpenFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();

      if (!result.canceled && result.assets?.length) {
        const file = result.assets[0]; // Access the first file picked
        const { name, mimeType } = file;

        setNewAttachment(name); // Show the file name in the input field
        console.log("Selected File:", { name, mimeType });
      } else {
        console.log("File picker was canceled.");
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Something went wrong while picking the file.");
    }
  };

  interface ToggleDropdownParams {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    heightAnim: Animated.Value;
    rotationAnim: Animated.Value;
  }

  const toggleDropdown = ({
    isVisible,
    setIsVisible,
    heightAnim,
    rotationAnim,
  }: ToggleDropdownParams) => {
    if (isVisible) {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start(() => setIsVisible(false));
      Animated.timing(rotationAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      setIsVisible(true);
      Animated.timing(heightAnim, {
        toValue: 90,
        duration: 400,
        useNativeDriver: false,
      }).start();
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  };

  const removeAssignee = (id: string) => {
    setAssignees(assignees.filter((a) => a.id !== id));
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>{t.projectTitle || "New Project"}</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={t.projectTitle || "Enter project name"}
              placeholderTextColor="#8C8C8C"
            />
            <Feather name="map" size={18} color="#8C8C8C" />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={t.projectCode}
              placeholderTextColor="#8C8C8C"
            />
            <Feather name="hash" size={18} color="#8C8C8C" />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={t.projectSector}
              placeholderTextColor="#8C8C8C"
            />
            <FontAwesome5 name="arrows-alt" size={18} color="#8C8C8C" />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input]}
              placeholder={t.description}
              placeholderTextColor="#8C8C8C"
              multiline
              numberOfLines={4}
            />
            <Feather name="book" size={18} color="#8C8C8C" />
          </View>
        </View>

        <View style={styles.dateContainer}>
          <View style={styles.dateField}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={{ color: "#8C8C8C", fontFamily: "SFPro-Regular" }}>
                {t.startDate}
              </Text>
              <Feather name="calendar" size={18} color="#8C8C8C" />
            </TouchableOpacity>
          </View>

          <View style={styles.dateField}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={{ color: "#8C8C8C", fontFamily: "SFPro-Regular" }}>
                {t.endDate}
              </Text>
              <Feather name="calendar" size={18} color="#8C8C8C" />
            </TouchableOpacity>
          </View>
        </View>

        {(showStartPicker || showEndPicker) && Platform.OS !== "web" && (
          <DateTimePicker
            value={showStartPicker ? startDate : endDate}
            mode="date"
            onChange={(event, date) => {
              if (showStartPicker) {
                setShowStartPicker(false);
                date && setStartDate(date);
              } else {
                setShowEndPicker(false);
                date && setEndDate(date);
              }
            }}
          />
        )}

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={t.projectArea}
              placeholderTextColor="#8C8C8C"
            />
            <Ionicons name="scan" size={18} color="#8C8C8C" />
          </View>
        </View>

        <View
          style={[
            styles.inputContainer,
            { flexDirection: "column", borderWidth: 1, borderColor: "#ddd" },
          ]}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
            onPress={() =>
              toggleDropdown({
                isVisible: isUnitDropdownVisible,
                setIsVisible: setIsUnitDropdownVisible,
                heightAnim: unitDropdownHeight,
                rotationAnim: unitRotationAnim,
              })
            }
          >
            <TextInput
              style={styles.input}
              placeholder={t.measurementUnits}
              placeholderTextColor="#8C8C8C"
              value={measurementUnit}
              editable={false}
            />
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: unitRotationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "180deg"],
                    }),
                  },
                ],
              }}
            >
              <Feather
                name="chevron-down"
                size={20}
                color="gray"
                style={styles.icon}
              />
            </Animated.View>
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.dropdown,
              {
                height: unitDropdownHeight,
                overflow: "hidden",
                justifyContent: "flex-start",
              },
            ]}
          >
            {measurementUnits.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setMeasurementUnit(option.label);
                  toggleDropdown({
                    isVisible: isUnitDropdownVisible,
                    setIsVisible: setIsUnitDropdownVisible,
                    heightAnim: unitDropdownHeight,
                    rotationAnim: unitRotationAnim,
                  });
                }}
                style={{ marginTop: 10 }}
              >
                <Text style={styles.dropdownItem}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={t.budget}
              placeholderTextColor="#8C8C8C"
              keyboardType="numeric"
            />
            <Ionicons name="cash-outline" size={20} color="#8C8C8C" />
          </View>
        </View>

        <View
          style={[
            styles.inputContainer,
            { flexDirection: "column", borderWidth: 1, borderColor: "#ddd" },
          ]}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
            onPress={() =>
              toggleDropdown({
                isVisible: isCurrencyDropdownVisible,
                setIsVisible: setIsCurrencyDropdownVisible,
                heightAnim: currencyDropdownHeight,
                rotationAnim: currencyRotationAnim,
              })
            }
          >
            <TextInput
              style={styles.input}
              placeholder={t.currency}
              placeholderTextColor="#8C8C8C"
              value={currency}
              editable={false}
            />
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: currencyRotationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "180deg"],
                    }),
                  },
                ],
              }}
            >
              <Feather
                name="chevron-down"
                size={20}
                color="gray"
                style={styles.icon}
              />
            </Animated.View>
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.dropdown,
              {
                height: currencyDropdownHeight,
                overflow: "hidden",
                justifyContent: "flex-start",
              },
            ]}
          >
            {currencies.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setCurrency(option.label);
                  toggleDropdown({
                    isVisible: isCurrencyDropdownVisible,
                    setIsVisible: setIsCurrencyDropdownVisible,
                    heightAnim: currencyDropdownHeight,
                    rotationAnim: currencyRotationAnim,
                  });
                }}
                style={{ marginTop: 10 }}
              >
                <Text style={styles.dropdownItem}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.input} placeholder={t.location} />
            <Feather name="map-pin" size={18} color="#8C8C8C" />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.input} placeholder={t.mapLink} />
            <Feather name="external-link" size={18} color="#8C8C8C" />
          </View>
        </View>

        <View style={styles.uploadSection}>
          <View style={styles.uploadHeader}>
            <Ionicons name="image-outline" size={20} color="#8C8C8C" />
            <Text style={styles.uploadTitle}>{t.thumbnail.title}</Text>
            <TouchableOpacity>
              <Text style={styles.addButton}>{t.thumbnail.add}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.assigneesSection}>
          <View style={styles.uploadHeader}>
            <Ionicons name="people-outline" size={20} color="#8C8C8C" />
            <Text style={styles.uploadTitle}>{t.assignees.title}</Text>
            <TouchableOpacity>
              <Text style={styles.addButton}>{t.assignees.add}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.chipContainer}>
          {assignees.map((assignee) => (
            <View key={assignee.id} style={styles.chip}>
              <Text style={styles.chipText}>{assignee.name}</Text>
              <TouchableOpacity onPress={() => removeAssignee(assignee.id)}>
                <Ionicons name="close-outline" size={20} color="#8C8C8C" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.uploadSection}>
          <TouchableOpacity
            onPress={handleOpenFilePicker}
            style={styles.addPeopleContainer}
          >
            <View style={styles.addPeopleLeft}>
              <Ionicons name="document-outline" size={20} color="#8C8C8C" />
              <Text style={styles.addPeopleText}>
                {newAttachment || t.attachments?.addLabel || "Add Attachment"}
              </Text>
            </View>
            <TouchableOpacity onPress={handleAddAttachment}>
              <Text style={styles.addButtonText}>
                {t.attachments?.addButton || "Add"}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        <View style={styles.chipsContainer}>
          {attachments.map((attachment, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>
                {t.attachments?.types?.[attachment.type] || attachment.type}
              </Text>
              <TouchableOpacity onPress={() => handleRemoveAttachment(index)}>
                <Ionicons name="close-circle" size={16} color="gray" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>
            {t.submitButton || "Submit"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    padding: moderateScale(16),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    fontFamily: "SFPro-Semibold",
    marginBottom: moderateScale(24),
  },
  inputContainer: {
    marginBottom: moderateScale(16),
    backgroundColor: "#F9F9F9",
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: moderateScale(12),
  },
  label: {
    fontSize: moderateScale(14),
    marginBottom: moderateScale(8),
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
  required: {
    color: "red",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: moderateScale(10),
  },
  input: {
    flex: 1,
    height: moderateScale(40),
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Regular",
    color: "#8C8C8C",
  },
  textArea: {
    height: moderateScale(100),
    textAlignVertical: "top",
    paddingTop: moderateScale(12),
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    backgroundColor: "#F9F9F9",
  },
  dropdownButtonText: {
    fontSize: moderateScale(16),
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
  dateContainer: {
    flexDirection: "row",
    gap: moderateScale(16),
    marginBottom: moderateScale(16),
  },
  dateField: {
    flex: 1,
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    backgroundColor: "#F9F9F9",
  },
  uploadSection: {
    marginBottom: moderateScale(16),
    backgroundColor: "#F9F9F9",
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: moderateScale(12),
  },
  assigneesSection: {
    marginBottom: moderateScale(16),
    backgroundColor: "#F9F9F9",
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: moderateScale(12),
  },
  uploadHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  uploadTitle: {
    flex: 1,
    marginLeft: moderateScale(8),
    fontSize: moderateScale(14),
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
  addButton: {
    color: "#007AFF",
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Regular",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(8),
    marginBottom: moderateScale(12),
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: moderateScale(16),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
  },
  chipText: {
    marginRight: moderateScale(4),
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Regular",
  },
  submitButton: {
    backgroundColor: "#002B5B",
    borderRadius: moderateScale(10),
    padding: moderateScale(16),
    alignItems: "center",
    marginBottom: moderateScale(32),
    marginTop: moderateScale(16),
  },
  submitButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "bold",
    fontFamily: "SFPro-Semibold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderRadius: moderateScale(10),
    padding: moderateScale(16),
    width: "80%",
    maxHeight: "80%",
  },
  modalItem: {
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: moderateScale(16),
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
  modalCloseButton: {
    marginTop: moderateScale(16),
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#007AFF",
    fontSize: moderateScale(16),
    fontWeight: "bold",
    fontFamily: "SFPro-Semibold",
  },
  dropdownTitle: {
    fontSize: moderateScale(16),
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
  dropdown: {
    backgroundColor: "#F9F9F9",
  },
  dropdownItem: {
    fontSize: moderateScale(12),
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
  icon: {
    marginLeft: moderateScale(8),
  },
  addPeopleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addPeopleLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  addPeopleText: {
    marginLeft: moderateScale(10),
    color: "gray",
  },
  addButtonText: {
    color: "#007AFF",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(8),
  },
});
