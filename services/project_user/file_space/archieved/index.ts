import { ApiResponse, ApiSuccessResponse } from "@/types/Apitypes";
import axiosInstance from "../../../index";
import API_ROUTES from "@/services/routes.config";

// Get Archived Files
export async function getArchivedFiles(
  authToken: string
): Promise<ApiSuccessResponse<any>> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<any>>(
      API_ROUTES.PROJECT_MAIN_USER.FILESPACE.ARCHIVE.GET_ARCHIVED_FILES,
      {
        headers: { authToken },
      }
    );

    return {
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    throw error;
  }
}
