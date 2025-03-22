import {
  ApiResponse,
  ApiSuccessResponse,
  CreateChatRoomPayload,
  SearchUserResponse,
  ChatRoomResponse,
} from "@/types/Apitypes";
import axiosInstance from "../index";
import { API_ROUTES } from "../routes.config";

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
          authToken: authToken, // ✅ Sending auth token in header
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
export async function searchUser(
  authToken: string,
  query: string
): Promise<ApiSuccessResponse<SearchUserResponse[]>> {
  console.log(query);
  
  try {
    const { data } = await axiosInstance.get<ApiResponse<SearchUserResponse[]>>(
      API_ROUTES.CHAT.SEARCH_USER.replace("{{query}}", query),
      {
        params: { query }, // Sending search query as query param
        headers: {
          authToken: authToken, // Sending auth token in header
        },
      }
    );

    return {
      message: data.message,
      data: data as any,
    };
  } catch (error) {
    throw error;
  }
}

export async function fetchUserAllChats(
  authToken: string
): Promise<ApiSuccessResponse<ChatRoomResponse[]>> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<ChatRoomResponse[]>>(
      API_ROUTES.CHAT.FETCH_USER_ALL_CHATS,
      {
        headers: {
          authToken: authToken,
        },
      }
    );

    return {
      message: data.message,
      data: data as any,
    };
  } catch (error) {
    throw error;
  }
}

export async function fetchUserParticularChat(
  authToken: string
): Promise<ApiSuccessResponse<ChatRoomResponse[]>> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<ChatRoomResponse[]>>(
      API_ROUTES.CHAT.FETCH_CHAT_ROOM,
      {
        headers: {
          authToken: authToken,
        },
      }
    );

    return {
      message: data.message,
      data: data as any,
    };
  } catch (error) {
    throw error;
  }
}




