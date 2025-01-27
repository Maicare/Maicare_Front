import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Medication } from "@/types/medication.types";
import { PaginationParams } from "@/types/pagination.types";
import { useState } from "react";
import useSWR from "swr";

export function useMedication(clientId: Number, params?: PaginationParams) {
  const [page, setPage] = useState(params?.page || 1);
  const page_size = params?.page_size || 10;

  const {
    data: medications,
    error,
    isValidating,
    mutate,
  } = useSWR<PaginatedResponse<Medication>>(
    `${ApiRoutes.Client.Medical.Medications.ReadAll.replace(
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
  const isLoading = !medications && !error;

  return {
    medications,
    error,
    isLoading,
    isFetching: isValidating,
    page,
    setPage,
    mutate,
  };
}
