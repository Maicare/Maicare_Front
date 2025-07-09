"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { useSnackbar } from "notistack";
import useSWR from "swr";
import { CreateRegistrationType } from "@/schemas/registration.schema";
import { Registration, RegistrationParamsFilters } from "@/types/registration.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { useState } from "react";
import { stringConstructor } from "@/utils/string-constructor";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { Id } from "@/common/types/types";
import { transformEmptyStringsToNull } from "@/utils/emptyStringtoNull";


export function useRegistration({
  autoFetch = true,
  page: pageParam = 1,
  page_size = 10, // Uncomment if you want to use page_size,
  status,
  risk_aggressive_behavior,
  risk_criminal_history,
  risk_day_night_rhythm,
  risk_flight_behavior,
  risk_psychiatric_issues,
  risk_sexual_behavior,
  risk_suicidal_selfharm,
  risk_substance_abuse,
  risk_weapon_possession,
}: RegistrationParamsFilters & { autoFetch?: boolean }) {
  const [page, setPage] = useState(pageParam);

  const { enqueueSnackbar } = useSnackbar();
  const { start: startProgress, stop: stopProgress } = useProgressBar();
  const {
    data: registrations,
    error,
    mutate,
  } = useSWR<PaginatedResponse<Registration> | null>(
    autoFetch ? stringConstructor(
      ApiRoutes.Registration.ReadAll,
      constructUrlSearchParams({
        status,
        page,
        page_size,
        risk_aggressive_behavior,
        risk_criminal_history,
        risk_day_night_rhythm,
        risk_flight_behavior,
        risk_psychiatric_issues,
        risk_sexual_behavior,
        risk_suicidal_selfharm,
        risk_substance_abuse,
        risk_weapon_possession,
      })
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
  const isLoading = !registrations && !error;

  const readOne = async (id: number, options?: ApiOptions) => {
    const { displayProgress = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<Registration>(
        ApiRoutes.Registration.ReadOne.replace("{id}", id.toString()),
        "GET"
      );
      if (!response.data) {
        throw new Error("Registration not found");
      }
      return response.data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to fetch registration",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const createOne = async (data: CreateRegistrationType, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();

      // Transform empty strings to null in the object
      const transformedData = transformEmptyStringsToNull(data);

      const response = await useApi<Registration>(
        ApiRoutes.Registration.CreateOne,
        "POST",
        {},
        transformedData
      );
      if (!response.data) {
        throw new Error("Failed to create registration");
      }
      if (displaySuccess && response.success) {
        enqueueSnackbar("Registration created successful!", { variant: "success" });
      }
      mutate()
      return response.data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to create registration",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };
  
  
  const updateStatus = async (id:Id,status: "approved"|"rejected",date:string="", options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<Registration>(
        ApiRoutes.Registration.UpdateStatus.replace("{id}", id.toString())+"?status="+status+"&intake_appointment_date="+date,
        "POST",
        {},
        {}
      );
      if (!response.data) {
        throw new Error("Failed to "+status+" registration");
      }
      if (displaySuccess && response.success) {
        enqueueSnackbar("Registration "+status+" successful!", { variant: "success" });
      }
      mutate()
      return response.data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message ||"Failed to "+status+" registration",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

    const updateOne = async (id: Id, data: CreateRegistrationType, options?: ApiOptions) => {
      const { displayProgress = false, displaySuccess = false } = options || {};
      try {
        if (displayProgress) startProgress();
        const response = await useApi<Registration>(
          ApiRoutes.Registration.UpdateOne.replace("{id}", id.toString()),
          "PUT",
          {},
          data
        );
        if (!response.data) {
          throw new Error("Failed to update registration");
        }
        if (displaySuccess && response.success) {
          enqueueSnackbar("Registration updated successful!", { variant: "success" });
        }
        mutate();
        return response.data;
      } catch (err: any) {
        enqueueSnackbar(
          err?.response?.data?.message || "Failed to update registration",
          { variant: "error" }
        );
        throw err;
      } finally {
        if (displayProgress) stopProgress();
      }
    };

  return {
    registrations,
    error,
    isLoading,
    readOne,
    createOne,
    updateOne,
    page,
    setPage,
    updateStatus,
  };
}
