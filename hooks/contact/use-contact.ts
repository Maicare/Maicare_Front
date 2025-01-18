import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Contact } from "@/types/contacts.types";
import { useState } from "react";
import useSWR from "swr";

export function useContact(search?: string) {
  const [page, setPage] = useState(1);
  const page_size = 10;

  const {
    data: contacts,
    error,
    mutate,
  } = useSWR<PaginatedResponse<Contact>>(
    `${ApiRoutes.Contact.ReadAll}?page=${page}&page_size=${page_size}${
      search ? `&search=${search}` : ""
    }`,
    async (url) => {
      const response = await api.get(url);
      if (!response.data.data) {
        return null;
      }
      return response.data.data;
    },
    { shouldRetryOnError: false }
  );
  const isLoading = !contacts && !error;

  return {
    contacts,
    error,
    isLoading,
    page,
    setPage,
    mutate,
  };
}
