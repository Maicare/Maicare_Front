// components/invoice/UpdateInvoiceForm.tsx
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface UpdateInvoiceFormProps {
    defaultValues?: Partial<UpdateInvoiceFormValues>;
    onSubmit: (values: UpdateInvoiceFormValues) => void;
    isSubmitting?: boolean;
}

export function UpdateInvoiceForm({
    defaultValues,
    onSubmit,
    isSubmitting = false,
}: UpdateInvoiceFormProps) {
    const form = useForm<UpdateInvoiceFormValues>({
        resolver: zodResolver(updateInvoiceSchema),
        defaultValues: {
            due_date: "",
            extra_content: {},
            invoice_details: [
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
                },
            ],
            issue_date: "",
            status: "",
            total_amount: 0,
            warning_count: 0,
            ...defaultValues
        },
    });
    const router = useRouter();
    const handleCancel = () => {
        router.back();
    }
    // Add a new warning to a specific invoice detail
    const addWarning = (detailIndex: number) => {
        const currentWarnings = form.getValues(`invoice_details.${detailIndex}.warnings`) || [];
        form.setValue(`invoice_details.${detailIndex}.warnings`, [...currentWarnings, ""]);
    };

    // Remove a warning from a specific invoice detail
    const removeWarning = (detailIndex: number, warningIndex: number) => {
        const currentWarnings = form.getValues(`invoice_details.${detailIndex}.warnings`) || [];
        const newWarnings = currentWarnings.filter((_, index) => index !== warningIndex);
        form.setValue(`invoice_details.${detailIndex}.warnings`, newWarnings);
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

    const validateBusinessLogic = (
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
            const unit = detail.price_time_unit;
            const rate = detail.price;

            const expectedPreVat = detail.periods.reduce((sum, period) => {
                return sum + calculateExpectedPriceFromPeriod(unit, rate, {
                    ambulante_total_minutes: period.ambulante_total_minutes ?? null,
                    accommodation_time_frame: period.accommodation_time_frame ?? null,
                });
            }, 0);

            const expectedRounded = Math.round(expectedPreVat * 100) / 100;
            const preVatRounded = Math.round(detail.pre_vat_total_price * 100) / 100;
            const totalRounded = Math.round(detail.total_price * 100) / 100;

            // Save for display
            correctedPrices[detailIndex] = {
                expectedPreVat: expectedRounded,
                expectedTotal: expectedRounded + expectedPreVat * (detail.vat / 100),
            };

            totalSum += detail.total_price;

            if (Math.abs(expectedRounded - preVatRounded) > 0.01) {
                isValid = false;
                setError(`invoice_details.${detailIndex}.pre_vat_total_price` as const, {
                    type: "manual",
                    message: `Should be ${expectedRounded.toFixed(2)} based on time and price unit`,
                });
            }

            const expectedTotal = expectedRounded + (expectedRounded * (detail.vat / 100));
            if (Math.abs(expectedTotal - totalRounded) > 0.01) {
                isValid = false;
                setError(`invoice_details.${detailIndex}.total_price` as const, {
                    type: "manual",
                    message: `Should be ${expectedTotal.toFixed(2)} (pre-VAT + pre-VAT* VAT)`,
                });
            }
        });

        // Validate invoice total
        const formTotal = Math.round(data.total_amount * 100) / 100;
        const expectedTotalAmount = Math.round(totalSum * 100) / 100;

        if (Math.abs(formTotal - expectedTotalAmount) > 0.01) {
            isValid = false;
            setError("total_amount", {
                type: "manual",
                message: `Should be ${expectedTotalAmount.toFixed(2)} (sum of all invoice details)`,
            });
        }

        return { isValid, correctedPrices, expectedTotalAmount };
    };
    const submitWithValidation = (values: UpdateInvoiceFormValues) => {
        const { isValid, correctedPrices } = validateBusinessLogic(values);

        if (!isValid) {
            // Optional: show corrected values in a toast, UI message, or inline
            console.warn("🟡 Corrected Values Suggestion:", correctedPrices);
            return;
        }
        onSubmit(values);
    }
    // State for new key-value pair
    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");

    // Add new key-value pair
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

    // Remove key-value pair
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
                    {/* Left Column Card - Invoice Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Issue Date */}
                            <FormField
                                control={form.control}
                                name="issue_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Issue Date</FormLabel>
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
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
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

                            {/* Due Date */}
                            <FormField
                                control={form.control}
                                name="due_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Due Date</FormLabel>
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
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
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
                                            {/* TODO make it select */}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Total Amount */}
                            <FormField
                                control={form.control}
                                name="total_amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Amount</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Right Column Card - Additional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Extra Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <FormLabel>Key</FormLabel>
                                    <Input
                                        value={newKey}
                                        onChange={(e) => setNewKey(e.target.value)}
                                        placeholder="Enter key"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel>Value</FormLabel>
                                    <Input
                                        value={newValue}
                                        onChange={(e) => setNewValue(e.target.value)}
                                        placeholder="Enter value"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        onClick={addExtraContent}
                                        disabled={!newKey.trim() || !newValue.trim()}
                                    >
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Add
                                    </Button>
                                </div>
                            </div>

                            {/* Display existing key-value pairs */}
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
                                        No extra content added
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Invoice Details Section - Full width card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {form.watch("invoice_details").map((detail, detailIndex) => (
                            <Card key={detailIndex} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Contract Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`invoice_details.${detailIndex}.contract_id`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Contract ID</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`invoice_details.${detailIndex}.contract_name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Care Name</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Relatie" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white">
                                                                <SelectGroup>
                                                                    {
                                                                        [{ value: "ambulante", label: "Ambulante" }, { value: "accommodation", label: "Accommodation" }].filter(v => v.value !== "").map((item, index) => (
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

                                    {/* Pricing Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`invoice_details.${detailIndex}.price`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`invoice_details.${detailIndex}.price_time_unit`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price Time Unit</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* VAT and Totals */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`invoice_details.${detailIndex}.pre_vat_total_price`}
                                            render={({ field }) => {
                                                // const error = form.formState.errors?.invoice_details?.[detailIndex]?.pre_vat_total_price;
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Pre VAT Total</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )
                                            }}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`invoice_details.${detailIndex}.vat`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>VAT</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name={`invoice_details.${detailIndex}.total_price`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Total Price</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Periods Section */}
                                <div className="mt-6 space-y-4">
                                    <h4 className="text-sm font-medium">Periods</h4>
                                    {detail.periods.map((period, periodIndex) => (
                                        <Card key={periodIndex} className="p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Start Date */}
                                                <FormField
                                                    control={form.control}
                                                    name={`invoice_details.${detailIndex}.periods.${periodIndex}.start_date`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Start Date</FormLabel>
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
                                                                                <span>Pick a date</span>
                                                                            )}
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
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

                                                {/* End Date */}
                                                <FormField
                                                    control={form.control}
                                                    name={`invoice_details.${detailIndex}.periods.${periodIndex}.end_date`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>End Date</FormLabel>
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
                                                                                <span>Pick a date</span>
                                                                            )}
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
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

                                                {/* Accommodation Time Frame */}

                                                <FormField
                                                    control={form.control}
                                                    name={`invoice_details.${detailIndex}.periods.${periodIndex}.accommodation_time_frame`}
                                                    render={({ field }) => (
                                                        <FormItem className={defaultValues?.invoice_details?.[detailIndex]?.periods?.[periodIndex]?.accommodation_time_frame ? "" : "hidden"}>
                                                            <FormLabel>Accommodation Time Frame</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="e.g., 28 days"
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />


                                                {/* Ambulante Total Minutes */}

                                                <FormField
                                                    control={form.control}
                                                    name={`invoice_details.${detailIndex}.periods.${periodIndex}.ambulante_total_minutes`}
                                                    render={({ field }) => (
                                                        <FormItem className={defaultValues?.invoice_details?.[detailIndex]?.periods?.[periodIndex]?.ambulante_total_minutes ? "" : "hidden"}>
                                                            <FormLabel>Ambulante Total Minutes</FormLabel>
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

                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {/* Warnings Section */}
                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium">Warnings</h4>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addWarning(detailIndex)}
                                        >
                                            <PlusIcon className="mr-2 h-4 w-4" />
                                            Add Warning
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
                                            No warnings added yet
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Update Invoice"}
                    </Button>
                    <Button type="button" className='bg-red-200 text-red-600 hover:text-white hover:bg-red-600 transition-colors' disabled={isSubmitting} onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}