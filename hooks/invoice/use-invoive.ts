import { InvoicesType } from "@/app/(pages)/invoices/_components/columns";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { PAGE_SIZE } from "@/consts";
import { UpdateInvoiceFormValues } from "@/schemas/invoice.schema";
import { CreateInvoice, Invoice } from "@/types/invoice.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";


export function useInvoice({ autoFetch = false }: { autoFetch?: boolean }) {
    const { enqueueSnackbar } = useSnackbar();
    const [page,setPage] = useState(1)
    const { start: startProgress, stop: stopProgress } = useProgressBar();
    const {
        data: invoices,
        error,
        mutate,
    } = useSWR<PaginatedResponse<InvoicesType> | null>(
        autoFetch ? ApiRoutes.Invoice.ReadAll+constructUrlSearchParams({ page, page_size:PAGE_SIZE }) : null, // Endpoint to fetch Locations
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

    const createOne = async (invoice: CreateInvoice, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Invoice>(ApiRoutes.Invoice.CreateOne, "POST", {}, { ...invoice });
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Location created successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Location creationg failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const updateOne = async (id:string,invoice: UpdateInvoiceFormValues, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Invoice>(ApiRoutes.Invoice.UpdateOne.replace("{id}",id), "PUT", {}, { ...invoice });
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
    return {
        invoices,
        error,
        isLoading,
        readOne,
        createOne,
        page,
        setPage,
        updateOne
      };
}