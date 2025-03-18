import {
  ApiResponse,
  ApiSuccessResponse,
  CreatePaymentPayload,
  UpdatePaymentPayload,
  DeletePaymentPayload,
  PaymentResponse,
  PaymentsListResponse,
} from "@/types/Apitypes";
import axiosInstance from "../../index";
import { API_ROUTES } from "../../routes.config";

/**
 * Create a new payment log
 * @param paymentData - Payment creation payload
 * @returns PaymentResponse
 */
export async function createPayment(
  paymentData: CreatePaymentPayload
): Promise<ApiSuccessResponse<PaymentResponse>> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<PaymentResponse>>(
      API_ROUTES.PROJECT_MAIN_USER.PAYMENT_LOGS.CREATE_PAYMENT,
      paymentData
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
 * Get all payment logs for a project
 * @param projectId - Project ID
 * @returns List of payment logs
 */
export async function getAllPaymentLogs(
  projectId: string
): Promise<ApiSuccessResponse<PaymentsListResponse>> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<PaymentsListResponse>>(
      API_ROUTES.PROJECT_MAIN_USER.PAYMENT_LOGS.GET_ALL_PAYMENT_LOGS,
      {
        params: { ProjectID: projectId }, // ✅ Now sending ProjectID via params instead of appending to the URL
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
 * Update a payment log
 * @param updateData - Payment update payload
 * @returns Updated payment response
 */
export async function updatePaymentLog(
  updateData: UpdatePaymentPayload
): Promise<ApiSuccessResponse<PaymentResponse>> {
  try {
    const { data } = await axiosInstance.put<ApiResponse<PaymentResponse>>(
      API_ROUTES.PROJECT_MAIN_USER.PAYMENT_LOGS.UPDATE_ALL_PAYMENT_LOGS,
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
 * Delete a payment log
 * @param deleteData - Payment deletion payload
 * @returns Success message
 */
export async function deletePayment(
  deleteData: DeletePaymentPayload
): Promise<ApiSuccessResponse<{ message: string }>> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<{ message: string }>>(
      API_ROUTES.PROJECT_MAIN_USER.PAYMENT_LOGS.DELETE_PAYMENT,
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
