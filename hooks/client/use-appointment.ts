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
import { Appointment as AppointmentType } from "@/types/appointment.types";

export function useAppointment(clientId: string, params?: PaginationParams) {

    const router = useRouter();


    const { enqueueSnackbar } = useSnackbar();
    const { start: startProgress, stop: stopProgress } = useProgressBar();

    const [page, setPage] = useState(params?.page || 1);
    const page_size = params?.page_size || 10;

    const {
        data: appointments,
        isValidating,
        error,
        mutate,
    } = useSWR<AppointmentType>(
        `${ApiRoutes.Client.Appointment.ReadAll.replace(
            "{id}",
            clientId
        )}`,
        async (url) => {
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data;
        },
        { shouldRetryOnError: false }
    );
    const isLoading = !appointments && !error;

    const createAppointment = async (appointmentData: AppointmentType, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<AppointmentType>(ApiRoutes.Client.Appointment.ReadAll.replace(
                "{id}",
                clientId
            ), "POST", {}, appointmentData);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Appointment created successful!", { variant: "success" });
            }
            router.push(`/clients/${clientId}/appointment-card`);
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Appointment creationg failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const updateAppointment = async (appointmentData: AppointmentType, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<AppointmentType>(ApiRoutes.Client.Appointment.ReadAll.replace(
                "{id}",
                clientId
            ), "PUT", {}, appointmentData);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Appointment updated successful!", { variant: "success" });
            }
            router.push(`/clients/${clientId}/appointment-card`);
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Appointment updating failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    return {
        appointments,
        error,
        isLoading,
        isFetching: isValidating,
        page,
        setPage,
        mutate,
        createAppointment,
        updateAppointment
    };
}
