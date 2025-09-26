"use client";

import GoalDetails from "@/components/clients/goals/GoalDetails";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import { useParams } from "next/navigation";

const GoalDetailsPage = () => {
    const { assessmentId, clientId, goalId } = useParams();

    return (
        <>
            {/* TODO: add full path with routes to path props */}
            <Breadcrumb pageName="Goal & Objectives" />
            <GoalDetails assessmentId={assessmentId as string} clientId={clientId as string} goalId={goalId as string} />
        </>
    )
}

export default GoalDetailsPage