import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Assignee {
  id: string;
  name: string;
}

export default function TeamDashboard({ onBack }: { onBack: () => void }) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.teamDashboard;
  const [modalVisible, setModalVisible] = useState(false);
  const [assignees, setAssignees] = useState<Assignee[]>([
    { id: "1", name: "Person 1" },
    { id: "2", name: "Person 2" },
    { id: "3", name: "Person 3" },
  ]);

  const [memberStates, setMemberStates] = useState<{
    [key: string]: {
      isOpen: boolean;
      inventoryOpen: boolean;
      isEnabled: boolean;
    };
  }>({
    "1": { isOpen: false, inventoryOpen: false, isEnabled: false },
    "2": { isOpen: false, inventoryOpen: false, isEnabled: false },
    "3": { isOpen: false, inventoryOpen: false, isEnabled: false },
  });

  const [selectedPermissions, setSelectedPermissions] = useState<{
    [key: string]: { edit: boolean; view: boolean; export: boolean };
  }>({
    "1": { edit: false, view: false, export: false },
    "2": { edit: false, view: false, export: false },
    "3": { edit: false, view: false, export: false },
  });

  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Name",
      role: "Role Name",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      id: "2",
      name: "Name",
      role: "Role Name",
      avatar: "https://i.pravatar.cc/100?img=2",
    },
    {
      id: "3",
      name: "Name",
      role: "Role Name",
      avatar: "https://i.pravatar.cc/100?img=3",
    },
  ];

  const toggleInventoryOpen = (id: string) => {
    setMemberStates((prevState) => ({
      ...prevState,
      [id]: { ...prevState[id], inventoryOpen: !prevState[id].inventoryOpen },
    }));
  };

  const toggleIsOpen = (id: string) => {
    setMemberStates((prevState) => ({
      ...prevState,
      [id]: { ...prevState[id], isOpen: !prevState[id].isOpen },
    }));
  };

  const toggleIsEnabled = (id: string) => {
    setMemberStates((prevState) => ({
      ...prevState,
      [id]: { ...prevState[id], isEnabled: !prevState[id].isEnabled },
    }));
  };

  const togglePermission = (
    id: string,
    permission: "edit" | "view" | "export"
  ) => {
    setSelectedPermissions((prevState) => ({
      ...prevState,
      [id]: { ...prevState[id], [permission]: !prevState[id][permission] },
    }));
  };

  const removeAssignee = (id: string) => {
    setAssignees(assignees.filter((assignee) => assignee.id !== id));
  };

  const addNewAssignee = () => {
    const newId = (assignees.length + 1).toString();
    setAssignees([...assignees, { id: newId, name: `Person ${newId}` }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.title}</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={t.search}
          placeholderTextColor="#666"
        />
      </View>

      <ScrollView style={styles.content}>
        {teamMembers.map((member) => (
          <View
            key={member.id}
            style={{
              flexDirection: "column",
              padding: 12,
              backgroundColor: "#fff",
              borderRadius: 10,
              marginBottom: 12,
            }}
          >
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberInfo}>
                <Image source={{ uri: member.avatar }} style={styles.avatar} />
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{member.name}</Text>
                  <Text style={styles.role}>{member.role}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.editButton,
                  {
                    backgroundColor: !memberStates[member.id].inventoryOpen
                      ? "#F7F7F7"
                      : "#3498DB",
                  },
                ]}
                onPress={() => toggleInventoryOpen(member.id)}
              >
                <Ionicons
                  name="settings-outline"
                  size={16}
                  color={
                    !memberStates[member.id].inventoryOpen ? "#000" : "#fff"
                  }
                />
                <Text
                  style={[
                    styles.editButtonText,
                    {
                      color: !memberStates[member.id].inventoryOpen
                        ? "#000"
                        : "#fff",
                    },
                  ]}
                >
                  {t.editPermission}
                </Text>
              </TouchableOpacity>
            </View>
            {memberStates[member.id].inventoryOpen && (
              <View
                style={{
                  marginTop: 12,
                  backgroundColor: "#F7F7F7",
                  paddingHorizontal: 6,
                  borderRadius: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text>{t.inventory}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Switch
                      value={memberStates[member.id].isEnabled}
                      onValueChange={() => toggleIsEnabled(member.id)}
                      trackColor={{ false: "#DEDEDE", true: "#81b0ff" }}
                      thumbColor={
                        memberStates[member.id].isEnabled ? "#007BFF" : "#666"
                      }
                    />
                    <TouchableOpacity onPress={() => toggleIsOpen(member.id)}>
                      <Feather
                        name={
                          memberStates[member.id].isOpen
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={24}
                        color="#000"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {memberStates[member.id].isOpen && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 12,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 4,
                        alignItems: "center",
                      }}
                    >
                      <Text>{t.permissions.edit}</Text>
                      <TouchableOpacity
                        onPress={() => togglePermission(member.id, "edit")}
                      >
                        {selectedPermissions[member.id].edit ? (
                          <AntDesign
                            name="checkcircle"
                            size={20}
                            color="#007BFF"
                          />
                        ) : (
                          <Feather name="circle" size={20} color="#007BFF" />
                        )}
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 4,
                        alignItems: "center",
                      }}
                    >
                      <Text>{t.permissions.view}</Text>
                      <TouchableOpacity
                        onPress={() => togglePermission(member.id, "view")}
                      >
                        {selectedPermissions[member.id].view ? (
                          <AntDesign
                            name="checkcircle"
                            size={20}
                            color="#007BFF"
                          />
                        ) : (
                          <Feather name="circle" size={20} color="#007BFF" />
                        )}
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 4,
                        alignItems: "center",
                      }}
                    >
                      <Text>{t.permissions.export}</Text>
                      <TouchableOpacity
                        onPress={() => togglePermission(member.id, "export")}
                      >
                        {selectedPermissions[member.id].export ? (
                          <AntDesign
                            name="checkcircle"
                            size={20}
                            color="#007BFF"
                          />
                        ) : (
                          <Feather name="circle" size={20} color="#007BFF" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Add Member Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.addMember}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.assigneesSection}>
              <View style={styles.uploadHeader}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Ionicons name="people-outline" size={20} color="#8C8C8C" />
                  <TextInput
                    placeholder={t.assignees}
                    placeholderTextColor="#8C8C8C"
                    style={styles.uploadTitle}
                  />
                </View>
                <TouchableOpacity onPress={addNewAssignee}>
                  <Text style={styles.addButton}>{t.add}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.chipContainer}>
              {assignees.map((assignee) => (
                <View key={assignee.id} style={styles.chip}>
                  <Text style={styles.chipText}>{assignee.name}</Text>
                  <TouchableOpacity onPress={() => removeAssignee(assignee.id)}>
                    <Ionicons name="close-outline" size={20} color="#8C8C8C" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addMemberButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.addMemberText}>{t.add}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: moderateScale(16),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateScale(10),
  },
  backButton: {
    marginRight: moderateScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: moderateScale(14),
    paddingHorizontal: moderateScale(12),
    height: moderateScale(40),
    backgroundColor: "#fff",
    borderRadius: moderateScale(8),
  },
  searchIcon: {
    marginRight: moderateScale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: "#000",
    fontFamily: "SFPro-Regular",
  },
  content: {
    flex: 1,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
  },
  textContainer: {
    marginLeft: moderateScale(12),
  },
  name: {
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Medium",
  },
  role: {
    fontSize: moderateScale(12),
    color: "#666",
    marginTop: moderateScale(2),
    fontFamily: "SFPro-Regular",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(8),
    backgroundColor: "#F7F7F7",
    borderRadius: moderateScale(5),
  },
  editButtonText: {
    marginLeft: moderateScale(4),
    fontSize: moderateScale(12),
    color: "#1A1A1A",
    fontFamily: "SFPro-Regular",
  },
  fab: {
    position: "absolute",
    right: moderateScale(16),
    bottom: moderateScale(16),
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: "#002B5B",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: moderateScale(10),
    padding: moderateScale(16),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(16),
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Bold",
  },
  assigneesSection: {
    marginBottom: moderateScale(16),
    backgroundColor: "#F9F9F9",
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: moderateScale(12),
  },
  uploadHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  uploadTitle: {
    fontSize: moderateScale(14),
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
  addButton: {
    color: "#3498DB",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Regular",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: moderateScale(10),
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    marginRight: moderateScale(8),
    marginBottom: moderateScale(8),
  },
  chipText: {
    fontSize: moderateScale(14),
    marginRight: moderateScale(8),
    fontFamily: "SFPro-Regular",
  },
  addMemberButton: {
    backgroundColor: "#002B5B",
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(8),
    alignItems: "center",
  },
  addMemberText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Semibold",
  },
});
