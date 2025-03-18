import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Animated,
  ScrollView,
} from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LocalSvg } from "react-native-svg/css";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface AddUpdateResourceModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title?: string;
  closeText?: string;
  saveText?: string;
}

const AddUpdateResourceModal: React.FC<AddUpdateResourceModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  title,
  closeText = "Close",
  saveText = "Save",
}) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].inventory.modal.addUpdateResource;

  const [formData, setFormData] = useState<{
    itemName: string;
    brandName: string;
    totalQuantity: string;
    units: string;
    cost: string;
    date: string;
    category: string;
    paymentMode: string;
    invoices: string[];
    photos: string[];
  }>({
    itemName: "",
    brandName: "",
    totalQuantity: "",
    units: "",
    cost: "",
    date: "",
    category: "",
    paymentMode: "",
    invoices: [], // Change to an array to store multiple invoices
    photos: [], // Add photos array to store selected images
  });

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current; // Rotation value

  const [isCategoryDropdownVisible, setIsCategoryDropdownVisible] =
    useState(false);
  const categoryDropdownHeight = useRef(new Animated.Value(0)).current;
  const categoryRotationAnim = useRef(new Animated.Value(0)).current; // Rotation value for category

  const toggleDropdown = () => {
    if (isDropdownVisible) {
      // Collapse the dropdown
      Animated.timing(dropdownHeight, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start(() => setIsDropdownVisible(false));

      // Rotate back to original
      Animated.timing(rotationAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      // Expand the dropdown
      setIsDropdownVisible(true);
      Animated.timing(dropdownHeight, {
        toValue: 90, // Adjust height as per your dropdown size
        duration: 400,
        useNativeDriver: false,
      }).start();

      // Rotate to 180 degrees
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
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

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"], // Rotate between 0 and 180 degrees
  });

  const categoryRotation = categoryRotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"], // Rotate between 0 and 180 degrees
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose(); // Close modal after submission
  };

  const handleAddInvoice = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: true, // Enable multiple file selection
      });
      if (!result.canceled) {
        const uris = result.assets.map((asset) => asset.uri);
        setFormData((prev) => ({
          ...prev,
          invoices: [...prev.invoices, ...uris],
        }));
      }
    } catch (error) {
      console.error("Error picking document: ", error);
    }
  };

  const handleAddPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true, // Enable multiple image selection
      });
      if (!result.canceled) {
        const uris = result.assets.map((asset) => asset.uri);
        setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...uris] }));
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholderTextColor={"#8C8C8C"}
                style={styles.input}
                placeholder={t.itemName}
                value={formData.itemName}
                onChangeText={(text) => handleInputChange("itemName", text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholderTextColor={"#8C8C8C"}
                style={styles.input}
                placeholder={t.brandName}
                value={formData.brandName}
                onChangeText={(text) => handleInputChange("brandName", text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <LocalSvg
                asset={require("../../assets/images/quantity.svg")}
                width={20}
                height={20}
                style={styles.icon}
              />
              <TextInput
                placeholderTextColor={"#8C8C8C"}
                style={styles.input}
                placeholder={t.totalQuantity}
                value={formData.totalQuantity}
                onChangeText={(text) =>
                  handleInputChange("totalQuantity", text)
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons
                name="currency-rupee"
                size={20}
                color="gray"
                style={styles.icon}
              />
              <TextInput
                placeholderTextColor={"#8C8C8C"}
                style={styles.input}
                placeholder={t.cost}
                value={formData.cost}
                onChangeText={(text) => handleInputChange("cost", text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather
                name="calendar"
                size={20}
                color="gray"
                style={styles.icon}
              />
              <TextInput
                placeholderTextColor={"#8C8C8C"}
                style={styles.input}
                placeholder={t.date}
                value={formData.date}
                onChangeText={(text) => handleInputChange("date", text)}
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
                <Text style={styles.dropdownTitle}>{t.category}</Text>
                <Animated.View
                  style={{ transform: [{ rotate: categoryRotation }] }}
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
                    height: categoryDropdownHeight,
                    overflow: "hidden",
                    justifyContent: "flex-start",
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    handleInputChange("category", t.categories.category1);
                    toggleCategoryDropdown();
                  }}
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.dropdownItem}>
                    {t.categories.category1}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleInputChange("category", t.categories.category2);
                    toggleCategoryDropdown();
                  }}
                >
                  <Text style={styles.dropdownItem}>
                    {t.categories.category2}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleInputChange("category", t.categories.category3);
                    toggleCategoryDropdown();
                  }}
                >
                  <Text style={styles.dropdownItem}>
                    {t.categories.category3}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Payment Mode Dropdown */}
            <View style={[styles.inputContainer, { flexDirection: "column" }]}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
                onPress={toggleDropdown}
              >
                <Text style={styles.dropdownTitle}>{t.paymentMode}</Text>
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
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
                    height: dropdownHeight,
                    overflow: "hidden",
                    justifyContent: "flex-start",
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    handleInputChange("paymentMode", t.modes.mode1);
                    toggleDropdown();
                  }}
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.dropdownItem}>{t.modes.mode1}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleInputChange("paymentMode", t.modes.mode2);
                    toggleDropdown();
                  }}
                >
                  <Text style={styles.dropdownItem}>{t.modes.mode2}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleInputChange("paymentMode", t.modes.mode3);
                    toggleDropdown();
                  }}
                >
                  <Text style={styles.dropdownItem}>{t.modes.mode3}</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            <TouchableOpacity
              style={styles.addInvoice}
              onPress={handleAddInvoice}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather
                  name="file"
                  size={20}
                  color="gray"
                  style={styles.icon}
                />
                <Text style={styles.addInvoiceText}>{t.addInvoice}</Text>
              </View>
              <Text style={{ color: "#3498DB" }}>{t.actions.add}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addInvoice}
              onPress={handleAddPhoto}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather
                  name="image"
                  size={20}
                  color="gray"
                  style={styles.icon}
                />
                <Text style={styles.addInvoiceText}>{t.addPhoto}</Text>
              </View>
              <Text style={{ color: "#3498DB" }}>{t.actions.add}</Text>
            </TouchableOpacity>

            {formData.invoices.length > 0 &&
              formData.invoices.map((invoice, index) => (
                <View key={index} style={styles.addInvoice}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={[
                        styles.addInvoiceText,
                        { width: "90%", fontSize: 12 },
                      ]}
                    >
                      {invoice}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setFormData((prev) => ({
                        ...prev,
                        invoices: prev.invoices.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <Ionicons name="close" size={20} color="gray" />
                  </TouchableOpacity>
                </View>
              ))}

            {formData.photos.length > 0 &&
              formData.photos.map((photo, index) => (
                <View key={index} style={styles.addInvoice}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={[
                        styles.addInvoiceText,
                        { width: "90%", fontSize: 12 },
                      ]}
                    >
                      {photo}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setFormData((prev) => ({
                        ...prev,
                        photos: prev.photos.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <Ionicons name="close" size={20} color="gray" />
                  </TouchableOpacity>
                </View>
              ))}

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>{t.close}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={styles.saveButton}>{t.save}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
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
    maxHeight: "90%", // Set max height to 90% of the screen
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "SFPro-Semibold",
    color: "black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "SFPro-Regular",
    color: "#333",
  },
  icon: {
    marginRight: 5,
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
    paddingHorizontal: 10,
    fontSize: 13,
    fontFamily: "SFPro-Regular",
    color: "#8C8C8C",
  },
  addInvoice: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
  },
  addInvoiceText: {
    fontSize: 15,
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
    fontFamily: "SFPro-Semibold",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  closeButton: {
    fontSize: 16,
    fontFamily: "SFPro-Semibold",
    color: "#3498DB",
  },
  saveButton: {
    fontSize: 16,
    fontFamily: "SFPro-Semibold",
    color: "#002D62",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "SFPro-Semibold",
    color: "black",
    marginBottom: 20,
  },
});

export default AddUpdateResourceModal;
