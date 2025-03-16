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
import { IntakeFormType } from "@/types/intake.types";
import { Attachment } from "@/types/attachment.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { ClientsSearchParams } from "@/types/client.types";

export function useIntake({
    search,
    status,
    location_id,
    page = 1,
    page_size = 20,
    autoFetch = true,
}: Partial<ClientsSearchParams & { autoFetch?: boolean }>) {

    const router = useRouter();


    const { enqueueSnackbar } = useSnackbar();
    const { start: startProgress, stop: stopProgress } = useProgressBar();

    const {
        data: intakes,
        error,
        mutate,
    } = useSWR<PaginatedResponse<IntakeFormType> | null>(
        stringConstructor(
            ApiRoutes.IntakeForm.CreateOne,
            constructUrlSearchParams({ search, status, location_id, page, page_size })
        ), // Endpoint to fetch clients
        async (url) => {
            if (!autoFetch)
                return {
                    results: [],
                    count: 0,
                    page_size: 0,
                    next: null,
                    previous: null,
                };
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );
    const isLoading = !intakes && !error;

    const sendIntakeForm = async (intakeData: IntakeFormType, options?: ApiOptions) => {
        const { displayProgress = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<AppointmentType>(`${ApiRoutes.IntakeForm.CreateOne}`, "POST", {}, intakeData);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            enqueueSnackbar("Intake Form submitted successfully!", { variant: "success" });
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Intake Form submitted failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const uploadFileForIntake = async (formData: FormData, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Attachment>(ApiRoutes.IntakeForm.upload, "POST", {
                headers: {
                    "Content-Type": "multipart/form-data", // Ensure multipart encoding
                }
            }, formData);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("File uploaded successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "File upload failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const moveToWaitingList = async (id: string, options?: ApiOptions) => {
        const { displayProgress = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<AppointmentType>(`${ApiRoutes.IntakeForm.MoveToWaitingList.replace("{id}", id)}`, "POST");
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            enqueueSnackbar("Intake moved to waiting list successfully!", { variant: "success" });
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Intake moved to waiting lis failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const readOne = async (id: string, options?: ApiOptions) => {
        const { displayProgress = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<AppointmentType>(`${ApiRoutes.IntakeForm.ReadOne.replace("{id}", id)}`, "GET");
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Intake reading failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const updateUrgency = async (id: string, urgency_score: number = 0, options?: ApiOptions) => {
        const { displayProgress = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<AppointmentType>(`${ApiRoutes.IntakeForm.UpdateUrgency.replace("{id}", id)}`, "POST", {}, { urgency_score });
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            enqueueSnackbar("Intake urgency updated successfully!", { variant: "success" });
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Intake urgency updated failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    return {
        intakes,
        isLoading,
        error,
        sendIntakeForm,
        readOne,
        uploadFileForIntake,
        moveToWaitingList,
        updateUrgency
    };
}
