import {
  ApiResponse,
  ApiSuccessResponse,
  AddUserToProjectPayload,
  ProjectDetailsResponse,
  PermissionsListResponse,
  UsersListResponse,
} from "@/types/Apitypes";
import axiosInstance from "../../index";
import { API_ROUTES } from "../../routes.config";

export async function getAllProjects(): Promise<
  ApiSuccessResponse<ProjectDetailsResponse[]>
> {
  try {
    const { data } = await axiosInstance.get<
      ApiResponse<ProjectDetailsResponse[]>
    >(API_ROUTES.PROJECT_MAIN_USER.BASIC.GET_ALL_PROJECTS);

    return {
      message: data.message,
      data: data.data as any,
    };
  } catch (error) {
    throw error;
  }
}

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

export async function getProjectDetails(
  projectId: string,
  authToken: string
): Promise<ApiSuccessResponse> {
  try {
    const url = API_ROUTES.PROJECT_MAIN_USER.BASIC.GET_PROJECT_DETAILS.replace(
      "{{ProjectID}}",
      projectId
    );

    const { data } = await axiosInstance.get<ApiResponse>(url, {
      headers: { authToken },
    });


    return {
      message: data.message,
      data: data.data as any,
    };
  } catch (error) {
    throw error;
  }
}

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
