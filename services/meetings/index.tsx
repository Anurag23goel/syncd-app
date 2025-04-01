import {
  ApiResponse,
  ApiSuccessResponse,
  CreateMeetingPayload,
  UpdateMeetingPayload,
  MeetingResponse,
  MeetingsListResponse,
} from "@/types/Apitypes";
import axiosInstance from "../index";
import { API_ROUTES, BASE_URL } from "../routes.config";
import { MEETING_PAYLOAD } from "@/types/NewApiTypes";
import axios from "axios";

// export async function createMeeting(
//   authToken: string,
//   meetingData: CreateMeetingPayload
// ): Promise<ApiSuccessResponse<MeetingResponse>> {
//   try {
//     const { data } = await axiosInstance.post<ApiResponse<MeetingResponse>>(
//       API_ROUTES.MEETING.CREATE_MEETING,
//       meetingData,
//       {
//         headers: {
//           authToken: authToken, // ✅ Sending auth token in header
//         },
//       }
//     );

//     return {
//       message: data.message,
//       data: data.data as any,
//     };
//   } catch (error) {
//     throw error;
//   }
// }

export async function updateMeeting(
  authToken: string,
  meetingData: UpdateMeetingPayload
): Promise<ApiSuccessResponse<MeetingResponse>> {
  try {
    const { data } = await axiosInstance.put<ApiResponse<MeetingResponse>>(
      API_ROUTES.MEETING.UPDATE_MEETING,
      meetingData,
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

export async function getUserMeetings(
  authToken: string
): Promise<ApiSuccessResponse<MeetingsListResponse>> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<MeetingsListResponse>>(
      API_ROUTES.MEETING.GET_USER_MEETING,
      {
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

export async function deleteMeeting(
  authToken: string,
  meetingId: string
): Promise<ApiSuccessResponse<{ message: string }>> {
  try {
    const url = API_ROUTES.MEETING.DELETE_MEETING.replace(
      "{{meetingID}}",
      meetingId
    );

    const { data } = await axiosInstance.delete<
      ApiResponse<{ message: string }>
    >(url, {
      headers: {
        Authorization: `Bearer ${authToken}`, // ✅ Sending auth token in header
      },
    });

    return {
      message: data.message,
      data: data.data as any,
    };
  } catch (error) {
    throw error;
  }
}

export async function CREATE_MEETING(
  payload: MEETING_PAYLOAD,
  authToken: string
) {
  try {
    const response = await axios.post(
      API_ROUTES.MEETING.CREATE_MEETING,
      { payload },
      {
        headers: {
          authToken,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log("ERROR WHILE CREATING PROPERTY", error.message);
  }
}
