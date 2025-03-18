import {
    ApiResponse,
    ApiSuccessResponse,
    CreateMilestonePayload,
    UpdateMilestonePayload,
    DeleteMilestonePayload,
    MilestoneResponse,
    MilestonesListResponse,
  } from "@/types/Apitypes";
  import axiosInstance from "../../index";
  import { API_ROUTES } from "../../routes.config";
  
  /**
   * Create a new milestone
   * @param payload - Milestone creation payload
   * @returns MilestoneResponse
   */
  export async function createMilestone(
    payload: CreateMilestonePayload
  ): Promise<ApiSuccessResponse<MilestoneResponse>> {
    try {
      const { data } = await axiosInstance.post<ApiResponse<MilestoneResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.MILESTONE.CREATE_MILESTONE,
        payload
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
   * Get all milestones for a project
   * @param projectId - Project ID
   * @returns List of milestones
   */
  export async function getMilestones(
    projectId: string
  ): Promise<ApiSuccessResponse<MilestonesListResponse>> {
    try {
      const { data } = await axiosInstance.get<ApiResponse<MilestonesListResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.MILESTONE.GET_MILESTONE,
        {
          params: { ProjectID: projectId }, // Sending ProjectID in query params
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
   * Update an existing milestone
   * @param payload - Milestone update payload
   * @returns Updated milestone response
   */
  export async function updateMilestone(
    payload: UpdateMilestonePayload
  ): Promise<ApiSuccessResponse<MilestoneResponse>> {
    try {
      const { data } = await axiosInstance.put<ApiResponse<MilestoneResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.MILESTONE.UPDATE_MILESTONE, // Using correct PUT request endpoint
        payload
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
   * Delete a milestone
   * @param payload - Milestone deletion payload
   * @returns Success message
   */
  export async function deleteMilestone(
    payload: DeleteMilestonePayload
  ): Promise<ApiSuccessResponse<{ message: string }>> {
    try {
      const { data } = await axiosInstance.delete<ApiResponse<{ message: string }>>(
        API_ROUTES.PROJECT_MAIN_USER.MILESTONE.UPDATE_MILESTONE_COPY, // Using correct DELETE request endpoint
        {
          data: payload, // Sending payload in body for DELETE request
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
  