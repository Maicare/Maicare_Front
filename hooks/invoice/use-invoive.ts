

import { InvoiceTemplateItem } from "@/app/(pages)/contacts/_components/multi-select-invoice-items";
import { InvoicesType } from "@/app/(pages)/invoices/_components/columns";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { PAGE_SIZE } from "@/consts";
import { UpdateInvoiceFormValues } from "@/schemas/invoice.schema";
import { GenerateInvoice, Invoice } from "@/types/invoice.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";

export type InvoiceSearchParams = {
    search?: string;
    client_id?: number;
    sender_id?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
}

export function useInvoice({ autoFetch = false,client_id,end_date,search,sender_id,start_date,status }: { autoFetch?: boolean }&InvoiceSearchParams) {
    const { enqueueSnackbar } = useSnackbar();
    const [page, setPage] = useState(1)
    const { start: startProgress, stop: stopProgress } = useProgressBar();
    const {
        data: invoices,
        error,
        mutate,
    } = useSWR<PaginatedResponse<InvoicesType> | null>(
        autoFetch ? ApiRoutes.Invoice.ReadAll + constructUrlSearchParams({ page, page_size: PAGE_SIZE,client_id,end_date,search,sender_id,start_date,status }) : null, // Endpoint to fetch Locations
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

    const isLoading = !invoices && !error;


    const readOne = async (id: number, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } =
                await useApi<InvoicesType>(
                    ApiRoutes.Invoice.ReadOne.replace("{id}", id.toString()),
                    "GET",
                    {}
                );
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Invoice Details fetched successful!", {
                    variant: "success",
                });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(
                err?.response?.data?.message || "Invoice Details fetching failed",
                { variant: "error" }
            );
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    };
    const readAllInvoiceTemplate = async (options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } =
                await useApi<InvoiceTemplateItem[]>(
                    ApiRoutes.Invoice.InvoiceTemplate.ReadAll,
                    "GET",
                    {}
                );
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Invoice templates fetched successful!", {
                    variant: "success",
                });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(
                err?.response?.data?.message || "Invoice templates fetching failed",
                { variant: "error" }
            );
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    };

    const generateOne = async (invoice: GenerateInvoice, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Invoice>(ApiRoutes.Invoice.GenerateOne, "POST", {}, { ...invoice });
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("invoice ganarated successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "invoice generation failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const createOne = async (invoice: UpdateInvoiceFormValues, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Invoice>(ApiRoutes.Invoice.CreateOne, "POST", {}, { ...invoice });
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("invoice created successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "invoice creation failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const updateOne = async (id: string, invoice: UpdateInvoiceFormValues, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Invoice>(ApiRoutes.Invoice.UpdateOne.replace("{id}", id), "PUT", {}, { ...invoice });
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Invoice update successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Invoice update failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const creditOne = async (id: string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Invoice>(ApiRoutes.Invoice.CreditOne.replace("{id}", id), "POST", {}, {});
            if (!success)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Invoice Credited successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Invoice Credition failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const sendReminder = async (id: string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Invoice>(ApiRoutes.Invoice.SendReminder.replace("{id}", id), "POST", {}, {});
            if (!success)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Invoice Reminder Sent Successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Invoice Reminder failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    return {
        invoices,
        error,
        isLoading,
        readOne,
        generateOne,
        createOne,
        page,
        setPage,
        updateOne,
        readAllInvoiceTemplate,
        creditOne,
        sendReminder
    };
}