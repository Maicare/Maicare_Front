"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { EmployeeList, EmployeesSearchParams } from "@/types/employee.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { useState } from "react";
import useSWR from "swr";
import { EmployeeForm as EmployeeFormType } from "@/types/employee.types";
import { useMutation } from "@/common/hooks/use-mutate";
import { enqueueSnackbar } from "notistack";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";


export function useEmployee({ search, position, department, out_of_service, location_id, is_archived, page: pageParam = 1, page_size = 10 }: Partial<EmployeesSearchParams>) {
    const router = useRouter();
    const [page, setPage] = useState(pageParam);
    const { data: employees, error, mutate, isLoading } = useSWR<PaginatedResponse<EmployeeList> | null>(
        stringConstructor(ApiRoutes.Employee.ReadAll, constructUrlSearchParams({ search, position, department, out_of_service, location_id, is_archived, page, page_size })), // Endpoint to fetch Locations
        async (url) => {
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );

    const getEmployeeById = (employeeId: number) => {

        const { data: employee, error: employeeError, mutate, isLoading: isEmployeeLoading } = useSWR<EmployeeFormType>(
            ApiRoutes.Employee.ReadOne.replace("{id}", employeeId?.toString()),
            async (url) => {
                const response = await api.get(url);
                if (!response.data.data) {
                    return null;
                }
                return response.data.data;
            },
            { shouldRetryOnError: false }
        );
        return { employee, employeeError, mutate, isEmployeeLoading }
    }

    const { mutate: createEmployee, error: createEmployeeError } = useMutation<EmployeeFormType>();
    const { mutate: patchEmployee, error: patchEmployeeError } = useMutation<EmployeeFormType>();

    const addEmployee = async (newEmployee: EmployeeFormType) => {
        try {
            const created = await createEmployee(
                ApiRoutes.Employee.CreateOne,
                "POST",
                newEmployee
            );
            if (created) {
                mutate();
                enqueueSnackbar("Employee added successfully", {
                    variant: "success",
                });
                router.push("/employees");
                return created;
            } else {
                const error = createEmployeeError as AxiosError;
                console.log("ERROR: ", error?.response?.data);
                enqueueSnackbar("Employee not added", {
                    variant: "error",
                });
                return error.response?.data;
            }
        } catch (err) {
            console.log("Catch Error", err)
            enqueueSnackbar("Something Went Wrong!", {
                variant: "error",
            });
            throw err;
        }
    };

    const updateEmployee = async (newEmployee: EmployeeFormType, employeeId: number) => {
        try {
            const created = await patchEmployee(
                ApiRoutes.Employee.UpdateOne.replace("{id}", employeeId?.toString()),
                "PUT",
                newEmployee
            );
            if (created) {
                mutate();
                enqueueSnackbar("Employee added successfully", {
                    variant: "success",
                });
                router.push(`/employees/${employeeId}`);
                return created;
            } else {
                const error = patchEmployeeError as AxiosError;
                console.log("ERROR: ", error.response?.data);
                enqueueSnackbar("Employee not added", {
                    variant: "error",
                });
                return error.response?.data;
            }
        } catch (err) {
            enqueueSnackbar("Something Went Wrong!", {
                variant: "error",
            });
            throw err;
        }
    };


    //TODO: Add logic to CRUD user role
    return {
        employees,
        error,
        isLoading,
        page,
        setPage,
        addEmployee,
        getEmployeeById,
        updateEmployee
    }
}