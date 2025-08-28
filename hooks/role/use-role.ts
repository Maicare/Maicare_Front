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
        autoFetch ? ApiRoutes.Role.ReadAll : null, // Endpoint to fetch Roles
        async (url) => {
            if (!url) {
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

    const updateOneRole = async (employee_id: Id, roleId: Id, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Role>(ApiRoutes.Role.AssignRole.replace("{employee_id}", employee_id.toString()), "POST", {}, { role_id: roleId });//TODO: add correct type later
            if (!success)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Employee Role updated successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Employee Role update failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    // create role 
    const createOne = async (roleName: string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Role>(ApiRoutes.Role.CreateOne, "POST", {}, { name: roleName });
            if (!success)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Role created successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Role creation failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const readRolePermissions = async (roleId: Id, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<{
                "permission_id": Id,
                "permission_name": string,
                "permission_resource": string,
                "role_id": Id
            }[]>(ApiRoutes.Role.ReadRolePermissions.replace("{role_id}", roleId.toString()), "GET");
            if (!success || !data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Role Permissions fetched successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Role Permissions fetching failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const updateRolePermissions = async (roleId: Id, permissionIds: Id[], options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Role>(ApiRoutes.Role.UpdateRolePermissions.replace("{role_id}", roleId.toString()), "POST", {}, { permission_ids: permissionIds });
            if (!success)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Role Permissions updated successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Role Permissions update failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const readPermissions = async (options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<{
                "permission_id": Id,
                "permission_name": string,
                "permission_resource": string,
            }[]>(ApiRoutes.Role.ReadPermissions, "GET");
            if (!success || !data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Permissions fetched successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Permissions fetching failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const grantEmployeePermissions = async (employee_id: Id, permissionIds: Id[], options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Role>(ApiRoutes.Role.GrantEmployeePermissions.replace("{employee_id}", employee_id.toString()), "POST", {}, { permission_ids: permissionIds });
            if (!success)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Employee Permissions granted successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Employee Permissions granting failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const readEmployeePermissions = async (employee_id: Id, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<{
                permissions:{
                "id": Id,
                "name": string,
                "resource": string,
            }[]
            }>(ApiRoutes.Role.ReadEmployeePermissions.replace("{employee_id}", employee_id.toString()), "GET");
            if (!success || !data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Employee Permissions fetched successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Employee Permissions fetching failed", { variant: "error" });
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
        createOne,
        readRolePermissions,
        updateRolePermissions,readPermissions,grantEmployeePermissions,readEmployeePermissions
    }
}