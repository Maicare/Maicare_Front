import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Id } from "@/common/types/types";
import { useSnackbar } from "notistack";

export function useECR() {
    const { enqueueSnackbar } = useSnackbar();

    const { start: startProgress, stop: stopProgress } = useProgressBar();


    const readDischargeOverview = async (options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } =
                await useApi<PaginatedResponse<{
                    contract_end_date: string,
                    contract_status: string,
                    current_status: string,
                    departure_reason: string,
                    discharge_type: string,
                    first_name: string,
                    follow_up_plan: string,
                    id: Id,
                    last_name: string,
                    scheduled_status: string,
                    status_change_date: string,
                    status_change_reason: string
                }>>(
                    ApiRoutes.ECR.DischargeOverview+"?page_size=10&page=1&filter_type=all",
                    "GET",
                    {}
                );
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("ECR Discharge Overview fetched successful!", {
                    variant: "success",
                });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(
                err?.response?.data?.message || "ECR Discharge Overview fetching failed",
                { variant: "error" }
            );
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    };

    const readEmployeeEndingContracts = async (options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<{
                contract_end_date: string,
                contract_start_date: string,
                contract_type: string,
                department: string,
                email: string,
                employee_number: string,
                employment_number: string,
                first_name: string,
                id: Id,
                last_name: string,
                position: string
            }[]>(ApiRoutes.ECR.EmployeeEndingContracts, "GET", {});
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Employee ending contracts fetched successfully!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Employee ending contracts fetching failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const readLatestPayments = async (options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<{
                amount: Number,
                invoice_id: Id,
                invoice_number: string,
                payment_date: string,
                payment_method: string,
                payment_status: string,
                updated_at: string
            }[]>(ApiRoutes.ECR.LatestPayments, "GET", {});
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Latest payments fetched successfully!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Latest payments fetching failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const readTotalDischargeCount = async (options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } =
                await useApi<{
                    contract_end_count: Number,
                    status_change_count: Number,
                    total_discharge_count: Number,
                    urgent_cases_count: Number
                }>(
                    ApiRoutes.ECR.TotalDischargeCount,
                    "GET",
                    {}
                );
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Total Discharge Count fetched successfully!", {
                    variant: "success",
                });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(
                err?.response?.data?.message || "Total Discharge Count fetching failed",
                { variant: "error" }
            );
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    };

    const readUpcomingAppointments = async (options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<{
                description: string,
                end_time: string,
                id: string,
                location: string,
                start_time: string
            }[]>(ApiRoutes.ECR.UpcomingAppointments, "GET", {}, {});
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Upcoming appointments fetched successfully!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Upcoming appointments fetching failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    return {
        readDischargeOverview,
        readEmployeeEndingContracts,
        readLatestPayments,
        readTotalDischargeCount,
        readUpcomingAppointments
    };
}
