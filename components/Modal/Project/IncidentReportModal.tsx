import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons"; // Import MaterialIcons
import * as DocumentPicker from "expo-document-picker";
import { LocalSvg } from "react-native-svg/css";
import { moderateScale } from "@/utils/spacing"; // Import moderateScale
import { translations } from "@/constants/translations";
import { useLanguageStore } from "@/store/useLanguageStore";

interface Person {
  id: string;
  name: string;
}

interface Attachment {
  id: string;
  type: "File" | "Image" | "Video";
  name: string;
}

export default function IncidentReportModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].reports.incident;
  const form = t.form as {
    title: string;
    enterTitle: string;
    description: string;
    location: string;
    addPhoto: string;
    date: string;
    time: string;
    priority: {
      high: string;
      medium: string;
      low: string;
    };
    category: string;
    notifiedPeople: string;
    attachments: string;
    report: string;
    resolve: string;
    affectedIndividuals: string;
    damageDetails: string;
    fileTypes: {
      file: string;
      image: string;
      video: string;
    };
    actions: {
      add: string;
    };
  };

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPriority, setSelectedPriority] =
    useState<string>("High priority");
  const [isCategoryDropdownVisible, setIsCategoryDropdownVisible] =
    useState(false);
  const categoryDropdownHeight = useRef(new Animated.Value(0)).current;
  const categoryRotationAnim = useRef(new Animated.Value(0)).current; // Rotation value for category
  const [notifiedPeople, setNotifiedPeople] = useState<Person[]>([
    { id: "1", name: "Person 1" },
    { id: "2", name: "Person 2" },
    { id: "3", name: "Person 3" },
  ]);
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: "1", type: "File", name: "Document.pdf" },
    { id: "2", type: "Image", name: "Photo.jpg" },
    { id: "3", type: "Video", name: "Video.mp4" },
  ]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const toggleCategoryDropdown = () => {
    if (isCategoryDropdownVisible) {
      // Collapse the dropdown
      Animated.timing(categoryDropdownHeight, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start(() => setIsCategoryDropdownVisible(false));

      // Rotate back to original
      Animated.timing(categoryRotationAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      // Expand the dropdown
      setIsCategoryDropdownVisible(true);
      Animated.timing(categoryDropdownHeight, {
        toValue: 90, // Adjust height as per your dropdown size
        duration: 400,
        useNativeDriver: false,
      }).start();

      // Rotate to 180 degrees
      Animated.timing(categoryRotationAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  };

  const categoryRotation = categoryRotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"], // Rotate between 0 and 180 degrees
  });

  const handleInputChange = (field: string, value: string) => {
    // Handle input change logic here
  };

  const handleAddAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (!result.canceled && result.assets?.length) {
        const file = result.assets[0];
        const newAttachment: Attachment = {
          id: Date.now().toString(),
          type: file.mimeType?.includes("image")
            ? "Image"
            : file.mimeType?.includes("video")
            ? "Video"
            : "File",
          name: file.name,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  };

  const removePerson = (id: string) => {
    setNotifiedPeople((prev) => prev.filter((person) => person.id !== id));
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{form.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputContainer}>
              <MaterialIcons name="camera-alt" size={20} color="#666" />
              <Text
                style={{
                  flex: 1,
                  fontFamily: "SFPro-Regular",
                  color: "#666",
                  fontSize: 14,
                }}
              >
                {form.addPhoto}
              </Text>
            </View>
            <TextInput
              style={styles.inputContainer}
              placeholder={form.enterTitle}
              placeholderTextColor="#666"
            />

            <View style={styles.inputContainer}>
              <LocalSvg
                asset={require("../../../assets/images/details.svg")}
                width={20}
                height={20}
              />
              <TextInput
                style={{ flex: 1 }}
                placeholder={form.description}
                placeholderTextColor="#666"
                multiline
                numberOfLines={1}
              />
            </View>

            <View style={styles.inputContainer}>
              <LocalSvg
                asset={require("../../../assets/images/location.svg")}
                width={20}
                height={20}
              />
              <TextInput
                style={{ flex: 1 }}
                placeholder={form.location}
                placeholderTextColor="#666"
              />
            </View>

            <TouchableOpacity
              style={styles.inputWithIcon}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && Platform.OS !== "web" && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            <View style={styles.inputContainer}>
              <LocalSvg
                asset={require("../../../assets/images/affected.svg")}
                width={20}
                height={20}
              />
              <TextInput
                style={{ flex: 1 }}
                placeholder={t.form.affectedIndividuals}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputContainer}>
              <LocalSvg
                asset={require("../../../assets/images/damage.svg")}
                width={20}
                height={20}
              />

              <TextInput
                style={{ flex: 1 }}
                placeholder={t.form.damageDetails}
                placeholderTextColor="#666"
              />
            </View>

            <View style={[styles.inputContainer, { flexDirection: "column" }]}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
                onPress={toggleCategoryDropdown}
              >
                <Text style={styles.dropdownTitle}>{form.category}</Text>
                <Animated.View
                  style={{ transform: [{ rotate: categoryRotation }] }}
                >
                  <Feather name="chevron-down" size={20} color="gray" />
                </Animated.View>
              </TouchableOpacity>

              <Animated.View
                style={[
                  styles.dropdown,
                  {
                    height: categoryDropdownHeight,
                    overflow: "hidden",
                    justifyContent: "flex-start",
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    handleInputChange("category", "Category 1");
                    toggleCategoryDropdown();
                  }}
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.dropdownItem}>Category 1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleInputChange("category", "Category 2");
                    toggleCategoryDropdown();
                  }}
                >
                  <Text style={styles.dropdownItem}>Category 2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleInputChange("category", "Category 3");
                    toggleCategoryDropdown();
                  }}
                >
                  <Text style={styles.dropdownItem}>Category 3</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            <View style={styles.priorityContainer}>
              {[
                form.priority.high,
                form.priority.medium,
                form.priority.low,
              ].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    selectedPriority === priority &&
                      styles.priorityButtonSelected,
                  ]}
                  onPress={() => setSelectedPriority(priority)}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      selectedPriority === priority &&
                        styles.priorityButtonTextSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.attachmentSection}>
              <View style={styles.inputContainer}>
                <Feather name="paperclip" size={20} color="#666" />
                <Text style={styles.sectionHeaderText}>{form.attachments}</Text>
                <TouchableOpacity onPress={handleAddAttachment}>
                  <Text style={styles.addButton}>{t.form.actions.add}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chipContainer}>
                {attachments.map((attachment) => (
                  <View key={attachment.id} style={styles.chip}>
                    <Text style={styles.chipText}>
                      {
                        t.form.fileTypes[
                          attachment.type.toLowerCase() as keyof typeof t.form.fileTypes
                        ]
                      }
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeAttachment(attachment.id)}
                    >
                      <Ionicons name="close" size={18} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.notifySection}>
              <View style={styles.inputContainer}>
                <Ionicons name="people" size={20} color="#666" />
                <Text style={styles.sectionHeaderText}>
                  {form.notifiedPeople}
                </Text>
                <TouchableOpacity>
                  <Text style={styles.addButton}>{t.form.actions.add}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chipContainer}>
                {notifiedPeople.map((person) => (
                  <View key={person.id} style={styles.chip}>
                    <Text style={styles.chipText}>{person.name}</Text>
                    <TouchableOpacity onPress={() => removePerson(person.id)}>
                      <Ionicons name="close" size={18} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.reportButton}>
            <Text style={styles.reportButtonText}>{form.report}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: moderateScale(44),
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    padding: moderateScale(16),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: "600",
    fontFamily: "SFPro-Bold",
  },
  scrollView: {
    flex: 1,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#F9F9F9",
    gap: moderateScale(10),
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    marginBottom: moderateScale(16),
    alignItems: "center",
    fontSize: moderateScale(14),
    flexDirection: "row",
  },
  textArea: {
    height: moderateScale(100),
    textAlignVertical: "top",
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    backgroundColor: "#F9F9F9",
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    marginBottom: moderateScale(16),
  },
  inputIcon: {
    marginRight: moderateScale(8),
  },
  dateText: {
    fontSize: moderateScale(16),
    color: "#000",
  },
  dropdown: {
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },

  dropdownTitle: {
    fontSize: moderateScale(15),
    fontFamily: "SFPro-Regular",
    color: "#8C8C8C",
  },
  dropdownItem: {
    paddingVertical: moderateScale(5),
    paddingHorizontal: moderateScale(10),
    fontSize: moderateScale(13),
    fontFamily: "SFPro-Regular",
    color: "#8C8C8C",
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: moderateScale(10),
  },
  priorityButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: moderateScale(6),
    paddingVertical: moderateScale(10),
    marginHorizontal: moderateScale(3),
    alignItems: "center",
    justifyContent: "center",
  },
  priorityButtonSelected: {
    backgroundColor: "#F2F2F2",
  },
  priorityButtonText: {
    fontSize: moderateScale(12),
    color: "#333",
    textAlign: "center",
    fontFamily: "SFPro-Regular",
  },
  priorityButtonTextSelected: {
    color: "#1A1A1A",
  },
  attachmentSection: {
    marginBottom: moderateScale(16),
  },
  notifySection: {
    marginBottom: moderateScale(16),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(8),
  },
  sectionHeaderText: {
    flex: 1,
    marginLeft: moderateScale(8),
    fontSize: moderateScale(16),
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  addButton: {
    color: "#007AFF",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Regular",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(8),
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: moderateScale(16),
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(12),
  },
  chipText: {
    marginRight: moderateScale(4),
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Regular",
  },
  reportButton: {
    backgroundColor: "#002B5B",
    borderRadius: moderateScale(8),
    padding: moderateScale(16),
    alignItems: "center",
    marginTop: moderateScale(16),
  },
  reportButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "600",
    fontFamily: "SFPro-Semibold",
  },
  cameraButton: {
    alignSelf: "center",
    marginVertical: moderateScale(16),
  },
});
