import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { CreateLocation, Location } from "@/schemas/location.schema";
import {  useSnackbar } from "notistack";
import useSWR from "swr";

export function useLocation({autoFetch=false}:{autoFetch?:boolean}) {
  const { enqueueSnackbar } = useSnackbar();
  
  const { start: startProgress, stop: stopProgress } = useProgressBar();
  const {
    data: locations,
    error,
    mutate,
  } = useSWR<Location[] | null>(
    autoFetch ? ApiRoutes.Location.ReadAll : null, // Endpoint to fetch Locations
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

  const isLoading = !locations && !error;

  
  const readOne = async (id: number, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } =
        await useApi<Location>(
          ApiRoutes.Location.ReadOne.replace("{id}", id.toString()),
          "GET",
          {}
        );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Loaction Details fetched successful!", {
          variant: "success",
        });
      }
      return data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Loaction Details fetching failed",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

    const createOne = async (location: CreateLocation, options?: ApiOptions) => {
      const { displayProgress = false, displaySuccess = false } = options || {};
      try {
        if (displayProgress) startProgress();
        const { message, success, data, error } = await useApi<Location>(ApiRoutes.Location.CreateOne, "POST", {}, {...location});
        if (!data)
          throw new Error(error || message || "An unknown error occurred");
  
        // Display success message
        if (displaySuccess && success) {
          enqueueSnackbar("Location created successful!", { variant: "success" });
        }
        mutate()
        return data;
      } catch (err: any) {
        enqueueSnackbar(err?.response?.data?.message || "Location creationg failed", { variant: "error" });
        throw err;
      } finally {
        if (displayProgress) stopProgress();
      }
    }
    const createOneForOrganisation = async (location: CreateLocation, organisationId: string, options?: ApiOptions) => {
      const { displayProgress = false, displaySuccess = false } = options || {};
      try {
        if (displayProgress) startProgress();
        const { message, success, data, error } = await useApi<Location>(ApiRoutes.Location.CreateOneForOrganisation.replace("{organisationId}", organisationId), "POST", {}, {...location});
        if (!data)
          throw new Error(error || message || "An unknown error occurred");
  
        // Display success message
        if (displaySuccess && success) {
          enqueueSnackbar("Location created successful!", { variant: "success" });
        }
        mutate()
        return data;
      } catch (err: any) {
        enqueueSnackbar(err?.response?.data?.message || "Location creationg failed", { variant: "error" });
        throw err;
      } finally {
        if (displayProgress) stopProgress();
      }
    }

    const readAllForOrganisation = async (organisationId: string, options?: ApiOptions) => {
      const { displayProgress = false, displaySuccess = false } = options || {};
      try {
        // Display progress bar
        if (displayProgress) startProgress();
        const { message, success, data, error } =
          await useApi<Location[]>(
            ApiRoutes.Location.ReadAllForOrganisation.replace("{organisationId}", organisationId),
            "GET",
            {}
          );
        if (!data)
          throw new Error(error || message || "An unknown error occurred");
  
        // Display success message
        if (displaySuccess && success) {
          enqueueSnackbar("Loaction Details fetched successful!", {
            variant: "success",
          });
        }
        return data;
      } catch (err: any) {
        enqueueSnackbar(
          err?.response?.data?.message || "Loaction Details fetching failed",
          { variant: "error" }
        );
        throw err;
      } finally {
        if (displayProgress) stopProgress();
      }
    };

    const updateOne = async (location: CreateLocation,id:string, options?: ApiOptions) => {
      const { displayProgress = false, displaySuccess = false } = options || {};
      try {
        if (displayProgress) startProgress();
        const { message, success, data, error } = await useApi<Location>(ApiRoutes.Location.UpdateOne.replace("{id}", id), "PUT", {}, {...location});
        if (!data)
          throw new Error(error || message || "An unknown error occurred");
  
        // Display success message
        if (displaySuccess && success) {
          enqueueSnackbar("Location updated successful!", { variant: "success" });
        }
        mutate()
        return data;
      } catch (err: any) {
        enqueueSnackbar(err?.response?.data?.message || "Location updating failed", { variant: "error" });
        throw err;
      } finally {
        if (displayProgress) stopProgress();
      }
    }

  return {
    locations,
    error,
    isLoading,
    readOne,
    createOne,
    updateOne,
    createOneForOrganisation,
    readAllForOrganisation
  };
}
