import { ApiResponse, ApiSuccessResponse } from "@/types/Apitypes";
import axiosInstance from "../../../index";
import API_ROUTES from "@/services/routes.config";


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
export async function getFoldersByProject(
  projectId: string,
  folderId: string,
  authToken: string
): Promise<ApiSuccessResponse<any>> {
  try {
    const url = `${API_ROUTES.PROJECT_MAIN_USER.FILESPACE.FOLDER.GET_FOLDERS_BY_PROJECT}?ProjectID=${projectId}&FolderID=${folderId}`;

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

