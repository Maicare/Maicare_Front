"use client";

import EducationItem from "@/components/employee/educations/EducationItem";
import { GraduationCap, PlusCircle } from "lucide-react";
import { useState } from "react";
import UpsertEducationForm from "./_components/UpsertEducationForm";
import { CreateEducation } from "@/schemas/education.schema";
import { useEducation } from "@/hooks/education/use-education";
import { useModal } from "@/components/providers/ModalProvider";
import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import Loader from "@/components/common/loader";
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import { Education } from "@/types/education.types";
import PrimaryButton from "@/common/components/PrimaryButton";
import { useParams } from "next/navigation";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const Page = () => {
    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState(false);
    const [education, setEducation] = useState<CreateEducation & { id: number } | null>(null);
    const {employeeId} = useParams();

    const { isLoading, educations, mutate, deleteOne } = useEducation({ autoFetch: true, employeeId: employeeId as string });

    const { open } = useModal(
        getDangerActionConfirmationModal({
            msg: "Weet u zeker dat u deze opleiding wilt verwijderen?",
            title: "Opleiding Verwijderen",
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
    const handleEdit = (education: Education) => {
        const transformed: CreateEducation & { id: number } = {
            ...education,
            start_date: new Date(education.start_date),
            end_date: new Date(education.end_date),
            id: education.id
        }
        setEducation(transformed);
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

    const handleDelete = async (education: Education) => {
        open({
            onConfirm: async () => {
                try {
                    await deleteOne(education, { displayProgress: true, displaySuccess: true });
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
                    <GraduationCap size={24} className='text-indigo-400' />  Opleidingen
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
                <UpsertEducationForm employeeId={parseInt(employeeId as string)} onCancel={cancelAdd} mode="add" onSuccess={cancelAdd} />
                : editing ?
                    <UpsertEducationForm employeeId={parseInt(employeeId as string)} onCancel={cancelEdit} mode="update" onSuccess={cancelEdit} defaultValues={education || undefined} />
                    : null
            }
            <div className="w-full bg-white p-4 rounded-md shadow-md">
                {
                    isLoading ?
                        <Loader />
                        : educations?.length === 0 ?
                            <LargeErrorMessage
                                firstLine={"Oeps!"}
                                secondLine={
                                    "Het lijkt erop dat er nog geen opleidingen zijn toegevoegd voor deze medewerker."
                                }
                            />
                            :
                            <div className="mt-4 w-full h-max border-l-4 border-dashed border-slate-200 pl-6 p-2 flex flex-col gap-6">
                                {
                                    educations?.map((item, index) => (
                                        <EducationItem key={index} first={index === 0} education={item} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item)} />
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