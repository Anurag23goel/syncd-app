import React, { useRef, useState, useEffect } from "react";
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
  Platform,
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
  console.log("Current language:", language); // Debug language value
  const t =
    translations[language]?.inventory?.modal?.addUpdateResource ||
    translations["en"].inventory.modal.addUpdateResource;

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
    invoices: [],
    photos: [],
  });

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  const [isCategoryDropdownVisible, setIsCategoryDropdownVisible] =
    useState(false);
  const categoryDropdownHeight = useRef(new Animated.Value(0)).current;
  const categoryRotationAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    const newValue = !isDropdownVisible;
    setIsDropdownVisible(newValue);
    Animated.timing(dropdownHeight, {
      toValue: newValue ? 90 : 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
    Animated.timing(rotationAnim, {
      toValue: newValue ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const toggleCategoryDropdown = () => {
    const newValue = !isCategoryDropdownVisible;
    setIsCategoryDropdownVisible(newValue);
    Animated.timing(categoryDropdownHeight, {
      toValue: newValue ? 90 : 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
    Animated.timing(categoryRotationAnim, {
      toValue: newValue ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const categoryRotation = categoryRotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.itemName || !formData.totalQuantity || !formData.cost) {
      alert(t.validationError || "Please fill in all required fields.");
      return;
    }
    onSubmit(formData);
    resetForm();
    onClose();
  };

  const handleAddInvoice = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: true,
      });
      if (!result.canceled) {
        const uris = result.assets.map((asset) => asset.uri);
        setFormData((prev) => ({
          ...prev,
          invoices: [...prev.invoices, ...uris],
        }));
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const handleAddPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
      });
      if (!result.canceled) {
        const uris = result.assets.map((asset) => asset.uri);
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, ...uris],
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      itemName: "",
      brandName: "",
      totalQuantity: "",
      units: "",
      cost: "",
      date: "",
      category: "",
      paymentMode: "",
      invoices: [],
      photos: [],
    });
    setIsDropdownVisible(false);
    setIsCategoryDropdownVisible(false);
    dropdownHeight.setValue(0);
    categoryDropdownHeight.setValue(0);
    rotationAnim.setValue(0);
    categoryRotationAnim.setValue(0);
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isVisible) {
      resetForm();
    }
  }, [isVisible]);

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title || t.title}</Text>
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
                keyboardType="numeric"
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
                <Text style={styles.dropdownTitle}>
                  {formData.category || t.category}
                </Text>
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
                  { height: categoryDropdownHeight, overflow: "hidden" },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    handleInputChange("category", t.categories.category1);
                    toggleCategoryDropdown();
                  }}
                  style={{ marginTop: 10 }}
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
                <Text style={styles.dropdownTitle}>
                  {formData.paymentMode || t.paymentMode}
                </Text>
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
                  { height: dropdownHeight, overflow: "hidden" },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    handleInputChange("paymentMode", t.modes.mode1);
                    toggleDropdown();
                  }}
                  style={{ marginTop: 10 }}
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
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {invoice.split("/").pop()} {/* Display only filename */}
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
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {photo.split("/").pop()} {/* Display only filename */}
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
                <Text style={styles.closeButton}>{closeText || t.close}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={styles.saveButton}>{saveText || t.save}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    maxHeight: "90%",
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
