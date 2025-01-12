import { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../types/api.types";
import api from "./axios";

export const fetcher = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  config: AxiosRequestConfig = {},
  body?: Record<string, unknown> // Optional body for POST, PUT, or PATCH
): Promise<T> => {
  const finalConfig: AxiosRequestConfig = {
    method,
    url,
    ...config,
  };

  // Add body to the request if it's provided
  if (["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && body) {
    finalConfig.data = body;
  }

  const response = await api<ApiResponse<T>>(finalConfig);

  // Check if the API response is successful
  if (!response.data.data) {
    throw new Error(response.data.message || "An unknown error occurred");
  }

  return response.data.data; // Extract the actual data
};
