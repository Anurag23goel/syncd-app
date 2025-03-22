export const BASE_URL = "https://api-syncd.rebuilters.com";

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/userRoutes/userLogin",
    REGISTER: "/userRoutes/userRegister",
    VERIFY_OTP: "/userRoutes/verifyOtp",
    VERIFY_GOOGLE_TOKEN: "/userRoutes/verifyGoogleToken",
    VERIFY_AUTH_TOKEN: "/userRoutes/verifyAuthToken",
  },
  PROJECT_MAIN_USER: {
    ROLE: {
      CREATE_ROLE: `${BASE_URL}/adminRoutes/adminCreateRole`,
      GET_ALL_ROLES_FOR_PROJECT: `${BASE_URL}/adminRoutes/getAllRolesForProject`,
      ADMIN_ASSIGN_ROLE_TO_USER: `${BASE_URL}/adminRoutes/adminAssignRoleToUser`,
      UPDATE_ROLE: `${BASE_URL}/adminRoutes/updateRole`,
    },
    INVENTORY: {
      ADD_INVENTORY_ITEM: `${BASE_URL}/inventoryRoutes/addInventory`,
      GET_ALL_INVENTORY_ITEMS: `${BASE_URL}/inventoryRoutes/GetInventory/{{ProjectID}}`,
      UPDATE_INVENTORY_ITEM: `${BASE_URL}/inventoryRoutes/updateItem`,
      DELETE_INVENTORY_ITEM: `${BASE_URL}/inventoryRoutes/deleteInventory`,
    },
    BASIC: {
      GET_ALL_PROJECTS: `${BASE_URL}/adminRoutes/adminGetAllProjects`,
      GET_ALL_PERMISSIONS: `${BASE_URL}/adminRoutes/adminGetPermissions`,
      ADD_USER_TO_PROJECT: `${BASE_URL}/adminRoutes/adminAssignUsersToProject`,
      GET_PROJECT_DETAILS: `${BASE_URL}/userRoutes/getProjectDetails/{{ProjectID}}`,
      GET_ALL_USERS: `${BASE_URL}/adminRoutes/AdminSearchUsers`,
    },
    PAYMENT_LOGS: {
      CREATE_PAYMENT: `${BASE_URL}/paymentRoutes/CreatePaymentLog`,
      GET_ALL_PAYMENT_LOGS: `${BASE_URL}/paymentRoutes/GetAllPaymentLogs?ProjectID={{ProjectID}}`,
      UPDATE_ALL_PAYMENT_LOGS: `${BASE_URL}/paymentRoutes/UpdatePaymentLog`,
      DELETE_PAYMENT: `${BASE_URL}/paymentRoutes/DeletePaymentLog`,
    },
    MILESTONE: {
      CREATE_MILESTONE: `${BASE_URL}/mileStoneRoutes/CreateMileStone`,
      GET_MILESTONE: `${BASE_URL}/mileStoneRoutes/GetAllMileStone?ProjectID={{ProjectID}}`,
      UPDATE_MILESTONE: `${BASE_URL}/mileStoneRoutes/DeleteMileStone`, // PUT REQ
      UPDATE_MILESTONE_COPY: `${BASE_URL}/mileStoneRoutes/DeleteMileStoneCopy`, // DELETE REQ
    },
    FILESPACE: {},
    ATTENDANCE: {
      CREATE_ATTENDANCE: `${BASE_URL}/attendanceRoutes/CreateAttendance`,
      UPDATE_ATTENDANCE: `${BASE_URL}/attendanceRoutes/UpdateAttendance`,
      DELETE_ATTENDANCE_BY_PROJECT: `${BASE_URL}/attendanceRoutes/DeleteAttendance/{{attendanceID}}?ProjectID={{ProjectID}}`,
      UPDATE_ATTENDANCE_BY_PROJECT: `${BASE_URL}/attendanceRoutes/GetAttendanceByProject?ProjectID={{ProjectID}}&startDate={{startDate}}&endDate={{endDate}}`,
    },
    LABOR: {
      CREATE_LABOR_PROFILE: `${BASE_URL}/laborRoutes/CreateLabor`,
      UPDATE_LABOR_STATUS: `${BASE_URL}/laborRoutes/ToggleLaborStatus`,
      GET_LABORS_BY_PROJECT: `${BASE_URL}/laborRoutes/GetLaborsByProject?ProjectID={{ProjectID}}&IncludeInactive={{IncludeInactive}}`,
      UPDATE_LABOR_PROFILE: `${BASE_URL}/laborRoutes/UpdateLabor`,
      DELETE_LABOR: `${BASE_URL}/laborRoutes/DeleteLabor`,
    },
    TEAM: {
      CREATE_TEAM: `${BASE_URL}/teamRoutes/CreateTeam`,
      UPDATE_TEAM: `${BASE_URL}/teamRoutes/UpdateTeam`,
      DELETE_TEAM: `${BASE_URL}/teamRoutes/DeleteTeam`,
      GET_TEAM: `${BASE_URL}/teamRoutes/getTeamsByProject?ProjectID={{ProjectID}}`,
    },
    RENDER_COMPARISON: {
      CREATE_RENDER: `${BASE_URL}/RenderComparisonRoutes/CreateRenderComparison`,
      PUT_RENDER: `${BASE_URL}/RenderComparisonRoutes/UpdateRenderComparison`,
    },
  },
  PROJECT_OTHER_USER: {
    GET_ALL_PROJECTS: `${BASE_URL}/userRoutes/getUserProjects`,
  },
  CHAT: {
    CREATE_CHAT_ROOM: `${BASE_URL}/chatRoutes/CreateChatRoom`,
    SEARCH_USER: `${BASE_URL}/chatRoutes/SearchUsers`,
    FETCH_USER_ALL_CHATS: `${BASE_URL}/chatRoutes/fetchUserChats`,
    FETCH_CHAT_ROOM: `${BASE_URL}/chatRoutes/FetchChatAndMarkRead/{{chatroomID}}`,
  },
  TASK: {
    CREATE_TASK: `${BASE_URL}/taskRoutes/CreateTask`,
    CREATE_TEAM_TASK: `${BASE_URL}/taskRoutes/CreateTeamTask`,
    CREATE_TEAM_SUBTASK: `${BASE_URL}/taskRoutes/CreateTeamSubTask`,
    CREATE_SUBTASK: `${BASE_URL}/taskRoutes/CreateSubTask`,
    GET_TASK: `${BASE_URL}/taskRoutes/GetUserTasks`,
    APPROVE_TASK: `${BASE_URL}/taskRoutes/ApproveTaskCompletion`,
    MARK_AS_COMPLETE: `${BASE_URL}/taskRoutes/MarkTaskAsCompleted`,
  },
  MEETING: {
    SEARCH: {
      SEARCH_USER: `${BASE_URL}/meetingRoutes/SearchUsers`,
      GET_PROJECTS_OF_USER: `${BASE_URL}/meetingRoutes/getUserProjects`,
      GET_TEAMS_BY_PROJECT_ID: `${BASE_URL}/meetingRoutes/ProjectWithTeams/{{ProjectID}}`,
    },
    CREATE_MEETING: `${BASE_URL}/meetingRoutes/CreateMeeting`,
    UPDATE_MEETING: `${BASE_URL}/meetingRoutes/UpdateMeeting`,
    GET_USER_MEETING: `${BASE_URL}/meetingRoutes/GetUserMeetings`,
    DELETE_MEETING: `${BASE_URL}/meetingRoutes/DeleteMeeting/meeting-{{meetingID}}`,
  },
} as const;

export const SUPER_ADMIN_API_ROUTES = {
  AUTH: {},
  PROJECT: {
    CREATE_PROJECT: `${BASE_URL}/SuperAdminRoutes/SuperAdminCreateProject`, //requires header
  },
} as const;

export default API_ROUTES;
