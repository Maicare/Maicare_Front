import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Id } from "@/common/types/types";
import { CreateDocument, Document } from "@/types/Document.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { usePathname } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useSWR from "swr";


export function useDocument({ autoFetch = true, clientId, page:pageProp = 1, page_size = 10 }: { autoFetch?: boolean, clientId: Id, page?: number, page_size?: number }) {
    const { enqueueSnackbar } = useSnackbar();
    const [page,setPage] = useState(1);
    const [documents, setDocuments] = useState<PaginatedResponse<Document>>({
        results: [],
        count: 0,
        page_size: 0,
        next: null,
        previous: null
    });
    const { start: startProgress, stop: stopProgress } = useProgressBar();
    const { data, error, mutate, isLoading } = useSWR<PaginatedResponse<Document>>(
        stringConstructor(ApiRoutes.Client.Document.ReadAll.replace("{id}", clientId.toString()), constructUrlSearchParams({ page, page_size })),
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
        { shouldRetryOnError: false, revalidateOnFocus: true }
    );

    useEffect(() => {
        if (data) {
            setDocuments(data);
        } else {
            setDocuments({
                results: [],
                count: 0,
                page_size: 0,
                next: null,
                previous: null
            });
        }
    }, [data]);
    const pathname = usePathname();

    useEffect(() => {
        mutate();  // Forces SWR to re-fetch data
    }, [pathname]);  // Runs when the route changes


    const createOne = async (document: CreateDocument, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Document>(ApiRoutes.Client.Document.CreateOne.replace("{id}", clientId.toString()), "POST", {}, document);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Document created successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Document creationg failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const deleteOne = async (document: Document, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Document>(ApiRoutes.Client.Document.DeleteOne.replace("{id}", clientId.toString()).replace("{doc_id}", document.id.toString()), "DELETE", {}, {attachement_id:document.attachment_uuid});
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Document Deleted successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Document Deleted failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const readMissingDocs = async (document: Id, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<{missing_docs:string[]}>(ApiRoutes.Client.Document.MissingDocs.replace("{id}", clientId.toString()).replace("{report_id}", document!.toString()), "GET");
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Missing Documents Retrieving successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Missing Documents Retrieving failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }


    return {
        documents,
        error,
        isLoading,
        mutate,
        createOne,
        deleteOne,
        readMissingDocs,
        setPage,
        page
    }
}