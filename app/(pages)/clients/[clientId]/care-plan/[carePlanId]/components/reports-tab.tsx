"use client";

import PrimaryButton from "@/common/components/PrimaryButton";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCarePlan } from "@/hooks/care-plan/use-care-plan";
import { Report } from "@/types/care-plan.types";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useParams } from "next/navigation";
import { ReportCard } from "./report-card";
import { CreateReport } from "@/schemas/plan-care.schema";
import { useState } from "react";
import UpsertReportSheet from "./upsert-report-sheet";

const ReportsTab = () => {
    const { carePlanId } = useParams();

    const { data: reports, setPage, page,createReport,updateReport,deleteReport } = useCarePlan({
        reports: true,
        carePlanId: carePlanId as string
    });
    const [openId, setOpenId] = useState<number | null>(null);
    const handlePrevious = () => {
        if (page <= 1) {
            setPage(1);
            return;
        }
        setPage(page - 1);
    }
    const handleNext = () => {
        if ((reports as PaginatedResponse<Report | null>)?.next) {
            setPage(page + 1);
            return;
        }
    }

    const handleCreateReport = async(values: CreateReport) => {
        try {
            await createReport(values, {
                displayProgress: true,
                displaySuccess: true,
            });
            setOpenId(null);
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600">
                <CardTitle className='flex items-center justify-between text-white'>
                    <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-bold">Reporten</h2>
                    </div>
                    <UpsertReportSheet
                        mode="create"
                        handleCreate={handleCreateReport}
                        isOpen={openId === -1}
                        handleOpen={(o) => { setOpenId(o ? -1 : null); }}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(reports as PaginatedResponse<Report | null>)?.results.map((report) => (
                        <ReportCard key={report?.id} report={report!} />
                    ))}
                </div>
                <div className="flex items-center justify-between mt-4">
                    <PrimaryButton
                        disabled={page === 1}
                        onClick={handlePrevious}
                        text={"Previous"}
                        icon={ArrowBigLeft}
                        iconSide="left"
                    />
                    <PrimaryButton
                        disabled={(reports as PaginatedResponse<Report | null>)?.next ? false : true}
                        onClick={handleNext}
                        text={"Next"}
                        icon={ArrowBigRight}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default ReportsTab