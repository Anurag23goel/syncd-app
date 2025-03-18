import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface FileModalProps {
  visible: boolean;
  onClose: () => void;
}

const FileModal: React.FC<FileModalProps> = ({ visible, onClose }) => {
  const [currentModal, setCurrentModal] = useState("select");
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].file;

  const [permissions, setPermissions] = useState([
    {
      id: "person1",
      name: "Person 1",
      view: true,
      edit: false,
      protect: false,
    },
    {
      id: "person2",
      name: "Person 2",
      view: false,
      edit: true,
      protect: false,
    },
    {
      id: "person3",
      name: "Person 3",
      view: false,
      edit: false,
      protect: true,
    },
  ]);

  type PermissionKey = "view" | "edit" | "protect";

  const togglePermission = (personId: string, permission: PermissionKey) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((person) =>
        person.id === personId
          ? { ...person, [permission]: !person[permission] }
          : person
      )
    );
  };

  const renderSelectModal = () => (
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{t.select}</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => setCurrentModal("fileUpdate")}
      >
        <Text style={styles.optionText}>{t.document}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => setCurrentModal("folderUpdate")}
      >
        <Text style={styles.optionText}>{t.folder}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.optionText}>{t.camera || "Camera"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadText}>{t.uploadFile}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFileUpdateModal = () => (
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{t.updateFile}</Text>
        <TouchableOpacity onPress={() => setCurrentModal("select")}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TextInput style={styles.input} placeholder={t.rename} />
      <TouchableOpacity
        style={[styles.optionButton, { justifyContent: "space-between" }]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <MaterialIcons name="people-outline" size={20} color="#8C8C8C" />
          <Text style={styles.optionText}>{t.addPeople}</Text>
        </View>
        <TouchableOpacity>
          <Text style={{ color: "#3498DB", fontFamily: "SFPro-Regular" }}>
            {t.add}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.tagContainer}>
        {["Person 1", "Person 2", "Person 3"].map((person) => (
          <View key={person} style={styles.tag}>
            <Text style={styles.tagText}>{person}</Text>
            <Ionicons name="close" size={16} color="#B5B5B5" />
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadText}>{t.update}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFolderUpdateModal = () => (
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{t.updateFolder}</Text>
        <TouchableOpacity onPress={() => setCurrentModal("select")}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TextInput style={styles.input} placeholder={t.enterFolderName} />
      <TouchableOpacity style={styles.optionButton}>
        <MaterialIcons name="group" size={20} color="gray" />
        <Text style={styles.optionText}>{t.entireProjectTeam}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optionButton, { justifyContent: "space-between" }]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <MaterialIcons name="people-outline" size={20} color="#8C8C8C" />
          <Text style={styles.optionText}>{t.addPeople}</Text>
        </View>
        <TouchableOpacity>
          <Text style={{ color: "#3498DB", fontFamily: "SFPro-Regular" }}>
            {t.add}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.tagContainer}>
        {["Person 1", "Person 2", "Person 3"].map((person) => (
          <View key={person} style={styles.tag}>
            <Text style={styles.tagText}>{person}</Text>
            <Ionicons name="close" size={16} color="black" />
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.optionButton}>
        <Feather name="lock" size={20} color="gray" />
        <Text style={styles.optionText}>{t.permissions}</Text>
      </TouchableOpacity>
      <View style={styles.tagContainer}>
        {permissions.map((person) => (
          <View key={person.id} style={styles.permissionRow}>
            <Text style={styles.tagText}>{person.name}</Text>
            <View
              style={{
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => togglePermission(person.id, "view")}
                style={[
                  styles.iconButton,
                  person.view && styles.iconButtonSelected,
                ]}
              >
                <Feather
                  name="pen-tool"
                  size={18}
                  color={person.view ? "white" : "gray"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => togglePermission(person.id, "edit")}
                style={[
                  styles.iconButton,
                  person.edit && styles.iconButtonSelected,
                ]}
              >
                <Feather
                  name="search"
                  size={18}
                  color={person.edit ? "white" : "gray"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => togglePermission(person.id, "protect")}
                style={[
                  styles.iconButton,
                  person.protect && styles.iconButtonSelected,
                ]}
              >
                <Feather
                  name="shield"
                  size={18}
                  color={person.protect ? "white" : "gray"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setPermissions((prev) =>
                    prev.filter((p) => p.id !== person.id)
                  )
                }
              >
                <Ionicons name="close" size={20} color="#B5B5B5" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadText}>{t.updateFolder}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSortOptions = () => (
    <View>
      <Text style={styles.modalTitle}>{t.sortBy}</Text>
      <TouchableOpacity style={styles.sortOption}>
        <Text>{t.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sortOption}>
        <Text>{t.size}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sortOption}>
        <Text>{t.lastModified}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPermissionsSection = () => (
    <View>
      <Text style={styles.sectionTitle}>{t.permissions}</Text>
      <View style={styles.permissionOptions}>
        <TouchableOpacity style={styles.permissionOption}>
          <Text>{t.view}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.permissionOption}>
          <Text>{t.edit}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        {currentModal === "select" && renderSelectModal()}
        {currentModal === "fileUpdate" && renderFileUpdateModal()}
        {currentModal === "folderUpdate" && renderFolderUpdateModal()}
      </View>
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "SFPro-Semibold",
  },
  optionButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    gap: 10,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontFamily: "SFPro-Regular",
    fontSize: 15,
    color: "#8C8C8C",
  },
  uploadButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#002D62",
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  uploadText: {
    color: "white",
    fontSize: 16,
    fontFamily: "SFPro-Medium",
  },
  input: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    fontSize: 15,
    fontFamily: "SFPro-Regular",
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 10,
    width: "100%",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 35,
  },
  tagText: {
    fontSize: 14,
    marginRight: 5,
    color: "#1A1A1A",
    fontFamily: "SFPro-Medium",
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 35,
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
  iconButton: {
    padding: 10,
    borderRadius: 30,
    marginHorizontal: 5,
    backgroundColor: "#EDEDED",
  },
  iconButtonSelected: {
    backgroundColor: "#0060B0",
  },
  sortOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "SFPro-Semibold",
    marginBottom: 20,
  },
  permissionOptions: {
    flexDirection: "row",
    gap: 10,
  },
  permissionOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
  },
});

export default FileModal;
