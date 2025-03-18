import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { Image } from "react-native";
import { Task } from "@/types";
import { translations } from "@/constants/translations";
import { useLanguageStore } from "@/store/useLanguageStore";

interface TeamCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void; // Add this line
}

export const TeamCard = ({
  task,
  onToggle,
  onDelete,
  onEdit,
}: TeamCardProps) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tasks;

  return (
    <View style={styles.taskContainer}>
      <TouchableOpacity
        onPress={() => onToggle(task.id)}
        style={styles.checkbox}
      >
        {task.completed ? (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        ) : (
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

        <View style={styles.teamMembers}>
          {task.teamMembers?.slice(0, 3).map((member, index) => (
            <Image
              key={member.id}
              source={{ uri: member.avatar }}
              style={[styles.avatar, { marginLeft: index > 0 ? -10 : 0 }]}
            />
          ))}
          {(task.teamMembers?.length || 0) > 3 && (
            <View style={styles.extraMembers}>
              <Text style={styles.extraMembersText}>
                +{(task.teamMembers?.length || 0) - 3}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.taskActions}>
        {task.hasWarning && (
          <TouchableOpacity style={styles.actionButton}>
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
    marginTop: 4,
  },
  teamMembers: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  extraMembers: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#007BFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -10,
  },
  extraMembersText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
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
