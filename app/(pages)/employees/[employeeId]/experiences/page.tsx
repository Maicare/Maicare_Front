"use client";

import Loader from "@/components/common/loader";
import EmployeeBackground from "@/components/employee/EmployeeBackground";
import { useExperience } from "@/hooks/experience/use-experience";
import { useParams } from "next/navigation";
import React, { FunctionComponent } from "react";
import ExperienceForm from "@/components/employee/experiences/ExperienceForm";
import ExperiencesList from "@/components/employee/experiences/ExperiencesList";



const ExperiencesPage: FunctionComponent = () => {
    const params = useParams();
    const { employeeId } = params;
    const { experiences, isLoading, mutate } = useExperience({ autoFetch: true, employeeId: employeeId as string });

    if (!employeeId) {
        return null;
    }

    if (isLoading) {
        return <Loader />
    }
    if (!experiences) {
        return null;
    }
    return (
        <EmployeeBackground
            title={"Ervaringen"}
            addButtonText={"+ Ervaring Toevoegen"}
            cancelText={"Toevoegen Ervaring Annuleren"}
            errorText={"Een fout trad op tijdens het ophalen van ervaringen."}
            employeeId={+employeeId}
            query={experiences}
            ListComponent={ExperiencesList}
            FormComponent={ExperienceForm}
            isLoading={isLoading}
            mutate={() => mutate()}
        />
    );
};

export default ExperiencesPage;
