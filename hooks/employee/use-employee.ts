"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { EmployeeList, EmployeesSearchParams } from "@/types/employee.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { useState } from "react";
import useSWR from "swr";


export function useEmployee({ search, position, department, out_of_service, location_id, is_archived, page:pageParam=1, page_size=10 }: Partial<EmployeesSearchParams>) {
    const [page, setPage] = useState(pageParam);
    const { data: employees, error, mutate } = useSWR<PaginatedResponse<EmployeeList> | null>(
        stringConstructor(ApiRoutes.Employee.ReadAll,constructUrlSearchParams({ search, position, department, out_of_service, location_id, is_archived, page, page_size })) , // Endpoint to fetch Locations
        async (url) => {
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );
    const isLoading = !employees && !error;

    //TODO: Add logic to CRUD user role
    return {
        employees,
        error,
        isLoading,
        page,
        setPage,
    }
}