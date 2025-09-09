import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import {  useSnackbar } from "notistack";
import useSWR from "swr";
type Notification = {
    created_at: string,
    data: any,
    is_read: boolean,
    message: string,
    notification_id: string,
    type: string
}
export function useNotifications({autoFetch=false}:{autoFetch?:boolean}) {
  const { enqueueSnackbar } = useSnackbar();
  
  const { start: startProgress, stop: stopProgress } = useProgressBar();
  const {
    data: notifications,
    error,
    mutate,
  } = useSWR<Notification[] | null>(
    autoFetch ? ApiRoutes.Notifications.ReadAll+"?page_size=10&page=1" : null, // Endpoint to fetch Notifications
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

  const isLoading = !notifications && !error;

  const markAsRead = async (id: string) => {
    try {
      startProgress();
      const { message, success, data, error } =
        await useApi<Notification>(
          ApiRoutes.Notifications.ReadOne.replace("{id}", id.toString()),
          "POST",
          {}
        );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      if (success) {
        enqueueSnackbar("Notification marked as read successfully!", {
          variant: "success",
        });
        // Optionally, you can refresh the notifications list
        mutate();
      }
      return data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Marking notification as read failed",
        { variant: "error" }
      );
      return null;
    } finally {
      stopProgress();
    }
  };


  return {
    notifications,
    error,
    isLoading,
    mutate,
    markAsRead
  };
}
