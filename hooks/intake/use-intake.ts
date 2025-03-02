import api from "@/common/api/axios";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { useState } from "react";
import useSWR from "swr";
import { Diagnosis, DiagnosisForm } from "@/types/diagnosis.types";
import { PaginationParams } from "@/types/pagination.types";
import ApiRoutes from "@/common/api/routes";
import { ApiOptions } from "@/common/types/api.types";
import { useSnackbar } from "notistack";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { useApi } from "@/common/hooks/use-api";
import { useRouter } from "next/navigation";
import { Appointment as AppointmentType } from "@/types/appointment.types";
import { IntakeFormType } from "@/types/intake.types";
import { Attachment } from "@/types/attachment.types";

export function useIntake() {

    const router = useRouter();


    const { enqueueSnackbar } = useSnackbar();
    const { start: startProgress, stop: stopProgress } = useProgressBar();


    const sendIntakeForm = async (intakeData: IntakeFormType, options?: ApiOptions) => {
        const { displayProgress = false } = options || {};
        try {
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<AppointmentType>(`${ApiRoutes.IntakeForm.CreateOne}`, "POST", {}, intakeData);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            enqueueSnackbar("Intake Form submitted successfully!", { variant: "success" });
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Intake Form submitted failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const uploadFileForIntake = async (formData: FormData, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Attachment>(ApiRoutes.IntakeForm.upload, "POST", {
                headers: {
                    "Content-Type": "multipart/form-data", // Ensure multipart encoding
                }
            }, formData);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("File uploaded successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "File upload failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    return {
        sendIntakeForm,
        uploadFileForIntake
    };
}
