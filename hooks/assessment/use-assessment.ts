import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Id } from "@/common/types/types";
import { Assessment, AssessmentResponse } from "@/types/assessment.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { useState } from "react";
import useSWR from "swr";

export function useAssessment({ autoFetch = true,clientId, page:pageParam = 1, page_size = 10 } : {autoFetch:boolean,clientId:Id, page:number, page_size:number}) {	
      const [page, setPage] = useState(pageParam);
  
  const {
    data: assessments,
    error,
    isLoading,
    mutate,
  } = useSWR<PaginatedResponse<AssessmentResponse> | null>(
    stringConstructor(ApiRoutes.Client.Assessment.ReadAll.replace("{id}",clientId.toString()), constructUrlSearchParams({page,page_size})), // Endpoint to fetch Assessments
    async (url) => {
        if (!autoFetch) return {
          results: [],
          count: 0,
          page_size: 0,
          next: null,
          previous: null
      };
        const response = await api.get(url);
        if (!response.data.data) {
            return null;
        }
        return response.data.data; // Assuming API returns data inside a "data" field
    },
    { shouldRetryOnError: false }
  );


  return {
    assessments,
    error,
    isLoading,
    mutate
  };
}
