"use client";

import PrimaryButton from "@/common/components/PrimaryButton";
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import Loader from "@/components/common/loader";
import { DataTable } from "@/components/employee/table/data-table";
import { useDiagnosis } from "@/hooks/diagnosis/use-diagnosis";
import { ArrowBigLeft, ArrowBigRight, HeartPulse, PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./_components/columns";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const MedicalPage = () => {
    const {clientId} = useParams();
    const router = useRouter();
    const {diagnosis,isLoading,page,setPage} = useDiagnosis({ autoFetch: true, clientId: parseInt(clientId as string) });
    const handlePrevious = () => {
        if (page <= 1) {
            setPage(1);
            return;
        }
        setPage(page - 1);
    }
    const handleNext = () => {
        if (diagnosis?.next) {
            setPage(page + 1);
            return;
        }
    }
    const handleAdd = () => {
        router.push(`/clients/${clientId}/medical-record/create`);
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <HeartPulse size={24} className='text-indigo-400' />  Medisch dossier
                </h1>
                <PrimaryButton
                    text="Toevoegen"
                    onClick={handleAdd}
                    disabled={false}
                    icon={PlusCircle}
                    animation="animate-bounce"
                    className="bg-indigo-400 text-white"
                />
            </div>
            <div className="grid grid-cols-1 gap-4">
                {
                    isLoading ?
                        <Loader />
                        : diagnosis?.results?.length === 0 ?
                            <div className="col-span-4 w-full flex items-center justify-center">
                                <LargeErrorMessage
                                    firstLine="Oeps!"
                                    secondLine="Het lijkt erop dat er geen medische gegevens zijn die aan uw zoekcriteria voldoen."
                                    className="w-full"
                                />
                            </div>
                            :
                            <div className="grid grid-cols-1 gap-4">

                                <DataTable columns={columns} data={diagnosis?.results ?? []} onRowClick={() => { }} className="dark:bg-[#18181b] dark:border-black" />
                                <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
                                    <PrimaryButton
                                        disabled={page === 1}
                                        onClick={handlePrevious}
                                        text="Vorige"
                                        icon={ArrowBigLeft}
                                        iconSide="left"
                                    />
                                    <PrimaryButton
                                        disabled={diagnosis?.next ? false : true}
                                        onClick={handleNext}
                                        text="Volgende"
                                        icon={ArrowBigRight}
                                    />
                                </div>
                            </div>
                }
            </div>
        </div>
    )
}

export default withAuth(
  withPermissions(MedicalPage, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewClientDiagnosis, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );