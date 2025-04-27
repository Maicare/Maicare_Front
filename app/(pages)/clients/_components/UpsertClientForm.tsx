"use client";

import FilesUploader from "@/common/components/FilesUploader";
import PrimaryButton from "@/common/components/PrimaryButton";
import Tooltip from "@/common/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { GENDER_OPTIONS, LEGAL_MEASURE, SOURCE_OPTIONS } from "@/consts";
import { useClient } from "@/hooks/client/use-client";
import { useContact } from "@/hooks/contact/use-contact";
import { useLocation } from "@/hooks/location/use-location";
import { CreateClientInput, CreateClientSchema, UpdateClientRequestBody } from "@/schemas/clientNew.schema";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, Info, PlusCircle, XCircle } from "lucide-react";
import {  useState } from "react";
import {  useForm } from "react-hook-form";
import AddressesForm from "./AdressesForm";

type Props = {
    mode: "create" | "update";
    onSuccess?: (id: number) => void;
    defaultValues?: UpdateClientRequestBody&{identity_attachment_ids:string[]};
    onCancel: () => void;
}

const UpsertClientForm = ({ mode, onCancel, defaultValues, onSuccess }: Props) => {
    const { createOne, updateOne } = useClient({ autoFetch: false });
    const { locations, } = useLocation({autoFetch:true});
    const { contacts, } = useContact();
    const [loading, setLoading] = useState(false);
    // 1. Define your form.

    const form = useForm<CreateClientInput>({
        resolver: zodResolver(CreateClientSchema),
        defaultValues: mode === "update" ? {
            ...defaultValues,
            date_of_birth: new Date(defaultValues?.date_of_birth ?? ""),
            location_id: defaultValues?.location_id?.toString() ?? "",
            sender_id: defaultValues?.sender_id?.toString() ?? "",
            departure_reason:defaultValues?.departure_reason??"",
            departure_report:defaultValues?.departure_report ? defaultValues.departure_report : undefined,

        } : {
            first_name: "", // Voornaam
            last_name: "", // Achternaam
            email: "", // E-mail
            organisation: "", // Organisatie
            location_id: "", // Locatie ID
            legal_measure: "", // Juridische maatregel
            birthplace: "", // Geboorteplaats
            departement: "", // Afdeling
            gender: "", // Geslacht
            filenumber: "", // Dossiernummer
            phone_number: "", // Telefoonnummer
            bsn: "", // BSN
            source: "", // Bron
            date_of_birth: new Date(), // Geboortedatum
            addresses: [
                {
                    belongs_to: "", // Behoort toe
                    address: "", // Adres
                    city: "", // Stad
                    zip_code: "", // Postcode
                    phone_number: "", // Telefoonnummer
                },
            ], // Adressen
            infix: "", // Tussenvoegsel (optioneel)
            added_identity_documents: [], // Toegevoegde identiteitsdocumenten (optioneel)
            removed_identity_documents: [], // Verwijderde identiteitsdocumenten (optioneel)
            departure_reason: "", // Vertrekreden (optioneel)
            departure_report: "", // Vertrekrapport (optioneel)
            sender_id: "", // Afzender ID
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: CreateClientInput) {
        if (mode === "create") {
            try {
                setLoading(true);
                const newClient = await createOne(
                    {
                        ...values,
                        date_of_birth: values.date_of_birth.toISOString().split("T")[0],
                        location_id: Number(values.location_id),
                        sender_id: Number(values.sender_id),
                    }, {
                    displaySuccess: true,
                    displayProgress: true
                }
                );
                onSuccess?.(newClient.id);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        } else {
            try {
                setLoading(true);
                await updateOne(
                    defaultValues?.id || 0,
                    {
                        ...values,
                        date_of_birth: values.date_of_birth.toISOString().replace("00:00:00Z","04:00:00Z"),
                        location_id: Number(values.location_id),
                        sender_id:Number(values.sender_id),
                    }, {
                    displaySuccess: true,
                    displayProgress: true
                }
                );
                onSuccess?.(defaultValues?.id||0);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    }
    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2 h-fit">
                    <div className="grid grid-cols-1 gap-4 h-fit">
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
                            <h1 className='text-base font-semibold text-black'>Persoonlijke Gegevens</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Voornaam</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: John" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is Voornaam'>
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
                                                    <Input placeholder="eg: Doe" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is Achternaam'>
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
                                        <FormItem>
                                            <FormLabel>E-mail</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input type="email" placeholder="eg: John.doe@example.com" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is Email '>
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
                                        <FormItem>
                                            <FormLabel>Telefoonnummer</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: +212 626 661 516" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is Telefoonnummer'>
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
                                    name="infix"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tussenvoegsel</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: Tussenvoegsel" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is Tussenvoegsel'>
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
                                    name="birthplace"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Geboorteplaats</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: Tangier" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is Geboorteplaats'>
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
                                    name="filenumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dossiernummer</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: T98UJB590" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is Dossiernummer'>
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
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='flex items-center justify-between'>
                                                Geslacht
                                                <Tooltip text='This is gender '>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Geslacht" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            {
                                                                GENDER_OPTIONS.map((item, index) => (
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
                                    name="date_of_birth"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className='flex items-center justify-between'>
                                                Date of birth
                                                <Tooltip text='This is date of birth. '>
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
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 h-fit">
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
                            <h1 className='text-base font-semibold text-black'>Identiteitsgegevens</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="bsn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>BSN</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: BSN" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is BSN'>
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
                                    name="source"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='flex items-center justify-between'>
                                                Bron
                                                <Tooltip text='This is Bron'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Bron" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            {
                                                                SOURCE_OPTIONS.map((item, index) => (
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
                            </div>
                            <FilesUploader
                                label={"Identiteitsdocumenten"}
                                name={"added_identity_documents"}
                                uploaded={defaultValues?.identity_attachment_ids||undefined}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2 h-fit">
                    <div className="grid grid-cols-1 gap-4 h-fit">
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
                            <h1 className='text-base font-semibold text-black'>Locatiegegevens</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-2 gap-x-2 gap-y-4">
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
                                    name="legal_measure"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='flex items-center justify-between'>
                                                Rechtsmaatregel
                                                <Tooltip text='This is Rechtsmaatregel'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a Rechtsmaatregel" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            {
                                                                LEGAL_MEASURE.map((item, index) => (
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
                                    name="departement"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Afdeling</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: IT departement" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is Afdeling'>
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
                                    name="organisation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Organisatie</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: MaiCare" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is Organisatie'>
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
                            <div className="flex items-center justify-between">
                                <h1 className='text-base font-semibold text-black'>opdrachtgever</h1>
                                <PrimaryButton
                                    text="nieuwe opdrachtgever"
                                    icon={PlusCircle}
                                    animation="animate-bounce"
                                    type="button"
                                />
                            </div>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-1">
                                <FormField
                                    control={form.control}
                                    name="sender_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='flex items-center justify-between'>
                                                Contact
                                                <Tooltip text='This is Contact'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a Contact" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            <SelectLabel>Contacts</SelectLabel>
                                                            {
                                                                contacts?.results?.map((item, index) => (
                                                                    <SelectItem key={index} value={item?.id?.toString()||""} className="hover:bg-slate-100 cursor-pointer">{item.name}</SelectItem>
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
                            <h1 className='text-base font-semibold text-black'>Adresgegevens</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-1">
                                <AddressesForm />
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

export default UpsertClientForm