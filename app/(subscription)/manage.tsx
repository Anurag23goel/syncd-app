import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

// Memoize modal components to prevent unnecessary re-renders
interface SelectMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCard: () => void;
  onSelectUPI: () => void;
}

const SelectMethodModal: React.FC<SelectMethodModalProps> = React.memo(
  ({ visible, onClose, onSelectCard, onSelectUPI }) => {
    const language = useLanguageStore((state) => state.language);
    const t = translations[language].subscription;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.selectOption}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.modalOption} onPress={onSelectCard}>
              <Ionicons name="card-outline" size={24} color="black" />
              <Text style={styles.modalOptionText}>{t.card}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={onSelectUPI}>
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png",
                }}
                style={styles.upiLogo}
              />
              <Text style={styles.modalOptionText}>UPI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
);

interface CardModalProps {
  visible: boolean;
  onClose: () => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardName: string;
  setCardName: (value: string) => void;
  cvv: string;
  setCvv: (value: string) => void;
  expiry: string;
  setExpiry: (value: string) => void;
  saveCard: boolean;
  setSaveCard: (value: boolean) => void;
  handleAddCard: () => void;
}

const CardModal: React.FC<CardModalProps> = React.memo(
  ({
    visible,
    onClose,
    cardNumber,
    setCardNumber,
    cardName,
    setCardName,
    cvv,
    setCvv,
    expiry,
    setExpiry,
    saveCard,
    setSaveCard,
    handleAddCard,
  }) => {
    const language = useLanguageStore((state) => state.language);
    const t = translations[language].subscription;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.addCard}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="card-outline"
                  size={20}
                  color="gray"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={t.cardNumber}
                  keyboardType="numeric"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  maxLength={16}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="gray"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Name on card"
                  value={cardName}
                  onChangeText={setCardName}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="shield-outline"
                  size={20}
                  color="gray"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="CVV"
                  keyboardType="numeric"
                  maxLength={3}
                  value={cvv}
                  onChangeText={setCvv}
                  secureTextEntry
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="gray"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="MM/YYYY"
                  keyboardType="numeric"
                  value={expiry}
                  onChangeText={setExpiry}
                  maxLength={7}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setSaveCard(!saveCard)}
            >
              <View
                style={[styles.checkbox, saveCard && styles.checkboxChecked]}
              >
                {saveCard && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>{t.saveCard}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddCard}
            >
              <Text style={styles.submitButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);

interface UPIModalProps {
  visible: boolean;
  onClose: () => void;
  upiId: string;
  setUpiId: (value: string) => void;
  upiName: string;
  setUpiName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  saveUPI: boolean;
  setSaveUPI: (value: boolean) => void;
  handleAddUPI: () => void;
}

const UPIModal: React.FC<UPIModalProps> = React.memo(
  ({
    visible,
    onClose,
    upiId,
    setUpiId,
    upiName,
    setUpiName,
    phone,
    setPhone,
    saveUPI,
    setSaveUPI,
    handleAddUPI,
  }) => {
    const language = useLanguageStore((state) => state.language);
    const t = translations[language].subscription;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.addUPI}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <View style={styles.inputContainer}>
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png",
                  }}
                  style={[styles.inputIcon, { width: 20, height: 20 }]}
                />
                <TextInput
                  style={styles.input}
                  placeholder={t.upiId}
                  value={upiId}
                  onChangeText={setUpiId}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="gray"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={t.name}
                  value={upiName}
                  onChangeText={setUpiName}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="gray"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={t.phone}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={10}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setSaveUPI(!saveUPI)}
            >
              <View
                style={[styles.checkbox, saveUPI && styles.checkboxChecked]}
              >
                {saveUPI && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>{t.saveUPI}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddUPI}
            >
              <Text style={styles.submitButtonText}>{t.add}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);

export default function App() {
  const [selectMethodVisible, setSelectMethodVisible] = useState(false);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [upiModalVisible, setUpiModalVisible] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [saveUPI, setSaveUPI] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");

  const [upiId, setUpiId] = useState("");
  const [upiName, setUpiName] = useState("");
  const [phone, setPhone] = useState("");

  const paymentMethods = [
    {
      type: "Visa",
      number: "****1234",
      expiry: "2/11/24",
      isDefault: true,
    },
    {
      type: "Master Card",
      number: "****4567",
      expiry: "2/11/24",
      isDefault: false,
    },
    {
      type: "UPI",
      number: "+91 ** 6541",
      email: "example@bank.in",
      isDefault: false,
    },
  ];

  const billingHistory = [
    { date: "12/10/24", plan: "Basic", amount: 499, status: "Paid" },
    { date: "12/11/24", plan: "Basic", amount: 499, status: "Paid" },
  ];

  const handleAddCard = () => {
    // Add card logic here
    setCardModalVisible(false);
    setCardNumber("");
    setCardName("");
    setCvv("");
    setExpiry("");
    setSaveCard(false);
  };

  const handleAddUPI = () => {
    // Add UPI logic here
    setUpiModalVisible(false);
    setUpiId("");
    setUpiName("");
    setPhone("");
    setSaveUPI(false);
  };

  const language = useLanguageStore((state) => state.language);
  const t = translations[language].subscription;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.backText}>{t.back}</Text>
        </View>

        {/* Basic Plan Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.basic}</Text>
          <View style={styles.planInfo}>
            <View style={styles.statusContainer}>
              <Ionicons name="happy-outline" size={24} color="green" />
              <Text style={styles.activeText}>{t.active}</Text>
            </View>
            <View style={styles.billingContainer}>
              <Text style={styles.billingText}>{t.billingDate} 6/11/24</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText}>{t.cancelPlan}</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.paymentMethods}</Text>
          {paymentMethods.map((method, index) => (
            <View key={index} style={styles.paymentMethod}>
              <View>
                <Text style={styles.paymentTitle}>
                  {method.type} {method.number}
                </Text>
                <Text style={styles.paymentSubtext}>
                  {method.expiry || method.email}
                </Text>
              </View>
              <View style={styles.paymentActions}>
                {!method.isDefault && (
                  <TouchableOpacity style={styles.defaultButton}>
                    <Text style={styles.defaultButtonText}>
                      {t.makeDefault}
                    </Text>
                  </TouchableOpacity>
                )}
                {method.isDefault && (
                  <View style={styles.defaultTag}>
                    <Text style={styles.defaultTagText}>{t.default}</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>{t.remove}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setSelectMethodVisible(true)}
          >
            <Text style={styles.addButtonText}>{t.add}</Text>
          </TouchableOpacity>
        </View>

        {/* Billing History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.billingHistory}</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>{t.date}</Text>
            <Text style={styles.tableHeaderText}>{t.plan}</Text>
            <Text style={styles.tableHeaderText}>{t.amount}</Text>
            <Text style={styles.tableHeaderText}>{t.status}</Text>
            <Text style={styles.tableHeaderText}>{t.invoice}</Text>
          </View>
          {billingHistory.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.date}</Text>
              <Text style={styles.tableCell}>{item.plan}</Text>
              <Text style={styles.tableCell}>{item.amount}</Text>
              <Text style={styles.tableCell}>{item.status}</Text>
              <TouchableOpacity>
                <Text style={styles.downloadLink}>{t.download}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <SelectMethodModal
        visible={selectMethodVisible}
        onClose={() => setSelectMethodVisible(false)}
        onSelectCard={() => {
          setSelectMethodVisible(false);
          setCardModalVisible(true);
        }}
        onSelectUPI={() => {
          setSelectMethodVisible(false);
          setUpiModalVisible(true);
        }}
      />
      <CardModal
        visible={cardModalVisible}
        onClose={() => setCardModalVisible(false)}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        cardName={cardName}
        setCardName={setCardName}
        cvv={cvv}
        setCvv={setCvv}
        expiry={expiry}
        setExpiry={setExpiry}
        saveCard={saveCard}
        setSaveCard={setSaveCard}
        handleAddCard={handleAddCard}
      />
      <UPIModal
        visible={upiModalVisible}
        onClose={() => setUpiModalVisible(false)}
        upiId={upiId}
        setUpiId={setUpiId}
        upiName={upiName}
        setUpiName={setUpiName}
        phone={phone}
        setPhone={setPhone}
        saveUPI={saveUPI}
        setSaveUPI={setSaveUPI}
        handleAddUPI={handleAddUPI}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    marginRight: 8,
  },
  backText: {
    fontSize: 18,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "white",
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  planInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
  },
  activeText: {
    color: "green",
    marginLeft: 4,
  },
  billingContainer: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
  },
  billingText: {
    color: "#666",
  },
  cancelButton: {
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#ff4444",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  paymentMethod: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  paymentSubtext: {
    color: "#666",
    marginTop: 4,
  },
  paymentActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  defaultButton: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  defaultButtonText: {
    color: "#666",
  },
  defaultTag: {
    backgroundColor: "#e8f0fe",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  defaultTagText: {
    color: "#1a73e8",
  },
  removeButton: {
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 6,
  },
  removeButtonText: {
    color: "white",
  },
  addButton: {
    backgroundColor: "#1a73e8",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tableHeaderText: {
    color: "#666",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tableCell: {
    flex: 1,
  },
  downloadLink: {
    color: "#1a73e8",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
  },
  modalOptionText: {
    marginLeft: 12,
    fontSize: 16,
  },
  upiLogo: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  formGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#1a73e8",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#1a73e8",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#1a73e8",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
