import api from "@/common/api/axios";
import { useState } from "react";
import useSWR from "swr";
import { PaginationParams } from "@/types/pagination.types";
import ApiRoutes from "@/common/api/routes";
import { ApiOptions } from "@/common/types/api.types";
import { useSnackbar } from "notistack";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { useApi } from "@/common/hooks/use-api";
import { CalendarAppointment, RecurrenceType } from "@/types/calendar.types";
import { CreateAppointmentType } from "@/schemas/calendar.schemas";
import { Id } from "@/common/types/types";

export function useCalendar(employeeId: string, autoFetch: boolean = false, params?: PaginationParams) {

  const { enqueueSnackbar } = useSnackbar();
  const { start: startProgress, stop: stopProgress } = useProgressBar();

  const [page, setPage] = useState(params?.page || 1);
  const page_size = params?.page_size || 10;

  interface CalendarAppointmentResponse {
    id: number;
    description: string;
    start_time: string;
    end_time: string;
    location: string;

    clients_details: { client_id: Id }[];
    participants_details: { employee_id: Id }[];

    recurrence_type?: RecurrenceType;
    recurrence_interval?: number;
    recurrence_end_date?: string;
    color?: string;
  }

  const {
    data: appointments,
    isValidating,
    error,
    mutate,
  } = useSWR<CalendarAppointment>(
    autoFetch ? `${ApiRoutes.Employee.Appointmens.ReadAll.replace("{id}", employeeId)}` : null,
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
  const isLoading = !appointments && !error;

  const fetchAppointmentsWindowByEmployee = async (
    start: Date,
    end: Date,
    options?: ApiOptions,
  ): Promise<CalendarAppointment[]> => {
    const { displayProgress = false } = options || {};
    try {
      if (displayProgress) startProgress();

      const { data, error, success, message } = await useApi<CalendarAppointment[]>(
        ApiRoutes.Employee.Appointmens.ReadAll.replace("{id}", employeeId),
        "POST",
        {},
        {
          start_date: start.toISOString(),
          end_date: end.toISOString(),
        },
      );

      if (!success || !data)
        throw new Error(error || message || "Could not load appointments");

      return data;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const fetchAppointmentsWindowByClient = async (
    clientId: string,
    start: Date,
    end: Date,
    options?: ApiOptions,
  ): Promise<CalendarAppointment[]> => {
    const { displayProgress = false } = options || {};
    try {
      if (displayProgress) startProgress();

      const { data, error, success, message } = await useApi<CalendarAppointment[]>(
        ApiRoutes.Client.Appointmens.ReadAll.replace("{id}", clientId),
        "POST",
        {},
        {
          start_date: start.toISOString(),
          end_date: end.toISOString(),
        },
      );

      if (!success || !data)
        throw new Error(error || message || "Could not load appointments");

      return data;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const readOneAppointment = async (appointmentId: string, options?: ApiOptions): Promise<CalendarAppointmentResponse | null> => {
    const { displayProgress = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { data, error, message, success } = await useApi<CalendarAppointmentResponse>(
        ApiRoutes.Calendar.ReadOne.replace("{id}", appointmentId),
        "GET"
      );
      if (!success || !data)
        throw new Error(error || message || "Could not fetch appointment");
      return data;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const createAppointment = async (appointmentData: CreateAppointmentType, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<CreateAppointmentType>(ApiRoutes.Calendar.CreateOne
        , "POST", {}, appointmentData);
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Appointment created successful!", { variant: "success" });
      }
      mutate()
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Appointment creationg failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  }

  const updateAppointment = async (appointmentId: string, appointmentData: Partial<CalendarAppointment>, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<CalendarAppointment>(
        ApiRoutes.Calendar.UpdateOne.replace("{id}", appointmentId),
        "PUT",
        {},
        appointmentData
      );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      if (displaySuccess && success) {
        enqueueSnackbar("Appointment updated successfully!", { variant: "success" });
      }
      mutate();
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Appointment update failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const deleteAppointment = async (appointmentId: string, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, error } = await useApi<null>(
        ApiRoutes.Calendar.DeleteOne.replace("{id}", appointmentId),
        "DELETE"
      );
      if (!success) throw new Error(error || message || "An unknown error occurred");

      if (displaySuccess && success) {
        enqueueSnackbar("Appointment deleted successfully!", { variant: "success" });
      }
      mutate();
      return true;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Appointment deletion failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const addClientToAppointment = async (appointmentId: string, clientData: any, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<any>(
        ApiRoutes.Calendar.AddClient.replace("{id}", appointmentId),
        "POST",
        {},
        clientData
      );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      if (displaySuccess && success) {
        enqueueSnackbar("Client added to appointment successfully!", { variant: "success" });
      }
      mutate();
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Adding client failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const confirmAppointment = async (appointmentId: string, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<any>(
        ApiRoutes.Calendar.ConfirmAppointment.replace("{id}", appointmentId),
        "POST"
      );
      if (!success)
        throw new Error(error || message || "An unknown error occurred");

      if (displaySuccess && success) {
        enqueueSnackbar("Appointment confirmed successfully!", { variant: "success" });
      }
      mutate();
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Appointment confirmation failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const addParticipantsToAppointment = async (appointmentId: string, participantsData: any, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<any>(
        ApiRoutes.Calendar.AddParticipants.replace("{id}", appointmentId),
        "POST",
        {},
        participantsData
      );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      if (displaySuccess && success) {
        enqueueSnackbar("Participants added successfully!", { variant: "success" });
      }
      mutate();
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Adding participants failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  return {
    appointments,
    error,
    isLoading,
    isFetching: isValidating,
    page,
    setPage,
    mutate,
    fetchAppointmentsWindowByEmployee,
    fetchAppointmentsWindowByClient,
    readOneAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    addClientToAppointment,
    addParticipantsToAppointment,
    confirmAppointment,
  };
}
