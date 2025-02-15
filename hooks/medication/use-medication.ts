import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Medication, MedicationForm } from "@/types/medication.types";
import { PaginationParams } from "@/types/pagination.types";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";

export function useMedication(clientId: Number, params?: PaginationParams) {
  const router = useRouter();


  const { enqueueSnackbar } = useSnackbar();
  const { start: startProgress, stop: stopProgress } = useProgressBar();

  const [page, setPage] = useState(params?.page || 1);
  const page_size = params?.page_size || 10;

  const {
    data: medications,
    error,
    isValidating,
    mutate,
  } = useSWR<PaginatedResponse<Medication>>(
    `${ApiRoutes.Client.Medical.Medications.ReadAll.replace(
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
  const isLoading = !medications && !error;


  const createOne = async (medication: MedicationForm, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<MedicationForm>(ApiRoutes.Client.Medical.Medications.CreateOne.replace("{id}", clientId.toString()), "POST", {}, medication);
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Medication created successful!", { variant: "success" });
      }
      router.push(`/clients/${clientId}/medical-record/medications`);
      mutate()
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Medication creationg failed", { variant: "error" });
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
      const { message, success, data, error } = await useApi<Medication>(ApiRoutes.Client.Medical.Medications.readOne.replace("{medication_id}", id).replace("{id}", clientId.toString()), "GET", {});
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Medication fetched successful!", { variant: "success" });
      }
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Medication fetching failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  }

  const updateOne = async (medication: MedicationForm, id: string, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<MedicationForm>(ApiRoutes.Client.Medical.Medications.readOne.replace("{medication_id}", id).replace("{id}", clientId.toString()), "PUT", {}, medication);
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Medication updated successful!", { variant: "success" });
      }
      router.push(`/clients/${clientId}/medical-record/medications`);
      mutate()
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Medication updating failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  }

  return {
    medications,
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
