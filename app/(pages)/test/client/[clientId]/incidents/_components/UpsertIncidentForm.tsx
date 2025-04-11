"use client";
import PrimaryButton from '@/common/components/PrimaryButton';
import Tooltip from '@/common/components/Tooltip';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CLIENT_OPTIONS, CONSULTATION_NEEDED_OPTIONS, EMPLOYEE_ABSENTEEISM_OPTIONS,  INCIDENT_TYPE_NOTIFICATIONS, INFORM_WHO_OPTIONS, INJURY_OPTIONS,  MESE_WORKER_OPTIONS, ORGANIZATIONAL_OPTIONS, PSYCHOLOGICAL_DAMAGE_OPTIONS, REPORTER_INVOLVEMENT_OPTIONS, RISK_OF_RECURRENCE_OPTIONS, SEVERITY_OF_INCIDENT_OPTIONS,  SUCCESSION_OPTIONS, TECHNICAL_OPTIONS, TYPES_INCIDENT_OPTIONS } from '@/consts';
import { useIncident } from '@/hooks/incident/use-incident';
import { CreateIncidentNew, IncidentCreateSchema } from '@/schemas/incident.schema';
import { Incident } from '@/types/incident.types';
import { cn } from '@/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle, Info,  XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import EmployeeSelect from './EmployeeSelect';
import { useLocation } from '@/hooks/location/use-location';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import MultiEmailsSelect from './MultiEmailsSelect';

type Props = {
    mode: "create" | "update";
    onSuccess?: () => void;
    defaultValues?: Incident;
    onCancel: () => void;
    clientId: string;
    incidentId?: string;
}
const UpsertIncidentForm = ({ mode, onCancel, defaultValues, onSuccess, clientId,incidentId }: Props) => {
    const { createOne, updateOne } = useIncident({ autoFetch: false, clientId: parseInt(clientId) });
    const [loading, setLoading] = useState(false);
    const { locations, } = useLocation({ autoFetch: true });
    // 1. Define your form.

    const form = useForm<CreateIncidentNew>({
        resolver: zodResolver(IncidentCreateSchema),
        defaultValues: mode === "update" ? {
            ...defaultValues,
            incident_date: new Date(defaultValues?.incident_date ?? ""),
            location_id: defaultValues?.location_id?.toString() ?? "",
            employee_id: defaultValues?.employee_id?.toString() ?? "",

        } : {
            incident_date: new Date(),
            location_id: "",
            employee_id: "",
            accident: false,
            additional_appointments: "",
            cause_explanation: "",
            client_absence: false,
            client_options: [],
            emails: [],
            employee_absenteeism: "",
            fire_water_damage: false,
            incident_explanation: "",
            incident_prevent_steps: "",
            incident_taken_measures: "",
            incident_type: "",
            inform_who: [],
            medicines: false,
            mese_worker: [],
            needed_consultation: "",
            organization: false,
            organizational: [],
            other: false,
            other_cause: "",
            other_desc: "",
            other_notifications: false,
            passing_away: false,
            physical_injury: "",
            physical_injury_desc: "",
            psychological_damage: "",
            psychological_damage_desc: "",
            recurrence_risk: "",
            reporter_involvement: "",
            runtime_incident: "",
            self_harm: false,
            severity_of_incident: "",
            succession: [],
            succession_desc: "",
            technical: [],
            use_prohibited_substances: false,
            violence: false,
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: CreateIncidentNew) {
        if (mode === "create") {
            try {
                setLoading(true);
                await createOne(
                    {...values,emails:form.getValues("emails")}, parseInt(clientId), {
                    displaySuccess: true,
                    displayProgress: true
                }
                );
                onSuccess?.();
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        } else {
            try {
                setLoading(true);
                await updateOne(
                    {
                        ...values
                    },
                    defaultValues?.id || 0,
                    parseInt(clientId),
                    {
                        displaySuccess: true,
                        displayProgress: true
                    }
                );
                onSuccess?.();
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    }

    console.log({errors:form.formState.errors,values:form.getValues()})
    useEffect(() => {
        const clientOptions = form.getValues("client_options");
        const selectedClientOptions = clientOptions.filter((option) => option !== undefined);
        // const inform_who mese_worker organizational technical
        const inFormWho = form.getValues("inform_who");
        const selectedInFormWho = inFormWho.filter((option) => option !== undefined);
        const meseWorker = form.getValues("mese_worker");
        const selectedMeseWorker = meseWorker.filter((option) => option !== undefined);
        const organizational = form.getValues("organizational");
        const selectedOrganizational = organizational.filter((option) => option !== undefined);
        const technical = form.getValues("technical");
        const selectedTechnical = technical.filter((option) => option !== undefined);
        const succession = form.getValues("succession");
        const selectedSuccession = succession.filter((option) => option !== undefined);
        form.setValue("client_options", selectedClientOptions);
        form.setValue("inform_who", selectedInFormWho);
        form.setValue("mese_worker", selectedMeseWorker);
        form.setValue("organizational", selectedOrganizational);
        form.setValue("technical", selectedTechnical);
        form.setValue("succession", selectedSuccession);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.getValues("client_options"),form.getValues("succession"), form.getValues("inform_who"), form.getValues("mese_worker"), form.getValues("organizational"), form.getValues("technical")])
    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2 h-fit">
                    <div className="grid grid-cols-1 gap-4 h-fit">
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
                            <h1 className='text-base font-semibold text-black'>Algemene informatie</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                                <EmployeeSelect
                                    name="employee_id"
                                    label="Voornaam betrokken medewerker(s)"
                                    required
                                    className='w-full'
                                />
                                <FormField
                                    control={form.control}
                                    name="location_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='flex items-center justify-between'>
                                                Locatie
                                                <Tooltip text='This is Locatie '>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a Location" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            <SelectLabel>Locations</SelectLabel>
                                                            {
                                                                locations?.map((item, index) => (
                                                                    <SelectItem key={index} value={item.id.toString()} className="hover:bg-slate-100 cursor-pointer">{item.name}</SelectItem>
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
                                    name="reporter_involvement"
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
                                                                REPORTER_INVOLVEMENT_OPTIONS.filter(v => v.value !== "").map((item, index) => (
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
                                    name="incident_date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className='flex items-center justify-between'>
                                                Datum ontstaan incident
                                                <Tooltip text='This is datum ontstaan incident. '>
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
                                    name="inform_who"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2 grid grid-cols-2 gap-x-2 gap-y-4">
                                            <FormLabel className='col-span-2 flex items-center justify-between'>
                                                Wie moet geinformeerd worden?
                                                <Tooltip text='This is Wie moet geinformeerd worden? '>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            {
                                                INFORM_WHO_OPTIONS.map((item, index) => (
                                                    <FormField
                                                        key={index}
                                                        control={form.control}
                                                        name={`inform_who.${index}`}
                                                        render={({ field: _field }) => (
                                                            <FormItem className={cn('flex items-center gap-2 p-2 cursor-pointer w-full bg-indigo-500/5 backdrop-blur-sm rounded-md', field.value.includes(item) && "bg-indigo-900/30")}>
                                                                <FormControl className='flex items-center  cursor-pointer'>
                                                                    <Checkbox
                                                                        checked={field.value.includes(item)}
                                                                        onCheckedChange={(checked) => {
                                                                            if (checked) {
                                                                                field.onChange([...field.value, item]);
                                                                            } else {
                                                                                field.onChange(field.value.filter((i) => i !== item));
                                                                            }
                                                                        }
                                                                        }
                                                                        value={item}
                                                                        key={index}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className='!mt-0 w-full cursor-pointer'>{item}</FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))
                                            }
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="runtime_incident"
                                    render={({ field }) => (
                                        <FormItem className='col-span-2'>
                                            <FormLabel>Runtime incident</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input type="text" placeholder="Runtime incident" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is Runtime incident'>
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
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 h-fit">
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
                            <h1 className='text-base font-semibold text-black'>Mogelijke oorzaak en toelichting</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="technical"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2 grid grid-cols-3 gap-x-2 gap-y-4">
                                            <FormLabel className='col-span-3 flex items-center justify-between'>
                                                Technisch
                                                <Tooltip text='This is Technisch'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            {
                                                TECHNICAL_OPTIONS.map((item, index) => (
                                                    <FormField
                                                        key={index}
                                                        control={form.control}
                                                        name={`technical.${index}`}
                                                        render={({ field: _field }) => (
                                                            <FormItem className={cn('flex items-center gap-2 p-2 cursor-pointer w-full bg-indigo-500/5 backdrop-blur-sm rounded-md', field.value.includes(item) && "bg-indigo-900/30")}>
                                                                <FormControl className='flex items-center  cursor-pointer'>
                                                                    <Checkbox
                                                                        checked={field.value.includes(item)}
                                                                        onCheckedChange={(checked) => {
                                                                            if (checked) {
                                                                                field.onChange([...field.value, item]);
                                                                            } else {
                                                                                field.onChange(field.value.filter((i) => i !== item));
                                                                            }
                                                                        }
                                                                        }
                                                                        value={item}
                                                                        key={index}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className='!mt-0 w-full cursor-pointer leading-4'>{item}</FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))
                                            }
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="organizational"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2 grid grid-cols-3 gap-x-2 gap-y-4">
                                            <FormLabel className='col-span-3 flex items-center justify-between'>
                                                Organisatorish
                                                <Tooltip text='This is Organisatorish'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            {
                                                ORGANIZATIONAL_OPTIONS.map((item, index) => (
                                                    <FormField
                                                        key={index}
                                                        control={form.control}
                                                        name={`organizational.${index}`}
                                                        render={({ field: _field }) => (
                                                            <FormItem className={cn('flex items-center gap-2 p-2 cursor-pointer w-full bg-indigo-500/5 backdrop-blur-sm rounded-md', field.value.includes(item) && "bg-indigo-900/30")}>
                                                                <FormControl className='flex items-center  cursor-pointer'>
                                                                    <Checkbox
                                                                        checked={field.value.includes(item)}
                                                                        onCheckedChange={(checked) => {
                                                                            if (checked) {
                                                                                field.onChange([...field.value, item]);
                                                                            } else {
                                                                                field.onChange(field.value.filter((i) => i !== item));
                                                                            }
                                                                        }
                                                                        }
                                                                        value={item}
                                                                        key={index}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className='!mt-0 w-full cursor-pointer leading-4'>{item}</FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))
                                            }
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="mese_worker"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2 grid grid-cols-3 gap-x-2 gap-y-4">
                                            <FormLabel className='col-span-3 flex items-center justify-between'>
                                                Mesewerker
                                                <Tooltip text='This is Mesewerker'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            {
                                                MESE_WORKER_OPTIONS.map((item, index) => (
                                                    <FormField
                                                        key={index}
                                                        control={form.control}
                                                        name={`mese_worker.${index}`}
                                                        render={({ field: _field }) => (
                                                            <FormItem className={cn('flex items-center gap-2 p-2 cursor-pointer w-full bg-indigo-500/5 backdrop-blur-sm rounded-md', field.value.includes(item) && "bg-indigo-900/30")}>
                                                                <FormControl className='flex items-center  cursor-pointer'>
                                                                    <Checkbox
                                                                        checked={field.value.includes(item)}
                                                                        onCheckedChange={(checked) => {
                                                                            if (checked) {
                                                                                field.onChange([...field.value, item]);
                                                                            } else {
                                                                                field.onChange(field.value.filter((i) => i !== item));
                                                                            }
                                                                        }
                                                                        }
                                                                        value={item}
                                                                        key={index}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className='!mt-0 w-full cursor-pointer leading-4'>{item}</FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))
                                            }
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="client_options"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2 grid grid-cols-3 gap-x-2 gap-y-4">
                                            <FormLabel className='col-span-3 flex items-center justify-between'>
                                                Cliënt
                                                <Tooltip text='This is Cliënt'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            {
                                                CLIENT_OPTIONS.map((item, index) => (
                                                    <FormField
                                                        key={index}
                                                        control={form.control}
                                                        name={`client_options.${index}`}
                                                        render={({ field: _field }) => (
                                                            <FormItem className={cn('flex items-center gap-2 p-2 cursor-pointer w-full bg-indigo-500/5 backdrop-blur-sm rounded-md', field.value.includes(item) && "bg-indigo-900/30")}>
                                                                <FormControl className='flex items-center  cursor-pointer'>
                                                                    <Checkbox
                                                                        checked={field.value.includes(item)}
                                                                        onCheckedChange={(checked) => {
                                                                            if (checked) {
                                                                                field.onChange([...field.value, item]);
                                                                            } else {
                                                                                field.onChange(field.value.filter((i) => i !== item));
                                                                            }
                                                                        }
                                                                        }
                                                                        value={item}
                                                                        key={index}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className='!mt-0 w-full cursor-pointer leading-4'>{item}</FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))
                                            }
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="other_cause"
                                    render={({ field }) => (
                                        <FormItem className='col-span-2 '>
                                            <FormLabel>Overig</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: cause" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is Overig'>
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
                                    name="cause_explanation"
                                    render={({ field }) => (
                                        <FormItem className='col-span-2 '>
                                            <FormLabel className='flex items-center justify-between text-sm text-slate-700 font-semibold'>
                                                Toelichting op de oorzaak/oorzaken
                                                <Tooltip text='This is toelichting op de oorzaak/oorzaken'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="toelichting op de oorzaak/oorzaken"
                                                    className="resize-none"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2 h-fit">
                    <div className="grid grid-cols-1 gap-4 h-fit">
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
                            <h1 className='text-base font-semibold text-black'>Infromatie over het incident</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="incident_type"
                                    render={({ field }) => (
                                        <FormItem className='col-span-2 '>
                                            <FormLabel className='flex items-center justify-between'>
                                                Typ incident
                                                <Tooltip text='This is Typ incident'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Typ incident" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            {
                                                                TYPES_INCIDENT_OPTIONS.filter(v => v.value !== "").map((item, index) => (
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
                                    name=''
                                    render={({ field: _field }) => (
                                        <FormItem className="col-span-2 grid grid-cols-2 gap-x-2 gap-y-4">
                                            <FormLabel className='col-span-2 flex items-center justify-between'>
                                                Opties
                                                <Tooltip text='This is Opties'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            {
                                                INCIDENT_TYPE_NOTIFICATIONS.map((item, index) => (
                                                    <FormField
                                                        key={index}
                                                        name={item.value}
                                                        control={form.control}
                                                        render={({ field }) => (
                                                            <FormItem className={cn('flex items-center gap-2 p-2 cursor-pointer w-full bg-indigo-500/5 backdrop-blur-sm rounded-md', field.value && "bg-indigo-900/30")}>
                                                                <FormControl className='flex items-center  cursor-pointer'>
                                                                    <Checkbox
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
                                                                        value={item.value}
                                                                        key={index}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className='!mt-0 w-full cursor-pointer'>{item.label}</FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))
                                            }
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="severity_of_incident"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='flex items-center justify-between'>
                                                ernst incident
                                                <Tooltip text='This is ernst incident'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full text-start">
                                                        <SelectValue className='!text-start' placeholder="ernst incident" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            {
                                                                SEVERITY_OF_INCIDENT_OPTIONS.filter(v => v.value !== "").map((item, index) => (
                                                                    <SelectItem key={index} value={item.value} className="hover:bg-slate-100 cursor-pointer text-start">{item.label.trim()}</SelectItem>
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
                                    name="recurrence_risk"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='flex items-center justify-between'>
                                                Is er risico op herhaling?
                                                <Tooltip text='This is Is er risico op herhaling?'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full text-start">
                                                        <SelectValue className='!text-start' placeholder="Is er risico op herhaling?" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            {
                                                                RISK_OF_RECURRENCE_OPTIONS.filter(v => v.value !== "").map((item, index) => (
                                                                    <SelectItem key={index} value={item.value} className="hover:bg-slate-100 cursor-pointer text-start">{item.label.trim()}</SelectItem>
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
                                    name="incident_prevent_steps"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='flex items-center justify-between text-sm text-slate-700 font-semibold'>
                                                Welke stappen zijin ondernomen om het incident te voorkomen
                                                <Tooltip text='This is welke stappen zijin ondernomen om het incident te voorkomen'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="welke stappen zijin ondernomen om het incident te voorkomen"
                                                    className="resize-none"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="incident_taken_measures"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='flex items-center justify-between text-sm text-slate-700 font-semibold'>
                                                Welke maatregelen zijn genomen na het plaatsvinden van het incident
                                                <Tooltip text='This is welke maatregelen zijn genomen na het plaatsvinden van het incident'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="welke maatregelen zijn genomen na het plaatsvinden van het incident"
                                                    className="resize-none"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="incident_explanation"
                                    render={({ field }) => (
                                        <FormItem className='col-span-2 '>
                                            <FormLabel className='flex items-center justify-between text-sm text-slate-700 font-semibold'>
                                                Toelichting op het incident
                                                <Tooltip text='This is toelichting op het incident'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="toelichting op het incident"
                                                    className="resize-none"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 h-fit">
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
                            <h1 className='text-base font-semibold text-black'>Gevolgen</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="physical_injury"
                                    render={({ field }) => (
                                        <FormItem className='col-span-2 '>
                                            <FormLabel className='flex items-center justify-between'>
                                                Lichamelijjk letsel
                                                <Tooltip text='This is Lichamelijjk letsel'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full text-start">
                                                        <SelectValue className='!text-start' placeholder="Lichamelijjk letsel" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            {
                                                                INJURY_OPTIONS.filter(v => v.value !== "").map((item, index) => (
                                                                    <SelectItem key={index} value={item.value} className="hover:bg-slate-100 cursor-pointer text-start">{item.label.trim()}</SelectItem>
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
                                    name="physical_injury_desc"
                                    render={({ field }) => (
                                        <FormItem className='col-span-2 '>
                                            <FormLabel className='flex items-center justify-between text-sm text-slate-700 font-semibold'>
                                                Omschrijving van lichamelijk letsel
                                                <Tooltip text='This is omschrijving van lichamelijk letsel'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="omschrijving van lichamelijk letsel"
                                                    className="resize-none"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="psychological_damage"
                                    render={({ field }) => (
                                        <FormItem className='col-span-2 '>
                                            <FormLabel className='flex items-center justify-between'>
                                                Psychische schade
                                                <Tooltip text='This is Psychische schade'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full text-start">
                                                        <SelectValue className='!text-start' placeholder="Psychische schade" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            {
                                                                PSYCHOLOGICAL_DAMAGE_OPTIONS.filter(v => v.value !== "").map((item, index) => (
                                                                    <SelectItem key={index} value={item.value} className="hover:bg-slate-100 cursor-pointer text-start">{item.label.trim()}</SelectItem>
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
                                    name="psychological_damage_desc"
                                    render={({ field }) => (
                                        <FormItem className='col-span-2 '>
                                            <FormLabel className='flex items-center justify-between text-sm text-slate-700 font-semibold'>
                                                Omschrijving van psychologische schade
                                                <Tooltip text='This is omschrijving van psychologische schade'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="omschrijving van psychologische schade"
                                                    className="resize-none"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="needed_consultation"
                                    render={({ field }) => (
                                        <FormItem className='col-span-2 '>
                                            <FormLabel className='flex items-center justify-between'>
                                                Consult nodig
                                                <Tooltip text='This is Consult nodig'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full text-start">
                                                        <SelectValue className='!text-start' placeholder="Consult nodig" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            {
                                                                CONSULTATION_NEEDED_OPTIONS.filter(v => v.value !== "").map((item, index) => (
                                                                    <SelectItem key={index} value={item.value} className="hover:bg-slate-100 cursor-pointer text-start">{item.label.trim()}</SelectItem>
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
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 h-fit">
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
                            <h1 className='text-base font-semibold text-black'>Opvolging</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="succession"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2 grid grid-cols-3 gap-x-2 gap-y-4">
                                            <FormLabel className='col-span-3 flex items-center justify-between'>
                                                Opvolging
                                                <Tooltip text='This is Opvolging'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            {
                                                SUCCESSION_OPTIONS.map((item, index) => (
                                                    <FormField
                                                        key={index}
                                                        control={form.control}
                                                        name={`succession.${index}`}
                                                        render={({ field: _field }) => (
                                                            <FormItem className={cn('flex items-center gap-2 p-2 cursor-pointer w-full bg-indigo-500/5 backdrop-blur-sm rounded-md', field.value.includes(item) && "bg-indigo-900/30")}>
                                                                <FormControl className='flex items-center  cursor-pointer'>
                                                                    <Checkbox
                                                                        checked={field.value.includes(item)}
                                                                        onCheckedChange={(checked) => {
                                                                            if (checked) {
                                                                                field.onChange([...field.value.filter(v => v !== undefined), item]);
                                                                            } else {
                                                                                field.onChange(field.value.filter((i) => i !== item && i !== undefined));
                                                                            }
                                                                        }
                                                                        }
                                                                        value={item}
                                                                        key={index}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className='!mt-0 w-full cursor-pointer leading-4'>{item}</FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))
                                            }
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="succession_desc"
                                    render={({ field }) => (
                                        <FormItem className='col-span-2 '>
                                            <FormLabel className='flex items-center justify-between text-sm text-slate-700 font-semibold'>
                                                Beschrijving van opvolging
                                                <Tooltip text='This is beschrijving van opvolging'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="beschrijving van opvolging"
                                                    className="resize-none"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="other"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2 grid grid-cols-3 gap-x-2">
                                            <FormLabel className='col-span-3 flex items-center justify-between'>
                                                overige, nL.
                                                <Tooltip text='This is overige, nL.'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <div className='col-span-3 flex items-center gap-2 p-2 cursor-pointer w-full bg-indigo-500/5 backdrop-blur-sm rounded-md'>
                                                <FormControl className='flex items-center  cursor-pointer'>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel className='!mt-0 w-full cursor-pointer leading-4'>{"overige, nL."}</FormLabel>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="other_desc"
                                    render={({ field }) => (
                                        <FormItem className='col-span-2 '>
                                            <FormLabel className='flex items-center justify-between text-sm text-slate-700 font-semibold'>
                                                Beschrijving van overige, nL.
                                                <Tooltip text='This is beschrijving van overige, nL.'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="beschrijving van overige, nL."
                                                    className="resize-none"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="additional_appointments"
                                    render={({ field }) => (
                                        <FormItem className='col-span-2 '>
                                            <FormLabel className='flex items-center justify-between text-sm text-slate-700 font-semibold'>
                                                Aanvullende afspraken
                                                <Tooltip text='This is aanvullende afspraken'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="aanvullende afspraken"
                                                    className="resize-none"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="employee_absenteeism"
                                    render={({ field }) => (
                                        <FormItem className='col-span-2 '>
                                            <FormLabel className='flex items-center justify-between'>
                                                Ziekteverzuim medewerker antwoord wissen
                                                <Tooltip text='This is Ziekteverzuim medewerker antwoord wissen'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full text-start">
                                                        <SelectValue className='!text-start' placeholder="Ziekteverzuim medewerker antwoord wissen" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            {
                                                                EMPLOYEE_ABSENTEEISM_OPTIONS.filter(v => v.value !== "").map((item, index) => (
                                                                    <SelectItem key={index} value={item.value} className="hover:bg-slate-100 cursor-pointer text-start">{item.label.trim()}</SelectItem>
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
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 h-fit">
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
                            <h1 className='text-base font-semibold text-black'>Rapport</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                                <MultiEmailsSelect
                                    mode='update'
                                    clientId={clientId}
                                    label='Selecteer de medewerkers e-mailadressen'
                                    emails={defaultValues ? defaultValues.emails : []}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <PrimaryButton
                    text='Save'
                    type='submit'
                    animation='animate-bounce'
                    icon={CheckCircle}
                    disabled={loading}
                    className='bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white px-4 py-3 text-sm'
                />
                <PrimaryButton
                    text='Cancel'
                    type='button'
                    animation='animate-bounce'
                    icon={XCircle}
                    onClick={onCancel}
                    disabled={loading}
                    className='bg-red-100 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 text-sm'
                />
            </form>
        </Form >
    )
}

export default UpsertIncidentForm