import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  ApiSuccessResponse,
  ApiSuccessWithData,
  ApiErrorResponse,
  RegisterUserPayload,
  VerifyOtpPayload,
  UserResponse,
} from "@/types/Apitypes";
import axiosInstance from "../index";
import { API_ROUTES } from "../routes.config";

// Login functionality
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    console.log(credentials);
    const response = await axiosInstance.post<ApiResponse<UserResponse>>(
      API_ROUTES.AUTH.LOGIN,
      credentials
    );

    const responseData = response.data;
    console.log(responseData);

    return {
      ...responseData.data,
      token: responseData.token || "",
    } as LoginResponse;
  } catch (error) {
    throw error;
  }
}

// Register new user
export async function register(
  userData: RegisterUserPayload
): Promise<ApiSuccessResponse<UserResponse>> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<UserResponse>>(
      API_ROUTES.AUTH.REGISTER,
      userData
    );

    return {
      message: data.message,
      data: data.data as any,
    };
  } catch (error) {
    throw error;
  }
}

// Verify OTP
export async function verifyOtp(
  verifyData: VerifyOtpPayload
): Promise<ApiSuccessResponse<void>> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<void>>(
      API_ROUTES.AUTH.VERIFY_OTP,
      verifyData
    );

    return {
      message: data.message,
    };
  } catch (error) {
    throw error;
  }
}

// Helper function to handle registration flow
export async function handleRegistration(
  userData: RegisterUserPayload
): Promise<ApiSuccessWithData<UserResponse> | ApiErrorResponse> {
  try {
    const registerResponse = await register(userData);
    return {
      success: true,
      message: registerResponse.message || "",
      data: registerResponse.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Registration failed",
    };
  }
}

// Helper function to handle OTP verification flow
export async function handleOtpVerification(
  verifyData: VerifyOtpPayload
): Promise<ApiSuccessResponse | ApiErrorResponse> {
  try {
    const verifyResponse = await verifyOtp(verifyData);
    return {
      success: true,
      message: verifyResponse.message,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "OTP verification failed",
    };
  }
}

export const verifyGoogleToken = async (
  googleToken: string
): Promise<UserResponse> => {
  try {
    const { data } = await axiosInstance.post<ApiResponse<UserResponse>>(
      API_ROUTES.AUTH.VERIFY_GOOGLE_TOKEN,
      {
        GoogleID: googleToken,
      }
    );
    return data.data as any;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Google authentication failed");
    }
    throw error;
  }
};

export async function editUserProfile(
  UserFullName: string,
  UserContact: string,
  authToken: string
): Promise<ApiSuccessResponse<any>> {
  try {
    const { data } = await axiosInstance.put<ApiResponse<any>>(
      API_ROUTES.AUTH.EDIT_PROFILE,
      {
        UserFullName,
        UserContact,
       
      },
      {
        headers: {
          authToken,
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

export async function forgotPassword(
  email: string
): Promise<ApiSuccessResponse<any>> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<any>>(
      API_ROUTES.AUTH.FORGOT_PASSWORD,
      { UserEmail: email }
    );

    return {
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    throw error;
  }
}

export async function verifyAndChangePassword(
  UserEmail: string,
  OtpCode: string,
  NewPassword: string
): Promise<ApiSuccessResponse<any>> {
  try {
    const { data } = await axiosInstance.put<ApiResponse<any>>(
      API_ROUTES.AUTH.VERIFY_AND_CHANGE_PASSWORD,
      {
        UserEmail,
        OtpCode,
        NewPassword,
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
