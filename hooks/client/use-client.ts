"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Id } from "@/common/types/types";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";
import {
  Client,
  ClientsSearchParams,
  ClientStatusHistoryItem,
  CreateClientInput,
} from "@/types/client.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { DepartureEntries } from "@/types/contracts.types";

export function useClient({
  search,
  status,
  location_id,
  page: pageParam = 1,
  page_size = 10,
  autoFetch = true,
}: Partial<ClientsSearchParams & { autoFetch?: boolean }>) {
  const [page, setPage] = useState(pageParam);
  const { enqueueSnackbar } = useSnackbar();
  const { start: startProgress, stop: stopProgress } = useProgressBar();
  const {
    data: clients,
    error,
    mutate,
  } = useSWR<PaginatedResponse<Client> | null>(
    stringConstructor(
      ApiRoutes.Client.ReadAll,
      constructUrlSearchParams({ search, status, location_id, page, page_size })
    ), // Endpoint to fetch clients
    async (url) => {
      if (!autoFetch)
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
  const isLoading = !clients && !error;

  const readOne = async (id: Id, options?: ApiOptions) => {
    const { displayProgress = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<Client>(
        ApiRoutes.Client.ReadOne.replace("{id}", id.toString()),
        "GET"
      );
      if (!response.data) {
        throw new Error("Client not found");
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

  const createOne = async (data: CreateClientInput, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<Client>(
        ApiRoutes.Client.CreateOne,
        "POST",
        {},
        data
      );
      if (!response.data) {
        throw new Error("Failed to create client");
      }
      if (displaySuccess && response.success) {
        enqueueSnackbar("Client created successful!", { variant: "success" });
      }
      return response.data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to create client",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const updateStatus = async (id: string, data: DepartureEntries, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<Client>(
        ApiRoutes.Client.Status.replace("{id}", id),
        "PUT",
        {},
        data
      );
      if (!response.data) {
        throw new Error("Status update failed");
      }
      if (displaySuccess && response.success) {
        enqueueSnackbar("Status update successful!", { variant: "success" });
      }
      return response.data;
    } catch (err: any) {
      enqueueSnackbar("Failed to update Status ", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const updateClientPicture = async (
    id: number,
    attachement_id: string,
    options?: ApiOptions
  ) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<Client>(
        ApiRoutes.Client.UpdateProfilePicture.replace("{id}", id.toString()),
        "PUT",
        {},
        { attachement_id }
      ); //TODO: add correct type later
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Employee Deleted successful!", { variant: "success" });
      }
      mutate();
      return data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Employee Deletion failed",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const readClientRelatedEmails = async (id: Id) => {
    try {
      const response = await useApi<any>(
        ApiRoutes.Client.RelatedEmails.ReadAll.replace("{id}", id.toString()),
        "GET"
      );
      if (!response.data) {
        throw new Error("Client not found");
      }
      return response.data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to fetch client",
        { variant: "error" }
      );
      throw err;
    }
  };

  const getStatusHistory = async (id: string, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<ClientStatusHistoryItem[]>(
        ApiRoutes.Client.StatusHistory.replace("{id}", id),
        "GET",
        {}
      );
      return response.data;
    } catch (err: any) {
      enqueueSnackbar("Failed to get Status history ", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  //TODO: Add logic to CRUD user role
  return {
    clients,
    error,
    isLoading,
    page,
    setPage,
    readOne,
    createOne,
    updateClientPicture,
    readClientRelatedEmails,
    updateStatus,
    getStatusHistory
  };
}
