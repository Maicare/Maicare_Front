"use client";

import PrimaryButton from "@/common/components/PrimaryButton";
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import Loader from "@/components/common/loader";
import { DataTable } from "@/components/employee/table/data-table";
import { useInvolvedEmployee } from "@/hooks/client-network/use-involved-employee";
import { CreateInvolvedEmployee } from "@/schemas/involvedEmployee.schema";
import { InvolvedEmployeeList } from "@/types/involved.types";
import { ArrowBigLeft, ArrowBigRight, Users2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import CreateInvolvedEmployeeSheet from "./_components/CreateInvolvedEmployeeSheet";
import { getColumns } from "./_components/columns";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const InvolvedEmployeesPage = () => {
    const { clientId } = useParams();
    const { involvedEmployees, isLoading, page, setPage, createOne, updateOne } = useInvolvedEmployee({ clientId: clientId as string, autoFetch: true });
    const [open, setOpen] = useState(false);
    const [involvedEmployee, setInvolvedEmployee] = useState<InvolvedEmployeeList | null>(null);
    const handleOpen = (bool: boolean) => {
        setOpen(bool);
    }
    const handlePrevious = () => {
        if (page <= 1) {
            setPage(1);
            return;
        }
        setPage(page - 1);
    }
    const handleNext = () => {
        if (involvedEmployees?.next) {
            setPage(page + 1);
            return;
        }
    }
    const handleCreate = async (values: CreateInvolvedEmployee) => {
        try {
            await createOne(
                values, {
                displayProgress: true,
                displaySuccess: true
            }
            );
        } catch (error) {
            console.log(error);
        }
    }
    const handleUpdate = async (values: CreateInvolvedEmployee) => {
        try {
            await updateOne(
                values,
                values.id!.toString(),
                {
                    displayProgress: true,
                    displaySuccess: true
                }
            );
        } catch (error) {
            console.log(error);
        }
    }

    const handlePreUpdate = (involvedEmployee: InvolvedEmployeeList) => {
        setInvolvedEmployee(involvedEmployee);
        setOpen(true);
    }
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <Users2 size={24} className='text-indigo-400' />  Betrokken Medewerkers
                </h1>
                <CreateInvolvedEmployeeSheet
                    mode={involvedEmployee ? "update" : "create"}
                    handleCreate={handleCreate}
                    handleUpdate={handleUpdate}
                    handleOpen={handleOpen}
                    involvedEmployee={involvedEmployee ?? undefined}
                    isOpen={open}
                />

            </div>
            <div className="grid grid-cols-1 gap-4">
                {
                    isLoading ?
                        <Loader />
                        : involvedEmployees?.results?.length === 0 ?
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
                            <div className="grid grid-cols-1 gap-4">
                                <DataTable columns={getColumns(handlePreUpdate)} data={involvedEmployees?.results ?? []} onRowClick={() => { }} className="dark:bg-[#18181b] dark:border-black" />
                                <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
                                    <PrimaryButton
                                        disabled={page === 1}
                                        onClick={handlePrevious}
                                        text={"Vorige"}
                                        icon={ArrowBigLeft}
                                        iconSide="left"
                                    />
                                    <PrimaryButton
                                        disabled={involvedEmployees?.next ? false : true}
                                        onClick={handleNext}
                                        text={"Volgende"}
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
  withPermissions(InvolvedEmployeesPage, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewClientInvolvedEmployee, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );