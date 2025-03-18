import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi, I'm having an issue with my dashboard layout it's not displaying correctly.",
      time: "08:16 AM",
      type: "sent",
    },
    {
      id: 2,
      text: "Hello! Thank you for the message. Let me check with the team and get back to you shortly.",
      time: "09:20 AM",
      type: "received",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const language = useLanguageStore((state) => state.language);
  const t = translations[language].profile.help;

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: "sent",
        },
      ]);
      setNewMessage("");
    }
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View
      style={[
        styles.messageContainer,
        item.type === "sent" ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      {item.text && (
        <Text
          style={[
            styles.messageText,
            item.type === "received" && styles.receivedMessageText,
          ]}
        >
          {item.text}
        </Text>
      )}
      <Text
        style={[
          styles.timeText,
          item.type === "sent"
            ? { alignSelf: "flex-end" }
            : { alignSelf: "flex-start", color: "#666" },
        ]}
      >
        {item.time}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
        <Image
          source={require("../../assets/images/headset.png")}
          style={styles.helpDeskImage}
        />
        <Text style={styles.headerText}>{t.helpDesk}</Text>
      </TouchableOpacity>

      {/* Modal for Contact Info */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)} // Close modal when clicking outside
        >
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.Modalheader}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="chevron-back" size={24} color="#000" />
                  <Image
                    source={require("../../assets/images/headset.png")}
                    style={styles.helpDeskImage}
                  />
                  <Text style={styles.headerText}>{t.helpDesk}</Text>
                </TouchableOpacity>
                <View style={styles.contactRow}>
                  <Feather name="mail" size={20} color="#8C8C8C" />
                  <Text style={styles.contactText}>{t.email}</Text>
                </View>
                <View style={styles.contactRow}>
                  <Feather name="phone" size={20} color="#8C8C8C" />
                  <Text style={styles.contactText}>{t.phone}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.chatContainer}
      />

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t.messagePlaceholder}
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="#646464" />
        </TouchableOpacity>
      </View>
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
    gap: 10,
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "SFPro-Semibold",
  },
  helpDeskImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  chatContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  messageContainer: {
    maxWidth: "75%",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 10,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F2F2F2",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 14,
    fontFamily: "SFPro-Regular",
    color: "#FFF",
  },
  receivedMessageText: {
    color: "#1A1A1A",
  },
  timeText: {
    fontSize: 10,
    marginTop: 5,
    color: "#E0E0E0",
    fontFamily: "SFPro-Regular",
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    fontFamily: "SFPro-Regular",
    fontSize: 14,
  },
  /* Modal Styles */
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingTop: 70,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    elevation: 5,
  },
  Modalheader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 15,
    fontFamily: "SFPro-Regular",
    color: "#8C8C8C",
  },
});

export default ChatScreen;
