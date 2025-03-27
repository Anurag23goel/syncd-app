import React, { useCallback, useEffect, useState } from "react";
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
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import EditContactModal from "@/components/Modal/EditContactModal";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { fetchMessagesForParticularChat } from "@/services/chat";
import { ChatMessage, ChatRoomMember } from "@/types/Apitypes";
import { Linking } from "react-native";
import socket, { connectSocketWithToken } from "@/app/socket";
import {
  CHAT_MESSAGES,
  PARTICULAR_CHAT_WITH_USER_RESPONSE_TYPE,
} from "@/types/NewApiTypes";

interface SocketMessageToSend {
  roomId: string;
  content: string;
  messageType: string;
}

interface SocketMessageToRecieve {
  content: string;
}

const ChatScreen = () => {
  const router = useRouter();
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].chat;
  const { id } = useLocalSearchParams();
  const chatRoomID = Array.isArray(id) ? id[0] : id;

  const authToken = useAuthStore.getState().token;
  const user = useAuthStore.getState().user;
  const currentUserID = user?.UserID;

  const [actualMessages, setActualMessages] = useState<CHAT_MESSAGES[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendersDetails, setSendersDetails] = useState<{
    UserID: string;
    UserFullName: string;
    UserProfilePicture: string | null;
    UserContact: string | null;
    UserEmail: string | null;
    IsCurrentUser: boolean;
  }>({
    UserID: "",
    UserFullName: "",
    UserProfilePicture: null,
    UserContact: null,
    UserEmail: "",
    IsCurrentUser: false,
  });

  useEffect(() => {
    if (!authToken || !chatRoomID || !currentUserID) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetchMessagesForParticularChat(
          authToken,
          chatRoomID
        );
        // Map messages and ensure all required fields are present
        const messages = response.data.messages.map((msg: CHAT_MESSAGES) => ({
          ...msg,
          RoomID: chatRoomID, // Add RoomID if not in API response
        }));
        setActualMessages(messages.reverse()); // Newest first

        // Since API doesn't provide Members, use RoomName as fallback for sender's name
        setSendersDetails({
          UserID: "", // No sender ID available for non-current user
          UserFullName: response.data.chatRoom.RoomName || "Unknown",
          UserProfilePicture: null, // No profile picture in data
          UserContact: null, // No contact in data
          UserEmail: "", // No email in data
          IsCurrentUser: false,
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [authToken, chatRoomID, currentUserID]);

  useEffect(() => {
    if (!authToken || !chatRoomID) return;

    connectSocketWithToken(authToken);
    socket.emit("join-room", chatRoomID);

    socket.on("new-message", (message: any) => {
      if (message.RoomID === chatRoomID) {
        const messageToBeAdded: CHAT_MESSAGES = {
          MessageID: message.MessageID || `temp-${Date.now()}`,
          SenderID: message.SenderID,
          Content: message.Content,
          MessageType: message.MessageType || "TEXT",
        };

        setActualMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m.MessageID === messageToBeAdded.MessageID)) {
            return prev;
          }
          return [messageToBeAdded, ...prev];
        });
      }
    });

    return () => {
      socket.off("new-message");
      socket.disconnect();
    };
  }, [authToken, chatRoomID]);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !chatRoomID || !currentUserID) return;

    const messageToBeSent: SocketMessageToSend = {
      roomId: chatRoomID,
      content: newMessage,
      messageType: "TEXT",
    };

    const tempMessage: CHAT_MESSAGES = {
      MessageID: `temp-${Date.now()}`,
      SenderID: currentUserID,
      Content: newMessage,
      MessageType: "TEXT",
    };

    // Optimistically update UI
    setActualMessages((prev) => [tempMessage, ...prev]);
    socket.emit("send-message", messageToBeSent);

    console.log("Sent:", newMessage);
    setNewMessage("");
  }, [newMessage, chatRoomID, currentUserID]);

  const renderMessage = ({ item }: { item: CHAT_MESSAGES }) => {
    const isSender = item.SenderID === currentUserID;

    return (
      <View
        style={
          isSender ? styles.sentMessageWrapper : styles.receivedMessageWrapper
        }
      >
        <View
          style={[
            styles.messageBubble,
            isSender ? styles.sentBubble : styles.receivedBubble,
          ]}
        >
          <Text style={isSender ? styles.sentText : styles.receivedText}>
            {item.Content}
          </Text>
        </View>
        {/* Timestamp not in API data, using current time as fallback */}
        <Text
          style={[
            styles.timestamp,
            isSender ? styles.sentTimestamp : styles.receivedTimestamp,
          ]}
        >
          {new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

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
              source={{
                uri:
                  sendersDetails.UserProfilePicture ||
                  "https://i.sstatic.net/34AD2.jpg",
              }}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.headerTitle}>
                {sendersDetails.UserFullName || "User"}
              </Text>
              <Text style={styles.onlineStatus}>{t.online}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {sendersDetails.UserContact && (
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${sendersDetails.UserContact}`)}
            style={styles.callButton}
          >
            <Feather name="phone" size={20} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Chat Messages */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={actualMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.MessageID}
          contentContainerStyle={styles.chatContainer}
          inverted // Newest messages at the bottom
        />
      )}

      {/* Input */}
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
                  }}
                >
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
                        source={{
                          uri:
                            sendersDetails.UserProfilePicture ||
                            "https://i.sstatic.net/34AD2.jpg",
                        }}
                        style={styles.modalProfileImage}
                      />
                      <Text style={styles.modalName}>
                        {sendersDetails.UserFullName}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        if (sendersDetails.UserContact) {
                          Linking.openURL(`tel:${sendersDetails.UserContact}`);
                        } else {
                          Alert.alert(
                            "No phone number",
                            "This user doesn't have a contact number."
                          );
                        }
                      }}
                      style={{
                        padding: 8,
                        borderRadius: 8,
                      }}
                    >
                      <Feather name="phone" size={25} color="#007AFF" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.modalDetails}>
                  <View style={styles.modalDetailRow}>
                    <Feather name="mail" size={20} color="#6B6B6B" />
                    <Text style={styles.modalDetailText}>
                      {sendersDetails.UserEmail || "No Email"}
                    </Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Feather name="phone" size={20} color="#6B6B6B" />
                    <Text style={styles.modalDetailText}>
                      {sendersDetails.UserContact || "No Phone"}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  callButton: {
    padding: 10,
    marginRight: 10,
    alignSelf: "center",
  },

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
