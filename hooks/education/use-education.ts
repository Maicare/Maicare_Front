"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { useSnackbar } from "notistack";
import useSWR from "swr";
import { CreateEducation, Education } from "@/types/education.types";


export function useEducation({ employeeId,autoFetch=true }: {autoFetch?:boolean,employeeId:string}) {
    const { enqueueSnackbar } = useSnackbar();
    const { start: startProgress, stop: stopProgress } = useProgressBar();
    const { data: educations, error, mutate,isLoading } = useSWR<Education[] | null>(

        ApiRoutes.Employee.ReadEducations.replace("{id}",employeeId), // Endpoint to fetch Locations
        async (url) => {
            if (!autoFetch) return [];
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );

    const createOne = async (education:CreateEducation, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Education>(ApiRoutes.Employee.CreateOneEducation.replace("{id}",education.employee_id.toString()), "POST", {},education);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Employee Education created successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Employee Education creationg failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const updateOne = async (education:Education, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Education>(ApiRoutes.Employee.UpdateOneEducation.replace("{edu_id}",education.id?.toString()).replace("{id}",education.employee_id.toString()), "PUT", {},education);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Employee Education created successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Employee Education creationg failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const deleteOne = async (education:Education, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Education>(ApiRoutes.Employee.DeleteOneEducation.replace("{edu_id}",education.id?.toString()).replace("{id}",education.employee_id.toString()), "DELETE");
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Employee Education deleted successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Employee Education deletion failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }



    return {
        error,
        educations,
        isLoading,
        createOne,
        updateOne,
        deleteOne,
        mutate
    }
}