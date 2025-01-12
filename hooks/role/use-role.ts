import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { Role } from "@/types/role.types";
import useSWR from "swr";


export function useRole() {
    const { data: role, error, mutate } = useSWR<Role | null>(
        ApiRoutes.Role.User, // Endpoint to fetch User Role details
        async (url) => {
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );
    const isLoading = !role && !error;

    //TODO: Add logic to CRUD user role
    return {
        role,
        error,
        isLoading
    }
}