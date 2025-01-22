"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { useSnackbar } from "notistack";
import useSWR from "swr";
import { Certification, CreateCertificate } from "@/types/certification.types";


export function useCertificate({ employeeId,autoFetch=true }: {autoFetch?:boolean,employeeId:string}) {
    const { enqueueSnackbar } = useSnackbar();
    const { start: startProgress, stop: stopProgress } = useProgressBar();
    const { data: certificates, error, mutate,isLoading } = useSWR<Certification[]>(

        ApiRoutes.Employee.ReadCertificates.replace("{id}",employeeId), // Endpoint to fetch Locations
        async (url) => {
            if (!autoFetch) return [];
            const response = await api.get(url);
            if (!response.data.data) {
                return [];
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false,keepPreviousData:true,fallbackData:[] }
    );

    const createOne = async (certificate:CreateCertificate, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Certification>(ApiRoutes.Employee.CreateOneCertificate.replace("{id}",certificate.employee_id.toString()), "POST", {},certificate);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Employee Certificate created successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Employee Certificate creationg failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const updateOne = async (certificate:Certification, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Certification>(ApiRoutes.Employee.UpdateOneCertificate.replace("{cert_id}",certificate.id?.toString()).replace("{id}",certificate.employee_id.toString()), "PUT", {},certificate);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Employee Certificate created successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Employee Certificate creationg failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const deleteOne = async (certificate:Certification, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Certification>(ApiRoutes.Employee.DeleteOneCertificate.replace("{cert_id}",certificate.id?.toString()).replace("{id}",certificate.employee_id.toString()), "DELETE");
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Employee Certificate deleted successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Employee Certificate deletion failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }



    return {
        error,
        certificates,
        isLoading,
        createOne,
        updateOne,
        deleteOne,
        mutate
    }
}