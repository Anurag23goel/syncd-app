import {
  ApiResponse,
  ApiSuccessResponse,
  AddInventoryPayload,
  UpdateInventoryPayload,
  DeleteInventoryPayload,
  InventoryListResponse,
} from "@/types/Apitypes";
import axiosInstance from "../../index";
import { API_ROUTES } from "../../routes.config";
import {
  GET_ALL_INVENTORY_ITEMS_RESPONSE,
  INVENTORY_HISTORY,
  SINGLE_INVENTORY_ITEM,
} from "@/types/NewApiTypes";

/**
 * Add a new inventory item
 * @param inventoryData - Inventory item payload
 * @returns InventoryResponse
 */
export async function addInventoryItem(
  inventoryData: AddInventoryPayload
): Promise<ApiSuccessResponse> {
  try {
    const { data } = await axiosInstance.post<
      ApiResponse<SINGLE_INVENTORY_ITEM>
    >(API_ROUTES.PROJECT_MAIN_USER.INVENTORY.ADD_INVENTORY_ITEM, inventoryData);

    console.log(data);

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
export async function getAllResouceItems(
  projectId: string,
  authToken: string
): Promise<ApiSuccessResponse> {
  try {
    const url =
      API_ROUTES.PROJECT_MAIN_USER.INVENTORY.GET_ALL_INVENTORY_ITEMS.replace(
        "{{ProjectID}}",
        projectId
      );

    const { data } = await axiosInstance.get<
      ApiResponse<GET_ALL_INVENTORY_ITEMS_RESPONSE>
    >(url, {
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
): Promise<ApiSuccessResponse> {
  try {
    const { data } = await axiosInstance.post<ApiResponse>(
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
): Promise<ApiSuccessResponse> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<INVENTORY_HISTORY>>(
      API_ROUTES.PROJECT_MAIN_USER.INVENTORY.GET_INVENTORY_HISTORY_FOR_USER.replace(
        "{{inventoryID}}",
        inventoryID
      ),
      {
        headers: {
          authToken,
        },
      }
    );

    console.log(data);
    

    return {
      data: data as any,
    };
  } catch (error) {
    throw error;
  }
}
