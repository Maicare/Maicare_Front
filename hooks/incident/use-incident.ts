import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Id } from "@/common/types/types";
import { CreateIncident, Incident } from "@/types/incident.types";
import { PaginationParams } from "@/types/pagination.types";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";

export interface UseIncidentProps {
  clientId: Id;
  params?: PaginationParams;
}

export function useIncident({ clientId, params }: UseIncidentProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { start: startProgress, stop: stopProgress } = useProgressBar();
  const [page, setPage] = useState(params?.page || 1);
  const page_size = params?.page_size || 10;

  const {
    data: incidents,
    error,
    isValidating,
    mutate,
  } = useSWR<PaginatedResponse<Incident>>(
    `${ApiRoutes.Client.Incident.ReadAll.replace(
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
  const isLoading = !incidents && !error;

  const readOne = async (
    incident_id: Id,
    client_id: Id,
    options?: ApiOptions
  ) => {
    const { displayProgress = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<Incident>(
        ApiRoutes.Client.Incident.ReadOne.replace(
          "{id}",
          client_id.toString()
        ).replace("{incident_id}", incident_id.toString()),
        "GET"
      );
      if (!response.data) {
        throw new Error("Incident not found");
      }
      return response.data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to fetch Incident",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const createOne = async (
    incident: CreateIncident,
    client_id: Id,
    options?: ApiOptions
  ) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<CreateIncident>(
        ApiRoutes.Client.Incident.CreateOne.replace(
          "{id}",
          client_id.toString()
        ),
        "POST",
        {},
        incident
      );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Client Incident created successful!", {
          variant: "success",
        });
      }
      mutate();
      return data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Client Incident creationg failed",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const updateOne = async (
    incident: CreateIncident,
    incident_id: Id,
    client_id: Id,
    options?: ApiOptions
  ) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<CreateIncident>(
        ApiRoutes.Client.Incident.UpdateOne.replace(
          "{id}",
          client_id.toString()
        ).replace("{incident_id}", incident_id.toString()),
        "PUT",
        {},
        incident
      );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Client Incident created successful!", {
          variant: "success",
        });
      }
      mutate();
      return data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Client Incident creationg failed",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  return {
    incidents,
    error,
    isLoading,
    isFetching: isValidating,
    page,
    setPage,
    mutate,
    createOne,
    updateOne,
    readOne,
  };
}
