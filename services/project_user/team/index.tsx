import {
    ApiResponse,
    ApiSuccessResponse,
    CreateTeamPayload,
    UpdateTeamPayload,
    DeleteTeamPayload,
    TeamResponse,
    TeamsListResponse,
  } from "@/types/Apitypes";
  import axiosInstance from "../../index";
  import { API_ROUTES } from "../../routes.config";
  
  /**
   * Create a new team
   * @param teamData - Team creation payload
   * @returns TeamResponse
   */
  export async function createTeam(
    teamData: CreateTeamPayload
  ): Promise<ApiSuccessResponse<TeamResponse>> {
    try {
      const { data } = await axiosInstance.post<ApiResponse<TeamResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.TEAM.CREATE_TEAM,
        teamData
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
   * Get all teams for a project
   * @param projectId - Project ID
   * @returns List of teams
   */
  export async function getTeamsByProject(
    projectId: string
  ): Promise<ApiSuccessResponse<TeamsListResponse>> {
    try {
      const { data } = await axiosInstance.get<ApiResponse<TeamsListResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.TEAM.GET_TEAM,
        {
          params: { ProjectID: projectId }, // ✅ Sending as query param
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
   * Update a team
   * @param updateData - Team update payload
   * @returns Updated team response
   */
  export async function updateTeam(
    updateData: UpdateTeamPayload
  ): Promise<ApiSuccessResponse<TeamResponse>> {
    try {
      const { data } = await axiosInstance.put<ApiResponse<TeamResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.TEAM.UPDATE_TEAM,
        updateData
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
   * Delete a team
   * @param deleteData - Team deletion payload
   * @returns Success message
   */
  export async function deleteTeam(
    deleteData: DeleteTeamPayload
  ): Promise<ApiSuccessResponse<{ message: string }>> {
    try {
      const { data } = await axiosInstance.post<ApiResponse<{ message: string }>>(
        API_ROUTES.PROJECT_MAIN_USER.TEAM.DELETE_TEAM,
        deleteData
      );
  
      return {
        message: data.message,
        data: data.data as any,
      };
    } catch (error) {
      throw error;
    }
  }
  