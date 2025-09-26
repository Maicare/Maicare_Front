"use client";

import { useDiagnosis } from "@/hooks/diagnosis/use-diagnosis";
import { Diagnosis, Medication } from "@/types/diagnosis.types";
import { AlertCircle, AlertTriangle, ArrowBigLeft, Edit2, HeartPulse, MoreVertical, Pill, PillBottle, } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DiagnosisInformationCard from "./_components/DiagnosisInformationCard";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PrimaryButton from "@/common/components/PrimaryButton";
import UpsertMedicationSheet from "./_components/UpsertMedicationSheet";
import { useMedication } from "@/hooks/medication/use-medication";
import { CreateMedication } from "@/schemas/medication.schema";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const DiagnosisPAge = () => {
    const { clientId, diagnosisId } = useParams();
    const { readOne } = useDiagnosis({
        clientId: parseInt(clientId as string),
        autoFetch: false
    });
    const { createOne, updateOne, deleteOne } = useMedication({ clientId: parseInt(clientId as string), diagnosisId: parseInt(diagnosisId as string), autoFetch: false });
    const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
    const [isMutate, setIsMutate] = useState(true);
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [medication, setMedication] = useState<Medication | null>(null);

    const fetchDiagnosis = async () => {
        try {
            const res = await readOne(diagnosisId as string, {
                displayProgress: true,
                displaySuccess: true
            });
            setDiagnosis(res);
        } catch (error) {
            console.error("Error fetching diagnosis:", error);
        }
    }
    useEffect(() => {
        if (clientId && diagnosisId) {
            fetchDiagnosis();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId, diagnosisId, isMutate]);
    if (!diagnosis) {
        return (
            <div className="w-full flex items-center justify-center">
                <h1 className="text-lg font-bold text-slate-600">Loading...</h1>
            </div>
        );

    }
    // Calculate overall diagnosis period
    const calculateDiagnosisPeriod = (medication: Medication) => {
        if (!medication) return null;

        const startDate = new Date(medication.start_date);
        const endDate = medication.end_date ? new Date(medication.end_date) : null;

        const validEndDate = endDate && !isNaN(endDate.getTime());

        if (!startDate) return null;

        const formatDate = (date: Date) => format(date, "MMM dd, yyyy");

        return {
            start: formatDate(startDate),
            end: validEndDate ? formatDate(endDate) : "Present",
            ongoing: endDate && endDate?.getTime() > Date.now() ? true : false,
        };
    };

    const handleBack = () => {
        router.back();
    }
    const handleOpen = (bool: boolean) => {
        setOpen(bool);
    }
    const handleCreate = async (values: CreateMedication) => {
        try {
            await createOne(
                values, {
                displayProgress: true,
                displaySuccess: true
            }
            );
            setIsMutate(p => !p);
        } catch (error) {
            console.log(error);
        }
    }
    const handleUpdate = async (values: CreateMedication) => {
        try {
            await updateOne(
                values,
                medication!.id!.toString(),
                {
                    displayProgress: true,
                    displaySuccess: true
                }
            );
            setIsMutate(p => !p);
        } catch (error) {
            console.log(error);
        }
    }
    const handleDelete = async (id: number) => {
        try {
            await deleteOne(
                id.toString(),
                {
                    displayProgress: true,
                    displaySuccess: true
                }
            );
            setIsMutate(p => !p);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <HeartPulse size={24} className='text-indigo-400' />  {diagnosis.title}
                </h1>
                <PrimaryButton
                    text="Back"
                    onClick={handleBack}
                    disabled={false}
                    icon={ArrowBigLeft}
                    iconSide="left"
                    animation="arrow-animation"
                    className="bg-indigo-400 text-white"
                />
            </div>
            <div className="grid grid-cols-3 gap-4 w-full">
                <DiagnosisInformationCard
                    code={diagnosis.diagnosis_code}
                    status={diagnosis.status}
                    severity={diagnosis.severity}
                    diagnosing_clinician={diagnosis.diagnosing_clinician}
                    description={diagnosis.description}
                    notes={diagnosis.notes}
                    isParentLoading={false}
                />
                <div className="col-span-2 w-full rounded-sm shadow-md p-4 bg-white">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><PillBottle size={18} className='text-indigo-400' /> Medication Information</h1>
                        <UpsertMedicationSheet
                            isOpen={open}
                            handleCreate={handleCreate}
                            handleOpen={handleOpen}
                            handleUpdate={handleUpdate}
                            mode={medication ? "update" : "create"}
                            medication={medication || undefined}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {
                            diagnosis.medications.map((med) => {
                                const medicationPeriod = calculateDiagnosisPeriod(med);

                                return (
                                    <div key={med.id} className="flex flex-col gap-2 bg-gray-50 hover:bg-gray-100 p-2 rounded-md">
                                        <div className="flex gap-0 items-center w-full">
                                            <div className="flex justify-between w-full">
                                                <div className="flex items-center gap-2">
                                                    <Pill className={cn(
                                                        "h-3 w-3",
                                                        med.is_critical ? "text-red-500" : "text-blue-500"
                                                    )} />
                                                    <span className="text-xs">{med.name}</span>
                                                    {med.is_critical && (
                                                        <span className="text-[8px] font-bold text-red-500 rounded-lg border-1 px-1 bg-red-50 border-red-500">(CRITICAL)</span>
                                                    )}
                                                </div>
                                                {medicationPeriod?.ongoing ? (
                                                    <span className="p-1 flex items-center gap-1 text-xs text-green-600 border-1 rounded-lg bg-green-50 border-green-500">
                                                        <AlertCircle className="h-3 w-3" />
                                                        Active
                                                    </span>
                                                )
                                                    : (
                                                        <span className="p-1 flex items-center gap-1 text-xs text-orange-600 border-1 rounded-lg bg-orange-50 border-orange-500" >
                                                            <AlertCircle className="h-3 w-3" />
                                                            Completed
                                                        </span>
                                                    )
                                                }

                                            </div>
                                            <AlertDialog>
                                                <DropdownMenu modal={false}>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            className="p-1 m-0 h-fit bg-transparent hover:bg-transparent"
                                                        >
                                                            <MoreVertical className="h-4 w-4 text-slate-800 " />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-white">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() => { setMedication(med); setOpen(true) }}
                                                            className="hover:bg-indigo-100 hover:text-indigo-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                            <span className="text-sm font-medium">Edit</span>
                                                        </DropdownMenuItem>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem
                                                                onClick={() => { }}
                                                                className="hover:bg-red-100 hover:text-red-500 transition-colors ease-in-out cursor-pointer flex items-center gap-2"
                                                            >
                                                                <AlertCircle className="h-4 w-4" />
                                                                <span className="text-sm font-medium">Delete</span>
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="flex flex-col gap-2 items-center">
                                                            <span className="h-12 w-12 rounded-full bg-red-200 flex items-center justify-center">
                                                                <AlertTriangle className="text-red-600 h-8 w-8" />
                                                            </span>
                                                            <span className="text-lg font-semibold">Delete Diagnosis</span>
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription className="text-center">
                                                            Are you sure you want to delete this diagnosis record? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter className="w-full grid grid-cols-2 gap-2 space-x-0">
                                                        <AlertDialogCancel className="w-full border-none ring-0 bg-indigo-200 px-2 py-1 text-indigo-500 hover:bg-indigo-400 hover:text-white transition-colors ml-0 space-x-0">
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={async () => {
                                                                await handleDelete(med.id!);
                                                            }}
                                                            className="w-full border-none ring-0 bg-red-200 px-2 py-1 text-red-500 hover:bg-red-500 hover:text-white transition-colors ml-0 space-x-0"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                        {medicationPeriod && (
                                            <div className=" mx-5 flex items-center justify-between text-xs">
                                                <span className={cn(
                                                    "px-2 py-1 rounded-md",
                                                    medicationPeriod.ongoing
                                                        ? "text-green-700 bg-green-50 border border-green-200"
                                                        : "text-indigo-700 bg-indigo-50 border border-indigo-200"
                                                )}>
                                                    {medicationPeriod.start} → {medicationPeriod.end}
                                                </span>
                                                <div className="">
                                                    <span className={cn(
                                                        "text-xs font-semibold p-1 rounded-lg border-1",
                                                        !med.self_administered ? "text-green-500 bg-green-50 border-green-500" : "text-orange-500 bg-orange-50 border-orange-500"
                                                    )}>
                                                        {!med.self_administered ? "Administered by Jhon Doe" : "Self Administered"}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="text-xs opacity-80 mx-5">{med.dosage}</div>
                                    </div>
                                )
                            })
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}

export default withAuth(
  withPermissions(DiagnosisPAge, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewClientDiagnosis, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );