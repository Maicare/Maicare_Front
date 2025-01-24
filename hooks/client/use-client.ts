"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Id } from "@/common/types/types";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";
import { Client, ClientsSearchParams, CreateClientInput } from "@/types/client.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";


export function useClient({ search, status, location_id, page: pageParam = 1, page_size = 10,autoFetch=true }: Partial<ClientsSearchParams&{autoFetch?:boolean}>) {
    const [page, setPage] = useState(pageParam);
    const { enqueueSnackbar } = useSnackbar();
    const { start: startProgress, stop: stopProgress } = useProgressBar();
    const { data: clients, error } = useSWR<PaginatedResponse<Client> | null>(
      stringConstructor(ApiRoutes.Client.ReadAll, constructUrlSearchParams({search,status,location_id,page,page_size})), // Endpoint to fetch clients
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
    const isLoading = !clients && !error;

    const readOne = async (id: Id, options?: ApiOptions) => {
        const { displayProgress = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const response = await useApi<Client>(ApiRoutes.Client.ReadOne.replace("{id}",id.toString()), "GET");
            if (!response.data) {
                throw new Error("Client not found");
            }
            return response.data;
        } catch (err:any) {
            enqueueSnackbar(err?.response?.data?.message || "Failed to fetch client", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const createOne = async (data: CreateClientInput, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const response = await useApi<Client>(ApiRoutes.Client.CreateOne, "POST", {}, data);
            if (!response.data) {
                throw new Error("Failed to create client");
            }
            if (displaySuccess && response.success) {
                enqueueSnackbar("Client created successful!", { variant: "success" });
              }
            return response.data;
        } catch (err:any) {
            enqueueSnackbar(err?.response?.data?.message || "Failed to create client", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    //TODO: Add logic to CRUD user role
    return {
        clients,
        error,
        isLoading,
        page,
        setPage,
        readOne,
        createOne
    }
}