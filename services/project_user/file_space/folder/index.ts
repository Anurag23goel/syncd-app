import { ApiResponse, ApiSuccessResponse } from "@/types/Apitypes";
import axiosInstance from "../../../index";
import API_ROUTES, { BASE_URL } from "@/services/routes.config";
import axios from "axios";

// Create Folder
export async function createFolder(
  projectId: string,
  folderName: string,
  folderType: string,
  authToken: string
): Promise<ApiSuccessResponse<any>> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<any>>(
      API_ROUTES.PROJECT_MAIN_USER.FILESPACE.FOLDER.CREATE_FOLDER,
      {
        ProjectID: projectId,
        FolderName: folderName,
        FolderType: folderType,
      },
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

// Get All Folders by Project
export async function GET_ALL_FOLDERS_FOR_PROJECT(
  projectId: string,
  authToken: string
) {
  try {
    const response = await axios.get(
      BASE_URL +
        API_ROUTES.PROJECT_MAIN_USER.FILESPACE.FOLDER.GET_FOLDERS_BY_PROJECT.replace(
          "{{ProjectID}}",
          projectId
        ),
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

// Update Folder
export async function updateFolder(
  folderId: string,
  projectId: string,
  folderName: string,
  authToken: string
): Promise<ApiSuccessResponse<any>> {
  try {
    const { data } = await axiosInstance.put<ApiResponse<any>>(
      API_ROUTES.PROJECT_MAIN_USER.FILESPACE.FOLDER.UPDATE_FOLDER,
      {
        FolderID: folderId,
        ProjectID: projectId,
        FolderName: folderName,
      },
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

// Delete Folder
export async function deleteFolder(
  folderId: string,
  projectId: string,
  authToken: string
): Promise<ApiSuccessResponse<any>> {
  try {
    const { data } = await axiosInstance.delete<ApiResponse<any>>(
      API_ROUTES.PROJECT_MAIN_USER.FILESPACE.FOLDER.DELETE_FOLDER,
      {
        headers: { authToken },
        data: {
          FolderID: folderId,
          ProjectID: projectId,
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
