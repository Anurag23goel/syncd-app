import {
    ApiResponse,
    ApiSuccessResponse,
    CreateRenderPayload,
    UpdateRenderPayload,
    RenderComparisonResponse,
  } from "@/types/Apitypes";
  import axiosInstance from "../../index";
  import { API_ROUTES } from "../../routes.config";
  
  /**
   * Create a new render comparison
   * @param authToken - Admin authentication token
   * @param renderData - Render comparison creation payload
   * @returns RenderComparisonResponse
   */
  export async function createRenderComparison(
    authToken: string,
    renderData: CreateRenderPayload
  ): Promise<ApiSuccessResponse<RenderComparisonResponse>> {
    try {
      const formData = new FormData();
      formData.append("RenderImage", renderData.RenderImage);
      formData.append("RealImage", renderData.RealImage);
      formData.append("ProjectID", renderData.ProjectID);
  
      const { data } = await axiosInstance.post<ApiResponse<RenderComparisonResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.RENDER_COMPARISON.CREATE_RENDER,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // ✅ Sending auth token separately
            "Content-Type": "multipart/form-data", // ✅ Required for file upload
          },
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
   * Update a render comparison
   * @param authToken - Admin authentication token
   * @param updateData - Render comparison update payload
   * @returns Updated render comparison response
   */
  export async function updateRenderComparison(
    authToken: string,
    updateData: UpdateRenderPayload
  ): Promise<ApiSuccessResponse<RenderComparisonResponse>> {
    try {
      const formData = new FormData();
      formData.append("RenderImage", updateData.RenderImage);
      formData.append("RealImage", updateData.RealImage);
      formData.append("ProjectID", updateData.ProjectID);
      formData.append("ComparisonID", updateData.ComparisonID);
  
      const { data } = await axiosInstance.put<ApiResponse<RenderComparisonResponse>>(
        API_ROUTES.PROJECT_MAIN_USER.RENDER_COMPARISON.PUT_RENDER,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // ✅ Sending auth token separately
            "Content-Type": "multipart/form-data", // ✅ Required for file upload
          },
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
  