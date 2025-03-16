import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import { useMutation } from "@/common/hooks/use-mutate";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { CreateLocationReqDto, Location } from "@/types/location.types";
import {  useSnackbar } from "notistack";
import useSWR from "swr";

export function useLocation() {
  const { enqueueSnackbar } = useSnackbar();
  const { start: startProgress, stop: stopProgress } = useProgressBar();
  const {
    data: locations,
    error,
    mutate,
  } = useSWR<Location[] | null>(
    ApiRoutes.Location.ReadAll, // Endpoint to fetch Locations
    async (url) => {
      const response = await api.get(url);
      if (!response.data.data) {
        return null;
      }
      return response.data.data; // Assuming API returns data inside a "data" field
    },
    { shouldRetryOnError: false }
  );

  const isLoading = !locations && !error;

  const { mutate: createLocation } = useMutation<Location>();
  const { mutate: updateLocation } = useMutation<Location>();
  const { mutate: deleteLocationMutation } = useMutation<Location>();

  const addLocation = async (newLocation: CreateLocationReqDto) => {
    const created = await createLocation(
      ApiRoutes.Location.CreateOne,
      "POST",
      newLocation
    );
    if (created) {
      mutate([...(locations || []), created], false);
      enqueueSnackbar("Location created successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Failed to create location", { variant: "error" });
    }
  };

  const modifyLocation = async (
    id: number,
    updatedLocation: CreateLocationReqDto
  ) => {
    const updated = await updateLocation(
      `${ApiRoutes.Location.UpdateOne}`.replace("{id}", id.toString()),
      "PUT",
      updatedLocation
    );
    if (updated) {
      mutate();
      enqueueSnackbar("Location updated successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Failed to update location", { variant: "error" });
    }
  };

  const deleteLocation = async (id: number) => {
    const deleted = await deleteLocationMutation(
      `${ApiRoutes.Location.DeleteOne}`.replace("{id}", id.toString()),
      "DELETE"
    );
    if (deleted) {
      mutate();
      enqueueSnackbar("Location deleted successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Failed to delete location", { variant: "error" });
    }
  };

  const getLocation = (id: number) => {
    return useSWR<Location>(
      `${ApiRoutes.Location.ReadOne}`.replace("{id}", id.toString()),
      async (url: string) => {
        const response = await api.get(url);
        return response.data.data;
      }
    );
  };

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

  return {
    locations,
    error,
    isLoading,
    getLocation,
    addLocation,
    modifyLocation,
    deleteLocation,
    readOne
  };
}
