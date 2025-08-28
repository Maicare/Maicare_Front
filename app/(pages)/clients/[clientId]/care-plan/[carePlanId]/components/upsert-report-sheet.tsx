"use client";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import PrimaryButton from '@/common/components/PrimaryButton';
import { Edit2,  PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import {  Report } from '@/types/care-plan.types';
import { Id } from '@/common/types/types';
import {  CreateReport, createReportSchema } from '@/schemas/plan-care.schema';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
type Props = {
    mode: "create" | "update";
    handleCreate?: (values: CreateReport) => void;
    handleUpdate?: (values: CreateReport, id: Id) => void;
    report?: Report ;
    isOpen: boolean;
    handleOpen: (bool: boolean) => void;
    objectiveId?: Id; // Optional, if creating an action for a specific objective
}

const UpsertReportSheet = ({ mode, handleCreate, handleUpdate, report, handleOpen, isOpen, }: Props) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<CreateReport>({
        resolver: zodResolver(createReportSchema),
        defaultValues: report ? {
            report_content: report.report_content,
            report_type: report.report_type,
            is_critical: report.is_critical,
        } : {
            report_content: "",
            report_type: "progress",
            is_critical: false,
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: CreateReport) {
        setLoading(true);
        if (mode === "create") {
            handleCreate?.(values);
        } else {
            handleUpdate?.(values, report!.id);
        }
        handleOpen(false);
        setLoading(false);
    }

    useEffect(() => {
        if (report) {
            form.setValue("report_content", report.report_content);
            form.setValue("report_type", report.report_type);
            form.setValue("is_critical", report.is_critical);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [report]);

    return (
        <Sheet open={isOpen} onOpenChange={(o) => handleOpen(o)}>
            <SheetTrigger asChild>
                <PrimaryButton
                    text={mode === "create" ? "Add" : ""}
                    // onClick={handleAdd}
                    disabled={false}
                    icon={mode === "create" ? PlusCircle : Edit2}
                    animation="animate-bounce"
                    className={mode === "create" ? "bg-indigo-400 text-white" : "bg-blue-300 text-white hover:bg-blue-500"}
                />
            </SheetTrigger>
            <SheetContent className='bg-slate-200/50 backdrop-blur-sm overflow-scroll' onPointerDownOutside={(e) => e.preventDefault()} >
                <SheetHeader>
                    <SheetTitle>Nieuwe Report</SheetTitle>
                    <SheetDescription>
                        Creëer Nieuwe Report.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form} >
                    <form className="grid grid-cols-1 gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="report_content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Report Inhoud</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Voer de inhoud van het rapport in" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="report_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Report Type</FormLabel>
                                    <FormControl>
                                        <Select {...field}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecteer een type rapport" />
                                            </SelectTrigger>
                                            <SelectContent className='bg-white'>
                                                <SelectItem value="progress">Progress</SelectItem>
                                                <SelectItem value="concern">Concern</SelectItem>
                                                <SelectItem value="achievement">Achievement</SelectItem>
                                                <SelectItem value="modification">Modification</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_critical"
                            render={({ field }) => (
                                <FormItem className='flex items-center space-x-2'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel>Is Kritisch</FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button disabled={loading} type="submit" className='bg-indigo-200 text-indigo-600 hover:text-white hover:bg-indigo-600 transition-colors'>Save changes</Button>
                        <SheetClose asChild>
                            <Button className='bg-red-200 text-red-600 hover:text-white hover:bg-red-600 transition-colors'>Cancel</Button>
                        </SheetClose>
                    </form>
                </Form>


            </SheetContent>
        </Sheet>
    )
}

export default UpsertReportSheet