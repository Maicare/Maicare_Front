"use client";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
// import { useApi } from "@/common/hooks/use-api";
// import useProgressBar from "@/common/hooks/use-progress-bar";
// import { ApiOptions } from "@/common/types/api.types";
// import { Id } from "@/common/types/types";
// import { useSnackbar } from "notistack";
import useSWR from "swr";
import { EmployeeWorkingHoursReport } from "@/types/working-hours.types";

export function useWorkingHours({
  employee_id,
  autoFetch = true,
  month,
  year
}: { employee_id:number,autoFetch?: boolean,year?: string, month?: string }) {
//   const { enqueueSnackbar } = useSnackbar();
//   const { start: startProgress, stop: stopProgress } = useProgressBar();
  const {
    data: workingHoursReport,
    error,
    // mutate,
  } = useSWR<EmployeeWorkingHoursReport | null>(
    autoFetch ? ApiRoutes.Employee.WorkingHours.ReadAll.replace("{id}",employee_id.toString())+`?month=${month}&year=${year}` : null, // Endpoint to fetch clients
    async (url) => {
      if (!url)
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
  const isLoading = !workingHoursReport && !error;

  return {
    workingHoursReport,
    error,
    isLoading,
    // readOne,
    // createOne,
    // updateOne
  };
}
