import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import EditContactModal from "../../components/Modal/EditContactModal";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { useRouter } from "expo-router";

const ChatScreen = () => {
  const router = useRouter();
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].chat;

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey Ronak, quick update on the project. Can we review the site plans by tomorrow?",
      time: "08:18 AM",
      type: "sent",
    },
    {
      id: 2,
      text: "Sure, I'm available around 11 AM. Does that work?",
      time: "09:20 AM",
      type: "received",
    },
    {
      id: 3,
      text: "Perfect. I'll send over the latest drafts by tonight.",
      time: "09:25 AM",
      type: "sent",
    },
    {
      id: 4,
      text: "Great, I'll take a look before our call.",
      time: "09:26 AM",
      type: "received",
    },
    {
      id: 5,
      text: "Thanks. Let's aim to finalize the elevations in this review.",
      time: "09:30 AM",
      type: "sent",
    },
    {
      id: 6,
      text: "Sounds good. Looking forward to it.",
      time: "09:31 AM",
      type: "received",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

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

  const renderMessage = ({
    item,
  }: {
    item: { id: number; text: string; time: string; type: string };
  }) => (
    <View
      style={
        item.type === "sent"
          ? styles.sentMessageWrapper
          : styles.receivedMessageWrapper
      }
    >
      <View
        style={[
          styles.messageBubble,
          item.type === "sent" ? styles.sentBubble : styles.receivedBubble,
        ]}
      >
        <Text
          style={item.type === "sent" ? styles.sentText : styles.receivedText}
        >
          {item.text}
        </Text>
      </View>
      <Text
        style={[
          styles.timestamp,
          item.type === "sent"
            ? styles.sentTimestamp
            : styles.receivedTimestamp,
        ]}
      >
        {item.time}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.profileSection}
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/100?img=3" }}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.headerTitle}>Ronak Ahuja</Text>
              <Text style={styles.onlineStatus}>{t.online}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Feather name="phone" size={24} color="#000" />
        </TouchableOpacity>
      </View>

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
          placeholder={t.typingPlaceholder}
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <View style={styles.inputActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="paperclip" size={24} color="#646464" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons
              name="send"
              size={24}
              color={newMessage.trim() ? "#007AFF" : "#646464"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Modal */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: 24,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <Image
                      source={{ uri: "https://i.pravatar.cc/100?img=3" }}
                      style={styles.modalProfileImage}
                    />
                    <Text style={styles.modalName}>Ronak Ahuja</Text>
                  </View>
                  <TouchableOpacity>
                    <Feather
                      name="phone"
                      size={24}
                      color="#000"
                      style={styles.modalIcon}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalDetails}>
                  <View style={styles.modalDetailRow}>
                    <Feather name="mail" size={20} color="#6B6B6B" />
                    <Text style={styles.modalDetailText}>
                      ronak.ahuja12@gmail.com
                    </Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Feather name="phone" size={20} color="#6B6B6B" />
                    <Text style={styles.modalDetailText}>9876543210</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Ionicons
                      name="briefcase-outline"
                      size={20}
                      color="#6B6B6B"
                    />
                    <Text style={styles.modalDetailText}>Broker</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#6B6B6B"
                    />
                    <Text style={styles.modalDetailText}>Orion Towers</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditModalVisible(true)}
                >
                  <Text style={styles.editButtonText}>Edit contact</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <EditContactModal
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        contact={{
          name: "Ronak Ahuja",
          phone: "9876543210",
          email: "ronak.ahuja12@gmail.com",
          role: t.brokerRole,
          location: "Orion Towers",
        }}
        onUpdate={(updatedContact) => {
          console.log(updatedContact);
        }}
      />
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  onlineStatus: {
    fontSize: 12,
    color: "#4CAF50",
    fontFamily: "SFPro-Regular",
  },
  chatContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sentMessageWrapper: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  receivedMessageWrapper: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
  },
  sentBubble: {
    backgroundColor: "#007AFF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  receivedBubble: {
    backgroundColor: "#E0E0E0",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  sentText: {
    color: "#FFF",
    fontSize: 14,
  },
  receivedText: {
    color: "#000",
    fontSize: 14,
  },
  timestamp: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
  },
  sentTimestamp: {
    textAlign: "left",
  },
  receivedTimestamp: {
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 20,
    marginTop: 40,
    width: "90%",
    elevation: 5,
  },
  modalProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  modalName: {
    fontSize: 20,
    fontFamily: "SFPro-Semibold",
  },
  modalIcon: {},
  modalDetails: {
    width: "100%",
    marginBottom: 20,
  },
  modalDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  modalDetailText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#6B6B6B",
    paddingVertical: 4,
    fontFamily: "SFPro-Regular",
  },
  editButton: {
    backgroundColor: "#F2F2F2",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  editButtonText: {
    color: "#000",
    fontFamily: "SFPro-Regular",
    fontSize: 16,
  },
  inputActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatScreen;
