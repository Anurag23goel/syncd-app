const BASE_URL = "https://api-syncd.rebuilters.com";

const ROUTES = {
  LOGIN: `${BASE_URL}/userRoutes/userLogin`,
  VERIFY_AUTH_TOKEN: `${BASE_URL}/userRoutes/verifyAuthToken`,
  CREATE_PROJECT: `${BASE_URL}/SuperAdminRoutes/SuperAdminCreateProject`,
  SEARCH_USERS: `${BASE_URL}/adminRoutes/AdminSearchUsers`,
  CREATE_TEAM: `${BASE_URL}/teamRoutes/CreateTeam`,
  GET_ALL_PROJECTS: `${BASE_URL}/adminRoutes/adminGetAllProjects`,
  GET_PROJECT_DETAILS:`${BASE_URL}/userRoutes/getProjectDetails/{{ProjectID}}`,
  CREATE_MILESTONE:`${BASE_URL}/mileStoneRoutes/CreateMileStone`,
  UPDATE_MILESTONE:`${BASE_URL}/mileStoneRoutes/UpdateMileStone`
};

export default ROUTES;
