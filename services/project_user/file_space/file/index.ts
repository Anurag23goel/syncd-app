import { ApiResponse, ApiSuccessResponse } from "@/types/Apitypes";
import axiosInstance from "../../../index";
import API_ROUTES, { BASE_URL } from "@/services/routes.config";
import axios from "axios";

// Get Files by Folder
export async function getFilesByFolder(
  projectId: string,
  folderId: string,
  authToken: string
): Promise<ApiSuccessResponse<any>> {
  try {
    const url = `${API_ROUTES.PROJECT_MAIN_USER.FILESPACE.FILE.GET_FILES_BY_FOLDER}?ProjectID=${projectId}&FolderID=${folderId}`;

    const { data } = await axiosInstance.get<ApiResponse<any>>(url, {
      headers: { authToken },
    });

    return {
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    throw error;
  }
}

// Upload File to Folder
export async function uploadFileToFolder(
  projectId: string,
  folderId: string,
  files: File[], // or FileList
  authToken: string
): Promise<ApiSuccessResponse<any>> {
  try {
    const formData = new FormData();
    formData.append("ProjectID", projectId);
    formData.append("FolderID", folderId);

    files.forEach((file) => {
      formData.append("Files", file);
    });

    const { data } = await axiosInstance.post<ApiResponse<any>>(
      API_ROUTES.PROJECT_MAIN_USER.FILESPACE.FILE.UPLOAD_FILE_TO_FOLDER,
      formData,
      {
        headers: {
          authToken,
          "Content-Type": "multipart/form-data",
        },
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

// Delete File
export async function deleteFile(
  projectId: string,
  fileId: string,
  authToken: string
): Promise<ApiSuccessResponse<any>> {
  try {
    const { data } = await axiosInstance.delete<ApiResponse<any>>(
      API_ROUTES.PROJECT_MAIN_USER.FILESPACE.FILE.DELETE_FILE,
      {
        headers: { authToken },
        data: {
          ProjectID: projectId,
          FileID: fileId,
        },
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

export async function GET_FILES_OF_FOLDER(
  projectID: string,
  folderId: string,
  authToken: string
) {
  try {
    const response = await axios.get(
      BASE_URL +
        API_ROUTES.PROJECT_MAIN_USER.FILESPACE.FILE.GET_FILES_BY_FOLDER.replace("{{ProjectID}}",projectID).replace("{{FolderID}}", folderId),
      {
        headers: { authToken },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log("Error while fetching folders:", error.message);
    return error;
  }
}
