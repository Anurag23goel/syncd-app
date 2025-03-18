import {
    ApiResponse,
    ApiSuccessResponse,
    CreateTaskPayload,
    CreateTeamTaskPayload,
    CreateSubTaskPayload,
    CreateTeamSubTaskPayload,
    ApproveTaskPayload,
    MarkTaskCompletePayload,
    TaskResponse,
    TasksListResponse,
  } from "@/types/Apitypes";
  import axiosInstance from "../index";
  import { API_ROUTES } from "../routes.config";
  
  /**
   * Create a new task
   * @param taskData - Task creation payload
   * @returns TaskResponse
   */
  export async function createTask(
    taskData: CreateTaskPayload
  ): Promise<ApiSuccessResponse<TaskResponse>> {
    try {
      const { data } = await axiosInstance.post<ApiResponse<TaskResponse>>(
        API_ROUTES.TASK.CREATE_TASK,
        taskData
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
   * Create a new team task
   * @param teamTaskData - Team task creation payload
   * @returns TaskResponse
   */
  export async function createTeamTask(
    teamTaskData: CreateTeamTaskPayload
  ): Promise<ApiSuccessResponse<TaskResponse>> {
    try {
      const { data } = await axiosInstance.post<ApiResponse<TaskResponse>>(
        API_ROUTES.TASK.CREATE_TEAM_TASK,
        teamTaskData
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
   * Create a new subtask
   * @param parentTaskId - Parent task ID (query param)
   * @param subTaskData - Subtask creation payload
   * @returns TaskResponse
   */
  export async function createSubTask(
    parentTaskId: string,
    subTaskData: CreateSubTaskPayload
  ): Promise<ApiSuccessResponse<TaskResponse>> {
    try {
      const { data } = await axiosInstance.post<ApiResponse<TaskResponse>>(
        API_ROUTES.TASK.CREATE_SUBTASK,
        subTaskData,
        {
          params: { ParentTaskID: parentTaskId }, // ✅ Sending ParentTaskID in query params
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
   * Create a new team subtask
   * @param parentTaskId - Parent task ID (query param)
   * @param teamSubTaskData - Team subtask creation payload
   * @returns TaskResponse
   */
  export async function createTeamSubTask(
    parentTaskId: string,
    teamSubTaskData: CreateTeamSubTaskPayload
  ): Promise<ApiSuccessResponse<TaskResponse>> {
    try {
      const { data } = await axiosInstance.post<ApiResponse<TaskResponse>>(
        API_ROUTES.TASK.CREATE_TEAM_SUBTASK,
        teamSubTaskData,
        {
          params: { ParentTaskID: parentTaskId }, // ✅ Sending ParentTaskID in query params
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
   * Get all tasks for a project
   * @param projectId - Project ID
   * @returns List of tasks
   */
  export async function getTasks(
    projectId: string
  ): Promise<ApiSuccessResponse<TasksListResponse>> {
    try {
      const { data } = await axiosInstance.get<ApiResponse<TasksListResponse>>(
        API_ROUTES.TASK.GET_TASK,
        {
          params: { ProjectID: projectId }, // ✅ Sending ProjectID in query params
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
   * Approve a task
   * @param approveData - Task approval payload
   * @returns Success message
   */
  export async function approveTask(
    approveData: ApproveTaskPayload
  ): Promise<ApiSuccessResponse<{ message: string }>> {
    try {
      const { data } = await axiosInstance.put<ApiResponse<{ message: string }>>(
        API_ROUTES.TASK.APPROVE_TASK,
        approveData
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
   * Mark a task as complete
   * @param completeData - Mark task complete payload
   * @returns Success message
   */
  export async function markTaskAsComplete(
    completeData: MarkTaskCompletePayload
  ): Promise<ApiSuccessResponse<{ message: string }>> {
    try {
      const { data } = await axiosInstance.put<ApiResponse<{ message: string }>>(
        API_ROUTES.TASK.MARK_AS_COMPLETE,
        completeData
      );
  
      return {
        message: data.message,
        data: data.data as any,
      };
    } catch (error) {
      throw error;
    }
  }
  