import api from "@/common/api/axios";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { useState } from "react";
import useSWR from "swr";
import { Diagnosis, DiagnosisForm } from "@/types/diagnosis.types";
import { PaginationParams } from "@/types/pagination.types";
import ApiRoutes from "@/common/api/routes";
import { ApiOptions } from "@/common/types/api.types";
import { useSnackbar } from "notistack";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { useApi } from "@/common/hooks/use-api";
import { useRouter } from "next/navigation";
import { CreateDiagnosis } from "@/schemas/diagnosis.schema";

export function useDiagnosis({clientId, params,autoFetch=false}:{ clientId: number, params?: PaginationParams,autoFetch?: boolean }) {

  const router = useRouter();


  const { enqueueSnackbar } = useSnackbar();
  const { start: startProgress, stop: stopProgress } = useProgressBar();

  const [page, setPage] = useState(params?.page || 1);
  const page_size = params?.page_size || 10;

  const {
    data: diagnosis,
    isValidating,
    error,
    mutate,
  } = useSWR<PaginatedResponse<Diagnosis>>(
    autoFetch ? `${ApiRoutes.Client.Medical.Diagnosis.ReadAll.replace(
      "{id}",
      clientId.toString()
    )}?page=${page}&page_size=${page_size}&ordering=-date_of_diagnosis` : null,
    async (url) => {
      if (!url) return null;
      const response = await api.get(url);
      if (!response.data.data) {
        return null;
      }
      return response.data.data;
    },
    { shouldRetryOnError: false }
  );
  const isLoading = !diagnosis && !error;

  const createOne = async (diagnosis: CreateDiagnosis, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      const medications = diagnosis.medications.map((medication) => ({
        ...medication,
        administered_by_id: parseInt(medication.administered_by_id),
      }));
      const body = {
        ...diagnosis,
        medications,
        };
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<Diagnosis>(ApiRoutes.Client.Medical.Diagnosis.CreateOne.replace("{id}", clientId.toString()), "POST", {}, body);
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Diagnosis created successful!", { variant: "success" });
      }
      mutate()
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Diagnosis creationg failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  }

  const readOne = async (id: string, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<Diagnosis>(ApiRoutes.Client.Medical.Diagnosis.readOne.replace("{diagnosis_id}", id).replace("{id}", clientId.toString()), "GET", {});
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Diagnosis fetched successful!", { variant: "success" });
      }
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Diagnosis fetching failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  }

  const updateOne = async (diagnosis: CreateDiagnosis, id: string, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const medications = diagnosis.medications.map((medication) => ({
        ...medication,
        administered_by_id: parseInt(medication.administered_by_id),
      }));
      const body = {
        ...diagnosis,
        medications,
        };
      const { message, success, data, error } = await useApi<Diagnosis>(ApiRoutes.Client.Medical.Diagnosis.readOne.replace("{diagnosis_id}", id).replace("{id}", clientId.toString()), "PUT", {}, body);
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Diagnosis updated successful!", { variant: "success" });
      }
      mutate()
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Diagnosis updating failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  }

  return {
    diagnosis,
    error,
    isLoading,
    isFetching: isValidating,
    page,
    setPage,
    mutate,
    createOne,
    readOne,
    updateOne
  };
}
