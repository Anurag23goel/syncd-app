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
      CREATE_ROLE: "/adminRoutes/adminCreateRole", //POST REQUEST
      GET_ALL_ROLES_FOR_PROJECT: "/adminRoutes/getAllRolesForProject", // GET REQUEST
      ADMIN_ASSIGN_ROLE_TO_USER: "/adminRoutes/adminAssignRoleToUser", //POST REQUEST
      UPDATE_ROLE: "/adminRoutes/updateRole", //POST REQUEST
    },
    INVENTORY: {
      ADD_INVENTORY_ITEM: "/inventoryRoutes/addInventory",
      GET_ALL_INVENTORY_ITEMS: "/inventoryRoutes/GetInventory/{{ProjectID}}",
      UPDATE_INVENTORY_ITEM: "/inventoryRoutes/updateItem",
      DELETE_INVENTORY_ITEM: "/inventoryRoutes/deleteInventory",
    },
    BASIC: {
      GET_ALL_PROJECTS: "/adminRoutes/adminGetAllProjects",
      GET_ALL_PERMISSIONS: "/adminRoutes/adminGetPermissions",
      ADD_USER_TO_PROJECT: "/adminRoutes/adminAssignUsersToProject",
      GET_PROJECT_DETAILS: "/userRoutes/getProjectDetails/{{ProjectID}}",
      GET_ALL_USERS: "/adminRoutes/AdminSearchUsers",
    },
    PAYMENT_LOGS: {
      CREATE_PAYMENT: "/paymentRoutes/CreatePaymentLog",
      GET_ALL_PAYMENT_LOGS:
        "/paymentRoutes/GetAllPaymentLogs?ProjectID={{ProjectID}}",
      UPDATE_ALL_PAYMENT_LOGS: "/paymentRoutes/UpdatePaymentLog",
      DELETE_PAYMENT: "/paymentRoutes/DeletePaymentLog",
    },
    MILESTONE: {
      CREATE_MILESTONE: "/mileStoneRoutes/CreateMileStone",
      GET_MILESTONE: "/mileStoneRoutes/GetAllMileStone?ProjectID={{ProjectID}}",
      UPDATE_MILESTONE: "/mileStoneRoutes/DeleteMileStone", //PUT REQ
      UPDATE_MILESTONE_COPY: "/mileStoneRoutes/DeleteMileStoneCopy", //DELET REQ
    },
    FILESPACE: {},
    ATTENDANCE: {
      CREATE_ATTENDANCE: "/attendanceRoutes/CreateAttendance",
      UPDATE_ATTENDANCE: "/attendanceRoutes/UpdateAttendance",
      DELETE_ATTENDANCE_BY_PROJECT:
        "/attendanceRoutes/DeleteAttendance/{{attendanceID}}?ProjectID={{ProjectID}}",
      UPDATE_ATTENDANCE_BY_PROJECT:
        "/attendanceRoutes/GetAttendanceByProject?ProjectID={{ProjectID}}&startDate={{startDate}}&endDate={{endDate}}",
    },
    LABOR: {
      CREATE_LABOR_PROFILE: "/laborRoutes/CreateLabor",
      UPDATE_LABOR_STATUS: "/laborRoutes/ToggleLaborStatus",
      GET_LABORS_BY_PROJECT:
        "/laborRoutes/GetLaborsByProject?ProjectID={{ProjectID}}&IncludeInactive={{IncludeInactive}}",
      UPDATE_LABOR_PROFILE: "/laborRoutes/UpdateLabor",
      DELETE_LABOR: "/laborRoutes/DeleteLabor",
    },
    TEAM: {
      CREATE_TEAM: "/teamRoutes/CreateTeam",
      UPDATE_TEAM: "/teamRoutes/UpdateTeam",
      DELETE_TEAM: "/teamRoutes/DeleteTeam",
      GET_TEAM: "/teamRoutes/getTeamsByProject?ProjectID={{ProjectID}}",
    },
    RENDER_COMPARISON: {
      CREATE_RENDER: "/RenderComparisonRoutes/CreateRenderComparison",
      PUT_RENDER: "/RenderComparisonRoutes/UpdateRenderComparison",
    },
  },
  PROJECT_OTHER_USER: {
    GET_ALL_PROJECTS: "/userRoutes/getUserProjects",
  },
  CHAT: {
    CREATE_CHAT_ROOM: "/chatRoutes/CreateChatRoom",
    SEARCH_USER: "/chatRoutes/SearchUsers",
    CHAT:""
  },
  TASK: {
    CREATE_TASK: "/taskRoutes/CreateTask",
    CREATE_TEAM_TASK: "/taskRoutes/CreateTeamTask",
    CREATE_TEAM_SUBTASK: "/taskRoutes/CreateTeamSubTask",
    CREATE_SUBTASK: "/taskRoutes/CreateSubTask",
    GET_TASK: "/taskRoutes/GetUserTasks",
    APPROVE_TASK: "/taskRoutes/ApproveTaskCompletion",
    MARK_AS_COMPLETE: "/taskRoutes/MarkTaskAsCompleted",
  },
  MEETING: {
    SEARCH: {
      SEARCH_USER: "/meetingRoutes/SearchUsers",
      GET_PROJECTS_OF_USER: "/meetingRoutes/getUserProjects",
      GET_TEAMS_BY_PROJECT_ID: "/meetingRoutes/ProjectWithTeams/{{ProjectID}}",
    },
    CREATE_MEETING: "/meetingRoutes/CreateMeeting",
    UPDATE_MEETING: "/meetingRoutes/UpdateMeeting",
    GET_USER_MEETING: "/meetingRoutes/GetUserMeetings",
    DELETE_MEETING: "/meetingRoutes/DeleteMeeting/meeting-{{meetingID}}",
  },
} as const;

export default API_ROUTES;
