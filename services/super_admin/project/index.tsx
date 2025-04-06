import {
    ApiResponse,
    ApiSuccessResponse,
    CreateProjectPayload,
    ProjectResponse,
  } from "@/types/Apitypes";
  import axiosInstance from "../../index";
  import { SUPER_ADMIN_API_ROUTES } from "../../routes.config";
  
  /**
   * Create a new project
   * @param projectData - Project creation payload
   * @returns ProjectResponse
   */
  export async function createProject(
    projectData: CreateProjectPayload
  ): Promise<ApiSuccessResponse<ProjectResponse>> {
    try {
      const { data } = await axiosInstance.post<ApiResponse<ProjectResponse>>(
        SUPER_ADMIN_API_ROUTES.PROJECT.CREATE_PROJECT,
        projectData
      );
  
      return {
        message: data.message,
        data: data.data as any,
      };
    } catch (error) {
      throw error;
    }
  }