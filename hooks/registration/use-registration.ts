"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { useSnackbar } from "notistack";
import { RegistrationFormType, RegistrationStatusUpdateType } from "@/types/registration.types";

export function useRegistration() {
    const { enqueueSnackbar } = useSnackbar();
    const { start: startProgress, stop: stopProgress } = useProgressBar();

    const createRegistrationForm = async (data: RegistrationFormType, options?: ApiOptions) => {
        const { displayProgress = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data: responseData, error } = await useApi<any>(
                ApiRoutes.RegistrationForm.CreateOne,
                "POST",
                {},
                data
            );
            if (!responseData)
                throw new Error(error || message || "An unknown error occurred");

            enqueueSnackbar("Registration Form submitted successfully!", { variant: "success" });
            return responseData;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Registration Form submission failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    };

    const updateRegistrationStatus = async (id: string, data: RegistrationStatusUpdateType, options?: ApiOptions) => {
        const { displayProgress = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data: responseData, error } = await useApi<any>(
                ApiRoutes.RegistrationForm.UpdateStatus.replace("{id}", id),
                "POST",
                {},
                data
            );
            if (!success)
                throw new Error(error || message || "An unknown error occurred");

            enqueueSnackbar("Registration status updated successfully!", { variant: "success" });
            return responseData;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Registration status update failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    };

    const readAll = async (params: any = { Page: 1, PageSize: 10 }, options?: ApiOptions) => {
        const { displayProgress = false } = options || {};
        try {
            if (displayProgress) startProgress();
            // Assuming stringConstructor and constructUrlSearchParams are available or standard fetch is used
            const queryString = new URLSearchParams({ page: params.Page, page_size: params.PageSize }).toString();
            const url = `${ApiRoutes.RegistrationForm.CreateOne}?${queryString}`;

            const response = await api.get(url);
            if (!response.data.data) {
                return { results: [], count: 0 };
            }
            return response.data.data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Failed to fetch registrations", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    };

    const readOne = async (id: string, options?: ApiOptions) => {
        const { displayProgress = false } = options || {};
        try {
            if (displayProgress) startProgress();
            // Assuming ReadOne route exists or constructing it
            const url = `${ApiRoutes.RegistrationForm.CreateOne}/${id}`;
            const { message, success, data, error } = await useApi<any>(url, "GET");

            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Failed to fetch registration", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    };

    return {
        createRegistrationForm,
        updateRegistrationStatus,
        readAll,
        readOne
    };
}
