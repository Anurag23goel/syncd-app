export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  hasWarning?: boolean;
  type?: "team" | "approval" | "todays" | "rejected";
  teamMembers?: { id: string; avatar: string }[];
  createdAt?: string;
}
