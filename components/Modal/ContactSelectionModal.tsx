import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Image,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { useAuthStore } from "@/store/authStore";
import { createChatRoom, searchUser } from "@/services/chat";
import { CreateChatRoomPayload, SearchUserResponse } from "@/types/Apitypes";
import { router } from "expo-router";

interface ContactSelectionModalProps {
  onClose: () => void;
}

// Extended user type with selection state
type SelectableContact = SearchUserResponse & { selected: boolean };

const ContactSelectionModal: React.FC<ContactSelectionModalProps> = ({
  onClose,
}) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].contactSelection;
  const user = useAuthStore.getState().user; // Replace with your logic
  const currentUserID = user.UserID;
  const authToken = useAuthStore.getState().token;

  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupView, setIsGroupView] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [contacts, setContacts] = useState<SelectableContact[]>([]);

  // Load contacts based on search
  useEffect(() => {
    if (!authToken) return;

    const fetchSearchedContacts = async (query: string) => {
      try {
        const response = await searchUser(authToken, query); // search by query
        const users = response.data?.users || [];
        const selectableContacts: SelectableContact[] = users.map((user) => ({
          ...user,
          selected: false,
        }));
        setContacts(selectableContacts);
      } catch (error: any) {
        console.log("Search error:", error.message);
      }
    };

    // const fetchAllContacts = async () => {
    //   try {
    //     const response = await fetchAllUsers(authToken); // your API for all users
    //     const users = response.data?.users || [];
    //     const selectableContacts: SelectableContact[] = users.map((user) => ({
    //       ...user,
    //       selected: false,
    //     }));
    //     setContacts(selectableContacts);
    //   } catch (error: any) {
    //     console.log("Fetch all contacts error:", error.message);
    //   }
    // };

    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        fetchSearchedContacts(searchQuery.trim());
      } else {
        // fetchAllContacts(); // <-- different API call when no search query
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const toggleSelection = (userID: string) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.UserID === userID
          ? { ...contact, selected: !contact.selected }
          : contact
      )
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setGroupImage(result.assets[0].uri);
    }
  };

  const selectedContacts = contacts.filter((c) => c.selected);

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;

    console.log("Creating group with:", {
      name: groupName,
      description: groupDescription,
      members: selectedContacts,
      image: groupImage,
    });

    onClose();
  };

  const handleCreateDirectChat = async () => {
    if (selectedContacts.length !== 1 || !currentUserID) return;

    if (!authToken) return;

    try {
      const chatRoomPayload: CreateChatRoomPayload = {
        RoomType: "INDIVIDUAL",
        Members: [selectedContacts[0].UserID],
      };

      const res = await createChatRoom(authToken, chatRoomPayload);
      router.push(`/chat/${selectedContacts[0].UserID}`);
      onClose();
    } catch (error: any) {
      console.error("Error creating direct chat:", error.message);
    }
  };

  const renderContact = ({ item }: { item: SelectableContact }) => (
    <TouchableOpacity
      style={styles.contactRow}
      onPress={() => toggleSelection(item.UserID)}
    >
      <Image
        source={{
          uri: item.UserProfilePicture || "https://via.placeholder.com/50",
        }}
        style={styles.contactImage}
      />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.UserFullName}</Text>
        <Text style={styles.contactNumber}>{item.UserEmail}</Text>
      </View>
      {item.selected ? (
        <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
      ) : (
        <Ionicons name="ellipse-outline" size={24} color="#C0C0C0" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <SafeAreaView
          style={[
            styles.modalContainer,
            { maxHeight: isGroupView ? "50%" : "70%" },
          ]}
        >
          {!isGroupView ? (
            <>
              <View style={styles.header}>
                <Text style={styles.headerText}>{t.selectContacts}</Text>
                <TouchableOpacity onPress={onClose}>
                  <Feather name="x" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="gray" />
                <TextInput
                  placeholder={t.searchPlaceholder}
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#8C8C8C"
                />
              </View>
              <FlatList
                data={contacts}
                renderItem={renderContact}
                keyExtractor={(item) => item.UserID}
                contentContainerStyle={styles.contactList}
                showsVerticalScrollIndicator={false}
              />

              {selectedContacts.length > 0 && (
                <View style={styles.bottomBar}>
                  <Text style={styles.selectedCount}>
                    {selectedContacts.length} {t.selected}
                  </Text>
                  {selectedContacts.length === 1 ? (
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={handleCreateDirectChat}
                    >
                      <Text style={styles.nextButtonText}>{t.startChat}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={() => setIsGroupView(true)}
                    >
                      <Text style={styles.nextButtonText}>{t.next}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </>
          ) : (
            <View style={styles.groupContainer}>
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => setIsGroupView(false)}
                  style={styles.backButton}
                >
                  <Ionicons name="chevron-back" size={24} color="#000" onPress={() => router.back()}/>
                </TouchableOpacity>
                <Text style={styles.headerText}>{t.newGroup}</Text>
                <View style={{ width: 24 }} />
              </View>

              <TouchableOpacity
                style={styles.groupImageWrapper}
                onPress={pickImage}
              >
                {groupImage ? (
                  <Image
                    source={{ uri: groupImage }}
                    style={styles.groupImage}
                  />
                ) : (
                  <View style={styles.groupImagePlaceholder}>
                    <Ionicons name="camera-outline" size={30} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.groupForm}>
                <TextInput
                  placeholder={t.groupName}
                  style={styles.groupNameInput}
                  value={groupName}
                  onChangeText={setGroupName}
                  placeholderTextColor="#8C8C8C"
                />
                <TextInput
                  placeholder={t.groupDescription}
                  style={styles.groupDescriptionInput}
                  value={groupDescription}
                  onChangeText={setGroupDescription}
                  multiline
                  placeholderTextColor="#8C8C8C"
                />
              </View>

              <View style={styles.membersSection}>
                <Text style={styles.memberCountText}>
                  {t.members}: {selectedContacts.length}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.membersListContainer}
                >
                  {selectedContacts.map((contact) => (
                    <View key={contact.UserID} style={styles.memberItem}>
                      <Image
                        source={{
                          uri:
                            contact.UserProfilePicture ||
                            "https://via.placeholder.com/50",
                        }}
                        style={styles.memberImage}
                      />
                      <Text style={styles.memberName} numberOfLines={1}>
                        {contact.UserFullName}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              <TouchableOpacity
                style={[
                  styles.createButton,
                  !groupName.trim() && styles.createButtonDisabled,
                ]}
                onPress={handleCreateGroup}
                disabled={!groupName.trim()}
              >
                <Text style={styles.createButtonText}>{t.createGroup}</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  contactList: {
    paddingBottom: 16,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  contactNumber: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    fontFamily: "SFPro-Regular",
  },
  confirmButton: {
    backgroundColor: "#002D62",
    borderRadius: 30,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
    alignSelf: "center",
  },

  backButton: {
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  groupImageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#002347",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  groupNameInput: {
    fontSize: 18,
    fontFamily: "SFPro-Semibold",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 8,
  },
  groupDescriptionInput: {
    fontSize: 14,
    color: "#666",
    fontFamily: "SFPro-Regular",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  memberCountText: {
    fontSize: 12,
    marginVertical: 10,
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
  membersListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  memberImage: {
    width: 42,
    height: 42,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
  },
  groupImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  groupImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  groupContainer: {
    flex: 1,
  },
  groupForm: {
    flex: 1,
    padding: 16,
  },
  membersSection: {
    flex: 1,
    padding: 16,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  createButton: {
    backgroundColor: "#002D62",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 16,
  },
  createButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  createButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "SFPro-Medium",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  selectedCount: {
    fontSize: 16,
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  nextButton: {
    backgroundColor: "#002D62",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "SFPro-Medium",
  },
});

export default ContactSelectionModal;
