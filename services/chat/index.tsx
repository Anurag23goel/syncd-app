import {
  ApiResponse,
  ApiSuccessResponse,
  CreateChatRoomPayload,
  SearchUserResponse,
  ChatRoomResponse,
} from "@/types/Apitypes";
import axiosInstance from "../index";
import { API_ROUTES } from "../routes.config";

/**
 * Create a new chat room
 * @param authToken - User authentication token
 * @param chatRoomData - Chat room creation payload
 * @returns ChatRoomResponse
 */
export async function createChatRoom(
  authToken: string,
  chatRoomData: CreateChatRoomPayload
): Promise<ApiSuccessResponse<ChatRoomResponse>> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<ChatRoomResponse>>(
      API_ROUTES.CHAT.CREATE_CHAT_ROOM,
      chatRoomData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`, // ✅ Sending auth token in header
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
 * Search for users
 * @param authToken - User authentication token
 * @param query - Search query (username or other criteria)
 * @returns List of users
 */
export async function searchUser(
  authToken: string,
  query: string
): Promise<ApiSuccessResponse<SearchUserResponse[]>> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<SearchUserResponse[]>>(
      API_ROUTES.CHAT.SEARCH_USER,
      {
        params: { query }, // ✅ Sending search query as query param
        headers: {
          Authorization: `Bearer ${authToken}`, // ✅ Sending auth token in header
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
