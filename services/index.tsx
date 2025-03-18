import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";
import { BASE_URL } from "./routes.config";
import { ApiResponse, ApiError } from "@/types/Apitypes";
import { useAuthStore } from "@/store/authStore";

// UUID generation function for request tracking
const generateRequestId = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

enum ErrorType {
  AUTH = "auth_error",
  NETWORK = "network_error",
  SERVER = "server_error",
  VALIDATION = "validation_error",
  TIMEOUT = "timeout_error",
  RATE_LIMIT = "rate_limit_error",
  UNKNOWN = "unknown_error",
}

interface CustomError extends Error {
  status?: number;
  code?: string;
  type: ErrorType;
  data?: any;
  isAxiosError: boolean;
  retryable: boolean;
}

const createCustomError = (
  message: string,
  status?: number,
  data?: any,
  type: ErrorType = ErrorType.UNKNOWN,
  code?: string,
  retryable: boolean = false
): CustomError => {
  const error = new Error(message) as CustomError;
  error.status = status;
  error.data = data;
  error.type = type;
  error.code = code;
  error.isAxiosError = true;
  error.retryable = retryable;
  return error;
};

const handleNetworkError = (error: AxiosError): CustomError => {
  if (error.code === "ECONNABORTED") {
    return createCustomError(
      "Request timed out - Please check your internet connection",
      undefined,
      undefined,
      ErrorType.TIMEOUT,
      "TIMEOUT",
      true
    );
  }

  if (!navigator.onLine) {
    return createCustomError(
      "No internet connection",
      undefined,
      undefined,
      ErrorType.NETWORK,
      "OFFLINE",
      true
    );
  }

  return createCustomError(
    "Network error - Please check your connection",
    undefined,
    undefined,
    ErrorType.NETWORK,
    "NETWORK_ERROR",
    true
  );
};

const handleError = (
  error: AxiosError<ApiResponse<ApiError>>
): Promise<never> => {
  if (!error) {
    return Promise.reject(
      createCustomError(
        "Unknown error occurred",
        undefined,
        undefined,
        ErrorType.UNKNOWN
      )
    );
  }

  if (error.response) {
    const customError: CustomError = createCustomError(
      "An error occurred",
      undefined,
      undefined,
      ErrorType.UNKNOWN,
      undefined,
      false
    );

    customError.status = error.response.status;
    customError.data = error.response.data;

    switch (error.response.status) {
      case 401:
        customError.message = "Unauthorized - Please login again";
        useAuthStore.getState().logout();
        break;
      case 403:
        customError.message = "Forbidden - You don't have permission";
        break;
      case 404:
        customError.message = "Resource not found";
        break;
      case 408:
        customError.message = "Request timeout - Please try again";
        break;
      case 422:
        customError.message = "Validation failed - Please check your input";
        break;
      case 429:
        customError.message = "Too many requests - Please try again later";
        break;
      case 500:
        customError.message = "Internal server error";
        break;
      case 502:
        customError.message = "Bad gateway";
        break;
      case 503:
        customError.message = "Service unavailable";
        break;
      case 504:
        customError.message = "Gateway timeout";
        break;
      default:
        customError.message =
          error.response.data?.message ||
          getDefaultMessageForStatus(error.response.status);
    }

    const errorType = getErrorTypeForStatus(error.response.status);
    const retryable = isRetryableStatus(error.response.status);

    return Promise.reject(
      createCustomError(
        customError.message,
        customError.status,
        customError.data,
        errorType,
        `HTTP_${customError.status}`,
        retryable
      )
    );
  }

  if (error.request) {
    return Promise.reject(handleNetworkError(error));
  }

  return Promise.reject(
    createCustomError(
      error.message || "Request configuration error",
      undefined,
      undefined,
      ErrorType.UNKNOWN,
      "CONFIG_ERROR"
    )
  );
};

const getDefaultMessageForStatus = (status: number): string => {
  const statusMessages: Record<number, string> = {
    400: "Bad Request - Invalid data",
    401: "Unauthorized - Please login again",
    403: "Forbidden - You don't have permission",
    404: "Resource not found",
    408: "Request timeout - Please try again",
    422: "Validation failed - Please check your input",
    429: "Too many requests - Please try again later",
    500: "Internal server error",
    502: "Bad gateway",
    503: "Service unavailable",
    504: "Gateway timeout",
  };

  return statusMessages[status] || "Something went wrong";
};

const getErrorTypeForStatus = (status: number): ErrorType => {
  if (status >= 400 && status < 500) {
    if (status === 401 || status === 403) {
      return ErrorType.AUTH;
    }
    if (status === 429) {
      return ErrorType.RATE_LIMIT;
    }
    if (status === 422) {
      return ErrorType.VALIDATION;
    }
    if (status === 408) {
      return ErrorType.TIMEOUT;
    }
    return ErrorType.VALIDATION;
  }

  return ErrorType.SERVER;
};

const isRetryableStatus = (status: number): boolean => {
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  return retryableStatuses.includes(status);
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Generate a request ID for tracing
    config.headers["X-Request-ID"] = generateRequestId();

    return config;
  },
  (error) => {
    return Promise.reject(
      createCustomError(
        "Request configuration error",
        undefined,
        undefined,
        ErrorType.UNKNOWN,
        "CONFIG_ERROR"
      )
    );
  }
);

axiosInstance.interceptors.response.use(
  <T,>(response: AxiosResponse<ApiResponse<T>>) => response,
  handleError
);

const apiClient = {
  async get<T>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.get<ApiResponse<T>>(url, config);
  },

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return axiosInstance.post<ApiResponse<T>>(url, data, config);
  },

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return axiosInstance.put<ApiResponse<T>>(url, data, config);
  },

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return axiosInstance.patch<ApiResponse<T>>(url, data, config);
  },

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.delete<ApiResponse<T>>(url, config);
  },
};

export { ErrorType, type CustomError };
export default apiClient;
