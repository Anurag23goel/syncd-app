import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import {
  Feather,
  EvilIcons,
  FontAwesome6,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "../../constants/translations";

interface MOMModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const MOMModal: React.FC<MOMModalProps> = ({ isVisible, onClose }) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.mom;

  const [mom, setMom] = useState("");
  const [projectList, setProjectList] = useState(["Project 1", "Project 2"]);
  const [entireTeam, setEntireTeam] = useState(false);
  const [newProject, setNewProject] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const handleAddProject = () => {
    if (newProject.trim() !== "") {
      setProjectList((prev) => [...prev, newProject.trim()]);
      setNewProject("");
    }
  };

  const handleRemoveProject = (index: number) => {
    setProjectList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <KeyboardAvoidingView behavior="padding" style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>{t.title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder={t.enterMom}
              value={mom}
              onChangeText={setMom}
              maxLength={150}
              placeholderTextColor="#8C8C8C"
            />

            <View style={styles.projectListContainer}>
              <TextInput
                style={styles.projectListInput}
                placeholder={t.selectProject}
                value={selectedProject}
                onChangeText={setSelectedProject}
                placeholderTextColor="#8C8C8C"
              />
              <AntDesign name="down" size={20} color="#8C8C8C" />
            </View>

            <View style={styles.addPeopleContainer}>
              <View style={styles.addPeopleLeft}>
                <EvilIcons name="spinner" size={24} color="#8C8C8C" />
                <Text style={styles.addPeopleText}>{t.entireProjectTeam}</Text>
              </View>
              <TouchableOpacity onPress={() => setEntireTeam(!entireTeam)}>
                {entireTeam ? (
                  <FontAwesome6 name="check-circle" size={20} color="#007BFF" />
                ) : (
                  <Entypo name="circle" size={20} color="#007BFF" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.addPeopleContainer}>
              <View style={styles.addPeopleLeft}>
                <Feather name="users" size={20} color="#8C8C8C" />
                <TextInput
                  placeholder={t.addProject}
                  value={newProject}
                  onChangeText={setNewProject}
                  placeholderTextColor="#8C8C8C"
                  style={styles.addPeopleInput}
                />
              </View>
              <TouchableOpacity onPress={handleAddProject}>
                <Text style={styles.addButtonText}>{t.add}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.selectedPeopleContainer}>
              {projectList.map((project, index) => (
                <View key={index} style={styles.personTag}>
                  <Text style={styles.personText}>{project}</Text>
                  <TouchableOpacity onPress={() => handleRemoveProject(index)}>
                    <Feather name="x" size={16} color="#B5B5B5" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createButtonText}>{t.createMom}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "SFPro-Bold",
  },
  scrollContainer: {
    padding: 20,
  },
  input: {
    width: "100%",
    marginTop: 20,
    height: 45,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 15,
  },
  projectListContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    height: 45,
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  projectListInput: {
    flex: 1,
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
    fontSize: 15,
  },
  addPeopleContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    height: 45,
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  addPeopleLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
  },
  addPeopleInput: {
    marginLeft: 10,
    flex: 1,
  },
  addPeopleText: {
    fontSize: 15,
    fontFamily: "SFPro-Regular",
    color: "#8C8C8C",
  },
  addButtonText: {
    color: "#007AFF",
    fontSize: 15,
    fontFamily: "SFPro-Regular",
  },
  selectedPeopleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  personTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  personText: {
    marginRight: 5,
    fontSize: 12,
    fontFamily: "SFPro-Medium",
  },
  createButton: {
    backgroundColor: "#002D62",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "SFPro-Semibold",
  },
});

export default MOMModal;
