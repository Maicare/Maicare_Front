import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Any } from "@/common/types/types";
import { ClientsSearchParams } from "@/types/client.types";
import { ContractFilterFormType, ContractFormType, ContractItem, ContractResDto, ContractTypeItem } from "@/types/contracts.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";

export type AppointmentDatesType = {
    start_date: string;
    end_date: string;
    employee_id?: string;
};

export function useAppointment({
    start_date,
    end_date,
    employee_id = "1"
}: AppointmentDatesType) {
    const { start: startProgress, stop: stopProgress } = useProgressBar();

    const {
        data: appointments,
        error,
        mutate,
    } = useSWR<Any[]>(
        ApiRoutes.Appointment.ReadAll.replace("{id}", employee_id),
        async (url) => {
            const response = await api.post(url, { start_date, end_date });
            if (!response.data.data) {
                return null;
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );
    const isLoading = !appointments && !error;

    const addAppointment = async (appointmentData: Any, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<ContractTypeItem[]>(ApiRoutes.Appointment.CreateOne, "POST", {}, appointmentData);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Contract added successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Contract add failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    return {
        appointments,
        error,
        isLoading,
        addAppointment,
    };
}
