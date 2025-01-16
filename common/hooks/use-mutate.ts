import { ApiResponse } from "@/common/types/api.types";
import api from "@/common/api/axios";
import { validateSchema } from "@/utils/validate";
import { useState } from "react";
import * as yup from "yup";

export function useMutation<T>() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (
    url: string,
    method: "POST" | "PUT" | "DELETE",
    body?: unknown,
    schema?: yup.Schema
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      if (schema && body) {
        // Validate the body against the schema
        await validateSchema(schema, body);
      }
      const response = await api.request<ApiResponse<T>>({
        url,
        method,
        data: body,
      });

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "An unknown error occurred");
      }

      setData(response.data.data);
      return response.data.data;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    data,
    error,
    mutate,
  };
}
