"use client";

import AssessmentDetails from "@/components/clients/goals/AssessmentDetails";
import AssessmentGoals from "@/components/clients/goals/AssessmentGoals";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import { useParams } from "next/navigation";

const AssessmentPage = () => {
    const { assessmentId,clientId } = useParams();
    return (
        <>
            {/* TODO: add full path with routes to path props */}
            <Breadcrumb pageName="Assessment" />
            <AssessmentDetails assessmentId={assessmentId as string} clientId={clientId as string} />
            <AssessmentGoals assessmentId={assessmentId as string} clientId={clientId as string} />
        </>
    )
}

export default AssessmentPage