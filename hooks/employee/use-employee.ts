"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import {
  EmployeeCount,
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
import { CreateContractInput, CreateEmployeeRequestBody, EmployeeContract, UpdateEmployeeRequestBody } from "@/schemas/employee.schema";

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
  v: _v
}: Partial<EmployeesSearchParams & { autoFetch?: boolean, v?: string }>) {
  const [page, setPage] = useState(pageParam);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const { start: startProgress, stop: stopProgress } = useProgressBar();
  const {
    data: employees,
    error,
    mutate,
  } = useSWR<PaginatedResponse<EmployeeList> | null>(
    autoFetch ? stringConstructor(
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
    ) : null, // Endpoint to fetch Locations
    async (url) => {
      if (!url) {
        return {
          results: [],
          count: 0,
          page_size: 0,
          next: null,
          previous: null,
        };
      }
      const response = await api.get(url);
      if (!response.data.data) {
        return null;
      }
      return response.data.data; // Assuming API returns data inside a "data" field
    },
    { shouldRetryOnError: false, dedupingInterval: 10000 }
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
  const readCount = async (options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } =
        await useApi<EmployeeCount>(
          ApiRoutes.Employee.ReadCount,
          "GET",
          {}
        );
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Employee Counts fetched successful!", {
          variant: "success",
        });
      }
      return data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Employee Counts fetching failed",
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
          ApiRoutes.Employee.UpdateOne.replace("{id}", employee.id.toString()),
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
        router.back();
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
  const updateEmployeeContract = async (
    contract: EmployeeContract,
    employeeId: number,
    options?: ApiOptions
  ) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<EmployeeContract>(
        ApiRoutes.Employee.Contract.UpdateOne.replace("{id}", employeeId.toString()),
        "PUT",
        {},
        {...contract}
      );
      if (!response.data) {
        throw new Error("Failed to update contract");
      }
      if (displaySuccess && response.success) {
        enqueueSnackbar("Contract update successful!", { variant: "success" });
      }
      mutate()
      return response.data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to update contract",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };
  const updateEmployeeIsSubContractor = async (
    isSubcontractor: boolean,
    employeeId: number,
    options?: ApiOptions
  ) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<EmployeeContract>(
        ApiRoutes.Employee.Contract.UpdateIsSubContractor.replace("{id}", employeeId.toString()),
        "PUT",
        {},
        {
          is_subcontractor:isSubcontractor
        }
      );
      if (!response.data) {
        throw new Error("Failed to update contract");
      }
      if (displaySuccess && response.success) {
        enqueueSnackbar("Contract update successful!", { variant: "success" });
      }
      mutate()
      return response.data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to update contract",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };
  const readEmployeeContract = async (
    employeeId: number,
    options?: ApiOptions
  ) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();
      const response = await useApi<EmployeeContract>(
        ApiRoutes.Employee.Contract.ReadOne.replace("{id}", employeeId.toString()),
        "GET",
        {},
        {}
      );
      if (!response.data) {
        throw new Error("Failed to retrieve contract");
      }
      if (displaySuccess && response.success) {
        enqueueSnackbar("Contract retrieve successful!", { variant: "success" });
      }
      mutate()
      return response.data;
    } catch (err: any) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to retrieve contract",
        { variant: "error" }
      );
      throw err;
    } finally {
      if (displayProgress) stopProgress();
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
    readCount,
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
    updateOne,
    updateEmployeeContract,
    readEmployeeContract,
    mutate,
    updateEmployeeIsSubContractor
  };
}
