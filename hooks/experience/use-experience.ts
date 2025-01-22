"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { useSnackbar } from "notistack";
import useSWR from "swr";
import { CreateExperience, Experience } from "@/types/experience.types";


export function useExperience({ employeeId,autoFetch=true }: {autoFetch?:boolean,employeeId:string}) {
    const { enqueueSnackbar } = useSnackbar();
    const { start: startProgress, stop: stopProgress } = useProgressBar();
    const { data: experiences, error, mutate,isLoading } = useSWR<Experience[] | null>(

        ApiRoutes.Employee.ReadExperiences.replace("{id}",employeeId), // Endpoint to fetch Locations
        async (url) => {
            if (!autoFetch) return {
                results: [],
                count: 0,
                page_size: 0,
                next: null,
                previous: null
            };
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );

    const createOne = async (experience:CreateExperience, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Experience>(ApiRoutes.Employee.CreateOneExperience.replace("{id}",experience.employee_id.toString()), "POST", {},experience);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Employee Experience created successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Employee Experience creationg failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const updateOne = async (experience:Experience, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Experience>(ApiRoutes.Employee.UpdateOneExperience.replace("{exp_id}",experience.id?.toString()).replace("{id}",experience.employee_id.toString()), "PUT", {},experience);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Employee Experience created successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Employee Experience creationg failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const deleteOne = async (experience:Experience, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Experience>(ApiRoutes.Employee.DeleteOneExperience.replace("{exp_id}",experience.id?.toString()).replace("{id}",experience.employee_id.toString()), "DELETE");
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Employee Experience deleted successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Employee Experience deletion failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }



    return {
        error,
        experiences,
        isLoading,
        createOne,
        updateOne,
        deleteOne,
        mutate
    }
}