"use client";

import PrimaryButton from "@/common/components/PrimaryButton";
import Tooltip from "@/common/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { GENDER_OPTIONS,  } from "@/consts";
import { useClient } from "@/hooks/client/use-client";
import { useContact } from "@/hooks/contact/use-contact";
import { useLocation } from "@/hooks/location/use-location";
import { CreateClientInput, CreateClientSchema, UpdateClientRequestBody } from "@/schemas/clientNew.schema";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, Info, PlusCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AddressesForm from "./AdressesForm";
import EmployeeSelect from "../[clientId]/incidents/_components/EmployeeSelect";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import UpsertContactForm from "../../contacts/_components/upsert-contact-form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EnhancedDatePicker } from "./enhanced-date-picker";
import { useI18n } from "@/lib/i18n/client";

type Props = {
    mode: "create" | "update";
    onSuccess?: (id: number) => void;
    defaultValues?: UpdateClientRequestBody & { identity_attachment_ids: string[] };
    onCancel: () => void;
}

const UpsertClientForm = ({ mode, onCancel, defaultValues, onSuccess }: Props) => {
    const { createOne, updateOne } = useClient({ autoFetch: false });
    const { locations, } = useLocation({ autoFetch: true });
    const { contacts, } = useContact({ autoFetch: true });
    const [loading, setLoading] = useState(false);
    const [openContactSheet, setOpenContactSheet] = useState(false);
    const t = useI18n();
    // 1. Define your form.

    const form = useForm<CreateClientInput>({
        resolver: zodResolver(CreateClientSchema),
        defaultValues: mode === "update" ? {
            ...defaultValues,
            date_of_birth: new Date(defaultValues?.date_of_birth ?? ""),
            location_id: defaultValues?.location_id?.toString() ?? "",
            sender_id: defaultValues?.sender_id?.toString() ?? "",
            employee_id: defaultValues?.employee_id?.toString() ?? "",
            departure_reason: defaultValues?.departure_reason ?? "",
            departure_report: defaultValues?.departure_report ? defaultValues.departure_report : undefined,

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
            sender_id: "", // Afzender ID,
            employee_id: "", // Werknemer ID
            work_additional_notes: "", // Werk aanvullende notities (optioneel)
            work_current_employer: "", // Huidige werkgever (optioneel)
            work_current_position: "", // Huidige functie (optioneel)
            work_currently_employed: false, // Momenteel in dienst (optioneel)
            work_employer_email: "", // Werkgever e-mail (optioneel)
            work_employer_phone: "", // Werkgever telefoon (optioneel)
            work_start_date: new Date(), // Startdatum werk (optioneel)
            education_additional_notes: "", // Onderwijs aanvullende notities (optioneel)
            education_currently_enrolled: false, // Momenteel ingeschreven (optioneel)
            education_institution: "", // Onderwijsinstelling (optioneel)
            education_level: "primary", // Onderwijsniveau (optioneel)
            education_mentor_email: "", // Ouder/mentor e-mail (optioneel)
            education_mentor_name: "", // Ouder/mentor naam (optioneel)
            education_mentor_phone: "", // Ouder/mentor telefoon (optioneel)
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
                        date_of_birth: values.date_of_birth.toISOString().replace("00:00:00Z", "04:00:00Z"),
                        location_id: Number(values.location_id),
                        sender_id: Number(values.sender_id),
                    }, {
                    displaySuccess: true,
                    displayProgress: true
                }
                );
                onSuccess?.(defaultValues?.id || 0);
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
                            <h1 className='text-base font-semibold text-black'>{t("clients.create.personalDetails")}</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("clients.create.firstName")}</FormLabel>
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
                                            <FormLabel>{t("clients.create.lastName")}</FormLabel>
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
                                            <FormLabel>{t("clients.create.email")}</FormLabel>
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
                                            <FormLabel>{t("clients.create.phoneNumber")}</FormLabel>
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
                                            <FormLabel>{t("clients.create.middleName")}</FormLabel>
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
                                            <FormLabel>{t("clients.create.placeOfBirth")}</FormLabel>
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
                                            <FormLabel>{t("clients.create.fileNumber")}</FormLabel>
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
                                                {t("clients.create.gender")}
                                                <Tooltip text='This is gender '>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={t("clients.create.gender")} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            {
                                                                GENDER_OPTIONS.map((item, index) => (
                                                                    <SelectItem key={index} value={item.value} className="hover:bg-slate-100 cursor-pointer">{item.label === "Man" ? t("common.male") : item.label === "Vrouw" ? t("common.female") : t("common.notSpecified")}</SelectItem>
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
                                <EnhancedDatePicker
                                    control={form.control}
                                    name="date_of_birth"
                                    label={t("clients.create.dateOfBirth")}
                                    tooltipText="Select your date of birth. Must be after 1950."
                                />
                                <FormField
                                    control={form.control}
                                    name="living_situation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='flex items-center justify-between'>
                                                {t("clients.create.livingSituation")}
                                                <Tooltip text='This is Woon situatie'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Woon situatie" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            {
                                                                [
                                                                    { value: "home", label: t("clients.create.home") },
                                                                    { value: "foster_care", label: t("clients.create.fosterCare") },
                                                                    { value: "youth_care_institution", label: t("clients.create.youthCareInstitution") },
                                                                    { value: "other", label: t("common.other") },
                                                                ].map((item, index) => (
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
                                    name="living_situation_notes"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>{t("clients.create.livingSituationNotes")}</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Textarea rows={4} placeholder="eg: Woon situatie notities" className="resize-none" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is Woon situatie notities'>
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
                            <h1 className='text-base font-semibold text-black'>{t("clients.create.identityDetails")}</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="bsn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("clients.create.bsn")}</FormLabel>
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
                                                {t("clients.create.source")}
                                                <Tooltip text='This is Bron'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={t("clients.create.source")} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            {
                                                                [
                                                                    { value: 'policy_card', label: t('clients.create.policyCard') },
                                                                    { value: 'passport', label: t('clients.create.passport') },
                                                                    { value: 'ID', label: t('clients.create.id') },
                                                                    { value: 'BRP', label: t('clients.create.brp') },
                                                                    { value: 'government_agency_letter', label: t('clients.create.governmentAgencyLetter') }
                                                                ].map((item, index) => (
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
                            <EmployeeSelect
                                name="employee_id"
                                label={t("clients.create.employee")}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 h-fit">
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
                            <h1 className='text-base font-semibold text-black'>{t("clients.create.locationDetails")}</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="location_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='flex items-center justify-between'>
                                                {t("clients.create.location")}
                                                <Tooltip text='This is Locatie '>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={t("clients.list.selectLocation")} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            <SelectLabel>{t("clients.create.location")}</SelectLabel>
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
                                                {t("clients.create.legalMeasure")}
                                                <Tooltip text='This is Rechtsmaatregel'>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={t("clients.create.legalMeasure")} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            {
                                                                [
                                                                    {
                                                                        value: "Jeugdreclassering",
                                                                        label: t("clients.create.youthProbation"),
                                                                    },
                                                                    {
                                                                        value: "Jeugdbescherming",
                                                                        label: t("clients.create.youthProtection"),
                                                                    }
                                                                ].map((item, index) => (
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
                                            <FormLabel>{t("clients.create.department")}</FormLabel>
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
                                            <FormLabel>{t("clients.create.organization")}</FormLabel>
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
                                <h1 className='text-base font-semibold text-black'>{t("clients.create.contact")}</h1>
                                {/* make a sheet for the upsert-contact-form */}
                                <Sheet open={openContactSheet} onOpenChange={(b) => setOpenContactSheet(b)}>
                                    <SheetTrigger asChild>
                                        <PrimaryButton
                                            text={t("clients.create.newContact")}
                                            icon={PlusCircle}
                                            animation="animate-bounce"
                                            type="button"
                                            onClick={() => setOpenContactSheet(true)}
                                        />
                                    </SheetTrigger>
                                    <SheetContent className="sm:max-w-2xl">
                                        <SheetHeader className="mb-4">
                                            <SheetTitle>{t("clients.create.newContact")}</SheetTitle>
                                            <SheetDescription>
                                                Vul de gegevens van de nieuwe opdrachtgever in.
                                                {/* TODO translate this to eng fr nl */}
                                            </SheetDescription>
                                        </SheetHeader>
                                        <UpsertContactForm
                                            mode="create"
                                            onSuccess={(id) => {
                                                form.setValue("sender_id", id.toString());
                                                setOpenContactSheet(false);
                                            }}
                                            onCancel={() => {
                                                form.setValue("sender_id", "");
                                                setOpenContactSheet(false);
                                            }}
                                            sheet={true}
                                        />
                                    </SheetContent>
                                </Sheet>
                            </div>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-1">
                                <FormField
                                    control={form.control}
                                    name="sender_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='flex items-center justify-between'>
                                                {t("clients.create.contact")}
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
                                                            <SelectLabel>{t("clients.create.contact")}</SelectLabel>
                                                            {
                                                                contacts?.results?.map((item, index) => (
                                                                    <SelectItem key={index} value={item?.id?.toString() || ""} className="hover:bg-slate-100 cursor-pointer">{item.name}</SelectItem>
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
                </div>
                <div className="grid grid-cols-1 gap-2 h-fit">
                    {/* education and work */}
                    <div className="grid grid-cols-1 gap-4 h-fit">
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
                            <h1 className='text-base font-semibold text-black'>{t("clients.create.work")}</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-1 gap-x-2 gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="work_currently_employed"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {t("clients.create.currentlyEmployed")}
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                                {form.watch("work_currently_employed") && (
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="work_current_employer"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("clients.create.employer")}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Boston Consulting Group" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="work_current_position"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("clients.create.positionName")}</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Developer Fullstack" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="work_start_date"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("clients.create.startDate")}</FormLabel>
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
                                                                            <span>{t("clients.create.startDate")}</span>
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
                                                name="work_employer_email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("clients.create.employerEmail")}</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="employer@example.com" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="work_employer_phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("clients.create.employerPhone")}</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="+31 6 12345678" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="work_additional_notes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("clients.create.additionalNotes")}</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Any additional information about education..."
                                                            className="resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
                            <h1 className='text-base font-semibold text-black'>{t("clients.create.education")}</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-1 gap-x-2 gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="education_currently_enrolled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {t("clients.create.currentlyEnrolled")}
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />

                                {form.watch("education_currently_enrolled") && (
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="education_institution"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("clients.create.institution")}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="University of Amsterdam" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="education_mentor_name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("clients.create.mentorName")}</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Dr. Smith" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="education_mentor_email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("clients.create.mentorEmail")}</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="mentor@example.com" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="education_mentor_phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("clients.create.mentorPhone")}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="+31 6 12345678" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="education_additional_notes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("clients.create.additionalNotes")}</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Any additional information about education..."
                                                            className="resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="education_level"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='flex items-center justify-between'>
                                                        {t("clients.create.level")}
                                                        <Tooltip text='This is Opleidingsniveau'>
                                                            <Info className='h-5 w-5 mr-2' />
                                                        </Tooltip>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select a Level" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white">
                                                                <SelectGroup>
                                                                    {
                                                                        [
                                                                            { value: "primary", label: t("clients.create.primary") },
                                                                            { value: "secondary", label: t("clients.create.secondary") },
                                                                            { value: "higher", label: t("clients.create.higher") },
                                                                            { value: "none", label: t("common.other") }
                                                                        ].map((item, index) => (
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
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 h-fit">
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
                            <h1 className='text-base font-semibold text-black'>{t("clients.create.addressDetails")}</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-1">
                                <AddressesForm />
                            </div>
                        </div>
                    </div>
                </div>
                <PrimaryButton
                    text={t("common.save")}
                    type='submit'
                    animation='animate-bounce'
                    icon={CheckCircle}
                    disabled={loading}
                    className='bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white px-4 py-3 text-sm'
                />
                <PrimaryButton
                    text={t("common.cancel")}
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