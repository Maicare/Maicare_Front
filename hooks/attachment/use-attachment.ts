import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { Attachment } from "@/types/attachment.types";
import { useSnackbar } from "notistack";


export function useAttachment() {
    const { enqueueSnackbar } = useSnackbar();
    const { start: startProgress, stop: stopProgress } = useProgressBar();

    const createOne = async (formData: FormData, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Attachment>(ApiRoutes.Attachment.CreateOne, "POST", {
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

    const readOne = async (id:string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Attachment>(ApiRoutes.Attachment.ReadOne.replace('{id}',id), "GET");
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("File retrieved successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "File retrieving failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const deleteOne = async (id:string, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Attachment>(ApiRoutes.Attachment.DeleteOne.replace('{id}',id), "DELETE");
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("File deleted successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "File deleting failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    //TODO: Add logic to CRUD user role
    return {
        readOne,
        createOne,
        deleteOne
    }
}