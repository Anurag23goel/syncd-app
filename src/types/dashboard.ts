export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingProjects: number;
}

export interface RecentProject {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'pending';
  progress: number;
  dueDate: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  activeProjects: number;
}