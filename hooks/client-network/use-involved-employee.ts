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
import { EmergencyContactForm } from "@/types/emergency.types";
import { InvolvedEmployeeForm, InvolvedEmployeeList, InvolvedEmployeesSearchParams } from "@/types/involved.types";
import { CreateInvolvedEmployee } from "@/schemas/involvedEmployee.schema";


export function useInvolvedEmployee({ search, page: pageParam = 1, page_size = 10, autoFetch = true, clientId = '0' }: Partial<InvolvedEmployeesSearchParams & { autoFetch?: boolean }>) {
    const [page, setPage] = useState(pageParam);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { start: startProgress, stop: stopProgress } = useProgressBar();

    const { data: involvedEmployees, error, mutate, isValidating } = useSWR<PaginatedResponse<InvolvedEmployeeList>>(

        stringConstructor(ApiRoutes.ClientNetwork.involved.ReadAll, constructUrlSearchParams({ search, page, page_size })).replace("{id}", clientId), // Endpoint to fetch Locations
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
    const isLoading = !involvedEmployees && !error;

    const createOne = async (employee: CreateInvolvedEmployee, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<InvolvedEmployeeForm>(ApiRoutes.ClientNetwork.involved.CreateOne.replace("{id}", clientId), "POST", {}, {...employee,employee_id:parseInt(employee.employee_id)});
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Client Involved Employee created successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Client Involved Employee creationg failed", { variant: "error" });
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
            const { message, success, data, error } = await useApi<InvolvedEmployeeForm>(ApiRoutes.ClientNetwork.involved.ReadOne.replace("{employee_id}", id.toString()).replace("{id}", clientId), "GET", {});
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Client Involved Employee fetched successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Client Involved Employee fetching failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const updateOne = async (contact: CreateInvolvedEmployee, id: string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<EmergencyContactForm>(ApiRoutes.ClientNetwork.involved.ReadOne.replace("{employee_id}", id.toString()).replace("{id}", clientId), "PUT", {}, {...contact,employee_id:parseInt(contact.employee_id)});
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Client Involved Employee updated successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Client Involved Employee updating failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const deleteOne = async (id: string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<EmergencyContactForm>(ApiRoutes.ClientNetwork.involved.DeleteOne.replace("{employee_id}", id.toString()).replace("{id}", clientId), "DELETE");
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Client Involved Employee delete successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Client Involved Employee delete failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    //TODO: Add logic to CRUD user role
    return {
        involvedEmployees,
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