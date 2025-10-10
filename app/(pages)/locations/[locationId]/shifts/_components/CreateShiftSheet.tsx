"use client";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import PrimaryButton from '@/common/components/PrimaryButton';
import { Info, PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Tooltip from '@/common/components/Tooltip';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { CreateShift, createShiftSchema, Shift } from '@/schemas/shift.schema';
import { useParams } from 'next/navigation';
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createDateFromTimeString, formatTimeFromDate } from '@/utils/timeFormatting';
import { Id } from '@/common/types/types';

type Props = {
    mode: "create" | "update";
    handleCreate: (values: CreateShift) => void;
    handleUpdate: (values: CreateShift&{id:Id}) => void;
    shift?: Shift;
    isOpen: boolean;
    handleOpen: (bool: boolean) => void;
}

const CreateShiftSheet = ({ mode, handleCreate, handleUpdate, shift, handleOpen, isOpen }: Props) => {
    const { locationId } = useParams();
    const [loading, setLoading] = useState(false);
    const form = useForm<CreateShift>({
        resolver: zodResolver(createShiftSchema),
        defaultValues: shift ? {
            ...shift
        } : {
            location_id: parseInt(locationId as string),
            shift: "",
            start_time: "00:00",
            end_time: "23:59"
        },
    });
    // 2. Definieer een submit handler.
    async function onSubmit(values: CreateShift) {
        setLoading(true);
        if (mode === "create") {
            handleCreate(values);
        } else {
            handleUpdate({...values,id:shift!.id});
        }
        handleOpen(false);
        setLoading(false);
    }
    useEffect(() => {
        if (shift) {
            form.setValue("shift", shift.shift);
            form.setValue("location_id", shift.location_id);
            form.setValue("start_time", shift.start_time);
            form.setValue("end_time", shift.end_time);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shift]);
    return (
        <Sheet open={isOpen} onOpenChange={(o) => handleOpen(o)}>
            <SheetTrigger asChild>
                <PrimaryButton
                    text="Toevoegen"
                    // onClick={handleAdd}
                    disabled={false}
                    icon={PlusCircle}
                    animation="animate-bounce"
                    className="bg-indigo-400 text-white"
                />
            </SheetTrigger>
            <SheetContent className='bg-slate-200/50 backdrop-blur-sm overflow-scroll' onPointerDownOutside={(e) => e.preventDefault()} >
                <SheetHeader>
                    <SheetTitle>{mode === "create" ? "Nieuwe Dienst" : "Dienst Bewerken"}</SheetTitle>
                    <SheetDescription>
                        {mode === "create" ? "Creëer Nieuwe Dienst." : "Bewerk bestaande dienst."}
                    </SheetDescription>
                </SheetHeader>
                <Form {...form} >
                    <form className="grid grid-cols-2 gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="shift"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
                                    <FormLabel>Naam</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="bijv: Ochtenddienst" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='Dit is de naam van de dienst'>
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
                            name="start_time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Starttijd</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <ReactDatePicker
                                                selected={createDateFromTimeString(field.value)}
                                                onChange={(d)=> d && field.onChange(formatTimeFromDate(d))}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={15}
                                                dateFormat="HH:mm"
                                                timeFormat="HH:mm"
                                                className="text-sm px-2 py-1.5 bg-white rounded-lg w-full"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="end_time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Eindtijd</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <ReactDatePicker
                                                selected={createDateFromTimeString(field.value)}
                                                onChange={(d)=> d && field.onChange(formatTimeFromDate(d))}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={15}
                                                dateFormat="HH:mm"
                                                timeFormat="HH:mm"
                                                className="text-sm px-2 py-1.5 bg-white rounded-lg w-full"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={loading} type="submit" className='bg-indigo-200 text-indigo-600 hover:text-white hover:bg-indigo-600 transition-colors'>
                            {loading ? "Opslaan..." : "Wijzigingen Opslaan"}
                        </Button>
                        <SheetClose asChild>
                            <Button className='bg-red-200 text-red-600 hover:text-white hover:bg-red-600 transition-colors'>Annuleren</Button>
                        </SheetClose>
                    </form>
                </Form>


            </SheetContent>
        </Sheet>
    )
}

export default CreateShiftSheet