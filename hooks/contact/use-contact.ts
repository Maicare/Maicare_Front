import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Contact, CreateContact } from "@/schemas/contact.schema";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";

export function useContact({search,autoFetch}:{ search?: string,autoFetch: boolean }) {
  const [page, setPage] = useState(1);
  const page_size = 10;
  const { start: startProgress, stop: stopProgress } = useProgressBar();


  const {
    data: contacts,
    error,
    mutate,
  } = useSWR<PaginatedResponse<Contact>>(
    autoFetch ? `${ApiRoutes.Contact.ReadAll}?page=${page}&page_size=${page_size}${search ? `&search=${search}` : ""
    }`: null,
    async (url) => {
      if (!url) return null; // Return null if URL is not defined
      // Fetch data from the API
      const response = await api.get(url);
      if (!response.data.data) {
        return null;
      }
      return response.data.data;
    },
    { shouldRetryOnError: false }
  );
  const isLoading = !contacts && !error;

  const createOne = async (contact: CreateContact, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};

    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<Contact>(ApiRoutes.Contact.AddContact, "POST", {}, contact);

      if (!data)
        throw new Error(error || message || "An unknown error occurred");
      if (displaySuccess && success)
        enqueueSnackbar("Contact created successfully", { variant: "success" });

      return data
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.message || "Contact creation failed", { variant: "error" });
      throw error;
    }finally {
      if (displayProgress) stopProgress();
    }

  }

  const readOne = async (id: number, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<Contact>(ApiRoutes.Contact.ReadOne.replace("{id}", id.toString()), "GET", {});
      if (!data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Contact Details fetched successful!", { variant: "success" });
      }
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Contact Details fetching failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  }

  const updateOne = async (id: number, contact: CreateContact, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      if (displayProgress) startProgress();

      const { message, success, data, error } = await useApi<Contact>(ApiRoutes.Contact.UpdateOne.replace("{id}", id.toString()), "PUT", {}, contact);

      if (!data)
        throw new Error(error || message || "An unknown error occurred");
      if (displaySuccess && success)
        enqueueSnackbar("Employee updated successfully", { variant: "success" });

      return data
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.message || "Employee update  failed", { variant: "error" });
      throw error;
    }finally {
      if (displayProgress) stopProgress();
    }
  }

  return {
    contacts,
    error,
    isLoading,
    page,
    setPage,
    mutate,
    createOne,
    readOne,
    updateOne
  };
}
