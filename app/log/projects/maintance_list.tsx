import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { moderateScale } from "@/utils/spacing";
import { BottomSheet } from "react-native-btr";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { router } from "expo-router";

interface MaintenancePerson {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export default function MaintenanceList({ onBack }: { onBack: () => void }) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.maintenanceList;
  const [modalVisible, setModalVisible] = useState(false);
  const [assignees, setAssignees] = useState<MaintenancePerson[]>([]);
  const [newContact, setNewContact] = useState("");
  const [newName, setNewName] = useState("");
  const [newCompanyBrand, setNewCompanyBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newInvoice, setNewInvoice] = useState("");
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const toggleBottomSheet = () => {
    setBottomSheetVisible(!bottomSheetVisible);
  };
  const maintenanceStaff: MaintenancePerson[] = [
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
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      id: "3",
      name: "Name",
      role: "Role Name",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      id: "4",
      name: "Name",
      role: "Role Name",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      id: "5",
      name: "Name",
      role: "Role Name",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
  ];

  const [memberStates, setMemberStates] = useState<{
    [key: string]: { detailsOpen: boolean };
  }>(
    maintenanceStaff.reduce((acc, member) => {
      acc[member.id] = { detailsOpen: false };
      return acc;
    }, {} as { [key: string]: { detailsOpen: boolean } })
  );

  const toggleContactDetailsOpen = (id: string) => {
    setMemberStates((prevState) => ({
      ...prevState,
      [id]: { detailsOpen: !prevState[id]?.detailsOpen },
    }));
  };

  const addNewAssignee = () => {
    // Add new assignee logic
  };

  const removeAssignee = (id: string) => {
    setAssignees((prevAssignees) =>
      prevAssignees.filter((assignee) => assignee.id !== id)
    );
  };

  const addNewContact = () => {
    // Add new contact logic
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" onPress={() => router.back()}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.title}</Text>
      </View>

      <ScrollView style={styles.content}>
        {maintenanceStaff.map((member) => (
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
                    backgroundColor: !memberStates[member.id].detailsOpen
                      ? "#F7F7F7"
                      : "#3498DB",
                  },
                ]}
                onPress={() => toggleContactDetailsOpen(member.id)}
              >
                <Text
                  style={[
                    styles.editButtonText,
                    {
                      color: !memberStates[member.id].detailsOpen
                        ? "#000"
                        : "#fff",
                    },
                  ]}
                >
                  Contact Details
                </Text>
              </TouchableOpacity>
            </View>
            {memberStates[member.id].detailsOpen && (
              <View
                style={{
                  marginTop: 12,
                  paddingHorizontal: 6,
                  borderRadius: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#F7F7F7",
                      width: "100%",
                      borderRadius: 8,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                      }}
                    >
                      Details1
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#F7F7F7",
                      width: "100%",
                      borderRadius: 8,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                      }}
                    >
                      Details2
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#F7F7F7",
                      width: "100%",
                      borderRadius: 8,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                      }}
                    >
                      Details3
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button for Download */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="download" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Floating Action Button for Plus */}
      <TouchableOpacity
        style={[styles.fab, { bottom: moderateScale(80) }]}
        onPress={toggleBottomSheet}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <BottomSheet
        visible={bottomSheetVisible}
        onBackButtonPress={toggleBottomSheet}
        onBackdropPress={toggleBottomSheet}
      >
        <View style={styles.bottomSheet}>
          <Text style={styles.bottomSheetTitle}>Add Contact</Text>
          <TextInput
            placeholder="Contact Name"
            value={newName}
            onChangeText={setNewName}
            style={styles.bottomSheetInput}
          />
          <TextInput
            placeholder="Contact Person"
            value={newContact}
            onChangeText={setNewContact}
            style={styles.bottomSheetInput}
          />
          <TextInput
            placeholder="Company / Brand"
            value={newCompanyBrand}
            onChangeText={setNewCompanyBrand}
            style={styles.bottomSheetInput}
          />
          <TextInput
            placeholder="Model"
            value={newModel}
            onChangeText={setNewModel}
            style={styles.bottomSheetInput}
          />
          <TextInput
            placeholder="Invoice"
            value={newInvoice}
            onChangeText={setNewInvoice}
            style={styles.bottomSheetInput}
          />
          <TouchableOpacity
            style={styles.bottomSheetButton}
            onPress={addNewContact}
          >
            <Text style={styles.bottomSheetButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      {/* Add Member Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.addMember}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <TextInput
                placeholder={t.name}
                placeholderTextColor="#8C8C8C"
                style={styles.uploadTitle}
                value={newName}
                onChangeText={setNewName}
              />
              <TextInput
                placeholder={t.contact}
                placeholderTextColor="#8C8C8C"
                style={styles.uploadTitle}
                value={newContact}
                onChangeText={setNewContact}
              />
              <TextInput
                placeholder={t.companyBrand}
                placeholderTextColor="#8C8C8C"
                style={styles.uploadTitle}
                value={newCompanyBrand}
                onChangeText={setNewCompanyBrand}
              />
              <TextInput
                placeholder={t.model}
                placeholderTextColor="#8C8C8C"
                style={styles.uploadTitle}
                value={newModel}
                onChangeText={setNewModel}
              />
              <TextInput
                placeholder={t.invoice}
                placeholderTextColor="#8C8C8C"
                style={styles.uploadTitle}
                value={newInvoice}
                onChangeText={setNewInvoice}
              />
            </ScrollView>

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
    marginTop: moderateScale(20),
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
  modalContainer: {
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
  modalBody: {
    maxHeight: "70%",
    marginBottom: moderateScale(16),
  },
  uploadTitle: {
    flex: 1,
    fontSize: moderateScale(14),
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
    marginLeft: moderateScale(6),
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
  bottomSheet: {
    backgroundColor: "#fff",
    padding: moderateScale(16),
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
  },
  bottomSheetTitle: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Bold",
    marginBottom: moderateScale(16),
  },
  bottomSheetInput: {
    backgroundColor: "#F7F7F7",
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    marginBottom: moderateScale(12),
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Regular",
  },
  bottomSheetButton: {
    backgroundColor: "#002B5B",
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(8),
    alignItems: "center",
  },
  bottomSheetButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Semibold",
  },
});
