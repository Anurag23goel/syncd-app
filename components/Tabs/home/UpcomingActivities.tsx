import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import TaskModal from "@/components/Modal/TeamTask";
import MeetingModal from "@/components/Modal/CreateMeeting";
import Filter_Calendar from "./Filter_Calendar";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { MeetingResponse, TaskResponse } from "@/types/Apitypes";
import { useAuthStore } from "@/store/authStore";
import { getUserMeetings } from "@/services/meetings";
import { getTasks } from "@/services/task";
import { markTaskAsComplete } from "@/services/task";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface FormatDate {
  (date: Date): string;
}

interface ActivityCardProps {
  title: string;
  description: string;
  time: string;
  attendees: any[];
  borderColor: string;
  meetIcon: any;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  description,
  time,
  attendees,
  borderColor,
  meetIcon,
}) => (
  <View style={[styles.activityCard]}>
    <View
      style={[styles.borderAccent, { backgroundColor: borderColor }]}
    ></View>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityDescription}>{description}</Text>
      <View style={styles.activityFooter}>
        <View style={styles.timeAndAttendees}>
          <View style={styles.timeContainer}>
            <Image source={meetIcon} style={styles.meetIcon} />
            <Text style={styles.timeText}>{time}</Text>
          </View>
          <View style={styles.attendees}>
            {attendees.slice(0, 3).map((attendee, index) => (
              <Image
                key={index}
                source={attendee}
                style={[
                  styles.attendeeAvatar,
                  {
                    transform: [{ translateX: -index * 12 }],
                    zIndex: 3 - index,
                  },
                ]}
              />
            ))}
            {attendees.length > 3 && (
              <View
                style={[
                  styles.moreAttendeesContainer,
                  { transform: [{ translateX: -3 * 12 }], zIndex: 0 },
                ]}
              >
                <Text style={styles.moreAttendeesText}>
                  +{attendees.length - 3}
                </Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.linkButton}>
          <Feather name="link-2" size={20} color="#6B6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const TaskItem: React.FC<{
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ task, onToggle, onEdit, onDelete }) => (
  <View style={styles.taskItem}>
    <TouchableOpacity onPress={() => onToggle(task.id)}>
      {task.completed ? (
        <AntDesign name="checkcircle" size={24} color="green" />
      ) : (
        <Feather name={"circle"} size={24} color={"#000"} />
      )}
    </TouchableOpacity>
    <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
      {task.title}
    </Text>
    <View style={styles.taskActions}>
      <TouchableOpacity
        onPress={() => onDelete(task.id)}
        style={styles.taskButton}
      >
        <Feather name="trash-2" size={16} color="#FF7043" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.taskButton}
        onPress={() => onEdit(task.id)}
      >
        <Feather name="edit-2" size={16} color="gray" />
      </TouchableOpacity>
    </View>
  </View>
);

const UpcomingActivities: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Meetings");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTaskModalVisible, setTaskModalVisible] = useState<boolean>(false);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs;

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const openTaskModal = () => setTaskModalVisible(true);
  const closeTaskModal = () => setTaskModalVisible(false);

  const [meetingsData, setMeetingsData] = useState<MeetingResponse[]>([]);
  const [tasks, setTasksData] = useState<TaskResponse[]>([]);

  // FETCHING MEETINGS DATA
  useEffect(() => {
    const fetchMeetingsData = async () => {
      const authToken = useAuthStore.getState().token;

      if (!authToken) {
        console.error("No auth token found!");
        return;
      }

      try {
        const response = await getUserMeetings(authToken);

        setMeetingsData(response.data?.data);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    fetchMeetingsData();
  }, []);

  const tasksData = [
    { id: "1", title: "Task 1", completed: false },
    { id: "2", title: "Task 2", completed: false },
    { id: "3", title: "Task 3", completed: true },
    { id: "4", title: "Task 4", completed: true },
    { id: "5", title: "Task 5", completed: true },
  ];

  interface MarkTaskCompletePayload {
    ProjectID: string;
    TaskID: string;
    Notes: string;
  }

  const toggleTaskCompletion = (id: string) => {
    console.log("Toggle Task Completion:", id);
    try {
      // You'll need to get the ProjectID for the current task
      // This could come from the task item itself, component props, or context
      const projectId = item.ProjectID; // Replace with how you're getting the projectId
      
      // You might want to get notes from user input or set a default
      const notes = "Task completed"; // Replace with user input if needed
      
      const completeData: MarkTaskCompletePayload = {
        ProjectID: projectId,
        TaskID: taskId,
        Notes: notes
      };
      const response = await markTaskAsComplete(completeData);
    
      console.log("Task marked as complete:", response);
      console.log("Success", "Task marked as complete!");
    
  } catch (error: any) {
    console.error("Error marking task as complete:", error);
    console.log("Error", error.message || "Failed to mark task as complete.");
  }
  };

  const renderMeetingItem = ({ item }: { item: (typeof meetingsData)[0] }) => (
    <ActivityCard
      title={item.Title}
      description={item.Description}
      time={item.StartTime}
      attendees={item.Participants}
      borderColor={"#E0E0E0"}
      meetIcon={{
        width: 16,
        height: 16,
        marginRight: 6,
      }}
    />
  );

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={toggleTaskCompletion}
      onEdit={(id) => console.log("Edit Task:", id)}
      onDelete={(id) => console.log("Delete Task:", id)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.upcomingActivities}</Text>

      <View style={styles.cardContainer}>
        <Filter_Calendar type="Home" home={activeTab === "Meetings"} />

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "Meetings" && styles.activeTab, // Orange for Meetings
            ]}
            onPress={() => setActiveTab("Meetings")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Meetings" && styles.tabTextActive,
              ]}
            >
              Meetings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "Tasks" && styles.tasksActiveTab, // Blue for Tasks
            ]}
            onPress={() => setActiveTab("Tasks")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Tasks" && styles.tabTextActive,
              ]}
            >
              Tasks
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "Meetings" ? (
          <FlatList
            data={meetingsData}
            keyExtractor={(meeting) => meeting.MeetingID}
            renderItem={renderMeetingItem}
            ListFooterComponent={
              <TouchableOpacity style={styles.addButton} onPress={openModal}>
                <Ionicons name="add" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            }
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        ) : (
          <FlatList
            data={tasksData}
            keyExtractor={(item) => item.id}
            renderItem={renderTaskItem}
            ListFooterComponent={
              <TouchableOpacity
                style={styles.addButton}
                onPress={openTaskModal}
              >
                <Ionicons name="add" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            }
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </View>
      <TaskModal isVisible={isTaskModalVisible} onClose={closeTaskModal} />
      <MeetingModal isVisible={isModalVisible} onClose={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "SFPro-Bold",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 16,
    color: "gray",
    fontFamily: "SFPro-Regular",
  },
  icons: {
    flexDirection: "row",
  },
  iconSpacing: {
    marginLeft: 10,
    backgroundColor: "#F4F4F4",
    padding: 8,
    borderRadius: 30,
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  calendarContainer: {
    overflow: "hidden",
    backgroundColor: "white",
    borderRadius: 12,
  },
  calendarContent: {
    height: 350,
  },
  filterContainer: {
    overflow: "hidden",
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: "SFPro-Semibold",
    color: "#333",
  },
  filterOptions: {
    flexDirection: "row",
  },
  priorityContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  deadlineContainer: {
    flexDirection: "column",
  },
  priorityButton: {
    width: (SCREEN_WIDTH - 120) / 3,
  },
  statusButton: {
    width: SCREEN_WIDTH * 0.4 - 16,
  },
  deadlineButton: {
    width: "100%",
  },
  filterButton: {
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 8,
    marginBottom: 8,
    alignItems: "center",
    gap: 8,
  },
  filterButtonText: {
    color: "#333",
    fontSize: 12,
    fontFamily: "SFPro-Medium",
  },
  filterButtonTextActive: {
    color: "white",
  },
  activeIconBackground: {
    backgroundColor: "#8C8C8C",
  },
  tabs: {
    flexDirection: "row",
    marginTop: 16,
    backgroundColor: "#F7F7F7",
    padding: 4,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#FFB800", // Orange for Meetings tab
  },
  tasksActiveTab: {
    backgroundColor: "#3498DB", // Blue for Tasks tab
  },
  tabText: {
    color: "#8C8C8C",
    fontSize: 14,
    fontFamily: "SFPro-Regular",
  },
  tabTextActive: {
    color: "#F2F2F2",
    fontFamily: "SFPro-Semibold",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginBottom: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "SFPro-Medium",
    marginLeft: 8,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  addButton: {
    marginTop: 16,
    alignSelf: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 40,
    padding: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  activityCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
    overflow: "hidden",
  },
  borderAccent: {
    width: 6,
    height: "100%",
    borderRadius: 8,
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: "SFPro-Bold",
    color: "#1A1A1A",
  },
  activityDescription: {
    color: "gray",
    fontSize: 14,
    marginTop: 4,
    fontFamily: "SFPro-Regular",
  },
  activityFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  timeAndAttendees: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  meetIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  timeText: {
    fontSize: 12,
    color: "gray",
    fontFamily: "SFPro-Regular",
  },
  attendees: {
    flexDirection: "row",
    alignItems: "center",
  },
  attendeeAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 4,
  },
  moreAttendeesContainer: {
    backgroundColor: "#FFB800",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  moreAttendeesText: {
    color: "#FFF",
    fontSize: 10,
    fontFamily: "SFPro-Bold",
  },
  linkButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  taskActions: {
    flexDirection: "row",
    marginLeft: "auto",
    gap: 10,
  },
  taskButton: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 20,
    fontFamily: "SFPro-Bold",
    marginBottom: 12,
  },
});

export default UpcomingActivities;
