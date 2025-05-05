import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { useApi } from "@/common/hooks/use-api";
import useProgressBar from "@/common/hooks/use-progress-bar";
import { ApiOptions } from "@/common/types/api.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Id } from "@/common/types/types";
import { CreateGoal } from "@/schemas/goal.schema";
import {  CreateObjective, Goal, GoalWithObjectives } from "@/types/goals.types";
import { CreateReport, Report } from "@/types/reports.types";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { usePathname } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useSWR from "swr";


export function useGoal({ autoFetch = true,clientId,assessmentId,page:pageParam=1,page_size=10 }: { autoFetch?: boolean,clientId:Id,assessmentId:Id,page?:number,page_size?:number }) {
    const { enqueueSnackbar } = useSnackbar();
    const [goals,setGoals] = useState<PaginatedResponse<Goal>>({
        results: [],
        count: 0,
        page_size: 0,
        next: null,
        previous: null
    });
    const [page,setPage] = useState(pageParam);
    const { start: startProgress, stop: stopProgress } = useProgressBar();
    const { data, error, mutate,isLoading } = useSWR<PaginatedResponse<Goal>>(
        stringConstructor(ApiRoutes.Client.Goal.ReadAll.replace("{id}",clientId.toString()).replace("{assessment_id}",assessmentId.toString()), constructUrlSearchParams({ page, page_size })),
        async (url) => {
            if (!autoFetch) {
                return {
                    results: [],
                    count: 0,
                    page_size: 0,
                    next: null,
                    previous: null
                };

            }
            const response = await api.get(url);
            if (!response.data.data || response.data.data.length === 0) {
                return {
                    results: [],
                    count: 0,
                    page_size: 0,
                    next: null,
                    previous: null
                };
            }
            return response.data.data;
        },
        { shouldRetryOnError: false, revalidateOnFocus: true }
    );

    useEffect(()=> {
        if(data){
            setGoals(data);
        }else{
            setGoals({
                results: [],
                count: 0,
                page_size: 0,
                next: null,
                previous: null
            });
        }
    },[data,page]);
    const pathname = usePathname();

    useEffect(() => {
        mutate();  // Forces SWR to re-fetch data
    }, [pathname]);  // Runs when the route changes


    const createOne = async (goal:CreateGoal, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            const transformed_data = {
                ...goal,
                target_level: parseInt(goal.target_level as unknown as string),
            };
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Goal>(ApiRoutes.Client.Goal.CreateOne.replace("{id}",clientId.toString()).replace("{assessment_id}",assessmentId.toString()), "POST", {},transformed_data);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Goal created successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Goal creation failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const updateOne = async (report:CreateReport, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<Report>(ApiRoutes.Report.UpdateOne.replace("{id}",clientId.toString()).replace("{report_id}",report.id!.toString()), "PUT", {},report);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Report updated successful!", { variant: "success" });
            }
            mutate()
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Report update failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }
    const readOne = async (id:Id, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<GoalWithObjectives>(ApiRoutes.Client.Goal.ReadOne.replace("{id}",clientId.toString()).replace("{assessment_id}",assessmentId.toString()).replace("{goal_id}",id.toString()), "GET");
            if (!data)
                throw new Error(error || message || "An unknown error occurred");

            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Goal retrieved successful!", { variant: "success" });
            }
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Goal retrieve failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const generateObjective = async (goalId:Id, options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<{goalId:Id,objectives:CreateObjective[]}>(ApiRoutes.Client.Goal.GenerateObjectives.replace("{id}",clientId.toString()).replace("{assessment_id}",assessmentId.toString()).replace("{goal_id}",goalId.toString()), "POST");
            if (!data)
                throw new Error(error || message || "An unknown error occurred");
            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Objective generated successful!", { variant: "success" });
            }
            return data.objectives;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Objective generation failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    const createObjective = async (goalId:Id, objective:CreateObjective[], options?: ApiOptions) => {
        const { displayProgress = false, displaySuccess = false } = options || {};
        try {
            const transformed_data = objective.map((obj) => {
                return {
                    ...obj,
                    due_date: obj.due_date + "T15:04:05Z",
                };
            });
            // Display progress bar
            if (displayProgress) startProgress();
            const { message, success, data, error } = await useApi<CreateObjective[]>(ApiRoutes.Client.Goal.CreateObjective.replace("{id}",clientId.toString()).replace("{assessment_id}",assessmentId.toString()).replace("{goal_id}",goalId.toString()), "POST", {},transformed_data);
            if (!data)
                throw new Error(error || message || "An unknown error occurred");
            // Display success message
            if (displaySuccess && success) {
                enqueueSnackbar("Objective created successful!", { variant: "success" });
            }
            mutate();
            return data;
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || "Objective creation failed", { variant: "error" });
            throw err;
        } finally {
            if (displayProgress) stopProgress();
        }
    }

    
    return {
        goals,
        error,
        isLoading,
        mutate,
        createOne,
        updateOne,
        readOne,
        generateObjective,
        createObjective,
        page,
        setPage
    }
}