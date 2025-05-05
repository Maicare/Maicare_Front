"use client";

import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import Loader from "@/components/common/loader";
import { DataTable } from "@/components/employee/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoal } from "@/hooks/goal/use-goal";
import { ArrowBigLeft, ArrowBigRight,  SquareCheck } from "lucide-react";
import columns from "./columns";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Row } from "@tanstack/table-core";
import { Goal } from "@/types/goals.types";
import { useRouter } from "next/navigation";
import UpsertGoalSheet from "./UpsertGoalSheet";
import { useState } from "react";
import { CreateGoal } from "@/schemas/goal.schema";

const GoalsDetails = ({ assessmentId, clientId }: { clientId: string, assessmentId: string }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { goals, isLoading, error, page, setPage,createOne } = useGoal({ autoFetch: true, clientId: parseInt(clientId), assessmentId: parseInt(assessmentId) });
    const handlePrevious = () => {
        if (page <= 1) {
            setPage(1);
            return;
        }
        setPage(page - 1);
    }
    const handleNext = () => {
        if (goals?.next) {
            setPage(page + 1);
            return;
        }
    }
    const handleRowClick = (row: Row<Goal>) => {
        router.push(`/clients/${clientId}/goals/${assessmentId}/objectives/${row.original.id}`);
    }
    const handleOpen = (bool: boolean) => {
        setOpen(bool);
    }
    const handleCreate = async (values: CreateGoal) => {
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
    return (
        <Card className="bg-transparent border-none shadow-none rounded-md p-0">
            <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <SquareCheck className="text-indigo-400" />
                    Assessment Goals
                </CardTitle>
                <div className="flex gap-2">
                    <UpsertGoalSheet
                        isOpen={open}
                        handleCreate={handleCreate}
                        handleOpen={handleOpen}
                        handleUpdate={() => { }}
                        mode={"create"}
                    />
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 p-0">
                {isLoading ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <LargeErrorMessage
                            firstLine={"Ops! Error accured"}
                            secondLine={error.message}
                        />

                    </div>
                ) : (
                    <div className="w-full grid grid-cols-1 gap-4">

                        <DataTable columns={columns} data={goals?.results ?? []} onRowClick={handleRowClick} className="dark:bg-[#18181b] dark:border-black" />
                        <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
                            <PrimaryButton
                                disabled={page === 1}
                                onClick={handlePrevious}
                                text={"Previous"}
                                icon={ArrowBigLeft}
                                iconSide="left"
                            />
                            <PrimaryButton
                                disabled={goals?.next ? false : true}
                                onClick={handleNext}
                                text={"Next"}
                                icon={ArrowBigRight}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default GoalsDetails