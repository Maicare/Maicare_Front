import api from "@/common/api/axios";
import { useState } from "react";
import useSWR from "swr";
import { PaginationParams } from "@/types/pagination.types";
import ApiRoutes from "@/common/api/routes";
import { ApiOptions } from "@/common/types/api.types";
import { useSnackbar } from "notistack";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { useApi } from "@/common/hooks/use-api";
import { Id } from "@/common/types/types";
import { CalendarSchedule } from "@/types/schedule.types";
import { CreateScheduleType } from "@/schemas/schedule.schemas";

export function useSchedule(autoFetch: boolean = false, params?: PaginationParams) {

  const { enqueueSnackbar } = useSnackbar();
  const { start: startProgress, stop: stopProgress } = useProgressBar();

  const [page, setPage] = useState(params?.page || 1);
  const page_size = params?.page_size || 10;

  interface CalendarScheduleResponse {
    id: number;
    start_datetime: string;
    end_datetime: string;
    employee_id: Id;
    employee_first_name: string;
    employee_last_name: string;
    location_id: Id;
    location_name: string;
    created_at: string;
    updated_at: string;
  }

  const {
    data: schedules,
    isValidating,
    error,
    mutate,
  } = useSWR<CalendarSchedule>(
    autoFetch ? `${ApiRoutes.Location.Schedule.ReadMonthly}` : null,
    async (url) => {
      if (!url) {
        return null;
      }
      const response = await api.get(url);
      if (!response.data.data) {
        return null;
      }
      return response.data.data;
    },
    { shouldRetryOnError: false }
  );
  const isLoading = !schedules && !error;

  const readSchedulesByDay = async (
    locationId: string,
    year: number,
    month: number,
    day: number,
    options?: ApiOptions
  ): Promise<CalendarScheduleResponse[] | null> => {
    const { displayProgress = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const url = `${ApiRoutes.Location.Schedule.ReadDaily
        .replace("{id}", locationId)
        }?year=${year}&month=${month}&day=${day}`;
      const { data, error, message, success } = await useApi<CalendarScheduleResponse[]>(
        url,
        "GET"
      );
      if (!success || !data) {
        throw new Error(error || message || "Could not fetch daily schedules");
      }
      return data;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const readSchedulesByMonth = async (
    locationId: string,
    year: number,
    month: number,
    options?: ApiOptions
  ): Promise<CalendarScheduleResponse[] | null> => {
    const { displayProgress = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const url = `${ApiRoutes.Location.Schedule.ReadMonthly
        .replace("{id}", locationId)
        }?year=${year}&month=${month}`;
      const { data, error, message, success } = await useApi<CalendarScheduleResponse[]>(
        url,
        "GET"
      );
      if (!success || !data) {
        throw new Error(error || message || "Could not fetch monthly schedules");
      }
      return data;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const readOneSchedule = async (scheduleId: string, options?: ApiOptions): Promise<CalendarScheduleResponse | null> => {
    const { displayProgress = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { data, error, message, success } = await useApi<CalendarScheduleResponse>(
        ApiRoutes.Schedule.ReadOne.replace("{id}", scheduleId),
        "GET"
      );
      if (!success || !data)
        throw new Error(error || message || "Could not fetch schedule");
      return data;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const createSchedule = async (scheduleData: CreateScheduleType, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<CreateScheduleType>(ApiRoutes.Schedule.CreateOne
        , "POST", {}, scheduleData);
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Schedule created successful!", { variant: "success" });
      }
      mutate()
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Schedule creationg failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  }

  const updateSchedule = async (scheduleId: string, scheduleData: Partial<CreateScheduleType>, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<CreateScheduleType>(
        ApiRoutes.Schedule.UpdateOne.replace("{id}", scheduleId),
        "PUT",
        {},
        scheduleData
      );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      if (displaySuccess && success) {
        enqueueSnackbar("Schedule updated successfully!", { variant: "success" });
      }
      mutate();
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Schedule update failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const deleteSchedule = async (scheduleId: string, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, error } = await useApi<null>(
        ApiRoutes.Schedule.DeleteOne.replace("{id}", scheduleId),
        "DELETE"
      );
      if (!success)
        throw new Error(error || message || "An unknown error occurred");

      if (displaySuccess) {
        enqueueSnackbar("Schedule deleted successfully!", { variant: "success" });
      }
      mutate();
      return true;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Schedule deletion failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  return {
    schedules,
    error,
    isLoading,
    isFetching: isValidating,
    page,
    setPage,
    mutate,
    readSchedulesByDay,
    readSchedulesByMonth,
    readOneSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
}
