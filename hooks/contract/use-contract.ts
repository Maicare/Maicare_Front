import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { ClientsSearchParams } from "@/types/client.types";
import { ContractItem } from "@/types/contracts.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";

export function useContract({
    search,
    status,
    location_id,
    page_size = 10,
    autoFetch = true,
}: Partial<ClientsSearchParams & { autoFetch?: boolean }>) {
    const [page, setPage] = useState(1);
    const { start: startProgress, stop: stopProgress } = useProgressBar();


    const {
        data: contracts,
        error,
        mutate,
    } = useSWR<PaginatedResponse<ContractItem>>(
        stringConstructor(
            ApiRoutes.Contract.ReadAll,
            constructUrlSearchParams({ search, status, location_id, page, page_size })
        ), // Endpoint to fetch clients
        async (url) => {
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );
    const isLoading = !contracts && !error;



    return {
        contracts,
        error,
        isLoading,
        page,
        setPage,
        mutate
    };
}
