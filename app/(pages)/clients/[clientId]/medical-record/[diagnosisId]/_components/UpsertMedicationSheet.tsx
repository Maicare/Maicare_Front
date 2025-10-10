"use client";
import { Sheet, SheetClose, SheetContent, SheetDescription,  SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

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
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CreateMedication, CreateMedicationSchema } from '@/schemas/medication.schema';
import { Medication } from '@/types/diagnosis.types';
import EmployeeSelect from '../../../incidents/_components/EmployeeSelect';
import { Separator } from '@/components/ui/separator';
type Props = {
    mode: "create" | "update";
    handleCreate: (values: CreateMedication) => void;
    handleUpdate: (values: CreateMedication) => void;
    medication?: Medication;
    isOpen: boolean;
    handleOpen: (bool: boolean) => void;
}

const UpsertMedicationSheet = ({ mode, handleCreate, handleUpdate, medication, handleOpen, isOpen }: Props) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<CreateMedication>({
        resolver: zodResolver(CreateMedicationSchema),
        defaultValues: medication ? {
            ...medication,
            start_date:new Date(medication.start_date),
            end_date:new Date(medication.end_date),
            administered_by_id:medication.administered_by_id.toString()
        } : {
            administered_by_id: "0",
            dosage: "",
            end_date:new Date(),
            is_critical: false,
            name: "",
            notes: "",
            self_administered: false,
            start_date: new Date()
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: CreateMedication) {
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
        if (medication) {
            form.setValue("administered_by_id", medication.administered_by_id.toString());
            form.setValue("dosage", medication.dosage);
            form.setValue("end_date", new Date(medication.end_date));
            form.setValue("is_critical", medication.is_critical);
            form.setValue("name", medication.name);
            form.setValue("notes", medication.notes);
            form.setValue("self_administered", medication.self_administered);
            form.setValue("start_date", new Date(medication.start_date));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [medication])
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
                    <SheetTitle>Nieuwe Medicatie</SheetTitle>
                    <SheetDescription>
                        Creëer nieuwe medicatie.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form} >
                    <form className="grid grid-cols-2 gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name={`name`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Medicatienaam</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="Bijv. Ibuprofen" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5">
                                                <Tooltip text="Naam van de medicatie">
                                                    <Info className="h-5 w-5" />
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
                            name={`dosage`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dosering</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="Bijv. 200mg" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5">
                                                <Tooltip text="Doseringsinstructies">
                                                    <Info className="h-5 w-5" />
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
                            name={`start_date`}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className='flex items-center justify-between'>
                                        Startdatum medicatie
                                        <Tooltip text='Dit is de startdatum van de medicatie'>
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
                                                        <span>Kies een datum</span>
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
                            name={`end_date`}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className='flex items-center justify-between'>
                                        Einddatum medicatie
                                        <Tooltip text='Dit is de einddatum van de medicatie'>
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
                                                        <span>Kies een datum</span>
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
                            name={`notes`}
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel className='flex items-center justify-between text-sm font-semibold'>
                                        Medicatie notities
                                        <Tooltip text='Geef notities voor de medicatie'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl className=''>
                                        <Textarea
                                            placeholder="Geef notities voor de medicatie"
                                            className="resize-none"
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`is_critical`}
                            render={({ field }) => (
                                <FormItem className={cn('flex items-center gap-2 p-2 cursor-pointer w-full bg-indigo-500/5 backdrop-blur-sm rounded-md', field.value && "bg-indigo-900/30")}>
                                    <FormControl className='flex items-center  cursor-pointer'>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className='!mt-0 w-full cursor-pointer'>Kritieke medicatie?</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`self_administered`}
                            render={({ field }) => (
                                <FormItem className={cn('flex items-center gap-2 p-2 cursor-pointer w-full bg-indigo-500/5 backdrop-blur-sm rounded-md', field.value && "bg-indigo-900/30")}>
                                    <FormControl className='flex items-center  cursor-pointer'>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className='!mt-0 w-full cursor-pointer'>Zelf toegediend?</FormLabel>
                                </FormItem>
                            )}
                        />
                        <EmployeeSelect
                            name={`administered_by_id`}
                            label="Beheerd door"
                            className="w-full col-span-2"
                            required
                            modal
                        />

                        <Separator className="bg-slate-300 w-full col-span-2" />

                        <Button disabled={loading} type="submit" className='bg-indigo-200 text-indigo-600 hover:text-white hover:bg-indigo-600 transition-colors'>Wijzigingen opslaan</Button>
                        <SheetClose asChild>
                            <Button className='bg-red-200 text-red-600 hover:text-white hover:bg-red-600 transition-colors'>Annuleren</Button>
                        </SheetClose>
                    </form>
                </Form>


            </SheetContent>
        </Sheet>
    )
}

export default UpsertMedicationSheet