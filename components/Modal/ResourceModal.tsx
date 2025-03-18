import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LocalSvg } from "react-native-svg/css";
import { translations } from "../../constants/translations";
import { useLanguageStore } from "@/store/useLanguageStore";

const { width } = Dimensions.get("window");

interface ResourceModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
}

const ResourceModal: React.FC<ResourceModalProps> = ({
  isVisible,
  onClose,
  title,
}) => {
  const [isListDropdownVisible, setIsListDropdownVisible] = useState(false);
  const ListDropdownHeight = useRef(new Animated.Value(0)).current;
  const ListRotationAnim = useRef(new Animated.Value(0)).current;

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const language = useLanguageStore((state) => state.language);
  const t = translations[language].inventory.resourceDetails;

  const handleDateChange = (event: any, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const toggleListDropdown = () => {
    if (isListDropdownVisible) {
      Animated.timing(ListDropdownHeight, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start(() => setIsListDropdownVisible(false));

      Animated.timing(ListRotationAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      setIsListDropdownVisible(true);
      Animated.timing(ListDropdownHeight, {
        toValue: 90, // Adjust height based on dropdown content
        duration: 400,
        useNativeDriver: false,
      }).start();

      Animated.timing(ListRotationAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  };

  const ListRotation = ListRotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="gray" />
            <TextInput placeholder={t.search} style={styles.searchInput} />
          </View>

          {/* Dropdown */}
          <View style={[styles.inputContainer, { flexDirection: "column" }]}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
              onPress={toggleListDropdown}
            >
              <Text style={styles.dropdownTitle}>{t.list}</Text>
              <Animated.View style={{ transform: [{ rotate: ListRotation }] }}>
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
                  height: ListDropdownHeight,
                  overflow: "hidden",
                  justifyContent: "flex-start",
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => toggleListDropdown()}
                style={[styles.dropdownItem, { marginTop: 6 }]}
              >
                <Text style={styles.dropdownItemText}>{t.list1}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => toggleListDropdown()}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>{t.list2}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => toggleListDropdown()}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>{t.list3}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Quantity Input */}
          <View style={styles.inputContainer}>
            <LocalSvg
              asset={require("../../assets/images/quantity.svg")}
              width={20}
              height={20}
              style={styles.icon}
            />
            <TextInput
              placeholder={t.quantity}
              placeholderTextColor="#8C8C8C"
              style={styles.input}
            />
            <Text style={styles.unitText}>({t.units})</Text>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="camera-alt" size={20} color="#666" />
            <Text style={styles.cameraText}>{t.addPhoto}</Text>
          </View>

          {/* Date Picker */}
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color="gray"
              style={styles.icon}
            />
            <Text style={styles.input}>{date.toLocaleDateString("en-US")}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={onClose}>
            <Text style={styles.submitButtonText}>{t.close}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
    color: "#333",
  },
  icon: {
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    flex: 1,
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
  unitText: {
    fontSize: 14,
    color: "#8C8C8C",
  },
  dropdown: {
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },

  dropdownTitle: {
    fontSize: 15,
    fontFamily: "SFPro-Regular",
    color: "#8C8C8C",
  },
  dropdownItem: {
    paddingVertical: 5,
    fontSize: 13,
    fontFamily: "SFPro-Regular",
    color: "#8C8C8C",
  },
  submitButton: {
    backgroundColor: "#002D62",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    color: "white",
  },
  closeButton: {
    fontSize: 16,
    color: "#002D62",
    fontWeight: "bold",
  },
  dropdownItemText: {
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
  cameraText: {
    flex: 1,
    fontFamily: "SFPro-Regular",
    color: "#666",
    fontSize: 14,
    marginLeft: 8,
  },
});

export default ResourceModal;
