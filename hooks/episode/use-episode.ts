import api from "@/common/api/axios";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Episode } from "@/types/episode.types";
import { PaginationParams } from "@/types/pagination.types";
import { useState } from "react";
import useSWR from "swr";

export function useEpisode(clientId?: Number, params?: PaginationParams) {
  const [page, setPage] = useState(params?.page || 1);
  const page_size = params?.page_size || 10;

  const {
    data: episodes,
    isValidating,
    error,
    mutate,
  } = useSWR<PaginatedResponse<Episode>>(
    `client/emotionalstate_list/${clientId}?page=${page}&page_size=${page_size}`,
    async (url) => {
      const response = await api.get(url);
      if (!response.data.data) {
        return null;
      }
      return response.data.data;
    },
    { shouldRetryOnError: false }
  );
  const isLoading = !episodes && !error;

  return {
    episodes,
    error,
    isLoading,
    isFetching: isValidating,
    page,
    setPage,
    mutate,
  };
}
