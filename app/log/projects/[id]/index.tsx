import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import TaskManager from "@/components/Modal/Project/TaskModal";
import ProjectOverview from "@/components/Modal/Project/MilestoneModal";
import { router, useLocalSearchParams } from "expo-router";
import { moderateScale } from "@/utils/spacing";
import MenuModal from "@/components/Modal/Project/ProjectOptionsModal";
import { PieChart } from "react-native-gifted-charts";
import Filter_Calendar from "@/components/Tabs/home/Filter_Calendar";
import BudgetScreen from "@/components/paymentLog/budget";
import InventoryScreen from "@/components/Modal/Project/InventoryModal";
import RenderComparison from "@/components/Modal/Project/RenderComparsion";
import { BottomSheet } from "react-native-btr";
import Collapsible from "react-native-collapsible";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { useAuthStore } from "@/store/authStore";
import { getProjectDetails } from "@/services/project_user/basic";
import { ProjectDetailsResponse } from "@/types/Apitypes";
import { NEW_PROJECT_DETAILS } from "@/types/NewApiTypes";

interface ProfileImage {
  id: string;
  image: string;
  name: string; // Added name property
}

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  assignee: string; // Added assignee property
}

interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export default function ProjectDetails() {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].projectDetails;
  const { id } = useLocalSearchParams();
  const projectId = Array.isArray(id) ? id[0] : id;
  console.log("Project ID:", projectId);

  const authToken = useAuthStore.getState().token;
  console.log("Auth TOKEN:", authToken);

  const [projectDetails, setProjectDetails] =
    useState<NEW_PROJECT_DETAILS | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [checklistVisible, setChecklistVisible] = useState(false);
  const [checklists, setChecklists] = useState<Checklist[]>([
    {
      id: "1",
      title: "Floor Plan",
      items: [
        { id: "1-1", text: "Living Room", checked: false, assignee: "" },
        { id: "1-2", text: "Kitchen", checked: false, assignee: "" },
      ],
    },
    {
      id: "2",
      title: "Electrical Plan",
      items: [
        { id: "2-1", text: "Wiring", checked: false, assignee: "" },
        { id: "2-2", text: "Lighting", checked: false, assignee: "" },
      ],
    },
  ]);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [assignee, setAssignee] = useState<string>("");
  const [assigneeSheetVisible, setAssigneeSheetVisible] = useState(false);

  // Map API data to pie chart
  const pieData = [
    {
      value: projectDetails?.attendance.stats.totalPresent || 0,
      color: "#4CAF50",
    },
    {
      value: projectDetails?.attendance.stats.totalAbsent || 0,
      color: "#FF4444",
    },
  ];

  // Placeholder data for stakeholders, contractors, and client (replace with API data if available)
  const stakeholders: ProfileImage[] = projectDetails?.keyPersonnel.stakeholders
    .length
    ? projectDetails.keyPersonnel.stakeholders.map((s, index) => ({
        id: `${index}`,
        image: "https://i.pravatar.cc/100?img=" + (index + 1), // Placeholder
        name: s.name || `Stakeholder ${index + 1}`,
      }))
    : [
        { id: "1", image: "https://i.pravatar.cc/100?img=1", name: "John Doe" },
        {
          id: "2",
          image: "https://i.pravatar.cc/100?img=2",
          name: "Jane Smith",
        },
        {
          id: "3",
          image: "https://i.pravatar.cc/100?img=3",
          name: "Alice Johnson",
        },
      ];

  const contractors: ProfileImage[] = projectDetails?.keyPersonnel.contractors
    .length
    ? projectDetails.keyPersonnel.contractors.map((c, index) => ({
        id: `${index}`,
        image: "https://i.pravatar.cc/100?img=" + (index + 4), // Placeholder
        name: c.name || `Contractor ${index + 1}`,
      }))
    : [
        {
          id: "1",
          image: "https://i.pravatar.cc/100?img=4",
          name: "Contractor 1",
        },
        {
          id: "2",
          image: "https://i.pravatar.cc/100?img=5",
          name: "Contractor 2",
        },
        {
          id: "3",
          image: "https://i.pravatar.cc/100?img=6",
          name: "Contractor 3",
        },
      ];

  const client: ProfileImage = projectDetails?.keyPersonnel.clients.length
    ? {
        id: "1",
        image: "https://i.pravatar.cc/100?img=7", // Placeholder
        name: projectDetails.keyPersonnel.clients[0].name || "Client Name",
      }
    : {
        id: "1",
        image: "https://i.pravatar.cc/100?img=7",
        name: "Client Name",
      };

  const addChecklistItem = (
    checklistId: string,
    itemText: string,
    assignee: string
  ) => {
    setChecklists(
      checklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: [
                ...checklist.items,
                {
                  id: Date.now().toString(),
                  text: itemText,
                  checked: false,
                  assignee,
                },
              ],
            }
          : checklist
      )
    );
    setNewChecklistItem("");
    setAssignee("");
  };

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(
      checklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: checklist.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : checklist
      )
    );
  };

  const deleteChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(
      checklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: checklist.items.filter((item) => item.id !== itemId),
            }
          : checklist
      )
    );
  };

  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>(() => {
    const initial: { [key: string]: boolean } = {};
    checklists.forEach((checklist) => (initial[checklist.id] = false));
    return initial;
  });

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderChecklist = (checklists: Checklist[]) =>
    checklists.map((checklist) => (
      <View key={checklist.id} style={styles.checklistCard}>
        <TouchableOpacity
          style={styles.checklistHeader}
          onPress={() => toggleCollapse(checklist.id)}
        >
          <View style={styles.checklistTitleContainer}>
            <Text style={styles.checklistTitle}>{checklist.title}</Text>
            <Text style={styles.itemCount}>
              {checklist.items.filter((item) => item.checked).length}/
              {checklist.items.length} completed
            </Text>
          </View>
          <Feather
            name={collapsed[checklist.id] ? "chevron-up" : "chevron-down"}
            size={24}
            color="#666"
            style={styles.chevronIcon}
          />
        </TouchableOpacity>
        <Collapsible collapsed={collapsed[checklist.id]}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (checklist.items.filter((item) => item.checked).length /
                      checklist.items.length) *
                    100
                  }%`,
                },
              ]}
            />
          </View>
          {checklist.items.map((item) => (
            <View key={item.id} style={styles.checklistItem}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => toggleChecklistItem(checklist.id, item.id)}
              >
                <Feather
                  name={item.checked ? "check-square" : "square"}
                  size={24}
                  color={item.checked ? "#4CAF50" : "#666"}
                />
              </TouchableOpacity>
              <View style={styles.itemContent}>
                <Text
                  style={[
                    styles.checklistText,
                    item.checked && styles.checkedText,
                  ]}
                >
                  {item.text}
                </Text>
                {item.assignee && (
                  <View style={styles.assigneeContainer}>
                    <Feather name="user" size={14} color="#666" />
                    <Text style={styles.assigneeText}>{item.assignee}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteChecklistItem(checklist.id, item.id)}
              >
                <Feather name="trash-2" size={20} color="#FF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </Collapsible>
      </View>
    ));

  const renderContent = () => (
    <View>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons
            name="chevron-back"
            onPress={() => router.back()}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.title}</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require("../../../../assets/images/assets/image1.png")}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={styles.title}>
            {projectDetails?.project.ProjectName || "Loading..."}
          </Text>
          <View style={styles.weatherContainer}>
            <Feather name="sun" size={24} color="#6B6B6B" />
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <Text style={styles.weatherText}>{t.weather.temperature}</Text>
              <Text style={styles.weatherCondition}>{t.weather.condition}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.locationContainer}>
            <Text style={styles.location}>
              {projectDetails?.project.ProjectLocation ||
                "Location not specified"}
            </Text>
          </View>
        </View>

        <View style={styles.metadata}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Feather name="dollar-sign" size={12} color="#8C8C8C" />
            <Text style={styles.metadataText}>
              {projectDetails?.project.Currency || t.metadata.currency}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Feather name="globe" size={12} color="#8C8C8C" />
            <Text style={styles.metadataText}>{t.metadata.timeZone}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Feather name="hash" size={12} color="#8C8C8C" />
            <Text style={styles.metadataText}>
              {projectDetails?.project.ProjectArea ||
                t.metadata.measurementUnits}
            </Text>
          </View>
        </View>

        <View style={styles.peopleContainer}>
          <TouchableOpacity
            style={styles.peopleSection}
            onPress={() => router.push("/log/projects/team_dashboard")}
          >
            <Text style={styles.sectionTitle}>{t.people.stakeholders}</Text>
            <View style={styles.avatarGroup}>
              {stakeholders.map((person, index) => (
                <Image
                  key={person.id}
                  source={{ uri: person.image }}
                  style={[
                    styles.avatar,
                    {
                      marginLeft: index > 0 ? -15 : 0,
                      zIndex: stakeholders.length - index,
                    },
                  ]}
                />
              ))}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.peopleSection}
            onPress={() => router.push("/log/projects/team_dashboard")}
          >
            <Text style={styles.sectionTitle}>{t.people.contractors}</Text>
            <View style={styles.avatarGroup}>
              {contractors.map((person, index) => (
                <Image
                  key={person.id}
                  source={{ uri: person.image }}
                  style={[
                    styles.avatar,
                    {
                      marginLeft: index > 0 ? -15 : 0,
                      zIndex: contractors.length - index,
                    },
                  ]}
                />
              ))}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.peopleSection}
            onPress={() => router.push("/log/projects/team_dashboard")}
          >
            <Text style={styles.sectionTitle}>{t.people.client}</Text>
            <View style={styles.avatarGroup}>
              <Image source={{ uri: client.image }} style={styles.avatar} />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={[styles.title, { marginTop: 10 }]}>
          {t.attendance.title}
        </Text>
        <View style={styles.statsContainer}>
          <Filter_Calendar type="Attendance" />
          <View
            style={styles.progressContainer}
            onTouchEnd={() => router.push("/log/projects/attendence_history")}
          >
            <PieChart
              data={pieData}
              donut
              radius={90}
              innerRadius={70}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={styles.percentageText}>
                    {projectDetails?.attendance.stats.attendanceRate || "0%"}
                  </Text>
                </View>
              )}
            />
          </View>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#4CAF50" }]}
              />
              <Text style={styles.legendText}>
                {t.attendance.present}{" "}
                {projectDetails?.attendance.stats.totalPresent || 0}
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#FF4444" }]}
              />
              <Text style={styles.legendText}>
                {t.attendance.absent}{" "}
                {projectDetails?.attendance.stats.totalAbsent || 0}
              </Text>
            </View>
          </View>
        </View>

        <Pressable onPress={() => router.push("/log/payment/id")}>
          <Text style={[styles.title, { marginTop: 10 }]}>
            {t.sections.budget}
          </Text>
        </Pressable>
        <BudgetScreen budgetDetails={projectDetails?.budget || {}} />

        <Text style={[styles.title, { marginTop: 10 }]}>
          {t.sections.checklist}
        </Text>
        {renderChecklist(checklists)}

        <Text style={[styles.title, { marginTop: 10 }]}>
          {t.sections.inventory}
        </Text>
        <InventoryScreen inventory={projectDetails?.inventory} />

        <Pressable onPress={() => router.push("/log/projects/milestone")}>
          <Text style={[styles.title, { marginTop: 10 }]}>
            {t.sections.milestone}
          </Text>
        </Pressable>
        <ProjectOverview milestoneData={projectDetails?.milestones} />

        <Text style={[styles.title, { marginTop: 10 }]}>
          {t.sections.renderComparison}
        </Text>
        <RenderComparison />

        <Text style={[styles.title, { marginTop: 10 }]}>
          {t.sections.tasks}
        </Text>
        <TaskManager />

        <View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              addNewChecklist("New Checklist Title", [
                {
                  id: "item-1",
                  text: "New Item 1",
                  checked: false,
                  assignee: "",
                },
                {
                  id: "item-2",
                  text: "New Item 2",
                  checked: false,
                  assignee: "",
                },
              ])
            }
          >
            <Text style={styles.addButtonText}>Add New Checklist</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const [selectedChecklistId, setSelectedChecklistId] = useState<string>("");

  const renderAssigneeOptions = () => (
    <View style={styles.assigneeOptionsContainer}>
      <Text style={styles.assigneeOptionsTitle}>
        {t.checklist.selectAssignee}
      </Text>
      <View style={styles.checklistSelection}>
        <Text style={styles.sectionLabel}>{t.checklist.selectChecklist}</Text>
        {checklists.map((checklist) => (
          <TouchableOpacity
            key={checklist.id}
            style={[
              styles.checklistOption,
              selectedChecklistId === checklist.id &&
                styles.checklistOptionSelected,
            ]}
            onPress={() => setSelectedChecklistId(checklist.id)}
          >
            <Text
              style={[
                styles.checklistOptionText,
                selectedChecklistId === checklist.id &&
                  styles.checklistOptionTextSelected,
              ]}
            >
              {checklist.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.assigneeSelection}>
        <Text style={styles.sectionLabel}>{t.checklist.selectPerson}</Text>
        {stakeholders.map((stakeholder) => (
          <TouchableOpacity
            key={stakeholder.id}
            style={[
              styles.assigneeOption,
              assignee === stakeholder.name && styles.assigneeOptionSelected,
            ]}
            onPress={() => {
              setAssignee(stakeholder.name);
              if (selectedChecklistId && newChecklistItem) {
                addChecklistItem(
                  selectedChecklistId,
                  newChecklistItem,
                  stakeholder.name
                );
                setAssigneeSheetVisible(false);
                setSelectedChecklistId("");
              }
            }}
          >
            <View style={styles.assigneeOptionContent}>
              <Image
                source={{ uri: stakeholder.image }}
                style={styles.assigneeAvatar}
              />
              <Text
                style={[
                  styles.assigneeOptionText,
                  assignee === stakeholder.name &&
                    styles.assigneeOptionTextSelected,
                ]}
              >
                {stakeholder.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const addNewChecklist = (title: string, items: ChecklistItem[]) => {
    setChecklists((prev) => [
      ...prev,
      { id: Date.now().toString(), title, items },
    ]);
    setChecklistVisible(false);
  };

  const handleAddItem = () => {
    if (!selectedChecklistId) {
      Alert.alert("Error", "Please select a checklist first");
      return;
    }
    if (!newChecklistItem.trim()) {
      Alert.alert("Error", "Please enter an item description");
      return;
    }
    addChecklistItem(selectedChecklistId, newChecklistItem, assignee);
    setChecklistVisible(false);
    setNewChecklistItem("");
    setAssignee("");
    setSelectedChecklistId("");
  };

  useEffect(() => {
    if (!authToken || !projectId) return;

    const fetchProjectDetails = async () => {
      try {
        const response = await getProjectDetails(projectId, authToken);
        setProjectDetails(response.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [authToken, projectId]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[{ key: "content" }]}
        renderItem={() => <View>{renderContent()}</View>}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="settings" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.floatingButton, { right: moderateScale(80) }]}
        onPress={() => setChecklistVisible(true)}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>
      <MenuModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <BottomSheet
        visible={checklistVisible}
        onBackButtonPress={() => setChecklistVisible(false)}
        onBackdropPress={() => setChecklistVisible(false)}
      >
        <View style={[styles.bottomSheet, { maxHeight: "80%" }]}>
          <Text style={styles.sheetTitle}>{t.checklist.addItem}</Text>
          <TextInput
            style={styles.input}
            value={newChecklistItem}
            onChangeText={setNewChecklistItem}
            placeholder={t.checklist.enterItem}
          />
          <TouchableOpacity
            style={styles.assigneeButton}
            onPress={() => setAssigneeSheetVisible(true)}
          >
            <Text style={styles.assigneeButtonText}>
              {assignee || t.checklist.selectAssignee}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <Text style={styles.addButtonText}>{t.checklist.add}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
      <BottomSheet
        visible={assigneeSheetVisible}
        onBackButtonPress={() => setAssigneeSheetVisible(false)}
        onBackdropPress={() => setAssigneeSheetVisible(false)}
      >
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>{t.checklist.selectAssignee}</Text>
          <ScrollView>{renderAssigneeOptions()}</ScrollView>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setAssigneeSheetVisible(false)}
          >
            <Text style={styles.modalCloseButtonText}>{t.checklist.close}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

// Your existing styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(16),
  },
  backButton: {
    marginRight: moderateScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Bold",
  },
  imageContainer: {
    width: "100%",
    height: moderateScale(250),
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(20),
  },
  mainImage: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(10),
    objectFit: "cover",
  },
  content: {
    padding: moderateScale(16),
  },
  title: {
    fontSize: moderateScale(24),
    marginBottom: moderateScale(8),
    width: "60%",
    fontFamily: "SFPro-Bold",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(6),
  },
  locationContainer: {
    flex: 1,
    marginRight: moderateScale(16),
  },
  location: {
    fontSize: moderateScale(16),
    color: "#6B6B6B",
    fontFamily: "SFPro-Regular",
  },
  weatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: moderateScale(8),
  },
  weatherText: {
    marginLeft: moderateScale(4),
    fontSize: moderateScale(16),
    color: "#8C8C8C",
    fontFamily: "SFPro-Medium",
  },
  weatherCondition: {
    marginLeft: moderateScale(4),
    fontSize: moderateScale(16),
    color: "#8C8C8C",
    fontFamily: "SFPro-Regular",
  },
  metadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(8),
    marginBottom: moderateScale(16),
  },
  metadataText: {
    fontSize: moderateScale(14),
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0060B0",
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(24),
  },
  locationButtonText: {
    color: "#fff",
    fontSize: moderateScale(12),
    marginRight: moderateScale(8),
    fontFamily: "SFPro-Medium",
  },
  peopleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  peopleSection: {
    alignItems: "flex-start",
    backgroundColor: "#f7f7f7",
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    color: "#6B6B6B",
    marginBottom: moderateScale(8),
    fontFamily: "SFPro-Medium",
  },
  avatarGroup: {
    flexDirection: "row",
  },
  avatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
  },
  floatingButton: {
    position: "absolute",
    bottom: moderateScale(16),
    right: moderateScale(16),
    backgroundColor: "#002D62",
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  statsContainer: {
    padding: moderateScale(16),
    width: "100%",
    backgroundColor: "#fff",
    marginVertical: moderateScale(16),
    borderRadius: moderateScale(10),
    alignItems: "center",
  },
  progressContainer: {
    width: moderateScale(180),
    height: moderateScale(180),
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabel: {
    position: "absolute",
    top: moderateScale(-15),
    left: moderateScale(-35),
    fontSize: moderateScale(14),
  },
  percentageText: {
    fontSize: moderateScale(15),
    fontWeight: "500",
    fontFamily: "SFPro-Semibold",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: moderateScale(24),
    width: "100%",
    marginTop: moderateScale(16),
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    gap: moderateScale(8),
  },
  legendDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
  },
  legendText: {
    fontSize: moderateScale(14),
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  checklistCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(16),
    padding: moderateScale(16),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  checklistHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(8),
  },
  checklistTitleContainer: {
    flex: 1,
  },
  checklistTitle: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Bold",
    color: "#333",
    marginBottom: moderateScale(4),
  },
  itemCount: {
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Regular",
    color: "#666",
  },
  progressBar: {
    height: moderateScale(4),
    backgroundColor: "#f0f0f0",
    width: "100%",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: moderateScale(2),
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  checkbox: {
    padding: moderateScale(4),
  },
  itemContent: {
    flex: 1,
    marginLeft: moderateScale(12),
  },
  checklistText: {
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Regular",
    color: "#333",
  },
  checkedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  assigneeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateScale(4),
  },
  assigneeText: {
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Regular",
    color: "#666",
    marginLeft: moderateScale(4),
  },
  deleteButton: {
    padding: moderateScale(4),
    marginLeft: moderateScale(8),
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: moderateScale(16),
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
  },
  sheetTitle: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Bold",
    marginBottom: moderateScale(16),
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: moderateScale(8),
    padding: moderateScale(8),
    marginBottom: moderateScale(16),
  },
  assigneeButton: {
    backgroundColor: "#0060B0",
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    alignItems: "center",
    marginBottom: moderateScale(16),
  },
  assigneeButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Medium",
  },
  addButton: {
    backgroundColor: "#0060B0",
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Medium",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: moderateScale(8),
    padding: moderateScale(16),
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Bold",
    marginBottom: moderateScale(16),
  },
  modalItem: {
    padding: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalItemText: {
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Regular",
  },
  modalCloseButton: {
    backgroundColor: "#0060B0",
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    alignItems: "center",
    marginTop: moderateScale(16),
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Medium",
  },
  assigneeOptionsContainer: {
    padding: moderateScale(16),
    backgroundColor: "#fff",
  },
  assigneeOptionsTitle: {
    fontSize: moderateScale(20),
    fontFamily: "SFPro-Bold",
    marginBottom: moderateScale(20),
    color: "#333",
    textAlign: "center",
  },
  sectionLabel: {
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Semibold",
    color: "#333",
    marginBottom: moderateScale(12),
    paddingHorizontal: moderateScale(4),
  },
  checklistSelection: {
    marginBottom: moderateScale(24),
    backgroundColor: "#f8f9fa",
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
  },
  checklistOption: {
    backgroundColor: "#fff",
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(8),
    borderWidth: 1,
    borderColor: "#e9ecef",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  checklistOptionSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#0060B0",
    borderWidth: 2,
  },
  checklistOptionText: {
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Regular",
    color: "#495057",
  },
  checklistOptionTextSelected: {
    color: "#0060B0",
    fontFamily: "SFPro-Medium",
  },
  assigneeSelection: {
    marginBottom: moderateScale(16),
    backgroundColor: "#f8f9fa",
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
  },
  assigneeOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(8),
    borderWidth: 1,
    borderColor: "#e9ecef",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  assigneeOptionSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#0060B0",
    borderWidth: 2,
  },
  assigneeOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  assigneeAvatar: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    marginRight: moderateScale(12),
  },
  assigneeOptionText: {
    fontSize: moderateScale(14),
    fontFamily: "SFPro-Regular",
    color: "#495057",
    flex: 1,
  },
  assigneeOptionTextSelected: {
    color: "#0060B0",
    fontFamily: "SFPro-Medium",
  },
  chevronIcon: {
    padding: moderateScale(4),
    transform: [{ rotate: "0deg" }],
  },
});
