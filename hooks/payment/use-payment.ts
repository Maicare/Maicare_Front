import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { Id } from "@/common/types/types";
import { CreatePayment } from "@/schemas/payment.schema";
import { Payment } from "@/types/payment.types";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";


export function usePayment({ autoFetch = false,invoiceId }: { autoFetch?: boolean,invoiceId:string }) {
    const { enqueueSnackbar } = useSnackbar();
    const [page,setPage] = useState(1)
    const { start: startProgress, stop: stopProgress } = useProgressBar();
    const {
        data: payments,
        error,
        mutate,
    } = useSWR<Payment[] | null>(
        autoFetch ? ApiRoutes.Invoice.Payment.ReadAll.replace("{id}",invoiceId) : null, // Endpoint to fetch Locations
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

    const isLoading = !payments && !error;


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

    const createOne = async (payment: CreatePayment, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Payment>(ApiRoutes.Invoice.Payment.CreateOne.replace("{id}",invoiceId), "POST", {}, { ...payment });
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Payment created successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Payment creation failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const updateOne = async (id:string,payment: CreatePayment&{recorded_by:Id}, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Payment>(ApiRoutes.Invoice.Payment.UpdateOne.replace("{id}",invoiceId).replace("{paymentId}",id), "PUT", {}, { ...payment });
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Payment update successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Payment update failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    return {
        payments,
        error,
        isLoading,
        readOne,
        createOne,
        updateOne,
        page,
        setPage
      };
}