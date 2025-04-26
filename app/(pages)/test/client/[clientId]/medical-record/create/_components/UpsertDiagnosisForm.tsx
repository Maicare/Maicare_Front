"use client";

import Tooltip from "@/common/components/Tooltip";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { DIAGNOSIS_SEVERITY_OPTIONS } from "@/consts";
import { useDiagnosis } from "@/hooks/diagnosis/use-diagnosis";
import { CreateDiagnosis, createDiagnosisSchema } from "@/schemas/diagnosis.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Info, XCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import MedicationsForm from "./MedicationsForm";
import PrimaryButton from "@/common/components/PrimaryButton";
import { cn } from "@/utils/cn";


type Props = {
    mode: "create" | "update";
    onSuccess: () => void;
    onCancel: () => void;
    clientId: string;
    diagnosisId?: string;
    diagnosis?: CreateDiagnosis;
}

const UpsertDiagnosisForm = ({ clientId, mode, onCancel, onSuccess, diagnosis }: Props) => {
    const { createOne, updateOne } = useDiagnosis({ autoFetch: false, clientId: parseInt(clientId) });
    const [loading, setLoading] = useState(false);
    // 1. Define your form.

    const form = useForm<CreateDiagnosis>({
        resolver: zodResolver(createDiagnosisSchema),
        defaultValues: diagnosis ? {
            ...diagnosis,
            medications: diagnosis.medications.map((medication) => ({
                ...medication,
                administered_by_id: String(medication.administered_by_id),
            })),

        } : {
            description: "",
            diagnosing_clinician: "",
            diagnosis_code: "",
            medications: [],
            notes: "",
            severity: "",
            status: "",
            title: ""
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: CreateDiagnosis) {
        if (mode === "create") {
            try {
                setLoading(true);
                await createOne(
                    values, {
                    displaySuccess: true,
                    displayProgress: true
                }
                );
                onSuccess?.();
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        } else {
            try {
                setLoading(true);
                await updateOne(
                    {
                        ...values
                    },
                    diagnosis?.id?.toString() || "0",
                    {
                        displaySuccess: true,
                        displayProgress: true
                    }
                );
                onSuccess?.();
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    }
    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                <div className={cn(mode === "create" ? "col-span-1" : "col-span-2","flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted")}>
                    <h1 className='text-base font-semibold text-black'>Algemene informatie</h1>
                    <Separator className='bg-slate-300' />
                    <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className=''>
                                    <FormLabel>Samenvatting diagnose</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type="text" placeholder="Samenvatting diagnose" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='This is Samenvatting diagnose'>
                                                    <Info className='h-5 w-5' />
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="diagnosis_code"
                            render={({ field }) => (
                                <FormItem className=''>
                                    <FormLabel>ICD Code</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type="text" max={10} placeholder="ICD Code" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='This is ICD Code'>
                                                    <Info className='h-5 w-5' />
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="severity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center justify-between'>
                                        Ernst
                                        <Tooltip text='This is Ernst'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Ernst" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectGroup>
                                                    {
                                                        DIAGNOSIS_SEVERITY_OPTIONS.filter(v => v.value !== "").map((item, index) => (
                                                            <SelectItem key={index} value={item.value} className="hover:bg-slate-100 cursor-pointer">{item.label}</SelectItem>
                                                        ))
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className=''>
                                    <FormLabel className="flex items-center justify-between">Status
                                        <Info className='h-5 w-5 opacity-0' />
                                    </FormLabel>
                                    <FormControl className="mt-0">
                                        <div className="relative">
                                            <Input type="text" placeholder="Voer huidige status van de patiënt in" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='Voer huidige status van de patiënt in'>
                                                    <Info className='h-5 w-5' />
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="diagnosing_clinician"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
                                    <FormLabel>diagnose clinician</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type="text" placeholder="diagnose clinician" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='diagnose clinician'>
                                                    <Info className='h-5 w-5' />
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
                                    <FormLabel>Aandoening</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type="text" placeholder="Aandoening" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='This is Aandoening'>
                                                    <Info className='h-5 w-5' />
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
                                    <FormLabel className='flex items-center justify-between text-sm font-semibold'>
                                        Diagnose notities
                                        <Tooltip text='Geef notities voor de diagnose'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl className=''>
                                        <div className="relative">
                                            <Textarea
                                                placeholder="Geef notities voor de diagnose"
                                                className="resize-none"
                                                rows={4}
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                {
                    mode === "create" && (
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted">
                            <h1 className='text-base font-semibold text-black'>Medicatie informatie</h1>
                            <Separator className='bg-slate-300' />
                            <MedicationsForm />
                        </div>
                    )
                }
                <PrimaryButton
                    text='Save'
                    type='submit'
                    animation='animate-bounce'
                    icon={CheckCircle}
                    disabled={loading}
                    className='bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white px-4 py-3 text-sm'
                />
                <PrimaryButton
                    text='Cancel'
                    type='button'
                    animation='animate-bounce'
                    icon={XCircle}
                    onClick={onCancel}
                    disabled={loading}
                    className='bg-red-100 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 text-sm'
                />
            </form >
        </Form >
    )
}

export default UpsertDiagnosisForm