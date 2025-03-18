import {
    ApiResponse,
    ApiSuccessResponse,
    CreateRolePayload,
    AssignRolePayload,
    UpdateRolePayload,
    RoleResponse,
    RolesListResponse,
  } from "@/types/Apitypes";
  import axiosInstance from "../../index";
  import { API_ROUTES } from "../../routes.config";
  
  /**
   * Create a new role
   * @param roleData - Role creation payload
   * @returns RoleResponse
   */
  export async function createRole(
    roleData: CreateRolePayload
  ): Promise<ApiSuccessResponse<RoleResponse>> {
    try {
      const { data } = await axiosInstance.post<ApiResponse<RoleResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.ROLE.CREATE_ROLE,
        roleData
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
   * Get all roles for a project
   * @returns List of roles
   */
  export async function getAllRolesForProject(): Promise<ApiSuccessResponse<RolesListResponse>> {
    try {
      const { data } = await axiosInstance.get<ApiResponse<RolesListResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.ROLE.GET_ALL_ROLES_FOR_PROJECT
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
   * Assign a role to a user
   * @param roleAssignmentData - Assign role payload
   * @returns Success message
   */
  export async function assignRoleToUser(
    roleAssignmentData: AssignRolePayload
  ): Promise<ApiSuccessResponse> {
    try {
      const { data } = await axiosInstance.post<ApiResponse<ApiSuccessResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.ROLE.ADMIN_ASSIGN_ROLE_TO_USER,
        roleAssignmentData
      );
  
      return {
        message: data.message,
        data: data.data,
      };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update an existing role
   * @param updateData - Update role payload
   * @returns Updated role response
   */
  export async function updateRole(
    updateData: UpdateRolePayload
  ): Promise<ApiSuccessResponse<RoleResponse>> {
    try {
      const { data } = await axiosInstance.post<ApiResponse<RoleResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.ROLE.UPDATE_ROLE,
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
  