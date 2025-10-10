"use client";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import PrimaryButton from '@/common/components/PrimaryButton';
import {  Edit2, Info, PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Tooltip from '@/common/components/Tooltip';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {  useEffect, useState } from 'react';
import {   InterventionActivity } from '@/types/care-plan.types';
import { Id } from '@/common/types/types';
import { CreateIntervention, createInterventionSchema } from '@/schemas/plan-care.schema';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
type Props = {
    mode: "create" | "update";
    handleCreate: (values: CreateIntervention) => void;
    handleUpdate?: (values: CreateIntervention, id: Id) => void;
    intervention?: InterventionActivity&{frequency: "daily" | "weekly" | "monthly"};
    isOpen: boolean;
    handleOpen: (bool: boolean) => void;
}

const UpsertInterventionSheet = ({ mode, handleCreate, handleUpdate, intervention, handleOpen, isOpen }: Props) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<CreateIntervention>({
        resolver: zodResolver(createInterventionSchema),
        defaultValues: intervention ? {
            ...intervention
        } : {
            intervention_description: "",
            frequency: "daily",
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: CreateIntervention) {
        setLoading(true);
        if (mode === "create") {
            handleCreate(values);
        } else {
            handleUpdate?.(values, intervention!.intervention_id);
        }
        handleOpen(false);
        setLoading(false);
    }

    useEffect(() => {
        if (intervention) {
            form.setValue("intervention_description", intervention.intervention_description);
            form.setValue("frequency", intervention.frequency);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intervention]);

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
                    <SheetTitle>Nieuwe Interventies</SheetTitle>
                    <SheetDescription>
                        Creëer Nieuwe Interventies.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form} >
                    <form className="grid grid-cols-1 gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="intervention_description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center justify-between'>
                                        Interventie Beschrijving
                                        <Tooltip text='This is Intervention description'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            {...field}
                                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Interventie Beschrijving"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="frequency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center justify-between'>
                                        Frequentie
                                        <Tooltip text='This is Intervention frequency'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecteer Frequentie" />
                                            </SelectTrigger>
                                            <SelectContent className="w-full  bg-white">
                                                <SelectGroup>
                                                    <SelectItem value="daily">Dagelijks</SelectItem>
                                                    <SelectItem value="weekly">Wekelijks</SelectItem>
                                                    <SelectItem value="monthly">Maandelijks</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
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

export default UpsertInterventionSheet