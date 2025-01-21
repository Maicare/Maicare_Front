"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Id } from "@/common/types/types";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";
import { Client, CreateClientInput } from "@/types/client.types";


export function useClient({autoFetch=true}: {autoFetch?: boolean}) {
    const [page, setPage] = useState(1);
    const { enqueueSnackbar } = useSnackbar();
    const { start: startProgress, stop: stopProgress } = useProgressBar();
    const { data: clients, error } = useSWR<PaginatedResponse<Client> | null>(ApiRoutes.Client.ReadAll, // Endpoint to fetch Locations
        async (url) => {
            if (!autoFetch) return {
                results: [],
                count: 0,
                page_size: 0,
                next: null,
                previous: null
            };
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );
    const isLoading = !clients && !error;

    const dummyClients: Client[] = [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          organisation: "TechCorp",
          location: "New York",
          legal_measure: "None",
          birthplace: "Los Angeles",
          departement: "IT",
          gender: "Male",
          filenumber: "12345",
          phone_number: "+1-555-1234",
          bsn: "678910",
          source: "Referral",
          date_of_birth: "1990-01-15",
          city: "New York",
          Zipcode: "10001",
          addresses: [
            {
              belongs_to: "John Doe",
              address: "123 Main Street",
              city: "New York",
              zip_code: "10001",
              phone_number: "+1-555-1234",
            },
          ],
          infix: "",
          streetname: "Main Street",
          street_number: "123",
          added_identity_documents: ["passport", "driver_license"],
          removed_identity_documents: ["old_id_card"],
          departure_reason: "Relocation",
          departure_report: "Moved to another city",
          profile_picture: "https://example.com/profiles/john_doe.jpg",
          sender_id:1
        },
        {
          id: 2,
          first_name: "Jane",
          last_name: "Smith",
          email: "jane.smith@example.com",
          organisation: "HealthCare Inc.",
          location: "San Francisco",
          legal_measure: "Under Investigation",
          birthplace: "Chicago",
          departement: "HR",
          gender: "Female",
          filenumber: "67890",
          phone_number: "+1-555-5678",
          bsn: "112233",
          source: "Website Signup",
          date_of_birth: "1985-05-20",
          city: "San Francisco",
          Zipcode: "94103",
          addresses: [
            {
              belongs_to: "Jane Smith",
              address: "456 Market Street",
              city: "San Francisco",
              zip_code: "94103",
              phone_number: "+1-555-5678",
            },
            {
              belongs_to: "Jane Smith",
              address: "789 Oak Street",
              city: "San Francisco",
              zip_code: "94107",
              phone_number: "+1-555-5678",
            },
          ],
          infix: "van",
          streetname: "Market Street",
          street_number: "456",
          added_identity_documents: ["passport"],
          removed_identity_documents: [],
          departure_reason: undefined,
          departure_report: undefined,
          profile_picture: "https://example.com/profiles/jane_smith.jpg",
          sender_id:1

        },
        {
          id: 3,
          first_name: "Alice",
          last_name: "Johnson",
          email: "alice.johnson@example.com",
          organisation: "Finance Solutions",
          location: "Austin",
          legal_measure: "Legal Hold",
          birthplace: "Houston",
          departement: "Finance",
          gender: "Female",
          filenumber: "54321",
          phone_number: "+1-555-9876",
          bsn: "445566",
          source: "Direct Contact",
          date_of_birth: "1995-10-30",
          city: "Austin",
          Zipcode: "73301",
          addresses: [
            {
              belongs_to: "Alice Johnson",
              address: "321 Congress Ave",
              city: "Austin",
              zip_code: "73301",
              phone_number: "+1-555-9876",
            },
          ],
          infix: "",
          streetname: "Congress Ave",
          street_number: "321",
          added_identity_documents: [],
          removed_identity_documents: ["expired_passport"],
          departure_reason: "Job Termination",
          departure_report: "Contract ended on 2023-12-31",
          profile_picture: undefined,
          sender_id:1

        },
      ];


    const readOne = async (id: Id, options?: ApiOptions) => {
        const { displayProgress = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const response = await useApi<Client>(ApiRoutes.Client.ReadOne.replace("{id}",id.toString()), "GET");
            if (!response.data) {
                throw new Error("Client not found");
            }
            return response.data;
        } catch (err:any) {
            enqueueSnackbar(err?.response?.data?.message || "Failed to fetch client", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const createOne = async (data: CreateClientInput, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const response = await useApi<Client>(ApiRoutes.Client.CreateOne, "POST", {}, data);
            if (!response.data) {
                throw new Error("Failed to create client");
            }
            if (displaySuccess && response.success) {
                enqueueSnackbar("Client created successful!", { variant: "success" });
              }
            return response.data;
        } catch (err:any) {
            enqueueSnackbar(err?.response?.data?.message || "Failed to create client", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    //TODO: Add logic to CRUD user role
    return {
        clients:{
            results:dummyClients,
            count:dummyClients.length,
            page_size:dummyClients.length,
            next:null,
            previous:null
        },
        error,
        isLoading,
        page,
        setPage,
        readOne,
        createOne
    }
}