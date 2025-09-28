import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Allergy, AllergyForm } from "@/types/allergy.types";
import { PaginationParams } from "@/types/pagination.types";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";
import { useLocalizedPath } from "../common/useLocalizedPath";

export function useAllergy(clientId: Number, params?: PaginationParams) {

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { start: startProgress, stop: stopProgress } = useProgressBar();
    const { currentLocale } = useLocalizedPath();

  const [page, setPage] = useState(params?.page || 1);
  const page_size = params?.page_size || 10;

  const {
    data: allergies,
    error,
    isValidating,
    mutate,
  } = useSWR<PaginatedResponse<Allergy>>(
    `${ApiRoutes.Client.Medical.Allergies.ReadAll.replace(
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
  const isLoading = !allergies && !error;

  const getAllergyTypes = async (options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<AllergyForm>(ApiRoutes.Client.Medical.Allergies.getAllergyTypes, "GET", {});
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Allergy created successful!", { variant: "success" });
      }
      router.push(`/${currentLocale}/clients/${clientId}/medical-record/allergies`);
      mutate()
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Allergy creationg failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  }

  const createOne = async (allergy: AllergyForm, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<AllergyForm>(ApiRoutes.Client.Medical.Allergies.CreateOne.replace("{id}", clientId.toString()), "POST", {}, allergy);
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Allergy created successful!", { variant: "success" });
      }
      router.push(`/${currentLocale}/clients/${clientId}/medical-record/allergies`);
      mutate()
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Allergy creationg failed", { variant: "error" });
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
      const { message, success, data, error } = await useApi<Allergy>(ApiRoutes.Client.Medical.Allergies.readOne.replace("{allergy_id}", id).replace("{id}", clientId.toString()), "GET", {});
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Allergy fetched successful!", { variant: "success" });
      }
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Allergy fetching failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  }

  const updateOne = async (allergy: AllergyForm, id: string, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<AllergyForm>(ApiRoutes.Client.Medical.Allergies.readOne.replace("{allergy_id}", id).replace("{id}", clientId.toString()), "PUT", {}, allergy);
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Allergy updated successful!", { variant: "success" });
      }
      router.push(`/${currentLocale}/clients/${clientId}/medical-record/allergies`);
      mutate()
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Allergy updating failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  }

  return {
    allergies,
    error,
    isLoading,
    isFetching: isValidating,
    page,
    setPage,
    mutate,
    createOne,
    readOne,
    updateOne,
    getAllergyTypes
  };
}
