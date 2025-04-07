import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { AntDesign, FontAwesome, Feather } from "@expo/vector-icons";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { createPayment } from "@/services/project_user/payment_logs";
import { useAuthStore } from "@/store/authStore";

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
}

interface CreatePaymentPayload{
  ProjectID: string;
  Amount: number;
  Title: string;
  EnterDetails: string;
  Category: string;
  PaymentMode: string;
  InvoiceLink?: string;
}
export default function AddExpenseModal({
  visible,
  onClose,
}: AddExpenseModalProps) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs.paymentLog.addExpense;
  const currentProject =  useAuthStore.getState().projectID;
  
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  
  const resetForm = () => {
    setTitle("");
    setAmount("");
    setDetails("");
    setCategory("");
    setPaymentMode("");
    setInvoiceFile(null);
  };

  const handleSubmit = async () => {
    console.log("Submit button clicked");
    if (!title || !amount || !details ) {
      console.log("Error", "Please fill all required fields");
      return;
    }

    if (!currentProject) {
      console.log("Error", "No project selected");
      return;
    }

    setIsLoading(true);
    
    try {
      let invoiceLink = "";
      
      
      const paymentData: CreatePaymentPayload = {
        ProjectID: currentProject,
        Amount: parseFloat(amount),
        Title: title,
        EnterDetails: details,
        Category: category,
        PaymentMode: paymentMode,
        InvoiceLink: invoiceLink || undefined
      };
      
     
      console.log("Payment created successfully:");
      
      console.log("Success", "Expense added successfully!");
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Error creating payment:", error);
      console.log("Error", error.message || "Failed to add expense");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.title}>{t.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={moderateScale(24)} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <FontAwesome
                name="rupee"
                size={moderateScale(16)}
                color="#8C8C8C"
              />
              <TextInput
                placeholder={t.amount}
                placeholderTextColor="#8C8C8C"
                keyboardType="numeric"
                style={styles.textInput}
              />
            </View>

            <View style={styles.input}>
              <Feather name="tag" size={moderateScale(16)} color="#8C8C8C" />
              <TextInput
                placeholder={t.enterTitle}
                placeholderTextColor="#8C8C8C"
                style={styles.textInput}
              />
            </View>

            <View style={styles.input}>
              <Feather
                name="align-left"
                size={moderateScale(16)}
                color="#8C8C8C"
              />
              <TextInput
                placeholder={t.enterDetails}
                placeholderTextColor="#8C8C8C"
                multiline
                style={styles.textInput}
              />
            </View>

            <View style={styles.input}>
              <Feather
                name="calendar"
                size={moderateScale(16)}
                color="#8C8C8C"
              />
              <TextInput
                placeholder={t.date}
                placeholderTextColor="#8C8C8C"
                style={styles.textInput}
              />
            </View>

            <TouchableOpacity
              style={[styles.input, { paddingVertical: moderateScale(12) }]}
            >
              <Feather name="grid" size={moderateScale(16)} color="#8C8C8C" />
              <Text style={styles.dropdownText}>{t.category}</Text>
              <Feather
                name="chevron-down"
                size={moderateScale(16)}
                color="#8C8C8C"
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.input, { paddingVertical: moderateScale(12) }]}
            >
              <Feather
                name="credit-card"
                size={moderateScale(16)}
                color="#8C8C8C"
              />
              <Text style={styles.dropdownText}>{t.paymentMode}</Text>
              <Feather
                name="chevron-down"
                size={moderateScale(16)}
                color="#8C8C8C"
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>

            <View
              style={[
                styles.input,
                {
                  justifyContent: "space-between",
                  paddingVertical: moderateScale(12),
                },
              ]}
            >
              <TouchableOpacity style={styles.invoiceButton}>
                <Feather
                  name="paperclip"
                  size={moderateScale(16)}
                  color="#8C8C8C"
                />
                <Text style={styles.invoiceText}>{t.addInvoice}</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.addLink}>{t.add}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.addButton}   onPress={handleSubmit}>
            <Text style={styles.addButtonText}>{t.add}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    width: "90%",
    maxWidth: moderateScale(400),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  inputContainer: {
    gap: moderateScale(15),
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(6),
    backgroundColor: "#F9F9F9",
  },
  textInput: {
    flex: 1,
    fontSize: moderateScale(14),
  },
  dropdownText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: "#8C8C8C",
  },
  dropdownIcon: {
    marginLeft: "auto",
  },
  invoiceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  invoiceButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
  },
  invoiceText: {
    fontSize: moderateScale(14),
    color: "#8C8C8C",
  },
  addLink: {
    color: "#007AFF",
    fontSize: moderateScale(14),
  },
  addButton: {
    backgroundColor: "#003B95",
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    alignItems: "center",
    marginTop: moderateScale(20),
  },
  addButtonText: {
    color: "white",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
});
