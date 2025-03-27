// ---------- INVENTORY ----------
export interface SINGLE_INVENTORY_ITEM {
  InventoryID: string;
  ProjectID: string;
  ResourceName: string;
  BrandName: string;
  TotalQuantity: number;
  Cost: string;
  Category: string;
  PaymentMode: "Cash" | "Card" | "Online" | string;
  InvoiceLink: string | null;
  PhotoLink: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface GET_ALL_INVENTORY_ITEMS_RESPONSE {
  inventoryItems: SINGLE_INVENTORY_ITEM[];
}

// ---------- PROJECT ----------
export interface SINGLE_PROJECT_DETAILS {
  ProjectID: string;
  ProjectName: string;
  ProjectCode: string;
  ProjectDescription: string;
  StartDate: string;
  EndDate: string | null;
  ProjectArea: string;
  Budget: number | null;
  Currency: string | null;
  ProjectLocation: string | null;
  ProjectMapLink: string;
  ProjectThumbnail: string | null;
  ProjectAdminIDs: string[];
  ProjectMembers: string[];
  IsCompleted: boolean;
  userPermissions: string[];
  isAdmin: boolean;
  status: "upcoming" | "ongoing" | "completed" | string;
  progress: {
    percentage: number;
    completedMilestones: number;
    totalMilestones: number;
  };
}

export interface GET_ALL_PROJECTS_FOR_USER {
  projects: SINGLE_PROJECT_DETAILS[];
}

// ---------- ATTENDANCE ----------
export interface AttendanceStats {
  attendanceRate: string;
  totalPresent: number;
  totalAbsent: number;
}

export interface AttendanceData {
  records: any[]; // Add shape if known
  stats: AttendanceStats;
}

// ---------- INVENTORY DASHBOARD ----------
export interface InventoryStats {
  totalItems: number;
  totalUsed: number;
  totalDamaged: number;
  totalAdded: number;
  totalValue: number;
  categoryBreakdown: any[]; // Add type if structure known
}

export interface InventoryData {
  records: SINGLE_INVENTORY_ITEM[];
  stats: InventoryStats;
  transactions: any[]; // Add shape if known
}

// ---------- MILESTONES ----------
export interface MilestoneStats {
  total: number;
  completed: number;
  pending: number;
}

export interface MilestoneData {
  records: any[]; // Define if needed
  stats: MilestoneStats;
}

// ---------- TASKS ----------
export interface TaskStats {
  totalTasks: number;
  completed: number;
  pending: number;
  delayed: number;
  upcoming: number;
}

export interface TaskData {
  records: any[]; // Define if known
  stats: TaskStats;
}

// ---------- PERSONNEL ----------
export interface KeyPersonnel {
  clients: any[];
  contractors: any[];
  stakeholders: any[];
}

// ---------- FULL PROJECT DASHBOARD ----------
export interface NEW_PROJECT_DETAILS {
  project: SINGLE_PROJECT_DETAILS;
  attendance: AttendanceData;
  inventory: InventoryData;
  milestones: MilestoneData;
  tasks: TaskData;
  keyPersonnel: KeyPersonnel;
  renderComparisons: any[]; // Placeholder
}

// ----------- CHATS ---------------
export interface NEW_CHAT_RESPONSE_TYPE {
  success: boolean;
  filter: string;
  chatRooms: CHAT_ROOM_TYPE[];
  totalCount: number;
  unreadTotal: number;
}

export interface CHAT_ROOM_TYPE {
  RoomID: string;
  DisplayName: string;
  DisplayPicture: string | null;
  UnreadCount: number;
  LastMessage: LAST_MESSAGE_TYPE | null;
}

export interface LAST_MESSAGE_TYPE {
  content: string;
  time: string; // ISO string format
}

export interface PARTICULAR_CHAT_WITH_USER_RESPONSE_TYPE {
  success: boolean;
  chatRoom: CHAT_ROOM_INFORMATION;
  messages: CHAT_MESSAGES[];
}

export interface CHAT_ROOM_INFORMATION {
  RoomID: string;
  RoomName: string;
  RoomType: "INDIVIDUAL" | "GROUP"; // Add other types if applicable
}

export interface CHAT_MESSAGES {
  MessageID: string;
  SenderID: string;
  Content: string;
  MessageType: "TEXT" | "IMAGE" | "VIDEO" | "FILE"; // Extend as needed
}
