import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { Location } from "@/types/location.types";
import useSWR from "swr";


export function useLocation() {
    const { data: locations, error, mutate } = useSWR<Location | null>(
        ApiRoutes.Location.ReadAll, // Endpoint to fetch Locations
        async (url) => {
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );
    const isLoading = !locations && !error;

    //TODO: Add logic to CRUD user role
    return {
        locations,
        error,
        isLoading
    }
}