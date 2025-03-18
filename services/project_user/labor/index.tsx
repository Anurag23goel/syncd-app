import {
    ApiResponse,
    ApiSuccessResponse,
    CreateLaborPayload,
    UpdateLaborPayload,
    ToggleLaborStatusPayload,
    DeleteLaborPayload,
    LaborResponse,
    LaborsListResponse,
  } from "@/types/Apitypes";
  import axiosInstance from "../../index";
  import { API_ROUTES } from "../../routes.config";
  
  /**
   * Create a new labor profile
   * @param laborData - Labor creation payload
   * @returns LaborResponse
   */
  export async function createLaborProfile(
    laborData: CreateLaborPayload
  ): Promise<ApiSuccessResponse<LaborResponse>> {
    try {
      const { data } = await axiosInstance.post<ApiResponse<LaborResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.LABOR.CREATE_LABOR_PROFILE,
        laborData
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
   * Get all labor profiles for a project
   * @param projectId - Project ID
   * @returns List of labor profiles
   */
  export async function getLaborsByProject(
    projectId: string,
    includeInactive: boolean
  ): Promise<ApiSuccessResponse<LaborsListResponse>> {
    try {
      const { data } = await axiosInstance.get<ApiResponse<LaborsListResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.LABOR.GET_LABORS_BY_PROJECT,
        {
          params: { ProjectID: projectId, IncludeInactive: includeInactive }, // ✅ Sending as query params
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
   * Update a labor profile
   * @param updateData - Labor update payload
   * @returns Updated labor response
   */
  export async function updateLaborProfile(
    updateData: UpdateLaborPayload
  ): Promise<ApiSuccessResponse<LaborResponse>> {
    try {
      const { data } = await axiosInstance.put<ApiResponse<LaborResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.LABOR.UPDATE_LABOR_PROFILE,
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
   * Toggle labor status
   * @param statusData - Toggle labor status payload
   * @returns Success message
   */
  export async function toggleLaborStatus(
    statusData: ToggleLaborStatusPayload
  ): Promise<ApiSuccessResponse<{ message: string }>> {
    try {
      const { data } = await axiosInstance.patch<ApiResponse<{ message: string }>>(
        API_ROUTES.PROJECT_MAIN_USER.LABOR.UPDATE_LABOR_STATUS,
        statusData
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
   * Delete a labor profile
   * @param deleteData - Labor deletion payload
   * @returns Success message
   */
  export async function deleteLabor(
    deleteData: DeleteLaborPayload
  ): Promise<ApiSuccessResponse<{ message: string }>> {
    try {
      const { data } = await axiosInstance.post<ApiResponse<{ message: string }>>(
        API_ROUTES.PROJECT_MAIN_USER.LABOR.DELETE_LABOR,
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
  