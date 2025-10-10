"use client";

import PrimaryButton from "@/common/components/PrimaryButton";
import ExperienceItem from "@/components/employee/experiences/ExperienceItem";
import { Briefcase, PlusCircle } from "lucide-react";
import { useState } from "react";
import UpsertExperienceForm from "./_components/UpsertExperienceForm";
import { CreateExperience } from "@/schemas/experience.schema";
import { useExperience } from "@/hooks/experience/use-experience";
import { Experience } from "@/types/experience.types";
import { useModal } from "@/components/providers/ModalProvider";
import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import Loader from "@/components/common/loader";
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import { useParams } from "next/navigation";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const Page = () => {
    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState(false);
    const [experience, setExperience] = useState<CreateExperience & { id: number } | null>(null);
    const {employeeId} = useParams();


    const { isLoading, experiences, mutate, deleteOne } = useExperience({ autoFetch: true, employeeId: employeeId as string });

    const { open } = useModal(
        getDangerActionConfirmationModal({
            msg: "Weet u zeker dat u deze ervaring wilt verwijderen?",
            title: "Ervaring Verwijderen",
        })
    );

    const handleAdd = () => {
        setAdding(true);
        mutate();
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Optioneel: Voegt soepele scroll toe
        });
    }
    const cancelAdd = () => {
        setAdding(false);
        mutate();
    }
    const handleEdit = (experience: Experience) => {
        const transformed: CreateExperience & { id: number } = {
            ...experience,
            start_date: new Date(experience.start_date),
            end_date: new Date(experience.end_date),
            id: experience.id
        }
        setExperience(transformed);
        setEditing(true);
        mutate();
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Optioneel: Voegt soepele scroll toe
        });
    }
    const cancelEdit = () => {
        setEditing(false);
        mutate();
    }

    const handleDelete = async (experience: Experience) => {
        open({
            onConfirm: async () => {
                try {
                    await deleteOne(experience, { displayProgress: true, displaySuccess: true });
                } catch (error) {
                    console.log(error);
                }
            },
        });
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <Briefcase size={24} className='text-indigo-400' />  Werkervaring
                </h1>
                <PrimaryButton
                    text="Toevoegen"
                    onClick={handleAdd}
                    disabled={adding}
                    icon={PlusCircle}
                    animation="animate-bounce"
                    className="bg-indigo-400 text-white"
                />
            </div>
            {adding ?
                <UpsertExperienceForm employeeId={parseInt(employeeId as string)} onCancel={cancelAdd} mode="add" onSuccess={cancelAdd} />
                : editing ?
                    <UpsertExperienceForm employeeId={parseInt(employeeId as string)} onCancel={cancelEdit} mode="update" onSuccess={cancelEdit} defaultValues={experience || undefined} />
                    : null
            }
            <div className="w-full bg-white p-4 rounded-md shadow-md">
                {
                    isLoading ?
                        <Loader />
                        : experiences?.length === 0 ?
                            <LargeErrorMessage
                                firstLine={"Oeps!"}
                                secondLine={
                                    "Het lijkt erop dat er nog geen werkervaring is toegevoegd voor deze medewerker."
                                }
                            />
                            :
                            <div className="mt-4 w-full h-max border-l-4 border-dashed border-slate-200 pl-6 p-2 flex flex-col gap-6">
                                {
                                    experiences?.map((item, index) => (
                                        <ExperienceItem key={index} first={index === 0} experience={item} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item)} />
                                    ))
                                }
                            </div>
                }
            </div>
        </div>
    )
}

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Voeg correcte permissie toe
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );