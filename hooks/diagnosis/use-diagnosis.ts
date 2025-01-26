import api from "@/common/api/axios";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { useState } from "react";
import useSWR from "swr";
import { Diagnosis } from "@/types/diagnosis.types";
import { PaginationParams } from "@/types/pagination.types";

export function useDiagnosis(clientId?: Number, params?: PaginationParams) {
  const [page, setPage] = useState(params?.page || 1);
  const page_size = params?.page_size || 10;

  const {
    data: diagnosis,
    isValidating,
    error,
    mutate,
  } = useSWR<PaginatedResponse<Diagnosis>>(
    `client/diagnosis_list/${clientId}?page=${page}&page_size=${page_size}&ordering=-date_of_diagnosis`,
    async (url) => {
      const response = await api.get(url);
      if (!response.data.data) {
        return null;
      }
      return response.data.data;
    },
    { shouldRetryOnError: false }
  );
  const isLoading = !diagnosis && !error;

  return {
    diagnosis,
    error,
    isLoading,
    isFetching: isValidating,
    page,
    setPage,
    mutate,
  };
}
