import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import {
  AutomaticReportItem,
  CreateAutomaticReport,
  CreateAutomaticReportResponse,
  ValidateAutomaticReport,
} from "@/types/automatic-report.types";
import { PaginationParams } from "@/types/pagination.types";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";

export function useAutomaticReport({
  clientId,
  params,
  autoFetch = true,
}: {
  autoFetch?: boolean;
  clientId: Number;
  params?: PaginationParams;
}) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { start: startProgress, stop: stopProgress } = useProgressBar();

  const [page, setPage] = useState(params?.page || 1);
  const page_size = params?.page_size || 8;

  const {
    data: automaticReports,
    error,
    isValidating,
    mutate,
  } = useSWR<PaginatedResponse<AutomaticReportItem>>(
    autoFetch
      ? `${ApiRoutes.AutomaticReport.ReadAll.replace(
          "{id}",
          clientId.toString()
        )}?page=${page}&page_size=${page_size}`
      : null,
    async (url) => {
      if (!url) {
        return null;
      }
      const response = await api.get(url);
      if (!response.data.data) {
        return null;
      }
      return response.data.data;
    },
    { shouldRetryOnError: false }
  );

  const isLoading = autoFetch && !automaticReports && !error;

  const generateOne = async (
    automaricReportDate: CreateAutomaticReport,
    options?: ApiOptions
  ) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } =
        await useApi<CreateAutomaticReportResponse>(
          ApiRoutes.AutomaticReport.GenerateOne.replace(
            "{id}",
            clientId.toString()
          ),
          "POST",
          {},
          automaricReportDate
        );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Automatic report generation successful!", {
          variant: "success",
        });
      }
      mutate();
      return data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Automatic report generation failed",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const validateOne = async (
    reportValidation: ValidateAutomaticReport,
    options?: ApiOptions
  ) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } =
        await useApi<ValidateAutomaticReport>(
          ApiRoutes.AutomaticReport.Validate.replace(
            "{id}",
            clientId.toString()
          ),
          "POST",
          {},
          reportValidation
        );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");
      mutate();
      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Automatic report created successful!", {
          variant: "success",
        });
      }
      mutate();
      return data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Automatic report creationg failed",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  return {
    automaticReports,
    error,
    isLoading,
    isFetching: isValidating,
    page,
    setPage,
    mutate,
    generateOne,
    validateOne,
  };
}
