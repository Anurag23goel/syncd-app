import {
  ApiResponse,
  ApiSuccessResponse,
  AddUserToProjectPayload,
  ProjectDetailsResponse,
  ProjectsListResponse,
  PermissionsListResponse,
  UsersListResponse,
} from "@/types/Apitypes";
import axiosInstance from "../../index";
import { API_ROUTES } from "../../routes.config";

/**
 * Get all projects
 * @returns List of projects
 */
export async function getAllProjects(): Promise<
  ApiSuccessResponse<ProjectsListResponse>
> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<ProjectsListResponse>>(
      API_ROUTES.PROJECT_MAIN_USER.BASIC.GET_ALL_PROJECTS
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
 * Get all permissions
 * @returns List of permissions
 */
export async function getAllPermissions(): Promise<
  ApiSuccessResponse<PermissionsListResponse>
> {
  try {
    const { data } = await axiosInstance.get<
      ApiResponse<PermissionsListResponse>
    >(API_ROUTES.PROJECT_MAIN_USER.BASIC.GET_ALL_PERMISSIONS);

    return {
      message: data.message,
      data: data.data as any,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Add users to a project
 * @param payload - Add user to project payload
 * @returns Success message
 */
export async function addUserToProject(
  payload: AddUserToProjectPayload
): Promise<ApiSuccessResponse<{ message: string }>> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<{ message: string }>>(
      API_ROUTES.PROJECT_MAIN_USER.BASIC.ADD_USER_TO_PROJECT,
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
 * Get project details
 * @param projectId - Project ID
 * @param authToken - Admin Authentication Token
 * @returns Project details
 */
export async function getProjectDetails(
  projectId: string,
  authToken: string
): Promise<ApiSuccessResponse<ProjectDetailsResponse>> {
  try {
    const url = API_ROUTES.PROJECT_MAIN_USER.BASIC.GET_PROJECT_DETAILS.replace(
      "{{ProjectID}}",
      projectId
    );

    const { data } = await axiosInstance.get<
      ApiResponse<ProjectDetailsResponse>
    >(url, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return {
      message: data.message,
      data: data.data as any,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Get all users
 * @param authToken - Admin Authentication Token
 * @returns List of users
 */
export async function getAllUsers(
  authToken: string
): Promise<ApiSuccessResponse<UsersListResponse>> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<UsersListResponse>>(
      API_ROUTES.PROJECT_MAIN_USER.BASIC.GET_ALL_USERS,
      {
        headers: { Authorization: `Bearer ${authToken}` },
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
