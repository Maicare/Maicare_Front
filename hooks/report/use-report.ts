import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Id } from "@/common/types/types";
import { CreateReport, Report } from "@/types/reports.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useSWR from "swr";


export function useReport({ autoFetch = true,clientId,page=1,page_size=10 }: { autoFetch?: boolean,clientId:Id,page?:number,page_size?:number }) {
    const { enqueueSnackbar } = useSnackbar();
    const [reports,setReports] = useState<PaginatedResponse<Report>>({
        results: [],
        count: 0,
        page_size: 0,
        next: null,
        previous: null
    });
    const { start: startProgress, stop: stopProgress } = useProgressBar();
    const { data, error, mutate } = useSWR<PaginatedResponse<Report>>(
        stringConstructor(ApiRoutes.Report.ReadAll.replace("{id}",clientId.toString()), constructUrlSearchParams({ page, page_size })),
        async (url) => {
            if (!autoFetch) {
                return {
                    results: [],
                    count: 0,
                    page_size: 0,
                    next: null,
                    previous: null
                };

            }
            const response = await api.get(url);
            if (!response.data.data || response.data.data.length === 0) {
                return {
                    results: [],
                    count: 0,
                    page_size: 0,
                    next: null,
                    previous: null
                };
            }
            return response.data.data;
        },
        { shouldRetryOnError: false }
    );

    useEffect(()=> {
        if(data){
            setReports(data);
        }else{
            setReports({
                results: [],
                count: 0,
                page_size: 0,
                next: null,
                previous: null
            });
        }
    },[data]);

    const isLoading = !reports && !error;

    const createOne = async (report:CreateReport, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Report>(ApiRoutes.Report.CreateOne.replace("{id}",clientId.toString()), "POST", {},report);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Report created successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Report creationg failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const updateOne = async (report:CreateReport, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Report>(ApiRoutes.Report.UpdateOne.replace("{id}",clientId.toString()).replace("{report_id}",report.id!.toString()), "PUT", {},report);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Report updated successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Report update failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const readOne = async (report:Id, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Report>(ApiRoutes.Report.ReadOne.replace("{id}",clientId.toString()).replace("{report_id}",report.toString()), "GET");
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Report retrieved successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Report retrieve failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const enhanceReport = async(report:string,options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<{corrected_text:string,initial_text:string}>(ApiRoutes.Report.Enhance, "POST", {},{initial_text:report});
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Report enhanced successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Report enhance failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    
    
    return {
        reports,
        error,
        isLoading,
        mutate,
        createOne,
        updateOne,
        readOne,
        enhanceReport
    }
}