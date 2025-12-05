"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { RequestLocationTransfer } from "@/schemas/clientNew.schema";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";

type LocationTransferResponse = {
    "approved_rejected_at": string,
    "approved_rejected_by": string,
    "client_id": string,
    "from_location_id": number,
    "id": number,
    "mentor_first_name": string,
    "mentor_last_name": string,
    "new_mentor_id": string,
    "reason": string,
    "request_date": string,
    "status": string,
    "to_location_id": number
}

export function useLocationTransfer({
    page: pageParam = 1,
    page_size = 10,
    autoFetch = true,
}: Partial<{ autoFetch?: boolean, page?: number, page_size?: number }>) {
    const [page, setPage] = useState(pageParam);
    const { enqueueSnackbar } = useSnackbar();
    const { start: startProgress, stop: stopProgress } = useProgressBar();
    const {
        data: requestTransfers,
        error,
        mutate,
    } = useSWR<PaginatedResponse<LocationTransferResponse> | null>(
        autoFetch ? stringConstructor(
            ApiRoutes.Client.LocationTransfer.ReadAll,
            constructUrlSearchParams({ page, page_size })
        ) : null, // Endpoint to fetch clients
        async (url) => {
            if (!url)
                return {
                    results: [],
                    count: 0,
                    page_size: 0,
                    next: null,
                    previous: null,
                };
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );
    const isLoading = !requestTransfers && !error;
const requestOne = async (data: RequestLocationTransfer, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<boolean>(
        ApiRoutes.Client.LocationTransfer.RequestOne,
        "POST",
        {},
        data
      );
      if (!response.success) {
        throw new Error("Failed to request transfer client location.");
      }
      if (displaySuccess && response.success) {
        enqueueSnackbar("Client transfer requested successful!", { variant: "success" });
      }
      return response.data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to request transfer client location.",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };
const approveOrRejectOne = async (data: {
  status: "approved" | "rejected",
  transfer_id: number
}, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<boolean>(
        ApiRoutes.Client.LocationTransfer.ApproveOrReject,
        "POST",
        {},
        data
      );
      if (!response.success) {
        throw new Error("Failed to validate transfer client location.");
      }
      if (displaySuccess && response.success) {
        enqueueSnackbar("Client transfer validated successfully!", { variant: "success" });
      }
      return response.data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to validate transfer client location.",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

 return {
    requestTransfers,
    error,
    isLoading,
    page,
    setPage,
    approveOrRejectOne,
    mutate,
    requestOne,
  };


}