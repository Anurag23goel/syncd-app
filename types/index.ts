export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  hasWarning?: boolean;
  teamMembers?: TeamMember[];
  createdAt?: string;
  type?: "task" | "team" | "approval";
}

export interface TeamMember {
  id: string;
  avatar: string;
}
