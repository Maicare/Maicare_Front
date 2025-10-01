import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { Id } from "@/common/types/types";
import { CreateOrganisation, } from "@/schemas/organisation.schema";
import { Organization } from "@/types/organisation";
import { useSnackbar } from "notistack";
import useSWR from "swr";

export function useOrganisation({ autoFetch = false }: { autoFetch?: boolean }) {
  const { enqueueSnackbar } = useSnackbar();

  const { start: startProgress, stop: stopProgress } = useProgressBar();
  const {
    data: organisations,
    error,
    mutate,
  } = useSWR<Organization[] | null>(
    autoFetch ? ApiRoutes.Organisation.ReadAll : null, // Endpoint to fetch Organisations
    async (url) => {
      if (!url) {
        return null;
      }
      const response = await api.get(url);
      if (!response.data.data) {
        return null;
      }
      return response.data.data; // Assuming API returns data inside a "data" field
    },
    { shouldRetryOnError: false }
  );

  const isLoading = !organisations && !error;


  const readOne = async (id: number, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } =
        await useApi<Organization>(
          ApiRoutes.Organisation.ReadOne.replace("{id}", id.toString()),
          "GET",
          {}
        );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Organization Details fetched successful!", {
          variant: "success",
        });
      }
      return data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Organization Details fetching failed",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };
  const readCount = async (id: number, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } =
        await useApi<{
          "client_count": number,
          "employee_count": number,
          "location_count": number,
          "organisation_id": Id,
          "organisation_name": string
        }>(
          ApiRoutes.Organisation.ReadCount.replace("{id}", id.toString()),
          "GET",
          {}
        );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Organization Details fetched successful!", {
          variant: "success",
        });
      }
      return data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Organization Details fetching failed",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const createOne = async (organisation: CreateOrganisation, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<Organization>(ApiRoutes.Organisation.CreateOne, "POST", {}, { ...organisation });
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Organisation created successful!", { variant: "success" });
      }
      mutate()
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Organisation creationg failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  }
  const updateOne = async (organisation: CreateOrganisation, id: string, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<Organization>(ApiRoutes.Organisation.UpdateOne.replace("{id}", id), "PUT", {}, { ...organisation });
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Organisation updated successful!", { variant: "success" });
      }
      mutate()
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Organisation updating failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  }

  return {
    organisations,
    error,
    isLoading,
    readOne,
    createOne,
    updateOne,
    readCount
  };
}
