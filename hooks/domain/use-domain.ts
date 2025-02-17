import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { Id } from "@/common/types/types";
import { Assessment, CreateAssessment } from "@/types/assessment.types";
import { MaturityMatrix } from "@/types/maturity-matrix.types";
import {  useSnackbar } from "notistack";
import useSWR from "swr";

export function useDomain({ autoFetch = true }: { autoFetch: boolean }) {
    const {enqueueSnackbar} = useSnackbar();
    const { start: startProgress, stop: stopProgress } = useProgressBar();

    const {
        data: domains,
        error,
        isLoading,
        mutate,
    } = useSWR<MaturityMatrix[] | null>(
        ApiRoutes.MaturityMatrix.ReadAll, // Endpoint to fetch Locations
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

    const createOne = async(assessment: CreateAssessment[],clientId:Id, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Assessment>(ApiRoutes.Client.Assessment.CreateOne.replace("{id}", clientId.toString()), "POST", {}, {assessment});
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Client Assessment created successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Client Assessment creation failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    return {
        domains,
        error,
        isLoading,
        mutate,
        createOne
    };
}
