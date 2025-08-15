"use client";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import PrimaryButton from '@/common/components/PrimaryButton';
import {  Edit2, Info, PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Tooltip from '@/common/components/Tooltip';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import {  Risk } from '@/types/care-plan.types';
import { Id } from '@/common/types/types';
import { CreateRisk, createRiskSchema } from '@/schemas/plan-care.schema';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
type Props = {
    mode: "create" | "update";
    handleCreate: (values: CreateRisk) => void;
    handleUpdate?: (values: CreateRisk, id: Id) => void;
    risk?: Risk;
    isOpen: boolean;
    handleOpen: (bool: boolean) => void;
}

const UpsertRiskSheet = ({ mode, handleCreate, handleUpdate, risk, handleOpen, isOpen }: Props) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<CreateRisk>({
        resolver: zodResolver(createRiskSchema),
        defaultValues: risk ? {
            ...risk
        } : {
            mitigation_strategy: "",
            risk_description: "",
            risk_level: "low",
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: CreateRisk) {
        setLoading(true);
        if (mode === "create") {
            handleCreate(values);
        } else {
            handleUpdate?.(values, risk!.risk_id);
        }
        handleOpen(false);
        setLoading(false);
    }
    useEffect(() => {
        if (risk) {
            form.setValue("mitigation_strategy", risk.mitigation_strategy);
            form.setValue("risk_description", risk.risk_description);
            form.setValue("risk_level", risk.risk_level);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [risk]);

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
                    <SheetTitle>Nieuwe Risico</SheetTitle>
                    <SheetDescription>
                        Creëer Nieuwe Risico.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form} >
                    <form className="grid grid-cols-1 gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="mitigation_strategy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center justify-between'>
                                        Mitigatie Strategie
                                        <Tooltip text='This is Mitigation Strategy'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            {...field}
                                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Resource Beschrijving"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="risk_description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center justify-between'>
                                        Risico Beschrijving
                                        <Tooltip text='This is Risk description'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            {...field}
                                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Rol Titel"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="risk_level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center justify-between'>
                                        Risico Niveau
                                        <Tooltip text='This is Risk Level'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecteer Risico Niveau" />
                                            </SelectTrigger>
                                            <SelectContent className="w-full">
                                                <SelectGroup>
                                                    <SelectItem value="high">Hoog</SelectItem>
                                                    <SelectItem value="medium">Middel</SelectItem>
                                                    <SelectItem value="low">Laag</SelectItem>
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

export default UpsertRiskSheet