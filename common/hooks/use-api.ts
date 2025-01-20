import { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../types/api.types";
import api from "../api/axios";


export const useApi = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  config: AxiosRequestConfig = {},
  body?: Record<string, unknown> | FormData // Optional body for POST, PUT, or PATCH
): Promise<ApiResponse<T>> => {
  try {
    const finalConfig: AxiosRequestConfig = {
      method,
      url,
      ...config,
    };

    // Add body to the request if applicable
    if (["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && body) {
      finalConfig.data = body;
    }

    const response = await api<ApiResponse<T>>(finalConfig);

    // Return structured response on success
    return {
      data: response.data.data,
      success: response.data.success,
      message: response.data.message,
      error: undefined,
    };
  } catch (error: any) {
    // Handle errors and return structured response
    return {
      data: undefined,
      success: false,
      message: error?.response?.data?.message || "An error occurred",
      error: error?.message || "Unknown error",
    };
  }
};
