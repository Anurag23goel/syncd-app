import {
  ApiResponse,
  ApiSuccessResponse,
  AddInventoryPayload,
  UpdateInventoryPayload,
  DeleteInventoryPayload,
} from "@/types/Apitypes";
import axiosInstance from "../../index";
import { API_ROUTES } from "../../routes.config";

/**
 * Add a new inventory item
 * @param inventoryData - Inventory item payload
 * @returns InventoryResponse
 */
export async function addInventoryItem(
  inventoryData: AddInventoryPayload
): Promise<ApiSuccessResponse<InventoryResponse>> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<InventoryResponse>>(
      API_ROUTES.PROJECT_MAIN_USER.INVENTORY.ADD_INVENTORY_ITEM,
      inventoryData
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
 * Get all inventory items for a project
 * @param projectId - Project ID
 * @returns List of inventory items
 */
export async function getAllInventoryItems(
  projectId: string,
  authToken: string
): Promise<ApiSuccessResponse<any>> {
  try {
    const url =
      API_ROUTES.PROJECT_MAIN_USER.INVENTORY.GET_ALL_INVENTORY_ITEMS.replace(
        "{{ProjectID}}",
        projectId
      );

    const { data } = await axiosInstance.get<ApiResponse<any>>(url, {
      headers: { authToken },
    });

    return {
      message: data.message,
      data: data as any,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Update an inventory item
 * @param updateData - Inventory update payload
 * @returns Updated inventory response
 */
export async function updateInventoryItem(
  updateData: UpdateInventoryPayload
): Promise<ApiSuccessResponse<InventoryResponse>> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<InventoryResponse>>(
      API_ROUTES.PROJECT_MAIN_USER.INVENTORY.UPDATE_INVENTORY_ITEM,
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
 * Delete an inventory item
 * @param deleteData - Inventory deletion payload
 * @returns Success message
 */
export async function deleteInventoryItem(
  deleteData: DeleteInventoryPayload
): Promise<ApiSuccessResponse<{ message: string }>> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<{ message: string }>>(
      API_ROUTES.PROJECT_MAIN_USER.INVENTORY.DELETE_INVENTORY_ITEM,
      deleteData
    );

    return {
      message: data.message,
      data: data.data as any,
    };
  } catch (error) {
    throw error;
  }
}

export async function GET_INVENTORY_HISTORY_FOR_USER(
  inventoryID: string,
  authToken: string
): Promise<ApiSuccessResponse<{ message: string }>> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<{ message: string }>>(
      API_ROUTES.PROJECT_MAIN_USER.INVENTORY.GET_INVENTORY_HISTORY_FOR_USER.replace(
        "{{projectID}}",
        inventoryID
      ),
      {
        headers: {
          authToken,
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
