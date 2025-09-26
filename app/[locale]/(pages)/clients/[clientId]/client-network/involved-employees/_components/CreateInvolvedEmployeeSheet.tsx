"use client";
import { Sheet, SheetClose, SheetContent, SheetDescription,  SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import PrimaryButton from '@/common/components/PrimaryButton';
import { CalendarIcon, Info, PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Tooltip from '@/common/components/Tooltip';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useEffect, useState } from 'react';
import {  EMERGENCY_RELATIONSHIP_OPTIONS } from '@/consts';
import { CreateInvolvedEmployee, createInvolvedEmployeeSchema } from '@/schemas/involvedEmployee.schema';
import { InvolvedEmployeeList } from '@/types/involved.types';
import EmployeeSelect from '../../../incidents/_components/EmployeeSelect';
type Props = {
    mode: "create" | "update";
    handleCreate: (values: CreateInvolvedEmployee) => void;
    handleUpdate: (values: CreateInvolvedEmployee) => void;
    involvedEmployee?: InvolvedEmployeeList;
    isOpen: boolean;
    handleOpen: (bool: boolean) => void;
}

const CreateInvolvedEmployeeSheet = ({ mode, handleCreate, handleUpdate, involvedEmployee, handleOpen, isOpen }: Props) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<CreateInvolvedEmployee>({
        resolver: zodResolver(createInvolvedEmployeeSchema),
        defaultValues: involvedEmployee ? {
            ...involvedEmployee,
            employee_id: involvedEmployee.employee_id.toString(),
            start_date: new Date(involvedEmployee.start_date)
        } : {
            employee_id: "",
            role: "",
            start_date: new Date()
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: CreateInvolvedEmployee) {
        console.log(values)
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
        if (involvedEmployee) {
            form.setValue("employee_id", involvedEmployee.employee_id.toString());
            form.setValue("role", involvedEmployee.role);
            form.setValue("start_date", new Date(involvedEmployee.start_date));
            form.setValue("id", involvedEmployee.id);

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [involvedEmployee])
    
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
            <SheetContent className='bg-slate-200/50 backdrop-blur-sm overflow-scroll' onPointerDownOutside={(e) => e.preventDefault()} >
                <SheetHeader>
                    <SheetTitle>Nieuwe Noodcontact</SheetTitle>
                    <SheetDescription>
                        Creëer Nieuwe Noodcontact.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form} >
                    <form className="grid grid-cols-1 gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <EmployeeSelect
                            name="employee_id"
                            label="Voornaam betrokken medewerker(s)"
                            required
                            className='w-full'
                            modal={true}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center justify-between'>
                                        Relatie
                                        <Tooltip text='This is Relatie'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Relatie" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectGroup>
                                                    {
                                                        EMERGENCY_RELATIONSHIP_OPTIONS.filter(v => v.value !== "").map((item, index) => (
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
                            name="start_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className='flex items-center justify-between'>
                                        Startdatum
                                        <Tooltip text='This is startdatum. '>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <Popover modal={true}>
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

export default CreateInvolvedEmployeeSheet