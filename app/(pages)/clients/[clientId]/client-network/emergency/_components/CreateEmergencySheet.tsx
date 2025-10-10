"use client";
import { Sheet, SheetClose, SheetContent, SheetDescription,  SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import PrimaryButton from '@/common/components/PrimaryButton';
import {  Info, PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Tooltip from '@/common/components/Tooltip';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { EmergencyContactList } from '@/types/emergency.types';
import { CreateEmergencyContact, createEmergencyContactSchema } from '@/schemas/emergencyContact.schema';
import { EMERGENCY_DISTANCE_OPTIONS, EMERGENCY_RELATIONSHIP_OPTIONS } from '@/consts';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
type Props = {
    mode: "create" | "update";
    handleCreate: (values: CreateEmergencyContact) => void;
    handleUpdate: (values: CreateEmergencyContact) => void;
    emergencyContact?: EmergencyContactList;
    isOpen: boolean;
    handleOpen: (bool: boolean) => void;
}

const CreateEmergencySheet = ({ mode, handleCreate, handleUpdate, emergencyContact, handleOpen, isOpen }: Props) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<CreateEmergencyContact>({
        resolver: zodResolver(createEmergencyContactSchema),
        defaultValues: emergencyContact ? {
            ...emergencyContact
        } : {
            address: "",
            email: "",
            first_name: "",
            goals_reports: false,
            incidents_reports: false,
            last_name: "",
            medical_reports: false,
            phone_number: "",
            relation_status: "",
            relationship: ""
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: CreateEmergencyContact) {
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
        if (emergencyContact) {
            form.setValue("address", emergencyContact.address);
            form.setValue("email", emergencyContact.email);
            form.setValue("goals_reports", emergencyContact.goals_reports);
            form.setValue("first_name", emergencyContact.first_name);
            form.setValue("last_name", emergencyContact.last_name);
            form.setValue("id", emergencyContact.id);
            form.setValue("incidents_reports", emergencyContact.incidents_reports);
            form.setValue("medical_reports", emergencyContact.medical_reports);
            form.setValue("phone_number", emergencyContact.phone_number);
            form.setValue("relation_status", emergencyContact.relation_status);
            form.setValue("relationship", emergencyContact.relationship);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emergencyContact])
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
                    <SheetTitle>Nieuw Noodcontact</SheetTitle>
                    <SheetDescription>
                        Creëer een nieuw noodcontact.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form} >
                    <form className="grid grid-cols-2 gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Voornaam</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="Bijv: Jan" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='Dit is Voornaam'>
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
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Achternaam</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="Bijv: Jansen" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='Dit is Achternaam'>
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
                            name="email"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
                                    <FormLabel>E-mailadres</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type='email' placeholder="Bijv: jan.jansen@voorbeeld.nl" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='Dit is E-mailadres'>
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
                            name="phone_number"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
                                    <FormLabel>Telefoonnummer</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="Bijv: +31 6 12345678" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='Dit is Telefoonnummer'>
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
                            name="relationship"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center justify-between'>
                                        Relatie
                                        <Tooltip text='Dit is Relatie'>
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
                            name="relation_status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center justify-between'>
                                        Afstand
                                        <Tooltip text='Dit is Afstand'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Afstand" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectGroup>
                                                    {
                                                        EMERGENCY_DISTANCE_OPTIONS.filter(v => v.value !== "").map((item, index) => (
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
                            name="address"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
                                    <FormLabel className='flex items-center justify-between text-sm font-semibold'>
                                        Voer adres in
                                        <Tooltip text='Dit is voer adres in'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl className=''>
                                        <div className="relative">
                                            <Textarea
                                                placeholder="Voer adres in"
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
                        <FormField
                            control={form.control}
                            name="goals_reports"
                            render={({ field }) => (
                                <FormItem className="col-span-2 grid grid-cols-3 gap-x-2">
                                    <div className='col-span-3 flex items-center gap-2 p-2 cursor-pointer w-full bg-white rounded-md'>
                                        <FormControl className='flex items-center  cursor-pointer'>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className='!mt-0 w-full cursor-pointer leading-4'>{"Voortgangsrapporten automatisch versturen (wekelijks)?"}</FormLabel>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="incidents_reports"
                            render={({ field }) => (
                                <FormItem className="col-span-2 grid grid-cols-3 gap-x-2">
                                    <div className='col-span-3 flex items-center gap-2 p-2 cursor-pointer w-full bg-white rounded-md'>
                                        <FormControl className='flex items-center  cursor-pointer'>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className='!mt-0 w-full cursor-pointer leading-4'>{"Incidentenrapporten automatisch verzenden?"}</FormLabel>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="medical_reports"
                            render={({ field }) => (
                                <FormItem className="col-span-2 grid grid-cols-3 gap-x-2">
                                    <div className='col-span-3 flex items-center gap-2 p-2 cursor-pointer w-full bg-white rounded-md'>
                                        <FormControl className='flex items-center  cursor-pointer'>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className='!mt-0 w-full cursor-pointer leading-4'>{"Medische rapporten automatisch verzenden (wekelijks)?"}</FormLabel>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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

export default CreateEmergencySheet