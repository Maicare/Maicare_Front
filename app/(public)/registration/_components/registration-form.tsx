"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createRegistrationSchema, CreateRegistrationType } from "@/schemas/registration.schema";
import { useState } from "react";
import { useRegistration } from "@/hooks/registration/use-registration";
import { useAttachment } from "@/hooks/attachment/use-attachment";
import { GENDER_OPTIONS } from "@/consts";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { FileUpload } from "./file-upload";
import PrimaryButton from "@/common/components/PrimaryButton";
import { CheckCircle, Info, XCircle } from "lucide-react";
import { Registration } from "@/types/registration.types";
import { formatBackendDate } from "@/utils/timeFormatting";
import { Any } from "@/common/types/types";
import Tooltip from "@/common/components/Tooltip";


const RegistrationForm = ({ mode = "create", registration }: { mode?: "create" | "update", registration: Registration | undefined }) => {
    const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
    const router = useRouter();
    const { createOne, updateOne } = useRegistration({ autoFetch: false });
    const { createOne: uploadFile } = useAttachment();

    const form = useForm<CreateRegistrationType>({
        resolver: zodResolver(createRegistrationSchema),
        defaultValues: registration ? { ...registration, application_date: formatBackendDate(registration.application_date) } : {
            care_ambulatory_guidance: false,
            care_assisted_independent_living: false,
            care_protected_living: false,
            care_room_training_center: false,
            education_currently_enrolled: false,
            work_currently_employed: false,
            referrer_signature: false,
            risk_aggressive_behavior: false,
            risk_criminal_history: false,
            risk_day_night_rhythm: false,
            risk_flight_behavior: false,
            risk_other: false,
            risk_psychiatric_issues: false,
            risk_sexual_behavior: false,
            risk_substance_abuse: false,
            risk_suicidal_selfharm: false,
            risk_weapon_possession: false,
            document_diagnosis: '',
            document_education_report: '',
            document_id_copy: '',
            document_psychiatric_report: '',
            document_referral: '',
            document_safety_plan: '',
            education_level: "primary",

        },
    });

    const handleFileUpload = async (fieldName: string, file: File | undefined) => {
        if (!file) {
            form.setValue(fieldName as Any, '');
            return;
        }
        const formData: FormData = new FormData();
        formData.append('file', file);
        try {
            setIsUploading(prev => ({ ...prev, [fieldName]: true }));
            const { file_id } = await uploadFile(formData, { displaySuccess: true });
            form.setValue(fieldName as Any, file_id);
        } catch (error) {
            console.log(error)
        } finally {
            setIsUploading(prev => ({ ...prev, [fieldName]: false }));
        }
    };

    async function onSubmit(data: CreateRegistrationType) {
        try {
            if (mode === "create") {
                await createOne({ ...data, application_date: data.application_date + "T00:00:00.000Z", work_start_date: data.work_start_date ? data.work_start_date + "T00:00:00.000Z" : undefined }, { displayProgress: true, displaySuccess: true });
            } else {
                await updateOne(registration!.id, { ...data, application_date: data.application_date + "T00:00:00.000Z", work_start_date: data.work_start_date ? data.work_start_date + "T00:00:00.000Z" : undefined }, { displayProgress: true, displaySuccess: true });
            }
            form.reset();
            router.back();
        } catch (error) {
            console.log(error)
        }
    }
    const onCancel = () => {
        router.back();
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Cliëntinformatie</CardTitle>
                            <CardDescription>Persoonlijke gegevens van de cliënt</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="client_first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Voornaam</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="client_last_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Achternaam</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="client_email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>E-mail</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john.doe@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="client_phone_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Telefoonnummer</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+31 6 12345678" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="client_bsn_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>BSN-nummer</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123456782" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="client_gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Geslacht</FormLabel>
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
                                    name="client_nationality"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nationaliteit</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nederlands" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="application_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Aanvraagdatum</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Zorgbehoeften</CardTitle>
                            <CardDescription>Selecteer de juiste zorgopties</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                "care_ambulatory_guidance",
                                "care_assisted_independent_living",
                                "care_protected_living",
                                "care_room_training_center",
                            ].map((field) => (
                                <FormField
                                    key={field}
                                    control={form.control}
                                    name={field as Any}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {field.name
                                                    .replace("care_", "")
                                                    .replace(/_/g, " ")
                                                    .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Adresgegevens</CardTitle>
                            <CardDescription>Woonadres van de cliënt</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="client_street"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Straat</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Hoofdstraat" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="client_house_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Huisnummer</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="client_postal_code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Postcode</FormLabel>
                                            <FormControl>
                                                <Input placeholder="1234 AB" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="client_city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plaats</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Amsterdam" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Werk en Opleiding</CardTitle>
                            <CardDescription>Huidige werk- en opleidingsinformatie</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                                            Momenteel ingeschreven voor opleiding
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />

                            {form.watch("education_currently_enrolled") && (
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="education_level"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='flex items-center justify-between'>
                                                    Opleidingsniveau
                                                    <Tooltip text='Dit is Opleidingsniveau'>
                                                        <Info className='h-5 w-5 mr-2' />
                                                    </Tooltip>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecteer een niveau" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white">
                                                            <SelectGroup>
                                                                {
                                                                    [
                                                                        { value: "primary", label: "Basisonderwijs" },
                                                                        { value: "secondary", label: "Voortgezet Onderwijs" },
                                                                        { value: "higher", label: "Hoger Onderwijs" },
                                                                        { value: "none", label: "Geen Opleiding" }
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
                                        name="education_institution"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Opleidingsinstelling</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Universiteit van Amsterdam" {...field} />
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
                                                    <FormLabel>Naam mentor</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Dr. Jansen" {...field} />
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
                                                    <FormLabel>E-mail mentor</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="mentor@voorbeeld.nl" {...field} />
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
                                                <FormLabel>Telefoon mentor</FormLabel>
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
                                                <FormLabel>Aanvullende opmerkingen</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Eventuele aanvullende informatie over de opleiding..."
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
                                            Momenteel werkzaam
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
                                                <FormLabel>Werkgever</FormLabel>
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
                                                    <FormLabel>Functie</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Fullstack Developer" {...field} />
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
                                                    <FormLabel>Startdatum</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="work_employer_email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>E-mail werkgever</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="werkgever@voorbeeld.nl" {...field} />
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
                                                    <FormLabel>Telefoon werkgever</FormLabel>
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
                                                <FormLabel>Aanvullende opmerkingen</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Eventuele aanvullende informatie over het werk..."
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
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Risico-inventarisatie</CardTitle>
                        <CardDescription>Geef relevante risicofactoren aan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "risk_aggressive_behavior",
                                "risk_criminal_history",
                                "risk_day_night_rhythm",
                                "risk_flight_behavior",
                                "risk_psychiatric_issues",
                                "risk_sexual_behavior",
                                "risk_substance_abuse",
                                "risk_suicidal_selfharm",
                                "risk_weapon_possession",
                                "risk_other",
                            ].map((field) => (
                                <FormField
                                    key={field}
                                    control={form.control}
                                    name={field as Any}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {field.name
                                                    .replace("risk_", "")
                                                    .replace(/_/g, " ")
                                                    .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>

                        {form.watch("risk_other") && (
                            <FormField
                                control={form.control}
                                name="risk_other_description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Omschrijving overig risico</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Beschrijf het overige risico..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="risk_additional_notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Aanvullende risico-opmerkingen</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Eventuele aanvullende informatie over risico's..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Wettelijk Vertegenwoordiger</CardTitle>
                        <CardDescription>Gegevens van wettelijk vertegenwoordigers (indien van toepassing)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-medium">Wettelijk vertegenwoordiger 1</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="guardian1_first_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Voornaam</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ouder" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="guardian1_last_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Achternaam</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Een" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="guardian1_email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>E-mail</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ouder1@voorbeeld.nl" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="guardian1_phone_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Telefoonnummer</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+31 6 12345678" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="guardian1_relationship"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Relatie</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Moeder/Vader/Wettelijk vertegenwoordiger" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-medium">Wettelijk vertegenwoordiger 2 (Optioneel)</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="guardian2_first_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Voornaam</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ouder" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="guardian2_last_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Achternaam</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Twee" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="guardian2_email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>E-mail</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ouder2@voorbeeld.nl" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="guardian2_phone_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Telefoonnummer</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+31 6 12345678" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="guardian2_relationship"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Relatie</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Moeder/Vader/Wettelijk vertegenwoordiger" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Benodigde Documenten</CardTitle>
                            <CardDescription>Verstrek de volgende documenten</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                "document_diagnosis",
                                "document_education_report",
                                "document_id_copy",
                                "document_psychiatric_report",
                                "document_referral",
                                "document_safety_plan",
                            ].map((field) => (
                                <FormField
                                    key={field}
                                    control={form.control}
                                    name={field as Any}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {field.name
                                                    .replace("document_", "")
                                                    .replace(/_/g, " ")
                                                    .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                            </FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    accept="application/pdf,image/*"
                                                    onUpload={(file) => handleFileUpload(field.name, file)}
                                                    isUploading={isUploading[field.name]}
                                                />
                                            </FormControl>
                                            {field.value && (
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    Document geüpload (ID: {field.value})
                                                </div>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Informatie Verwijzer</CardTitle>
                            <CardDescription>Gegevens van de persoon die de cliënt verwijst</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="referrer_first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Voornaam</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Jan" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="referrer_last_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Achternaam</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Jansen" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="referrer_email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-mail</FormLabel>
                                        <FormControl>
                                            <Input placeholder="jan.jansen@voorbeeld.nl" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="referrer_phone_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefoonnummer</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+31 6 12345678" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="referrer_organization"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Organisatie</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Zorgorganisatie" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="referrer_job_title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Functietitel</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Maatschappelijk werker" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="referrer_signature"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Ik bevestig dat de verstrekte informatie juist is
                                            </FormLabel>
                                            <FormDescription>
                                                Door dit vakje aan te vinken, bevestigt u dat alle verstrekte informatie correct is.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <PrimaryButton
                        text='Opslaan'
                        type='submit'
                        animation='animate-bounce'
                        icon={CheckCircle}
                        disabled={form.formState.isLoading || form.formState.isSubmitting}
                        className='bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white px-4 py-3 text-sm'
                    />
                    <PrimaryButton
                        text='Annuleren'
                        type='button'
                        animation='animate-bounce'
                        icon={XCircle}
                        onClick={onCancel}
                        disabled={form.formState.isLoading || form.formState.isSubmitting}
                        className='bg-red-100 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 text-sm'
                    />
                </div>
            </form>
        </Form>
    )
}

export default RegistrationForm