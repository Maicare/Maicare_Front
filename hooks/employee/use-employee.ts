"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import {
  EmployeeDetailsResponse,
  EmployeeList,
  EmployeesSearchParams,
} from "@/types/employee.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";
import { EmployeeForm as EmployeeFormType } from "@/types/employee.types";
import { useMutation } from "@/common/hooks/use-mutate";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Education } from "@/types/education.types";
import { Experience } from "@/types/experience.types";
import { CreateEmployee, CreateEmployeeRequestBody, UpdateEmployeeRequestBody } from "@/schemas/employee.schema";

export function useEmployee({
  search,
  position,
  department,
  out_of_service,
  location_id,
  is_archived,
  page: pageParam = 1,
  page_size = 10,
  autoFetch = true,
}: Partial<EmployeesSearchParams & { autoFetch?: boolean }>) {
  const [page, setPage] = useState(pageParam);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { start: startProgress, stop: stopProgress } = useProgressBar();
  const {
    data: employees,
    error,
    mutate,
  } = useSWR<PaginatedResponse<EmployeeList> | null>(
    stringConstructor(
      ApiRoutes.Employee.ReadAll,
      constructUrlSearchParams({
        search,
        position,
        department,
        out_of_service,
        location_id,
        is_archived,
        page,
        page_size,
      })
    ), // Endpoint to fetch Locations
    async (url) => {
      if (!autoFetch)
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
  const isLoading = !employees && !error;
  const readOne = async (id: number, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } =
        await useApi<EmployeeDetailsResponse>(
          ApiRoutes.Employee.ReadOne.replace("{id}", id.toString()),
          "GET",
          {}
        );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Employee Details fetched successful!", {
          variant: "success",
        });
      }
      return data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Employee Details fetching failed",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };
  const createOne = async (employee: CreateEmployeeRequestBody, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } =
        await useApi<EmployeeDetailsResponse>(
          ApiRoutes.Employee.CreateOne,
          "POST",
          {},
          employee
        );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Employee Created successful!", {
          variant: "success",
        });
      }
      return data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Employee Creation failed",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };
  const updateOne = async (employee: UpdateEmployeeRequestBody, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } =
        await useApi<EmployeeDetailsResponse>(
          ApiRoutes.Employee.UpdateOne.replace("{id}",employee.id.toString()),
          "PUT",
          {},
          employee
        );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Employee Updated successful!", {
          variant: "success",
        });
      }
      return data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Employee Update failed",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const deleteOne = async (id: number, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } =
        await useApi<EmployeeDetailsResponse>(
          ApiRoutes.Employee.DeleteOne.replace("{id}", id.toString()),
          "DELETE",
          {}
        ); //TODO: add correct type later
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Employee Deleted successful!", { variant: "success" });
      }
      return data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Employee Deletion failed",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const updateEmployeePicture = async (
    id: number,
    attachement_id: string,
    options?: ApiOptions
  ) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } =
        await useApi<EmployeeDetailsResponse>(
          ApiRoutes.Employee.UpdateImage.replace("{id}", id.toString()),
          "PUT",
          {},
          { attachement_id }
        ); //TODO: add correct type later
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Employee Deleted successful!", { variant: "success" });
      }
      mutate();
      return data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Employee Deletion failed",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const { mutate: createEmployee, error: createEmployeeError } =
    useMutation<EmployeeFormType>();
  const { mutate: patchEmployee, error: patchEmployeeError } =
    useMutation<EmployeeFormType>();

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
      console.log("Catch Error", err);
      enqueueSnackbar("Something Went Wrong!", {
        variant: "error",
      });
      throw err;
    }
  };

  const updateEmployee = async (
    newEmployee: EmployeeFormType,
    employeeId: number
  ) => {
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

  const readEmployeesEmails = async (search: string) => {
    try {
      const { data } = await api.get(
        ApiRoutes.Employee.ReadEmails + "?search=" + search
      );
      if (!data) {
        throw new Error("Emails not found");
      }
      return data;
    } catch (err) {
      console.log("Catch Error", err);
      enqueueSnackbar("Something Went Wrong!", {
        variant: "error",
      });
      throw err;
    }
  };

  //TODO: Add logic to CRUD user role
  return {
    employees,
    readOne,
    error,
    isLoading,
    page,
    deleteOne,
    setPage,
    addEmployee,
    updateEmployee,
    updateEmployeePicture,
    readEmployeesEmails,
    createOne,
    updateOne
  };
}
