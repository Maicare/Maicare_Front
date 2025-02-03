"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { EmergencyContactForm, EmergencyContactList, EmergencyContactsSearchParams } from "@/types/emergency.types";


export function useEmergencyContact({ search, page: pageParam = 1, page_size = 10, autoFetch = true, clientId = '0' }: Partial<EmergencyContactsSearchParams & { autoFetch?: boolean }>) {
    const [page, setPage] = useState(pageParam);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { start: startProgress, stop: stopProgress } = useProgressBar();

    const { data: emergencyContacts, error, mutate, isValidating } = useSWR<PaginatedResponse<EmergencyContactList>>(

        stringConstructor(ApiRoutes.ClientNetwork.emergency.ReadAll, constructUrlSearchParams({ search, page, page_size })).replace("{id}", clientId), // Endpoint to fetch Locations
        async (url) => {
            if (!autoFetch) return {
                results: [],
                count: 0,
                page_size: 0,
                next: null,
                previous: null
            };
            const response = await api.get(url);
            if (!response?.data?.data) {
                return null;
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );
    const isLoading = !emergencyContacts && !error;

    const createOne = async (contact: EmergencyContactForm, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<EmergencyContactForm>(ApiRoutes.ClientNetwork.emergency.CreateOne.replace("{id}", clientId), "POST", {}, contact);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Client Emergency contact created successful!", { variant: "success" });
            }
            router.push(`/clients/${clientId}/client-network/emergency`);
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Client Emergency contact creationg failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const readOne = async (id: string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<EmergencyContactForm>(ApiRoutes.ClientNetwork.emergency.ReadOne.replace("{contact_id}", id.toString()).replace("{id}", clientId), "GET", {});
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Client Emergency contact fetched successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Client Emergency contact fetching failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const updateOne = async (contact: EmergencyContactForm, id: string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<EmergencyContactForm>(ApiRoutes.ClientNetwork.emergency.ReadOne.replace("{contact_id}", id.toString()).replace("{id}", clientId), "PUT", {}, contact);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Client Emergency contact updated successful!", { variant: "success" });
            }
            router.push(`/clients/${clientId}/client-network/emergency`);
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Client Emergency contact updating failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const deleteOne = async (id: string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<EmergencyContactForm>(ApiRoutes.ClientNetwork.emergency.DeleteOne.replace("{contact_id}", id.toString()).replace("{id}", clientId), "DELETE");
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Client Emergency contact delete successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Client Emergency contact delete failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    //TODO: Add logic to CRUD user role
    return {
        emergencyContacts,
        error,
        isLoading,
        page,
        setPage,
        isFetching: isValidating,
        createOne,
        readOne,
        updateOne,
        deleteOne
    }
}