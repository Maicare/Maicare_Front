import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { Id } from "@/common/types/types";
import { Role } from "@/types/role.types";
import { useSnackbar } from "notistack";
import useSWR from "swr";


export function useRole({ autoFetch = true }: { autoFetch?: boolean }) {
    const { enqueueSnackbar } = useSnackbar();
    const { start: startProgress, stop: stopProgress } = useProgressBar();
    const { data: roles, error, mutate } = useSWR<Role[] | null>(
        ApiRoutes.Role.ReadAll, // Endpoint to fetch Roles
        async (url) => {
            if (!autoFetch) {
                return [];

            }
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data;
        },
        { shouldRetryOnError: false }
    );
    const isLoading = !roles && !error;

    const getUserRole = async (options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Role>(ApiRoutes.Role.User, "GET", {});
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("User Role fetched successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "User Role fetching failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const updateOneRole = async (id: Id, roleId: Id, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Role>(ApiRoutes.Role.AssignRole, "PUT", {}, { role_id: roleId, id });//TODO: add correct type later
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Employee Role updated successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Employee Role update failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    //TODO: Add logic to CRUD user role
    return {
        roles,
        error,
        isLoading,
        mutate,
        getUserRole, 
        updateOneRole,
    }
}