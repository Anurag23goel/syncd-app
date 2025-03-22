// API Response Types
export interface ApiResponse<T = any> {
  message: string;
  data: T;
  token?: string;
  error?: string;
  success: boolean;
}

export interface ApiSuccessResponse<T = any> {
  message?: string;
  success?: boolean;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface ApiSuccessWithData<T = any> {
  success: true;
  message: string;
  data?: T;
}

// User Related Types
export interface UserResponse {
  UserID: string;
  UserEmail: string;
  UserFullName: string;
  IsVerified: boolean;
  UserProfilePicture: string | null;
  UserContact: string | null;
  RoleIDs: string[];
}

export interface LoginResponse extends UserResponse {
  token: string;
  message: string;
  success: boolean;
  data: UserResponse;
}

// Request Payload Types
export interface LoginRequest {
  UserEmail: string;
  UserPassword: string;
}

export interface RegisterUserPayload {
  UserEmail: string;
  UserPassword: string;
  UserFullName: string;
}

export interface VerifyOtpPayload {
  UserEmail: string;
  OtpCode: string;
}

// Error Types
export interface ApiError {
  message: string;
  status?: number;
}

export enum ErrorType {
  AUTH = "auth_error",
  NETWORK = "network_error",
  SERVER = "server_error",
  VALIDATION = "validation_error",
  TIMEOUT = "timeout_error",
  RATE_LIMIT = "rate_limit_error",
  UNKNOWN = "unknown_error",
}

export interface CustomError extends Error {
  status?: number;
  code?: string;
  type: ErrorType;
  data?: any;
  isAxiosError: boolean;
  retryable: boolean;
}

/**
 * Type for creating a new role
 */
export interface CreateRolePayload {
  RoleName: string;
  RolePermissions: string[];
  ProjectID: string;
}

/**
 * Type for assigning a role to users
 */
export interface AssignRolePayload {
  RoleID: string;
  ProjectID: string;
  UserIDs: string[];
}

/**
 * Type for updating an existing role
 */
export interface UpdateRolePayload {
  RoleID: string;
  RoleColor: string;
  RoleName: string;
  RolePermissions: string[];
  ProjectID: string;
}

/**
 * Type for role response (returned after creation or update)
 */
export interface RoleResponse {
  RoleID: string;
  RoleName: string;
  RolePermissions: string[];
  RoleColor?: string; // Optional field
  ProjectID: string;
}

/**
 * Type for getting a list of roles
 */
export interface RolesListResponse {
  roles: RoleResponse[];
}

/**
 * Type for adding a new inventory item
 */
export interface AddInventoryPayload {
  ProjectID: string;
  ResourceName: string;
  BrandName: string;
  TotalQuantity: string;
  Cost: string;
  Category: string;
  PaymentMode: string;
}

/**
 * Type for updating an inventory item
 */
export interface UpdateInventoryPayload {
  InventoryID: string;
  ProjectID: string;
  PhotoLink: string;
  Quantity: string;
  TransactionType: "USED" | "ADDED"; // Added enum for better type safety
}

/**
 * Type for deleting an inventory item
 */
export interface DeleteInventoryPayload {
  ProjectID: string;
  InventoryID: string;
}

/**
 * Type for inventory item response
 */
export interface InventoryResponse {
  InventoryID: string;
  ProjectID: string;
  ResourceName: string;
  BrandName: string;
  TotalQuantity: string;
  Cost: string;
  Category: string;
  PaymentMode: string;
  CreatedAt: string;
}

/**
 * Type for listing inventory items
 */
export interface InventoryListResponse {
  inventoryItems: InventoryResponse[];
}

/**
 * Type for adding users to a project
 */
export interface AddUserToProjectPayload {
  ProjectID: string;
  UserIDs: string[];
}

/**
 * Type for project details response
 */
export interface ProjectDetailsResponse {
  ProjectID: string;
  ProjectName: string;
  ProjectDescription: string;
  ProjectCode: string;
  ProjectArea: string;
  Budget: number | null;
  Currency: string | null;
  StartDate: string;
  EndDate: string | null;
  ProjectLocation: string;
  ProjectMapLink: string | null;
  ProjectThumbnail: string | null;
  ProjectAdminIDs: string[]; // Assuming this is an array of admin IDs
  ProjectMembers: string[]; // Assuming an array of member IDs
  userPermissions: string[]; // Assuming this contains user permissions
  isAdmin: boolean;
  IsCompleted: boolean;
  progress:{
    percentage:number;
    completedMilestones: number,
    totalMilestones: number
  }
}

export interface AllProjectsResponse {
  projects: ProjectDetailsResponse[];
}

/**
 * Type for listing permissions
 */
export interface PermissionsListResponse {
  permissions: string[];
}

/**
 * Type for a single user
 */
export interface UserResponse {
  UserID: string;
  Username: string;
  Email: string;
  Role: string;
}

/**
 * Type for listing users
 */
export interface UsersListResponse {
  users: UserResponse[];
}

/**
 * Type for creating a new payment log
 */
export interface CreatePaymentPayload {
  ProjectID: string;
  Amount: number;
  Title: string;
  EnterDetails: string;
  Category: string;
  PaymentMode: string;
  InvoiceLink: string;
}

/**
 * Type for updating a payment log
 */
export interface UpdatePaymentPayload {
  ProjectID: string;
  PaymentID: string;
  Amount: string;
}

/**
 * Type for deleting a payment log
 */
export interface DeletePaymentPayload {
  ProjectID: string;
  PaymentID: string;
}

/**
 * Type for payment log response
 */
export interface PaymentResponse {
  PaymentID: string;
  ProjectID: string;
  Amount: number;
  Title: string;
  EnterDetails: string;
  Category: string;
  PaymentMode: string;
  InvoiceLink: string;
  CreatedAt: string;
}

/**
 * Type for listing payment logs
 */
export interface PaymentsListResponse {
  payments: PaymentResponse[];
}

/**
 * Type for creating a new milestone
 */
export interface CreateMilestonePayload {
  ProjectID: string;
  Title: string;
  Description: string;
  Status: string;
}

/**
 * Type for updating an existing milestone
 */
export interface UpdateMilestonePayload {
  ProjectID: string;
  MileStoneID: string;
  Title: string;
}

/**
 * Type for deleting a milestone
 */
export interface DeleteMilestonePayload {
  ProjectID: string;
  MileStoneID: string;
}

/**
 * Type for a milestone response
 */
export interface MilestoneResponse {
  MileStoneID: string;
  ProjectID: string;
  Title: string;
  Description: string;
  Status: string;
  CreatedAt: string;
}

/**
 * Type for listing milestones
 */
export interface MilestonesListResponse {
  milestones: MilestoneResponse[];
}

/**
 * Type for creating an attendance record
 */
export interface CreateAttendancePayload {
  ProjectID: string;
  Date: string; // Format: YYYY-MM-DD
  AttendanceRecords: {
    LaborID: string;
    Remarks: string;
  }[];
}

/**
 * Type for updating an attendance record
 */
export interface UpdateAttendancePayload {
  ProjectID: string;
  Date: string;
  AttendanceID: string;
  AttendanceRecords: {
    name: string;
    laborId: string;
    remarks: string;
    isPresent: boolean;
  }[];
}

/**
 * Type for deleting an attendance record
 */
export interface DeleteAttendancePayload {
  ProjectID: string;
  AttendanceID: string;
}

/**
 * Type for an attendance record response
 */
export interface AttendanceResponse {
  AttendanceID: string;
  ProjectID: string;
  Date: string;
  AttendanceRecords: {
    name: string;
    laborId: string;
    remarks: string;
    isPresent: boolean;
  }[];
  CreatedAt: string;
}

/**
 * Type for listing attendance records
 */
export interface AttendanceListResponse {
  attendanceRecords: AttendanceResponse[];
}

/**
 * Type for creating a labor profile
 */
export interface CreateLaborPayload {
  ProjectID: string;
  EmployeeID: string;
  Name: string;
  ProfileImage: string;
}

/**
 * Type for updating a labor profile
 */
export interface UpdateLaborPayload {
  ProjectID: string;
  LaborID: string;
}

/**
 * Type for toggling labor status
 */
export interface ToggleLaborStatusPayload {
  ProjectID: string;
  LaborID: string;
}

/**
 * Type for deleting a labor profile
 */
export interface DeleteLaborPayload {
  ProjectID: string;
  LaborID: string;
}

/**
 * Type for a labor response
 */
export interface LaborResponse {
  LaborID: string;
  ProjectID: string;
  EmployeeID: string;
  Name: string;
  ProfileImage: string;
  CreatedAt: string;
}

/**
 * Type for listing labor profiles
 */
export interface LaborsListResponse {
  labors: LaborResponse[];
}

/**
 * Type for creating a new team
 */
export interface CreateTeamPayload {
  ProjectID: string;
  TeamName: string;
  TeamLeaderID: string;
  TeamMembers: string[];
}

/**
 * Type for updating a team
 */
export interface UpdateTeamPayload {
  ProjectID: string;
  TeamID: string;
  TeamName: string;
  TeamLeaderID: string;
  TeamMembers: string[];
}

/**
 * Type for deleting a team
 */
export interface DeleteTeamPayload {
  TeamID: string;
}

/**
 * Type for a team response
 */
export interface TeamResponse {
  TeamID: string;
  ProjectID: string;
  TeamName: string;
  TeamLeaderID: string;
  TeamMembers: string[];
  CreatedAt: string;
}

/**
 * Type for listing teams
 */
export interface TeamsListResponse {
  teams: TeamResponse[];
}

/**
 * Type for creating a render comparison
 */
export interface CreateRenderPayload {
  RenderImage: File; // Multipart file upload
  RealImage: File; // Multipart file upload
  ProjectID: string;
}

/**
 * Type for updating a render comparison
 */
export interface UpdateRenderPayload {
  RenderImage: File; // Multipart file upload
  RealImage: File; // Multipart file upload
  ProjectID: string;
  ComparisonID: string;
}

/**
 * Type for render comparison response
 */
export interface RenderComparisonResponse {
  ComparisonID: string;
  ProjectID: string;
  RenderImageUrl: string;
  RealImageUrl: string;
  CreatedAt: string;
}

/**
 * Type for creating a chat room
 */
export interface CreateChatRoomPayload {
  RoomType: "GROUP" | "DIRECT";
  RoomName: string;
  Members: string[];
}

/**
 * Type for a chat room response
 */
export interface ChatRoomResponse {
  RoomID: string;
  RoomType: "GROUP" | "DIRECT";
  RoomName: string;
  Members: string[];
  CreatedAt: string;
}

/**
 * Type for searching users
 */
export interface SearchUserResponse {
  UserID: string;
  Username: string;
  Email: string;
}

/**
 * Type for creating a new task
 */
export interface CreateTaskPayload {
  Title: string;
  Description: string;
  StartDate: string;
  EndDate: string;
  Priority: "LOW" | "MEDIUM" | "HIGH";
  AssignmentType: "USER" | "TEAM";
  AssignedUserID: string;
  CreatorNotes: string;
  ProjectID: string;
}

/**
 * Type for creating a new team task
 */
export interface CreateTeamTaskPayload extends CreateTaskPayload {}

/**
 * Type for creating a subtask
 */
export interface CreateSubTaskPayload extends CreateTaskPayload {
  ParentTaskID: string;
}

/**
 * Type for creating a team subtask
 */
export interface CreateTeamSubTaskPayload extends CreateSubTaskPayload {}

/**
 * Type for approving a task
 */
export interface ApproveTaskPayload {
  ProjectID: string;
  TaskID: string;
  Notes: string;
  approved: boolean;
}

/**
 * Type for marking a task as complete
 */
export interface MarkTaskCompletePayload {
  ProjectID: string;
  TaskID: string;
  Notes: string;
}

/**
 * Type for a task response
 */
export interface TaskResponse {
  TaskID: string;
  ProjectID: string;
  Title: string;
  Description: string;
  StartDate: string;
  EndDate: string;
  Priority: string;
  AssignmentType: string;
  AssignedUserID: string;
  CreatorNotes: string;
  Status: string;
  CreatedAt: string;
}

/**
 * Type for listing tasks
 */
export interface TasksListResponse {
  tasks: TaskResponse[];
}

/**
 * Type for searching users
 */
export interface SearchUserResponse {
  UserID: string;
  Username: string;
  Email: string;
}

/**
 * Type for a single project
 */
export interface ProjectResponse {
  ProjectID: string;
  ProjectName: string;
  Description: string;
  CreatedAt: string;
}

/**
 * Type for listing projects
 */
export interface ProjectsListResponse {
  projects: ProjectResponse[];
}

/**
 * Type for a single team
 */
export interface TeamResponse {
  TeamID: string;
  ProjectID: string;
  TeamName: string;
  TeamLeaderID: string;
  TeamMembers: string[];
  CreatedAt: string;
}

/**
 * Type for listing teams
 */
export interface TeamsListResponse {
  teams: TeamResponse[];
}

/**
 * Type for creating a new meeting
 */
export interface CreateMeetingPayload {
  Title: string;
  Description: string;
  Date: string; // Format: YYYY-MM-DD
  StartTime: string; // ISO 8601 format
  EndTime: string; // ISO 8601 format
  MeetingType: "VIRTUAL" | "IN_PERSON";
  MeetingPlatform: "GMEET" | "ZOOM" | "MS_TEAMS" | string;
  MeetingLink: string | null;
  Location: string | null;
  Participants: string[];
  TeamIDs: string[];
  CreatedBy: string;
  CreatedAt: string;
  UpdatedAt: string;
}

/**
 * Type for updating a meeting
 */
export interface UpdateMeetingPayload {
  MeetingID: string;
  Title: string;
  Description: string;
  Date: string; // Format: YYYY-MM-DD
  StartTime: string; // ISO 8601 format
  EndTime: string; // ISO 8601 format
  MeetingType: "VIRTUAL" | "IN_PERSON";
  MeetingPlatform: "GMEET" | "ZOOM" | "MS_TEAMS" | string;
  MeetingLink: string | null;
  Location: string | null;
  Participants: string[];
  TeamIDs: string[];
}

/**
 * Type for a meeting response
 */
export interface MeetingResponse {
  MeetingID: string;
  Title: string;
  Description: string;
  Date: string; // Format: "YYYY-MM-DD"
  StartTime: string; // ISO timestamp "2025-03-20T10:00:00.000Z"
  EndTime: string; // ISO timestamp "2025-03-20T11:30:00.000Z"
  MeetingType: string; // Example: "VIRTUAL"
  MeetingPlatform: string; // Example: "GMEET"
  MeetingLink: string | null; // Can be null if it's an offline meeting
  Location: string | null; // Null for virtual meetings, a string for physical ones
  Participants: string[]; // Array of user IDs
  TeamIDs: string[]; // Array of team IDs
  CreatedBy: string; // User ID of the meeting creator
  createdAt: string; // API returns lowercase `createdAt`
  updatedAt: string; // API returns lowercase `updatedAt`
}

/**
 * Type for listing meetings
 */
export interface MeetingsListResponse {
  meetings: MeetingResponse[];
}
