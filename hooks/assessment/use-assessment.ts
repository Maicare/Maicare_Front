import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Id } from "@/common/types/types";
import { CreateAssessment } from "@/schemas/assessment.schema";
import {  Assessment, AssessmentResponse } from "@/types/assessment.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";

export function useAssessment({ autoFetch = true, clientId, page: pageParam = 1, page_size = 10 }: { autoFetch: boolean, clientId: Id, page?: number, page_size?: number }) {
  const [page, setPage] = useState(pageParam);
  const { enqueueSnackbar } = useSnackbar();
  const { start: startProgress, stop: stopProgress } = useProgressBar();

  const {
    data: assessments,
    error,
    isLoading,
    mutate,
  } = useSWR<PaginatedResponse<AssessmentResponse> | null>(
    autoFetch ? stringConstructor(ApiRoutes.Client.Assessment.ReadAll.replace("{id}", clientId.toString()), constructUrlSearchParams({ page, page_size })) : null, // Endpoint to fetch Assessments
    async (url) => {
      if (!url) return {
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
  const createOne = async(assessment: CreateAssessment[],clientId:Id, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      const body = assessment.map((i)=>({
        ...i,
        initial_level:parseInt(i.initial_level as unknown as string),
        maturity_matrix_id:parseInt(i.maturity_matrix_id as unknown as string),
      }))
        // Display progress bar
        if (displayProgress) startProgress();
        const { message, success, data, error } = await useApi<Assessment>(ApiRoutes.Client.Assessment.CreateOne.replace("{id}", clientId.toString()), "POST", {}, {assessment:body});
        if (!data)
            throw new Error(error || message || "An unknown error occurred");

        // Display success message
        if (displaySuccess && success) {
            enqueueSnackbar("Client Assessment created successful!", { variant: "success" });
        }
        mutate();
        return data;
    } catch (err: any) {
        enqueueSnackbar(err?.response?.data?.message || "Client Assessment creation failed", { variant: "error" });
        throw err;
    } finally {
        if (displayProgress) stopProgress();
    }
}
  const generateOne = async(assessment: {
    maturity_matrix_id: number;
    initial_level: number;
    target_level: number;
  }, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
        // Display progress bar
        if (displayProgress) startProgress();
        const { message, success, data, error } = await useApi<{
          care_plan_id: number;
          client_id: number;
        }>(ApiRoutes.Client.Assessment.GenerateOne.replace("{id}", clientId.toString()), "POST", {}, {...assessment});
        if (!data)
            throw new Error(error || message || "An unknown error occurred");

        // Display success message
        if (displaySuccess && success) {
            enqueueSnackbar("Client Assessment created successful!", { variant: "success" });
        }
        mutate();
        return data;
    } catch (err: any) {
        enqueueSnackbar(err?.response?.data?.message || "Client Assessment creation failed", { variant: "error" });
        throw err;
    } finally {
        if (displayProgress) stopProgress();
    }
}
  const readOne = async (id: Id, options?: ApiOptions) => {
    const { displayProgress = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<AssessmentResponse>(
        ApiRoutes.Client.Assessment.ReadOne.replace("{id}", clientId.toString()).replace("{mma_id}",id.toString()),
        "GET"
      );
      if (!response.data) {
        throw new Error("Assessment not found");
      }
      return response.data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to fetch client",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };
  return {
    assessments,
    error,
    isLoading,
    mutate,
    readOne,
    page,
    setPage,
    createOne,
    generateOne
  };
}
