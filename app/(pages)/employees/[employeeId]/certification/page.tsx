"use client";

import PrimaryButton from "@/common/components/PrimaryButton";
import {  BookMarked, PlusCircle } from "lucide-react";
import { useState } from "react";
import UpsertCertificationForm from "./_components/UpsertCertificationForm";
import { CreateCertificate } from "@/schemas/certification.schema";
import { useCertificate } from "@/hooks/certificate/use-certificate";
import { useModal } from "@/components/providers/ModalProvider";
import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import { Certification } from "@/types/certification.types";
import CertificationItem from "./_components/CertificationItem";
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
    const [certification, setCertification] = useState<CreateCertificate & { id: number } | null>(null);
    const {employeeId} = useParams();

    const { isLoading, certificates, mutate, deleteOne } = useCertificate({ autoFetch: true, employeeId: employeeId as string });

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
            behavior: "smooth", // Optional: Adds smooth scrolling
        });
    }
    const cancelAdd = () => {
        setAdding(false);
        mutate();
    }
    const handleEdit = (certification: Certification) => {
        const transformed: CreateCertificate & { id: number } = {
            ...certification,
            date_issued: new Date(certification.date_issued),
            id: certification.id
        }
        setCertification(transformed);
        setEditing(true);
        mutate();
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Optional: Adds smooth scrolling
        });
    }
    const cancelEdit = () => {
        setEditing(false);
        mutate();
    }

    const handleDelete = async (certificate: Certification) => {
        open({
            onConfirm: async () => {
                try {
                    await deleteOne(certificate, { displayProgress: true, displaySuccess: true });
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
                    <BookMarked size={24} className='text-indigo-400' />  Certificaten
                </h1>
                <PrimaryButton
                    text="Add"
                    onClick={handleAdd}
                    disabled={adding}
                    icon={PlusCircle}
                    animation="animate-bounce"
                    className="bg-indigo-400 text-white"
                />
            </div>
            {adding ?
                <UpsertCertificationForm employeeId={parseInt(employeeId as string)} onCancel={cancelAdd} mode="add" onSuccess={cancelAdd} />
                : editing ?
                    <UpsertCertificationForm employeeId={parseInt(employeeId as string)} onCancel={cancelEdit} mode="update" onSuccess={cancelEdit} defaultValues={certification || undefined} />
                    : null
            }
            <div className="grid grid-cols-4 gap-4">
                {
                    isLoading ?
                        <Loader />
                        : certificates?.length === 0 ?
                            <div className="col-span-4 w-full flex items-center justify-center">
                                <LargeErrorMessage
                                firstLine={"Oops!"}
                                secondLine={
                                    "Het lijkt erop dat er geen medewerkers zijn die aan uw zoekcriteria voldoen."
                                }
                                className="w-full"
                            />
                            </div>
                            :

                            certificates?.map((item, index) => (
                                <CertificationItem key={index} certification={item} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item)} />
                            ))
                }
            </div>
        </div>
    )
}

export default withAuth(
  withPermissions(Page, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );