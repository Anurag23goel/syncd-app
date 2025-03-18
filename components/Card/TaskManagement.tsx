import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { TeamCard } from "./TeamCard";
import { Task } from "@/types";
import { ApprovalCard } from "./Approval";
import { TodayTask, TodayTaskList } from "./TodayTask";
import { translations } from "@/constants/translations";
import { useLanguageStore } from "@/store/useLanguageStore";

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design Review",
    description: "Review the latest UI designs",
    completed: false,
    type: "team",
    teamMembers: [
      { id: "1", avatar: "https://i.pravatar.cc/100?img=1" },
      { id: "2", avatar: "https://i.pravatar.cc/100?img=2" },
      { id: "3", avatar: "https://i.pravatar.cc/100?img=3" },
      { id: "4", avatar: "https://i.pravatar.cc/100?img=4" },
    ],
  },
  {
    id: "2",
    title: "Code Review",
    description: "Review pull request #123",
    completed: false,
    type: "team",
    teamMembers: [
      { id: "1", avatar: "https://i.pravatar.cc/100?img=5" },
      { id: "2", avatar: "https://i.pravatar.cc/100?img=6" },
      { id: "3", avatar: "https://i.pravatar.cc/100?img=7" },
    ],
  },
  {
    id: "3",
    title: "Budget Approval",
    description: "Q1 2024 Budget Review",
    type: "approval",
    completed: false,
    createdAt: "1 day ago",
    teamMembers: [{ id: "1", avatar: "https://i.pravatar.cc/100?img=8" }],
  },
  {
    id: "4",
    title: "Project Timeline",
    description: "Update project milestones",
    type: "approval",
    completed: false,
    createdAt: "1 day ago",
    teamMembers: [{ id: "1", avatar: "https://i.pravatar.cc/100?img=9" }],
  },
];

const TaskManagement = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tasks;
  const [activeTab, setActiveTab] = useState("today");
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleApprove = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleReassign = (taskId: string) => {
    // Implement reassign logic
    console.log("Reassign task:", taskId);
  };

  const handleReject = (
    taskId: string,
    note: string,
    photoUri?: string,
    attachmentUri?: string,
    tqab?: string
  ) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleEdit = (taskId: string) => {
    // Implement edit logic
    console.log("Edit task:", taskId);
  };

  const renderTab = (tabKey: string) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === tabKey && styles.activeTab]}
      onPress={() => setActiveTab(tabKey)}
    >
      <Text
        style={[styles.tabText, activeTab === tabKey && styles.activeTabText]}
      >
        {t[tabKey as keyof typeof t] as string}
      </Text>
    </TouchableOpacity>
  );

  const renderTasks = () => {
    if (activeTab === "today") {
      return <TodayTaskList />;
    }

    const filteredTasks = tasks.filter((task) => {
      if (activeTab === "team") return task.type === "team";
      if (activeTab === "approvals") return task.type === "approval";
      if (activeTab === "rejected") return task.type === "rejected";
      return true;
    });

    return filteredTasks.map((task) => {
      if (task.type === "team") {
        return (
          <TeamCard
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={handleEdit}
          />
        );
      } else if (task.type === "approval" || task.type === "rejected") {
        return (
          <ApprovalCard
            key={task.id}
            task={task}
            onApprove={handleApprove}
            onReassign={handleReassign}
            onReject={handleReject}
          />
        );
      }
      return null;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {renderTab("today")}
        {renderTab("team")}
        {renderTab("approvals")}
        {renderTab("rejected")}
      </ScrollView>
      <ScrollView style={styles.taskList}>{renderTasks()}</ScrollView>
      <Text style={styles.sectionTitle}>{t.delayed}</Text>
      <TodayTaskList />
      <Text style={styles.sectionTitle}>{t.upcoming}</Text>
      <TodayTaskList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    gap: 10,
    flexWrap: "wrap", // Added flexWrap property
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: 100,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#007BFF",
  },
  tabText: {
    fontSize: 12,
    color: "#8C8C8C",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  taskList: {
    flex: 1,
  },
  sectionTitle: {
    color: "#080808",
    fontSize: 20,
    marginTop: 10,
    fontFamily: "SFPro-Bold",
  },
});

export default TaskManagement;
