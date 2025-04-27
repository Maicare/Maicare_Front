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
import { useEducation } from '@/hooks/education/use-education';
import { CreateEducation, educationSchema } from '@/schemas/education.schema';

type Props = {
    employeeId: number;
    onCancel: () => void;
    mode: "add" | "update";
    onSuccess:()=>void;
    defaultValues?:CreateEducation&{id:number};
}
const UpsertEducationForm = ({ employeeId, onCancel, mode,onSuccess,defaultValues }: Props) => {
    const { createOne, updateOne } = useEducation({ autoFetch: false, employeeId: employeeId.toString() });
    const [loading, setLoading] = useState(false);

    // 1. Define your form.
    const form = useForm<CreateEducation>({
        resolver: zodResolver(educationSchema),
        defaultValues: defaultValues || {
            degree: "",
            field_of_study: "",
            institution_name:"",
            employee_id: employeeId,
            end_date: new Date(),
            start_date: new Date()
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: CreateEducation) {
        if (mode === "add") {
            try {
                setLoading(true);
                await createOne(
                    {
                        ...values,
                        end_date:values.end_date.toISOString().split("T")[0],
                        start_date:values.start_date.toISOString().split("T")[0],
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
                        end_date:values.end_date.toISOString().split("T")[0],
                        start_date:values.start_date.toISOString().split("T")[0],
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
                        name="degree"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm text-slate-700 font-semibold">Degree</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input placeholder="eg: BA of Computer Science" {...field} />
                                        <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                            <Tooltip text='This is Degree'>
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
                        name="field_of_study"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm text-slate-700 font-semibold">Field of study</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input placeholder="eg: IT" {...field} />
                                        <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                            <Tooltip text='This is Field of study'>
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
                        name="start_date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className='flex items-center justify-between text-sm text-slate-700 font-semibold'>
                                    Start Date
                                    <Tooltip text='This is Start Date'>
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
                                                    <span>Pick a date</span>
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
                    <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className='flex items-center justify-between text-sm text-slate-700 font-semibold'>
                                    End Date
                                    <Tooltip text='This is End Date'>
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
                                                    <span>Pick a date</span>
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
                    <FormField
                        control={form.control}
                        name="institution_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm text-slate-700 font-semibold">Institution</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input placeholder="eg: University of Manhaten" {...field} />
                                        <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                            <Tooltip text='This is Field of study'>
                                                <Info className='h-5 w-5' />
                                            </Tooltip>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <PrimaryButton
                        text="Save"
                        icon={CheckCircle}
                        animation="animate-bounce"
                        className="px-4 py-3 text-sm"
                        disabled={loading}
                    />
                    <PrimaryButton
                        text="Cancel"
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

export default UpsertEducationForm