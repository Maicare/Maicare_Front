"use client";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import PrimaryButton from '@/common/components/PrimaryButton';
import { CalendarIcon, Info, PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DAILY_REPORT_TYPES_OPTIONS, EMOTIONAL_STATE_OPTIONS, Report } from '@/types/reports.types';
import Tooltip from '@/common/components/Tooltip';
import { useForm } from 'react-hook-form';
import { CreateReport, CreateReportSchema } from '@/schemas/report.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/common/hooks/use-auth';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import TextEnhancingDialog from './TextEnhancingDialog';
import { useEffect, useState } from 'react';
type Props = {
    mode: "create" | "update";
    handleCreate:(values:CreateReport)=>void;
    handleUpdate:(values:CreateReport)=>void;
    report?:Report;
    isOpen:boolean;
    handleOpen:(bool:boolean)=>void;
}

const CreateReportSheet = ({ mode,handleCreate,handleUpdate,report,handleOpen,isOpen }: Props) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const form = useForm<CreateReport>({
        resolver: zodResolver(CreateReportSchema),
        defaultValues: report ? {
            ...report,
            date:new Date(report?.date)
        } : {
            date: new Date(),
            emotional_state: "",
            report_text: "",
            type: "",
            employee_id: user?.employee_id || 0
        },
    });
    console.log(report)
    // 2. Define a submit handler.
    async function onSubmit(values: CreateReport) {
        setLoading(true);
        if (mode === "create") {
            handleCreate(values);
        } else {
            handleUpdate(values);
        }
        handleOpen(false);
        setLoading(false);
    }
    useEffect(() => {
        if (user?.employee_id) {
            form.setValue("employee_id", user?.employee_id);
        }
        if (report) {
            form.setValue("date",new Date(report.date));
            form.setValue("emotional_state",report.emotional_state);
            form.setValue("type",report.type);
            form.setValue("report_text",report.report_text);
            form.setValue("employee_id",report.employee_id);
            form.setValue("id",report.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.employee_id,report])
    return (
        <Sheet open={isOpen} onOpenChange={(o) => handleOpen(o)}>
            <SheetTrigger asChild>
                <PrimaryButton
                    text="Add"
                    // onClick={handleAdd}
                    disabled={false}
                    icon={PlusCircle}
                    animation="animate-bounce"
                    className="bg-indigo-400 text-white"
                />
            </SheetTrigger>
            <SheetContent className='bg-slate-200/50 backdrop-blur-sm' onPointerDownOutside={(e) => e.preventDefault()} >
                <SheetHeader>
                    <SheetTitle>Nieuwe Rapporten</SheetTitle>
                    <SheetDescription>
                        Creëer Nieuwe Rapporten.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form} >
                    <form className="grid gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center justify-between'>
                                        Betrokenheid melder
                                        <Tooltip text='This is Betrokenheid melder '>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Betrokenheid melder" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectGroup>
                                                    {
                                                        DAILY_REPORT_TYPES_OPTIONS.filter(v => v.value !== "").map((item, index) => (
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
                            name="emotional_state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center justify-between'>
                                        Emotionele toestand
                                        <Tooltip text='This is Betrokenheid melder '>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Betrokenheid melder" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectGroup>
                                                    {
                                                        EMOTIONAL_STATE_OPTIONS.filter(v => v.value !== "").map((item, index) => (
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
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Datum en tijd</FormLabel>
                                    <Popover modal>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                        !field.value && 'text-muted-foreground'
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value
                                                        ? format(field.value, 'PPPp')
                                                        : 'Pick a date and time'}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 z-[9999] bg-white">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date) => {
                                                    if (!date) return
                                                    const newDate = new Date(date)
                                                    const current = field.value ?? new Date()
                                                    newDate.setHours(current.getHours())
                                                    newDate.setMinutes(current.getMinutes())
                                                    field.onChange(newDate)
                                                }}
                                                initialFocus
                                            />
                                            <div className="p-4 border-t">
                                                <Input
                                                    type="time"
                                                    value={
                                                        field.value
                                                            ? `${String(field.value.getHours()).padStart(2, '0')}:${String(
                                                                field.value.getMinutes()
                                                            ).padStart(2, '0')}`
                                                            : ''
                                                    }
                                                    onChange={(e) => {
                                                        const [hours, minutes] = e.target.value
                                                            .split(':')
                                                            .map(Number)
                                                        const newDate = field.value ? new Date(field.value) : new Date()
                                                        newDate.setHours(hours)
                                                        newDate.setMinutes(minutes)
                                                        field.onChange(newDate)
                                                    }}
                                                />
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="report_text"
                            render={({ field }) => (
                                <FormItem className=''>
                                    <FormLabel className='flex items-center justify-between text-sm font-semibold'>
                                        Toelichting op de oorzaak/oorzaken
                                        <Tooltip text='This is toelichting op de oorzaak/oorzaken'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl className=''>
                                        <div className="relative">
                                            <Textarea
                                                placeholder="toelichting op de oorzaak/oorzaken"
                                                className="resize-none"
                                                rows={6}
                                                {...field}
                                            />
                                            <TextEnhancingDialog
                                                content={field.value}
                                                onConfirm={(text) => { form.setValue("report_text", text) }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <SheetFooter className='flex items-center justify-between'>
                            <Button disabled={loading} type="submit">Save changes</Button>
                            <SheetClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </SheetClose>
                        </SheetFooter>
                    </form>
                </Form>


            </SheetContent>
        </Sheet>
    )
}

export default CreateReportSheet