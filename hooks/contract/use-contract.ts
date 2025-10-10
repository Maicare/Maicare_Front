import { ContractResults } from "@/app/(pages)/contracts/_components/columns";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Any } from "@/common/types/types";
import { Contract, CreateContract } from "@/schemas/contract.schema";
import { ContractFilterFormType,  ContractResDto, ContractTypeItem } from "@/types/contracts.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";

export function useContract({
    search,
    status,
    page_size = 10,
    autoFetch = false,
    care_type,
    financing_act,
    financing_option,
    clientId
}: Partial<ContractFilterFormType & { autoFetch?: boolean;clientId?: string }>) {
    const [page, setPage] = useState(1);
    const { start: startProgress, stop: stopProgress } = useProgressBar();


    const {
        data: contracts,
        error,
        mutate,
    } = useSWR<PaginatedResponse<ContractResults|Contract>>(
        autoFetch ? 
        (
            clientId ? 
            stringConstructor(
                ApiRoutes.Contract.ReadAllClient.replace("{id}", clientId),
                constructUrlSearchParams({ page, page_size })
            ) :
            stringConstructor(
                ApiRoutes.Contract.ReadAll,
                constructUrlSearchParams({ search, status, care_type, financing_act, financing_option, page, page_size })
            ) 
        )
        : null, // Endpoint to fetch clients
        async (url) => {
            if (!url)
                return {
                    results: [],
                    count: 0,
                    page_size: 0,
                    next: null,
                    previous: null,
                };
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );
    const isLoading = !contracts && !error;

    const readContractTypes = async (options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<ContractTypeItem[]>(ApiRoutes.Contract.READTYPES, "GET", {});
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Contract Types fetched successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Contract Types fetching failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const addContractTypes = async (name: string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<{id:number;name:string;}>(ApiRoutes.Contract.READTYPES, "POST", {}, { name });
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Contract Types added successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Contract Types add failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const deleteContractTypes = async (id: string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<ContractTypeItem[]>(`${ApiRoutes.Contract.READTYPES}/${id}`, "DELETE", {});
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Contract Types deleted successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Contract Types delete failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const createOne = async (contractData: CreateContract, id: string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Contract[]>(ApiRoutes.Contract.AddOne.replace("{id}", id.toString()), "POST", {}, contractData);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Contract added successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Contract add failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const readOne = async (client_id: string, contract_id: string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Contract&{type_name:string;sender_name:string;client_first_name:string;client_last_name:string;}>(ApiRoutes.Contract.ReadOne.replace("{id}", client_id.toString()).replace("{contract_id}", contract_id.toString()), "GET", {});
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Contract fetch successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Contract fetch failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const updateOne = async (contractData: Any, contract_id: string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<ContractResDto>(ApiRoutes.Contract.UpdateOne.replace("{id}", contract_id.toString()), "PUT", {}, contractData);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Contract updated successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Contract updated failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }


    return {
        contracts,
        error,
        isLoading,
        page,
        setPage,
        mutate,
        addContractTypes,
        readContractTypes,
        deleteContractTypes,
        createOne,
        readOne,
        updateOne
    };
}
