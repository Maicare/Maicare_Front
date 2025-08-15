import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { Any, Id } from "@/common/types/types";
import { CreateAction, CreateIntervention, CreateObjective, CreateResource, CreateRisk, CreateSuccessMetric, CreateSupportNetwork, UpdateOverview } from "@/schemas/plan-care.schema";
import { CarePlanOverview, Intervention, Objective, Resource, Risk, SuccessMetric, SupportNetwork } from "@/types/care-plan.types";
import { enqueueSnackbar } from "notistack";
import useSWR from "swr";

export function useCarePlan({
    resources = false,
    risks = false,
    interventions = false,
    objectives = false,
    successMetrics = false,
    overview = false,
    carePlanId,
    supportNetwork = false
}: {
    resources?: boolean;
    risks?: boolean;
    interventions?: boolean;
    objectives?: boolean;
    successMetrics?: boolean;
    overview?: boolean;
    supportNetwork?: boolean;
    carePlanId: string;
}) {
    const { start: startProgress, stop: stopProgress } = useProgressBar();

    const autoFetch = resources || risks || interventions || objectives || successMetrics || overview || supportNetwork;
    const getUrl = () => {
        const type = resources ? "resources" : risks ? "risks" : interventions ? "interventions" : objectives ? "objectives" : successMetrics ? "successMetrics" : overview ? "overview" : supportNetwork ? "supportNetwork" : "";
        switch (type) {
            case "resources":
                return ApiRoutes.CarePlan.ReadResources.replace("{id}", carePlanId!);
            case "risks":
                return ApiRoutes.CarePlan.ReadRisks.replace("{id}", carePlanId!);
            case "interventions":
                return ApiRoutes.CarePlan.ReadInterventions.replace("{id}", carePlanId!);
            case "objectives":
                return ApiRoutes.CarePlan.ReadObjectives.replace("{id}", carePlanId!);
            case "successMetrics":
                return ApiRoutes.CarePlan.ReadSuccessMetrics.replace("{id}", carePlanId!);
            case "overview":
                return ApiRoutes.CarePlan.ReadOverview.replace("{id}", carePlanId!);
            case "supportNetwork":
                return ApiRoutes.CarePlan.ReadSupportNetwork.replace("{id}", carePlanId!);
            default:
                return "";
        }
    };
    const {
        data,
        error,
        mutate,
    } = useSWR<Resource[] | Risk[] | Intervention | Objective | SuccessMetric[] | CarePlanOverview | SupportNetwork[]>(
        autoFetch ?
            getUrl()
            : null, // Endpoint to fetch clients
        async (url) => {
            if (!url)
                return null;
            const response = await api.get(url);
            if (!response.data.data) {
                return null;
            }
            return response.data.data; // Assuming API returns data inside a "data" field
        },
        { shouldRetryOnError: false }
    );
    const isLoading = !data && !error;

    const createResource = async (resource: CreateResource, options?: ApiOptions) => {
        if (!carePlanId) {
            enqueueSnackbar("Care Plan ID is required", { variant: "error" });
            return;
        }
        options?.displayProgress && startProgress();
        try {
            const { message, success, data } = await useApi<Resource>(ApiRoutes.CarePlan.CreateResource.replace("{id}", carePlanId), "POST", {}, resource);
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Resource created successfully", { variant: "success" });
                mutate(); // Re-fetch data after creating a resource
                return data;
            } else {
                enqueueSnackbar(message || "Failed to create resource", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to create resource", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };
    const updateResource = async (resource: CreateResource, resourceId: Id, options?: ApiOptions) => {
        options?.displayProgress && startProgress();
        try {
            const { message, success, data } = await useApi<Resource>(ApiRoutes.CarePlan.UpdateResource.replace("{resourceId}", resourceId.toString()), "PUT", {}, resource);
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Resource updated successfully", { variant: "success" });
                mutate(); // Re-fetch data after updating a resource
                return data;
            } else {
                enqueueSnackbar(message || "Failed to update resource", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to update resource", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };
    const deleteResource = async (resourceId: Id, options?: ApiOptions) => {
        options?.displayProgress && startProgress();
        try {
            const { message, success } = await useApi(ApiRoutes.CarePlan.DeleteResource.replace("{resourceId}", resourceId.toString()), "DELETE", {}, {});
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Resource deleted successfully", { variant: "success" });
                mutate(); // Re-fetch data after deleting a resource
            } else {
                enqueueSnackbar(message || "Failed to delete resource", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to delete resource", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const createSupportNetwork = async (supportNetwork: CreateSupportNetwork, options?: ApiOptions) => {
        if (!carePlanId) {
            enqueueSnackbar("Care Plan ID is required", { variant: "error" });
            return;
        }
        options?.displayProgress && startProgress();
        try {
            const { message, success, data } = await useApi<SupportNetwork>(ApiRoutes.CarePlan.CreateSupportNetwork.replace("{id}", carePlanId), "POST", {}, supportNetwork);
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Support Network created successfully", { variant: "success" });
                mutate(); // Re-fetch data after creating a support network
                return data;
            } else {
                enqueueSnackbar(message || "Failed to create support network", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to create support network", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const updateSupportNetwork = async (supportNetwork: CreateSupportNetwork, supportNetworkId: Id, options?: ApiOptions) => {
        options?.displayProgress && startProgress();
        try {
            const { message, success, data } = await useApi<SupportNetwork>(ApiRoutes.CarePlan.UpdateSupportNetwork.replace("{supportNetworkId}", supportNetworkId.toString()), "PUT", {}, supportNetwork);
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Support Network updated successfully", { variant: "success" });
                mutate(); // Re-fetch data after updating a support network
                return data;
            } else {
                enqueueSnackbar(message || "Failed to update support network", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to update support network", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const deleteSupportNetwork = async (supportNetworkId: Id, options?: ApiOptions) => {
        options?.displayProgress && startProgress();
        try {
            const { message, success } = await useApi<Any>(ApiRoutes.CarePlan.DeleteSupportNetwork.replace("{supportNetworkId}", supportNetworkId.toString()), "DELETE", {}, {});
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Support Network deleted successfully", { variant: "success" });
                mutate(); // Re-fetch data after deleting a support network
            } else {
                enqueueSnackbar(message || "Failed to delete support network", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to delete support network", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const createRisk = async (risk: CreateRisk, options?: ApiOptions) => {
        if (!carePlanId) {
            enqueueSnackbar("Care Plan ID is required", { variant: "error" });
            return;
        }
        options?.displayProgress && startProgress();
        try {
            const { message, success, data } = await useApi<Risk>(ApiRoutes.CarePlan.CreateRisks.replace("{id}", carePlanId), "POST", {}, risk);
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Risk created successfully", { variant: "success" });
                mutate(); // Re-fetch data after creating a risk
                return data;
            } else {
                enqueueSnackbar(message || "Failed to create risk", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to create risk", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const updateRisk = async (risk: CreateRisk, riskId: Id, options?: ApiOptions) => {
        options?.displayProgress && startProgress();
        try {
            const { message, success, data } = await useApi<Risk>(ApiRoutes.CarePlan.UpdateRisks.replace("{riskId}", riskId.toString()), "PUT", {}, risk);
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Risk updated successfully", { variant: "success" });
                mutate(); // Re-fetch data after updating a risk
                return data;
            } else {
                enqueueSnackbar(message || "Failed to update risk", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to update risk", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const deleteRisk = async (riskId: Id, options?: ApiOptions) => {
        options?.displayProgress && startProgress();
        try {
            const { message, success } = await useApi(ApiRoutes.CarePlan.DeleteRisks.replace("{riskId}", riskId.toString()), "DELETE", {}, {});
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Risk deleted successfully", { variant: "success" });
                mutate(); // Re-fetch data after deleting a risk
            } else {
                enqueueSnackbar(message || "Failed to delete risk", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to delete risk", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const createSuccessMetric = async (metric: CreateSuccessMetric, options?: ApiOptions) => {
        if (!carePlanId) {
            enqueueSnackbar("Care Plan ID is required", { variant: "error" });
            return;
        }
        options?.displayProgress && startProgress();
        try {
            const { message, success, data } = await useApi<SuccessMetric>(ApiRoutes.CarePlan.CreateSuccessMetrics.replace("{id}", carePlanId), "POST", {}, metric);
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Success Metric created successfully", { variant: "success" });
                mutate(); // Re-fetch data after creating a success metric
                return data;
            } else {
                enqueueSnackbar(message || "Failed to create success metric", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to create success metric", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const updateSuccessMetric = async (metric: CreateSuccessMetric, metricId: Id, options?: ApiOptions) => {
        options?.displayProgress && startProgress();
        try {
            const { message, success, data } = await useApi<SuccessMetric>(ApiRoutes.CarePlan.UpdateSuccessMetrics.replace("{metricId}", metricId.toString()), "PUT", {}, metric);
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Success Metric updated successfully", { variant: "success" });
                mutate(); // Re-fetch data after updating a success metric
                return data;
            } else {
                enqueueSnackbar(message || "Failed to update success metric", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to update success metric", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const deleteSuccessMetric = async (metricId: Id, options?: ApiOptions) => {
        options?.displayProgress && startProgress();
        try {
            const { message, success } = await useApi(ApiRoutes.CarePlan.DeleteSuccessMetrics.replace("{metricId}", metricId.toString()), "DELETE", {}, {});
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Success Metric deleted successfully", { variant: "success" });
                mutate(); // Re-fetch data after deleting a success metric
            } else {
                enqueueSnackbar(message || "Failed to delete success metric", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to delete success metric", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const createIntervention = async (intervention: CreateIntervention, options?: ApiOptions) => {
        if (!carePlanId) {
            enqueueSnackbar("Care Plan ID is required", { variant: "error" });
            return;
        }
        options?.displayProgress && startProgress();
        try {
            const { message, success, data } = await useApi<Intervention>(ApiRoutes.CarePlan.CreateInterventions.replace("{id}", carePlanId), "POST", {}, intervention);
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Intervention created successfully", { variant: "success" });
                mutate(); // Re-fetch data after creating an intervention
                return data;
            } else {
                enqueueSnackbar(message || "Failed to create intervention", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to create intervention", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const updateIntervention = async (intervention: CreateIntervention, interventionId: Id, options?: ApiOptions) => {
        options?.displayProgress && startProgress();
        try {
            const { message, success, data } = await useApi<Intervention>(ApiRoutes.CarePlan.UpdateInterventions.replace("{interventionId}", interventionId.toString()), "PUT", {}, intervention);
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Intervention updated successfully", { variant: "success" });
                mutate(); // Re-fetch data after updating an intervention
                return data;
            } else {
                enqueueSnackbar(message || "Failed to update intervention", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to update intervention", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const deleteIntervention = async (interventionId: Id, options?: ApiOptions) => {
        options?.displayProgress && startProgress();
        try {
            const { message, success } = await useApi(ApiRoutes.CarePlan.DeleteInterventions.replace("{interventionId}", interventionId.toString()), "DELETE", {}, {});
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Intervention deleted successfully", { variant: "success" });
                mutate(); // Re-fetch data after deleting an intervention
            } else {
                enqueueSnackbar(message || "Failed to delete intervention", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to delete intervention", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const createObjective = async (objective: CreateObjective, options?: ApiOptions) => {
        if (!carePlanId) {
            enqueueSnackbar("Care Plan ID is required", { variant: "error" });
            return;
        }
        options?.displayProgress && startProgress();
        try {
            const { message, success, data } = await useApi<Objective>(ApiRoutes.CarePlan.CreateObjectives.replace("{id}", carePlanId), "POST", {}, objective);
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Objective created successfully", { variant: "success" });
                mutate(); // Re-fetch data after creating an objective
                return data;
            } else {
                enqueueSnackbar(message || "Failed to create objective", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to create objective", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const updateObjective = async (objective: CreateObjective, objectiveId: Id, options?: ApiOptions) => {
        options?.displayProgress && startProgress();
        try {
            const { message, success, data } = await useApi<Objective>(ApiRoutes.CarePlan.UpdateObjectives.replace("{objectiveId}", objectiveId.toString()), "PUT", {}, objective);
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Objective updated successfully", { variant: "success" });
                mutate(); // Re-fetch data after updating an objective
                return data;
            } else {
                enqueueSnackbar(message || "Failed to update objective", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to update objective", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const deleteObjective = async (objectiveId: Id, options?: ApiOptions) => {
        options?.displayProgress && startProgress();
        try {
            const { message, success } = await useApi(ApiRoutes.CarePlan.DeleteObjectives.replace("{objectiveId}", objectiveId.toString()), "DELETE", {}, {});
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Objective deleted successfully", { variant: "success" });
                mutate(); // Re-fetch data after deleting an objective
            } else {
                enqueueSnackbar(message || "Failed to delete objective", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to delete objective", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const createAction = async (action: CreateAction, objectiveId: Id, options?: ApiOptions) => {
        options?.displayProgress && startProgress();
        try {
            console.log("Creating action for objectiveId:", objectiveId);
            if (!objectiveId) {
                enqueueSnackbar("Objective ID is required", { variant: "error" });
                return;
            }
            if (!action || !action.action_description) {
                enqueueSnackbar("Action description is required", { variant: "error" });
                return;
            }
            const { message, success, data } = await useApi(ApiRoutes.CarePlan.CreateActions.replace("{objectiveId}", objectiveId.toString()), "POST", {}, action);
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Action created successfully", { variant: "success" });
                mutate(); // Re-fetch data after creating an action
                return data;
            } else {
                enqueueSnackbar(message || "Failed to create action", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to create action", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const updateAction = async (action: CreateAction, actionId: Id, options?: ApiOptions) => {
        options?.displayProgress && startProgress();
        try {
            const { message, success, data } = await useApi(ApiRoutes.CarePlan.UpdateActions.replace("{actionId}", actionId.toString()), "PUT", {}, action);
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Action updated successfully", { variant: "success" });
                mutate(); // Re-fetch data after updating an action
                return data;
            } else {
                enqueueSnackbar(message || "Failed to update action", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to update action", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const deleteAction = async (actionId: Id, options?: ApiOptions) => {
        options?.displayProgress && startProgress();
        try {
            const { message, success } = await useApi(ApiRoutes.CarePlan.DeleteActions.replace("{actionId}", actionId.toString()), "DELETE", {}, {});
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Action deleted successfully", { variant: "success" });
                mutate(); // Re-fetch data after deleting an action
            } else {
                enqueueSnackbar(message || "Failed to delete action", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to delete action", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    const updateOverview = async (overview: UpdateOverview, options?: ApiOptions) => {
        if (!carePlanId) {
            enqueueSnackbar("Care Plan ID is required", { variant: "error" });
            return;
        }
        options?.displayProgress && startProgress();
        try {
            const { message, success, data } = await useApi<CarePlanOverview>(ApiRoutes.CarePlan.UpdateOverview.replace("{id}", carePlanId), "PUT", {}, overview);
            if (success) {
                options?.displaySuccess && enqueueSnackbar("Overview updated successfully", { variant: "success" });
                mutate(); // Re-fetch data after updating the overview
                return data;
            } else {
                enqueueSnackbar(message || "Failed to update overview", { variant: "error" });
            }
        } catch (error: Any) {
            enqueueSnackbar(error?.response?.data?.message || "Failed to update overview", { variant: "error" });
        } finally {
            options?.displayProgress && stopProgress();
        }
    };

    return {
        data,
        isLoading,
        createResource,
        updateResource,
        deleteResource,
        createSupportNetwork,
        updateSupportNetwork,
        deleteSupportNetwork,
        createRisk,
        updateRisk,
        deleteRisk,
        createSuccessMetric,
        updateSuccessMetric,
        deleteSuccessMetric,
        createIntervention,
        updateIntervention,
        deleteIntervention,
        createObjective,
        updateObjective,
        deleteObjective,
        createAction,
        updateAction,
        deleteAction,
        updateOverview,
        error,
    };
}
