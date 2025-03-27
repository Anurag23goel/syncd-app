import {
  ApiResponse,
  ApiSuccessResponse,
  CreateChatRoomPayload,
  SearchUserResponse,
  HomeScreenChatResponse,
  ParticularChatResponse,
} from "@/types/Apitypes";
import axiosInstance from "../index";
import { API_ROUTES } from "../routes.config";
import {
  NEW_CHAT_RESPONSE_TYPE,
  PARTICULAR_CHAT_WITH_USER_RESPONSE_TYPE,
} from "@/types/NewApiTypes";

export async function createChatRoom(
  authToken: string,
  chatRoomData: CreateChatRoomPayload
): Promise<ApiSuccessResponse<any>> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<any>>(
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
): Promise<ApiSuccessResponse> {
  console.log(authToken);

  try {
    const { data } = await axiosInstance.get<
      ApiResponse<NEW_CHAT_RESPONSE_TYPE>
    >(API_ROUTES.CHAT.FETCH_USER_ALL_CHATS, {
      headers: {
        authToken,
      },
    });

    return {
      message: data.message,
      data: data as any,
    };
  } catch (error) {
    throw error;
  }
}

export async function fetchMessagesForParticularChat(
  authToken: string,
  chatRoomId: string
): Promise<ApiSuccessResponse> {
  try {
    const { data } =
      await axiosInstance.get<PARTICULAR_CHAT_WITH_USER_RESPONSE_TYPE>(
        API_ROUTES.CHAT.FETCH_CHAT_MESSAGES_WITH_PARTICULAR_USER.replace(
          "{{chatroomID}}",
          chatRoomId
        ),
        {
          headers: {
            authToken: authToken,
          },
        }
      );

    // console.log(data);

    return {
      success: data.success,
      data: data as any,
    };
  } catch (error) {
    throw error;
  }
}
