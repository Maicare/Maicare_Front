"use client";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import PrimaryButton from '@/common/components/PrimaryButton';
import { CalendarIcon, Info, PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Tooltip from '@/common/components/Tooltip';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LEVEL_OPTIONS } from '@/types/maturity-matrix.types';
import { CreateGoal, createGoalSchema } from '@/schemas/goal.schema';
import { Goal, GOAL_STATUSES } from '@/types/goals.types';
import { Textarea } from '@/components/ui/textarea';
type Props = {
    mode: "create" | "update";
    handleCreate: (values: CreateGoal) => void;
    handleUpdate: (values: CreateGoal) => void;
    goal?: Goal;
    isOpen: boolean;
    handleOpen: (bool: boolean) => void;
}

const UpsertGoalSheet = ({ mode, handleCreate, handleUpdate, goal, handleOpen, isOpen }: Props) => {
    const [loading, setLoading] = useState(false);

    const form = useForm<CreateGoal>({
        resolver: zodResolver(createGoalSchema),
        defaultValues: goal ? {
            start_date: new Date(goal.start_date),
            description: goal.description,
            target_date: new Date(goal.target_date),
            target_level: goal.target_level.toString(),
            status: goal.status,
        } : {
            description: "",
            target_date: new Date(),
            target_level: "1",
            status: "pending",
            start_date: new Date(),
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: CreateGoal) {
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
        if (goal) {
            form.setValue("description", goal.description);
            form.setValue("target_date", new Date(goal.target_date));
            form.setValue("target_level", goal.target_level.toString());
            form.setValue("status", goal.status);
            form.setValue("start_date", new Date(goal.start_date));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [goal])
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
                    <SheetTitle>Nieuwe Doelen</SheetTitle>
                    <SheetDescription>
                        Creëer Nieuwe Doelen.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form} >
                    <form className="grid grid-cols-2 gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="target_level"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
                                    <FormLabel className='flex items-center justify-between'>
                                        Level
                                        <Tooltip text='This is Domein '>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Domein" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectGroup>
                                                    {
                                                        LEVEL_OPTIONS.filter(v => v.value !== "").map((item, index) => (
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
                                <FormItem className='col-span-2'>
                                    <FormLabel className='flex items-center justify-between'>
                                        Status
                                        <Tooltip text='This is Status '>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectGroup>
                                                    {
                                                        GOAL_STATUSES.filter(v => v.value !== "").map((item, index) => (
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
                            name={`start_date`}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className='flex items-center justify-between'>
                                        Datum en tijd
                                        <Tooltip text='This is datum en tijd. '>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <Popover modal>
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
                                                selected={new Date(field.value)}
                                                onSelect={field.onChange}
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
                            name={`target_date`}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className='flex items-center justify-between'>
                                        Doeldatum
                                        <Tooltip text='This is doeldatum. '>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <Popover modal>
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
                                                selected={new Date(field.value || "")}
                                                onSelect={field.onChange}
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
                            name="description"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
                                    <FormLabel className='flex items-center justify-between text-sm font-semibold'>
                                        Beschrijving 
                                        <Tooltip text='This is beschrijving '>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl className=''>
                                        <div className="relative">
                                            <Textarea
                                                placeholder="beschrijving "
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

                        <Separator className="bg-slate-300 w-full col-span-2" />

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

export default UpsertGoalSheet