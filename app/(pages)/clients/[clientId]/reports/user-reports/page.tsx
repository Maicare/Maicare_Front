"use client";
import PrimaryButton from '@/common/components/PrimaryButton'
import LargeErrorMessage from '@/components/common/Alerts/LargeErrorMessage';
import Loader from '@/components/common/loader';
import { useReport } from '@/hooks/report/use-report';
import { ArrowBigLeft, ArrowBigRight, FileUser } from 'lucide-react'
import { useParams } from 'next/navigation';
import ReportCard from './_components/ReportCard';
import { Report, REPORT_TYPE_RECORD } from '@/types/reports.types';
import CreateReportSheet from './_components/CreateReportSheet';
import { CreateReport } from '@/schemas/report.schema';
import { useState } from 'react';
import withAuth, { AUTH_MODE } from '@/common/hocs/with-auth';
import withPermissions from '@/common/hocs/with-permissions';
import Routes from '@/common/routes';
import { PermissionsObjects } from '@/common/data/permission.data';


const UserReports = () => {
    const { clientId } = useParams();
    const { reports, isLoading, page, setPage, createOne, updateOne, } = useReport({ clientId: parseInt(clientId as string), autoFetch: true });
    const [report, setReport] = useState<Report | null>(null);
    const [open, setOpen] = useState(false);
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
        if (reports?.next) {
            setPage(page + 1);
            return;
        }
    }
    const handleCreate = async (values: CreateReport) => {
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
    const handleUpdate = async (values: CreateReport) => {
        try {
            await updateOne(
                values, {
                displayProgress: true,
                displaySuccess: true
            }
            );
        } catch (error) {
            console.log(error);
        }
    }
    const handleDelete = async (_id: number) => {
        try {
            alert("deleted !")
        } catch (error) {
            console.error(error)
        }
    }
    const handlePreUpdate = (report: Report) => {
        setReport(report);
        setOpen(true);
    }
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <FileUser size={24} className='text-indigo-400' />  Reportten
                </h1>
                <CreateReportSheet
                    mode={report ? "update" : "create"}
                    handleCreate={handleCreate}
                    handleUpdate={handleUpdate}
                    handleOpen={handleOpen}
                    report={report ?? undefined}
                    isOpen={open}
                />

            </div>
            <div className="grid grid-cols-1 gap-4">
                {
                    isLoading ?
                        <Loader />
                        : reports?.results?.length === 0 ?
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
                                <div className="grid grid-cols-4 gap-2">
                                    {
                                        reports.results.map((report, i) => (
                                            <ReportCard
                                                key={i}
                                                reportType={report.type as keyof typeof REPORT_TYPE_RECORD}
                                                createdAt={new Date(report.date)}
                                                content={report.report_text}
                                                author={{
                                                    name: report.employee_first_name + " " + report.employee_last_name,
                                                    avatar: "https://github.com/shadcn.png"//TODO add image here
                                                }}
                                                emotionalState={report.emotional_state}
                                                handleDelete={() => handleDelete(report.id as number)}
                                                handleUpdate={() => handlePreUpdate(report)}
                                            />
                                        ))
                                    }
                                </div>
                                <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
                                    <PrimaryButton
                                        disabled={page === 1}
                                        onClick={handlePrevious}
                                        text={"Previous"}
                                        icon={ArrowBigLeft}
                                        iconSide="left"
                                    />
                                    <PrimaryButton
                                        disabled={reports?.next ? false : true}
                                        onClick={handleNext}
                                        text={"Next"}
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
  withPermissions(UserReports, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );