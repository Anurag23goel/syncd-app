import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  hasWarning?: boolean;
  type?: string;
}

interface TodayTaskProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const TodayTask = ({
  task,
  onToggle,
  onDelete,
  onEdit,
}: TodayTaskProps) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tasks;

  return (
    <View key={task.id} style={styles.taskContainer}>
      <TouchableOpacity
        onPress={() => onToggle(task.id)}
        style={styles.checkbox}
        accessibilityLabel={
          task.completed ? t.status.completed : t.status.inProgress
        }
      >
        {task.completed && (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        )}
        {!task.completed && (
          <Ionicons name="ellipse-outline" size={24} color="#757575" />
        )}
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            task.completed && styles.completedTaskTitle,
          ]}
        >
          {task.title}
        </Text>
        {task.description && (
          <Text style={styles.taskDescription}>{task.description}</Text>
        )}
      </View>
      <View style={styles.taskActions}>
        {task.hasWarning && (
          <TouchableOpacity
            style={styles.actionButton}
            accessibilityLabel={t.status.delayed}
          >
            <Ionicons name="alert-circle" size={18} color="#FF5722" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(task.id)}
          accessibilityLabel={t.taskActions.delete}
        >
          <Ionicons name="trash-outline" size={18} color="#FF5722" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(task.id)}
          accessibilityLabel={t.taskActions.edit}
        >
          <Octicons name="pencil" size={18} color="#8C8C8C" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const TodayTaskList = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tasks;

  const tasks: Task[] = [
    { id: "1", title: t.today, completed: false, type: "todays" },
    { id: "2", title: t.today, completed: false, type: "todays" },
    { id: "3", title: t.today, completed: true, type: "todays" },
    {
      id: "4",
      title: t.title,
      description: "Description",
      completed: true,
      hasWarning: true,
      type: "todays",
    },
  ];

  const toggleTask = (id: string) => {
    // Implement the toggle task functionality
  };

  const deleteTask = (id: string) => {
    // Implement the delete task functionality
  };

  const editTask = (id: string) => {
    // Implement the edit task functionality
  };

  return (
    <View>
      {tasks.map((task) => (
        <TodayTask
          key={task.id}
          task={task}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 10,
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  checkbox: {
    marginRight: 10,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: "#212121",
  },
  completedTaskTitle: {
    textDecorationLine: "line-through",
    color: "#757575",
  },
  taskDescription: {
    fontSize: 14,
    color: "#757575",
  },
  taskActions: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: "#F2F2F2",
    padding: 4,
    borderRadius: 20,
  },
});
