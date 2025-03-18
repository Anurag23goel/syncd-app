import {
    ApiResponse,
    ApiSuccessResponse,
    CreateAttendancePayload,
    UpdateAttendancePayload,
    DeleteAttendancePayload,
    AttendanceResponse,
    AttendanceListResponse,
  } from "@/types/Apitypes";
  import axiosInstance from "../../index";
  import { API_ROUTES } from "../../routes.config";
  
  /**
   * Create an attendance record
   * @param attendanceData - Attendance creation payload
   * @returns AttendanceResponse
   */
  export async function createAttendance(
    attendanceData: CreateAttendancePayload
  ): Promise<ApiSuccessResponse<AttendanceResponse>> {
    try {
      const { data } = await axiosInstance.post<ApiResponse<AttendanceResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.ATTENDANCE.CREATE_ATTENDANCE,
        attendanceData
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
   * Get attendance records for a project within a date range
   * @param projectId - Project ID
   * @param startDate - Start Date (YYYY-MM-DD)
   * @param endDate - End Date (YYYY-MM-DD)
   * @returns List of attendance records
   */
  export async function getAttendanceByProject(
    projectId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiSuccessResponse<AttendanceListResponse>> {
    try {
      const { data } = await axiosInstance.get<ApiResponse<AttendanceListResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.ATTENDANCE.UPDATE_ATTENDANCE_BY_PROJECT,
        {
          params: { ProjectID: projectId, startDate, endDate }, // ✅ Sending as query params
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
   * Update an attendance record
   * @param updateData - Attendance update payload
   * @returns Updated attendance response
   */
  export async function updateAttendance(
    updateData: UpdateAttendancePayload
  ): Promise<ApiSuccessResponse<AttendanceResponse>> {
    try {
      const { data } = await axiosInstance.put<ApiResponse<AttendanceResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.ATTENDANCE.UPDATE_ATTENDANCE,
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
   * Delete an attendance record by project and attendance ID
   * @param projectId - Project ID
   * @param attendanceId - Attendance ID
   * @returns Success message
   */
  export async function deleteAttendanceByProject(
    projectId: string,
    attendanceId: string
  ): Promise<ApiSuccessResponse<{ message: string }>> {
    try {
      const { data } = await axiosInstance.delete<ApiResponse<{ message: string }>>(
        API_ROUTES.PROJECT_MAIN_USER.ATTENDANCE.DELETE_ATTENDANCE_BY_PROJECT,
        {
          params: { ProjectID: projectId, attendanceID: attendanceId }, // ✅ Sending as query params
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
  