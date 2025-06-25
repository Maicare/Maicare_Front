"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { Id } from "@/common/types/types";
import { useSnackbar } from "notistack";
import useSWR from "swr";
import { CreateShift, Shift } from "@/schemas/shift.schema";

export function useShift({
  location_id,
  autoFetch = true,
}: { location_id:number,autoFetch?: boolean }) {
  const { enqueueSnackbar } = useSnackbar();
  const { start: startProgress, stop: stopProgress } = useProgressBar();
  const {
    data: shifts,
    error,
    mutate,
  } = useSWR<Shift[] | null>(
    autoFetch ? ApiRoutes.Location.Shift.ReadAll.replace("{id}",location_id.toString()) : null, // Endpoint to fetch clients
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
  const isLoading = !shifts && !error;

  const readOne = async (id:number, options?: ApiOptions) => {
    const { displayProgress = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<Shift>(
        ApiRoutes.Location.Shift.ReadOne.replace("{id}", location_id.toString()).replace("{shiftId}", id.toString()),
        "GET"
      );
      if (!response.data) {
        throw new Error("Shift not found");
      }
      return response.data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to fetch shift",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const createOne = async (data: CreateShift, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<Shift>(
        ApiRoutes.Location.Shift.CreateOne.replace("{id}", location_id.toString()),
        "POST",
        {},
        data
      );
      if (!response.data) {
        throw new Error("Failed to create shift");
      }
      if (displaySuccess && response.success) {
        enqueueSnackbar("Shift created successful!", { variant: "success" });
      }
      mutate()
      return response.data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to create shift",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const updateOne = async (id: Id, data: CreateShift, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<Shift>(
        ApiRoutes.Location.Shift.UpdateOne.replace("{id}", location_id.toString()).replace("{shiftId}", id.toString()),
        "PUT",
        {},
        data
      );
      if (!response.data) {
        throw new Error("Failed to update shift");
      }
      if (displaySuccess && response.success) {
        enqueueSnackbar("Shift updated successful!", { variant: "success" });
      }
      mutate();
      return response.data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to update shift",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  return {
    shifts,
    error,
    isLoading,
    readOne,
    createOne,
    updateOne
  };
}
