// components/invoice/CreateInvoiceForm.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { UpdateInvoiceFormValues, updateInvoiceSchema } from "@/schemas/invoice.schema";
import { cn } from "@/utils/cn";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ContractSelect from "../../contracts/_components/contract-select";
import { ContractCard } from "./contract-card";
import { ContractResults } from "../../contracts/_components/columns";
import { useState } from "react";

interface CreateInvoiceFormProps {
    onSubmit: (values: UpdateInvoiceFormValues) => void;
    isSubmitting?: boolean;
    clientId: string;
}

export function CreateInvoiceForm({
    onSubmit,
    isSubmitting = false,
    clientId
}: CreateInvoiceFormProps) {
    const form = useForm<UpdateInvoiceFormValues>({
        resolver: zodResolver(updateInvoiceSchema),
        defaultValues: {
            due_date: "",
            extra_content: {},
            invoice_details: [
                {
                    contract_id: parseInt(clientId),
                    contract_name: "",
                    periods: [
                        {
                            accommodation_time_frame: "",
                            ambulante_total_minutes: 0,
                            end_date: "",
                            start_date: "",
                        },
                    ],
                    pre_vat_total_price: 0,
                    price: 0,
                    price_time_unit: "",
                    total_price: 0,
                    vat: 0,
                    warnings: [],
                },
            ],
            issue_date: "",
            status: "",
            total_amount: 0,
            warning_count: 0,
        },
    });

    const router = useRouter();
    const [contract, setContract] = useState<ContractResults[]>([]);
    const handleCancel = () => {
        router.back();
    }

    // Voeg een nieuwe waarschuwing toe aan een specifiek factuurdetail
    const addWarning = (detailIndex: number) => {
        const currentWarnings = form.getValues(`invoice_details.${detailIndex}.warnings`) || [];
        form.setValue(`invoice_details.${detailIndex}.warnings`, [...currentWarnings, ""]);
    };

    // Verwijder een waarschuwing van een specifiek factuurdetail
    const removeWarning = (detailIndex: number, warningIndex: number) => {
        const currentWarnings = form.getValues(`invoice_details.${detailIndex}.warnings`) || [];
        const newWarnings = currentWarnings.filter((_, index) => index !== warningIndex);
        form.setValue(`invoice_details.${detailIndex}.warnings`, newWarnings);
    };

    // Voeg een nieuw factuurdetail toe
    const addInvoiceDetail = () => {
        const currentDetails = form.getValues("invoice_details") || [];
        form.setValue("invoice_details", [
            ...currentDetails,
            {
                contract_id: 0,
                contract_name: "",
                periods: [
                    {
                        accommodation_time_frame: "",
                        ambulante_total_minutes: 0,
                        end_date: "",
                        start_date: "",
                    },
                ],
                pre_vat_total_price: 0,
                price: 0,
                price_time_unit: "",
                total_price: 0,
                vat: 0,
                warnings: [],
            }
        ]);
    };

    // Verwijder een factuurdetail
    const removeInvoiceDetail = (detailIndex: number) => {
        const currentDetails = form.getValues("invoice_details") || [];
        const newDetails = currentDetails.filter((_, index) => index !== detailIndex);
        form.setValue("invoice_details", newDetails);
    };

    // Voeg een nieuwe periode toe aan een specifiek factuurdetail
    const addPeriod = (detailIndex: number) => {
        const currentPeriods = form.getValues(`invoice_details.${detailIndex}.periods`) || [];
        form.setValue(`invoice_details.${detailIndex}.periods`, [
            ...currentPeriods,
            {
                accommodation_time_frame: "",
                ambulante_total_minutes: 0,
                end_date: "",
                start_date: "",
            }
        ]);
    };

    // Verwijder een periode van een specifiek factuurdetail
    const removePeriod = (detailIndex: number, periodIndex: number) => {
        const currentPeriods = form.getValues(`invoice_details.${detailIndex}.periods`) || [];
        const newPeriods = currentPeriods.filter((_, index) => index !== periodIndex);
        form.setValue(`invoice_details.${detailIndex}.periods`, newPeriods);
    };

    function calculateExpectedPriceFromPeriod(
        unit: string,
        rate: number,
        period: {
            ambulante_total_minutes: number | null;
            accommodation_time_frame: string | null;
        }
    ): number {
        if (period.ambulante_total_minutes != null && !isNaN(period.ambulante_total_minutes)) {
            const minutes = period.ambulante_total_minutes;
            switch (unit) {
                case "hourly":
                    return rate * (minutes / 60);
                case "minute":
                    return rate * minutes;
                default:
                    return 0;
            }
        } else if (period.accommodation_time_frame) {
            const match = period.accommodation_time_frame.match(/(\d+)\s*days?/i);
            const days = match ? parseInt(match[1], 10) : 0;

            switch (unit) {
                case "daily":
                    return rate * days;
                case "weekly":
                    return rate * (days / 7);
                case "monthly":
                    return rate * (days / 30);
                default:
                    return 0;
            }
        }

        return 0;
    }

    const _validateBusinessLogic = (
        data: UpdateInvoiceFormValues,
    ): {
        isValid: boolean;
        correctedPrices: Record<number, { expectedPreVat: number; expectedTotal: number }>;
        expectedTotalAmount: number;
    } => {
        const { setError, clearErrors } = form;
        let isValid = true;
        let totalSum = 0;
        const correctedPrices: Record<number, { expectedPreVat: number; expectedTotal: number }> = {};

        clearErrors();

        data.invoice_details.forEach((detail, detailIndex) => {
            const unit = contract?.[detailIndex]?.price_time_unit;
            const rate = contract?.[detailIndex]?.price;

            const expectedPreVat = detail.periods.reduce((sum, period) => {
                return sum + calculateExpectedPriceFromPeriod(unit, rate, {
                    ambulante_total_minutes: period.ambulante_total_minutes ?? null,
                    accommodation_time_frame: period.accommodation_time_frame ?? null,
                });
            }, 0);

            const expectedRounded = Math.round(expectedPreVat * 100) / 100;
            const preVatRounded = Math.round(detail.pre_vat_total_price * 100) / 100;
            const totalRounded = Math.round(detail.total_price * 100) / 100;

            // Opslaan voor weergave
            correctedPrices[detailIndex] = {
                expectedPreVat: expectedRounded,
                expectedTotal: expectedRounded + detail.vat,
            };

            totalSum += detail.total_price;

            if (Math.abs(expectedRounded - preVatRounded) > 0.01) {
                isValid = false;
                setError(`invoice_details.${detailIndex}.pre_vat_total_price` as const, {
                    type: "manual",
                    message: `Moet ${expectedRounded.toFixed(2)} zijn gebaseerd op tijd en prijseenheid`,
                });
            }

            const expectedTotal = expectedRounded + detail.vat;
            if (Math.abs(expectedTotal - totalRounded) > 0.01) {
                isValid = false;
                setError(`invoice_details.${detailIndex}.total_price` as const, {
                    type: "manual",
                    message: `Moet ${expectedTotal.toFixed(2)} zijn (pre-BTW + BTW)`,
                });
            }
        });

        // Valideer factuurtotaal
        const formTotal = Math.round(data.total_amount * 100) / 100;
        const expectedTotalAmount = Math.round(totalSum * 100) / 100;

        if (Math.abs(formTotal - expectedTotalAmount) > 0.01) {
            isValid = false;
            setError("total_amount", {
                type: "manual",
                message: `Moet ${expectedTotalAmount.toFixed(2)} zijn (som van alle factuurdetails)`,
            });
        }

        return { isValid, correctedPrices, expectedTotalAmount };
    };

    const submitWithValidation = (values: UpdateInvoiceFormValues) => {
        onSubmit({
            ...values,
            client_id: parseInt(clientId),
            invoice_type:"standard",
            invoice_details:values.invoice_details.map((detail, index) => ({
                ...detail,
                contract_id:contract?.[index]?.id,
                contract_name:contract?.[index]?.care_name,
                price:contract?.[index]?.price,
                price_time_unit:contract?.[index]?.price_time_unit,
            }),
        )});
    }

    // State voor nieuwe sleutel-waardepaar
    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");

    // Voeg nieuw sleutel-waardepaar toe
    const addExtraContent = () => {
        if (newKey.trim() && newValue.trim()) {
            const currentContent = form.getValues("extra_content") || {};
            form.setValue("extra_content", {
                ...currentContent,
                [newKey.trim()]: newValue.trim(),
            });
            setNewKey("");
            setNewValue("");
        }
    };

    // Verwijder sleutel-waardepaar
    const removeExtraContent = (key: string) => {
        const currentContent = form.getValues("extra_content") || {};
        const newContent = { ...currentContent };
        delete newContent[key];
        form.setValue("extra_content", newContent);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submitWithValidation)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Linker Kolom Kaart - Factuurinformatie */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Factuurinformatie</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Uitgiftedatum */}
                            <FormField
                                control={form.control}
                                name="issue_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Uitgiftedatum</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(new Date(field.value), "PPP")
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
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) =>
                                                        field.onChange(date ? date.toISOString() : "")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Vervaldatum */}
                            <FormField
                                control={form.control}
                                name="due_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Vervaldatum</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(new Date(field.value), "PPP")
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
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) =>
                                                        field.onChange(date ? date.toISOString() : "")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Status */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                            {/* TODO maak er een select van */}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Totaalbedrag */}
                            <FormField
                                control={form.control}
                                name="total_amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Totaalbedrag</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Rechter Kolom Kaart - Aanvullende Informatie */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Extra Inhoud</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <FormLabel>Sleutel</FormLabel>
                                    <Input
                                        value={newKey}
                                        onChange={(e) => setNewKey(e.target.value)}
                                        placeholder="Voer sleutel in"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel>Waarde</FormLabel>
                                    <Input
                                        value={newValue}
                                        onChange={(e) => setNewValue(e.target.value)}
                                        placeholder="Voer waarde in"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        onClick={addExtraContent}
                                        disabled={!newKey.trim() || !newValue.trim()}
                                    >
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Toevoegen
                                    </Button>
                                </div>
                            </div>

                            {/* Toon bestaande sleutel-waardeparen */}
                            <div className="border rounded-lg divide-y">
                                {Object.entries(form.watch("extra_content") || {}).map(([key, value]) => (
                                    <div key={key} className="p-3 flex justify-between items-center">
                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium">{key}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    {String(value)}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeExtraContent(key)}
                                            className="text-destructive"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                {Object.keys(form.watch("extra_content") || {}).length === 0 && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        Geen extra inhoud toegevoegd
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Factuurdetails Sectie - Volledige breedte kaart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Factuurdetails</span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addInvoiceDetail}
                            >
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Factuurdetail Toevoegen
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {form.watch("invoice_details").map((detail, detailIndex) => (
                            <Card key={detailIndex} className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-medium">Factuurdetail #{detailIndex + 1}</h3>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive"
                                        onClick={() => removeInvoiceDetail(detailIndex)}
                                    >
                                        <TrashIcon className="mr-2 h-4 w-4" />
                                        Verwijderen
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid grid-cols-1 gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`invoice_details.${detailIndex}.contract_id`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <ContractSelect
                                                            value={field.value.toString()}
                                                            onChange={(value) => field.onChange(parseInt(value))}
                                                            label="Selecteer Contract"
                                                            className="w-full"
                                                            modal={false}
                                                            clientId={clientId} // Stuur clientId door om contracten te filteren
                                                            getSelectedItem={(item: ContractResults) => {
                                                                setContract((prevItems) => {
                                                                    const updatedItems = [...prevItems]; // kloon de array
                                                                    updatedItems[detailIndex] = item; // werk de specifieke index bij
                                                                    return updatedItems; // stel de nieuwe array in
                                                                  });
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`invoice_details.${detailIndex}.pre_vat_total_price`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Pre-BTW Totaal</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`invoice_details.${detailIndex}.vat`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>BTW</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`invoice_details.${detailIndex}.total_price`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Totaalprijs</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="">
                                        <ContractCard contract={contract?.[detailIndex]||null} />
                                    </div>
                                </div>

                                {/* Periodes Sectie */}
                                <div className="mt-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-medium">Periodes</h4>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addPeriod(detailIndex)}
                                        >
                                            <PlusIcon className="mr-2 h-4 w-4" />
                                            Periode Toevoegen
                                        </Button>
                                    </div>

                                    {detail.periods.map((period, periodIndex) => (
                                        <Card key={periodIndex} className="p-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-sm font-medium">Periode #{periodIndex + 1}</h4>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive"
                                                    onClick={() => removePeriod(detailIndex, periodIndex)}
                                                >
                                                    <TrashIcon className="mr-2 h-4 w-4" />
                                                    Verwijderen
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Startdatum */}
                                                <FormField
                                                    control={form.control}
                                                    name={`invoice_details.${detailIndex}.periods.${periodIndex}.start_date`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Startdatum</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "pl-3 text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                format(new Date(field.value), "PPP")
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
                                                                        selected={field.value ? new Date(field.value) : undefined}
                                                                        onSelect={(date) =>
                                                                            field.onChange(date ? date.toISOString() : "")
                                                                        }
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Einddatum */}
                                                <FormField
                                                    control={form.control}
                                                    name={`invoice_details.${detailIndex}.periods.${periodIndex}.end_date`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Einddatum</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "pl-3 text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                format(new Date(field.value), "PPP")
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
                                                                        selected={field.value ? new Date(field.value) : undefined}
                                                                        onSelect={(date) =>
                                                                            field.onChange(date ? date.toISOString() : "")
                                                                        }
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Accommodatie Tijdsframe */}
                                                {
                                                    contract?.[detailIndex]?.care_type === "accommodation" && (
                                                        <FormField
                                                            control={form.control}
                                                            name={`invoice_details.${detailIndex}.periods.${periodIndex}.accommodation_time_frame`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Accommodatie Tijdsframe</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="bijv. 28 dagen"
                                                                            {...field}
                                                                            value={field.value || ""}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    )
                                                }

                                                {/* Ambulante Totale Minuten */}
                                                {
                                                    contract?.[detailIndex]?.care_type === "ambulante" && (
                                                        <FormField
                                                            control={form.control}
                                                            name={`invoice_details.${detailIndex}.periods.${periodIndex}.ambulante_total_minutes`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Ambulante Totale Minuten</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            {...field}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value;
                                                                                field.onChange(value === '' ? undefined : Number(value));
                                                                            }}
                                                                            value={field.value || ""}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    )
                                                }
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {/* Waarschuwingen Sectie */}
                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium">Waarschuwingen</h4>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addWarning(detailIndex)}
                                        >
                                            <PlusIcon className="mr-2 h-4 w-4" />
                                            Waarschuwing Toevoegen
                                        </Button>
                                    </div>

                                    {(detail.warnings || []).map((_, warningIndex) => (
                                        <div key={warningIndex} className="flex items-center gap-2">
                                            <FormField
                                                control={form.control}
                                                name={`invoice_details.${detailIndex}.warnings.${warningIndex}`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeWarning(detailIndex, warningIndex)}
                                                className="text-destructive"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    {(!detail.warnings || detail.warnings.length === 0) && (
                                        <div className="text-sm text-muted-foreground">
                                            Nog geen waarschuwingen toegevoegd
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Aanmaken..." : "Factuur Aanmaken"}
                    </Button>
                    <Button type="button" className='bg-red-200 text-red-600 hover:text-white hover:bg-red-600 transition-colors' disabled={isSubmitting} onClick={handleCancel}>
                        Annuleren
                    </Button>
                </div>
            </form>
        </Form>
    );
}