import {
    ApiResponse,
    ApiSuccessResponse,
    SearchUserResponse,
    TeamsListResponse,
    ProjectDetailsResponse,
  } from "@/types/Apitypes";
  import axiosInstance from "../../index";
  import { API_ROUTES } from "../../routes.config";
  
  /**
   * Search for users
   * @param authToken - User authentication token
   * @param query - Search query (username or other criteria)
   * @returns List of users
   */
  export async function searchUser(
    authToken: string,
    query: string
  ): Promise<ApiSuccessResponse<SearchUserResponse[]>> {
    try {
      const { data } = await axiosInstance.get<ApiResponse<SearchUserResponse[]>>(
        API_ROUTES.MEETING.SEARCH.SEARCH_USER,
        {
          params: { query }, // ✅ Sending search query as query param
          headers: {
            authToken: authToken, // ✅ Sending auth token in header
          },
        }
      );
  
      return {
        message: data.message,
        data: data as any,
      };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get all projects of the authenticated user
   * @param authToken - User authentication token
   * @returns List of projects
   */
  export async function getUserProjects(
    authToken: string
  ): Promise<ApiSuccessResponse<ProjectDetailsResponse[]>> {
    try {
      const { data } = await axiosInstance.get<ApiResponse<ProjectDetailsResponse[]>>(
        API_ROUTES.MEETING.SEARCH.GET_PROJECTS_OF_USER,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // ✅ Sending auth token in header
          },
        }
      );
  
      return {
        message: data.message,
        data: data.data as any,
      };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get teams by project ID
   * @param authToken - User authentication token
   * @param projectId - Project ID
   * @returns List of teams
   */
  export async function getTeamsByProjectId(
    authToken: string,
    projectId: string
  ): Promise<ApiSuccessResponse<TeamsListResponse>> {
    try {
      const { data } = await axiosInstance.get<ApiResponse<TeamsListResponse>>(
        API_ROUTES.MEETING.SEARCH.GET_TEAMS_BY_PROJECT_ID,
        {
          params: { ProjectID: projectId }, // ✅ Sending ProjectID in query params
          headers: {
            Authorization: `Bearer ${authToken}`, // ✅ Sending auth token in header
          },
        }
      );
  
      return {
        message: data.message,
        data: data.data as any,
      };
    } catch (error) {
      throw error;
    }
  }
  