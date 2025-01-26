import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Allergy } from "@/types/allergy.types";
import { PaginationParams } from "@/types/pagination.types";
import { useState } from "react";
import useSWR from "swr";

export function useAllergy(clientId: Number, params?: PaginationParams) {
  const [page, setPage] = useState(params?.page || 1);
  const page_size = params?.page_size || 10;

  const {
    data: allergies,
    error,
    isValidating,
    mutate,
  } = useSWR<PaginatedResponse<Allergy>>(
    `${ApiRoutes.Client.Medical.Allergies.ReadAll.replace(
      "{id}",
      clientId.toString()
    )}?page=${page}&page_size=${page_size}`,
    async (url) => {
      const response = await api.get(url);
      if (!response.data.data) {
        return null;
      }
      return response.data.data;
    },
    { shouldRetryOnError: false }
  );
  const isLoading = !allergies && !error;

  return {
    allergies,
    error,
    isLoading,
    isFetching: isValidating,
    page,
    setPage,
    mutate,
  };
}
