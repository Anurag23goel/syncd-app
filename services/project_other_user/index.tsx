import {
  ApiResponse,
  ApiSuccessResponse,
  ProjectsListResponse,
} from "@/types/Apitypes";
import axiosInstance from "../index";
import { API_ROUTES } from "../routes.config";
import axios from "axios";

/**
 * Get all projects for the logged-in user
 * @param authToken - User authentication token
 * @returns List of projects
 */
export async function getAllUserProjects(
  authToken: string
): Promise<ApiSuccessResponse<ProjectsListResponse>> {

  try {
    const { data } = await axiosInstance.get<ApiResponse<ProjectsListResponse>>(
      API_ROUTES.PROJECT_OTHER_USER.GET_ALL_PROJECTS,
      {
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
