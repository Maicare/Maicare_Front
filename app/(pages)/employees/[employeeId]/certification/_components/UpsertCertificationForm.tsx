"use client";
import Tooltip from '@/common/components/Tooltip'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CalendarIcon, CheckCircle, Info, XCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import PrimaryButton from '@/common/components/PrimaryButton'
import { certificateSchema, CreateCertificate } from '@/schemas/certification.schema';
import { useCertificate } from '@/hooks/certificate/use-certificate';

type Props = {
    employeeId: number;
    onCancel: () => void;
    mode: "add" | "update";
    onSuccess:()=>void;
    defaultValues?:CreateCertificate&{id:number};
}
const UpsertCertificationForm = ({ employeeId, onCancel, mode,onSuccess,defaultValues }: Props) => {
    const { createOne, updateOne } = useCertificate({ autoFetch: false, employeeId: employeeId.toString() });
    const [loading, setLoading] = useState(false);

    // 1. Definieer je formulier.
    const form = useForm<CreateCertificate>({
        resolver: zodResolver(certificateSchema),
        defaultValues: defaultValues || {
            name: "",
            issued_by:"",
            employee_id: employeeId,
            date_issued: new Date()
        },
    })

    // 2. Definieer een submit handler.
    async function onSubmit(values: CreateCertificate) {
        if (mode === "add") {
            try {
                setLoading(true);
                await createOne(
                    {
                        ...values,
                        date_issued:values.date_issued.toISOString().split("T")[0],
                        employee_id: employeeId,
                    },{
                        displaySuccess:true,
                        displayProgress:true
                    }
                );
                onSuccess();
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }else{
            try {
                setLoading(true);
                await updateOne(
                    {
                        ...values,
                        date_issued:values.date_issued.toISOString().split("T")[0],
                        id:defaultValues?.id||0
                    },{
                        displaySuccess:true,
                        displayProgress:true
                    }
                );
                onSuccess();
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    }
    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full bg-white p-4 rounded-md shadow-md flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm text-slate-700 font-semibold">Naam</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input placeholder="bijv: AZ-900" {...field} />
                                        <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                            <Tooltip text='Dit is de certificaatnaam'>
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
                        name="issued_by"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm text-slate-700 font-semibold">Uitgegeven door</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input placeholder="bijv: Microsoft Azure fundamentals" {...field} />
                                        <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                            <Tooltip text='Dit is de certificaatuitgever'>
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
                        name="date_issued"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className='flex items-center justify-between text-sm text-slate-700 font-semibold'>
                                    Uitgavedatum
                                    <Tooltip text='Dit is de uitgavedatum'>
                                        <Info className='h-5 w-5 mr-2' />
                                    </Tooltip>
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Kies een datum</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <PrimaryButton
                        text="Opslaan"
                        icon={CheckCircle}
                        animation="animate-bounce"
                        className="px-4 py-3 text-sm"
                        disabled={loading}
                    />
                    <PrimaryButton
                        text="Annuleren"
                        onClick={onCancel}
                        type='button'
                        icon={XCircle}
                        animation="animate-bounce"
                        disabled={loading}
                        className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 text-sm"
                    />
                </div>
            </form>
        </Form>
    )
}

export default UpsertCertificationForm;