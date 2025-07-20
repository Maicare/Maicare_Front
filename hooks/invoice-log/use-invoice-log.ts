import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { InvoiceAuditLog } from "@/types/invoice-log";
import { Payment } from "@/types/payment.types";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";


export function useInvoiceLog({ autoFetch = false,invoiceId }: { autoFetch?: boolean,invoiceId:string }) {
    const { enqueueSnackbar } = useSnackbar();
    const [page,setPage] = useState(1)
    const { start: startProgress, stop: stopProgress } = useProgressBar();
    const {
        data: logs,
        error,
        mutate,
    } = useSWR<InvoiceAuditLog[] | null>(
        autoFetch ? ApiRoutes.Invoice.Log.ReadAll.replace("{id}",invoiceId) : null, // Endpoint to fetch Locations
        async (url) => {
            if (!url) {
                return null;
            }
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );

    const isLoading = !logs && !error;


    const readOne = async (id: string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } =
                await useApi<Payment>(
                    ApiRoutes.Invoice.Payment.ReadOne.replace("{id}", invoiceId).replace("{paymentId}",id),
                    "GET",
                    {}
                );
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Payment Details fetched successful!", {
                    variant: "success",
                });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(
                err?.response?.data?.message || "Payment Details fetching failed",
                { variant: "error" }
            );
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    };

    // const createOne = async (invoice: CreateInvoice, options?: ApiOptions) => {
    //     const { displayProgress = false, displaySuccess = false } = options || {};
    //     try {
    //         if (displayProgress) startProgress();
    //         const { message, success, data, error } = await useApi<Invoice>(ApiRoutes.Invoice.CreateOne, "POST", {}, { ...invoice });
    //         if (!data)
    //             throw new Error(error || message || "An unknown error occurred");

    //         // Display success message
    //         if (displaySuccess && success) {
    //             enqueueSnackbar("Location created successful!", { variant: "success" });
    //         }
    //         mutate()
    //         return data;
    //     } catch (err: any) {
    //         enqueueSnackbar(err?.response?.data?.message || "Location creationg failed", { variant: "error" });
    //         throw err;
    //     } finally {
    //         if (displayProgress) stopProgress();
    //     }
    // }
    return {
        logs,
        error,
        isLoading,
        readOne,
        // createOne,
        page,
        setPage
      };
}