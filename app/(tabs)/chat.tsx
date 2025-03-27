import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ContactSelectionModal from "../../components/Modal/ContactSelectionModal";
import { LocalSvg } from "react-native-svg/css";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { fetchUserAllChats } from "@/services/chat";
import { useAuthStore } from "@/store/authStore";
import { ChatRoom } from "@/types/Apitypes";
import { CHAT_ROOM_TYPE } from "@/types/NewApiTypes";

export default function ChatScreen() {
  const language = useLanguageStore((state) => state.language);
  const authToken = useAuthStore.getState().token;
  const t = translations[language].chat;

  const [activeTab, setActiveTab] = useState("All");
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [defaultChats, setDefaultChats] = useState<CHAT_ROOM_TYPE[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllChatsForDefaultScreen = async () => {
    try {
      if (!authToken) {
        console.error("No auth token found!");
        return;
      }

      setLoading(true);
      const response = await fetchUserAllChats(authToken);
      const chats = response.data?.chatRooms;

      setDefaultChats(chats || []);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchAllChatsForDefaultScreen();
    }
  }, [authToken]);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === "Groups") {
      router.push("/chat/groupInfo");
    }
  };

  const renderChatItem = (chat: CHAT_ROOM_TYPE) => {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => router.push(`/chat/${chat.RoomID}`)}
      >
        <Image
          source={{
            uri: chat.DisplayPicture || "https://i.sstatic.net/34AD2.jpg",
          }}
          style={styles.avatar}
        />
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{chat.DisplayName || "Unknown"}</Text>
            <Text style={styles.timeAgo}>
              {chat.LastMessage?.content
                ? new Date(chat.LastMessage.time).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : ""}
            </Text>
          </View>
          <View style={styles.chatFooter}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {chat.LastMessage?.content || "No messages yet"}
            </Text>
            {(chat.UnreadCount ?? 0) > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{chat.UnreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredChats = defaultChats.filter((chat) =>
    (chat.DisplayName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleModalClose = () => {
    setSearchQuery("");
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.chats}</Text>
        <TouchableOpacity onPress={() => router.push("/notification")}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="gray" />
        <TextInput
          placeholder={t.searchPlaceholder}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {[t.all, t.unread, t.groups].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => handleTabPress(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && defaultChats.length === 0 ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.RoomID}
          renderItem={({ item }) => renderChatItem(item)}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={() => {
            setSearchQuery("");
            setDefaultChats([]);
            setTimeout(() => {
              fetchAllChatsForDefaultScreen();
            }, 300);
          }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 32 }}>
              No chats found.
            </Text>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <LocalSvg
          asset={require("../../assets/images/AddChat.svg")}
          width={24}
          height={24}
        />
      </TouchableOpacity>

      {isModalVisible && <ContactSelectionModal onClose={handleModalClose} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "SFPro-Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "SFPro-Regular",
  },
  tabsContainer: {
    flexDirection: "row",
    marginVertical: 8,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flex: 1,
  },
  activeTab: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  tabText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "SFPro-Regular",
  },
  activeTabText: {
    color: "#fff",
    fontFamily: "SFPro-Medium",
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatName: {
    fontSize: 16,
    fontFamily: "SFPro-Semibold",
  },
  timeAgo: {
    fontSize: 12,
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    fontFamily: "SFPro-Regular",
  },
  unreadBadge: {
    backgroundColor: "#0060B0",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  unreadCount: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "SFPro-Bold",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#003B93",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
