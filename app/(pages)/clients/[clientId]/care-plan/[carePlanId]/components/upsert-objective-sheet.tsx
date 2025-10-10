"use client";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import PrimaryButton from '@/common/components/PrimaryButton';
import { Edit2,  PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Id } from '@/common/types/types';
import {  CreateObjective, createObjectiveSchema } from '@/schemas/plan-care.schema';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
type Props = {
    mode: "create" | "update";
    handleCreate: (values: CreateObjective) => void;
    handleUpdate?: (values: CreateObjective, id: Id) => void;
    objective?: {
        description: string;
        objective_id: Id;
        timeframe: "short_term" | "medium_term" | "long_term";
        title: string;
        status: "draft" | "not_started" | "in_progress" | "completed";
    };
    isOpen: boolean;
    handleOpen: (bool: boolean) => void;
}

const UpsertObjectiveSheet = ({ mode, handleCreate, handleUpdate, objective, handleOpen, isOpen }: Props) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<CreateObjective>({
        resolver: zodResolver(createObjectiveSchema),
        defaultValues: objective ? {
            ...objective,
            goal_title: objective.title,
        } : {
            description: "",
            goal_title: "",
            timeframe: "short_term",
            status: "draft" // Default status
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: CreateObjective) {
        setLoading(true);
        if (mode === "create") {
            handleCreate(values);
        } else {
            handleUpdate?.(values, objective!.objective_id);
        }
        handleOpen(false);
        setLoading(false);
    }

    useEffect(() => {
        if (objective) {
            form.setValue("description", objective.description);
            form.setValue("goal_title", objective.title);
            form.setValue("timeframe", objective.timeframe);
            form.setValue("status", objective.status);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objective]);

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
                            name="goal_title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Titel</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Titel" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Beschrijving</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Beschrijving" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="timeframe"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tijdskader</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecteer Tijdskader" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full bg-white">
                                            <SelectGroup>
                                                <SelectItem value="short_term">Korte Termijn</SelectItem>
                                                <SelectItem value="medium_term">Middellange Termijn</SelectItem>
                                                <SelectItem value="long_term">Lange Termijn</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            mode === "update" && (
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecteer Status" />
                                                </SelectTrigger>
                                                <SelectContent className="w-full bg-white">
                                                    <SelectGroup>
                                                        <SelectItem value="draft">Concept</SelectItem>
                                                        <SelectItem value="not_started">Niet Gestart</SelectItem>
                                                        <SelectItem value="in_progress">In Behandeling</SelectItem>
                                                        <SelectItem value="completed">Voltooid</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )
                        }

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

export default UpsertObjectiveSheet