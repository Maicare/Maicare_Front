"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { contractTypes, createEmployeeContractSchema, EmployeeContract } from "@/schemas/employee.schema";





export function EmployeeContractForm({
    onSubmit,
    defaultValues,
}: {
    onSubmit: (values: EmployeeContract) => void;
    defaultValues?: Partial<EmployeeContract>;
}) {
    const form = useForm<EmployeeContract>({
        resolver: zodResolver(createEmployeeContractSchema),
        defaultValues: {
            fixed_contract_hours: 0,
            variable_contract_hours: 0,
            ...defaultValues,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-4 rounded-md">
                {/* Contract Type */}
                <FormField
                    control={form.control}
                    name="contract_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contract Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a contract type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white">
                                    {contractTypes.map((type) => (
                                        <SelectItem key={type} value={type} className="hover:bg-gray-100 cursor-pointer">
                                            {type
                                                .replace(/_/g, ' ')  // Replace underscores with spaces
                                                .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize each word
                                            }
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Date */}
                    <FormField
                        control={form.control}
                        name="contract_start_date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
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
                                            selected={new Date(field.value)}
                                            onSelect={(date)=>field.onChange(date?.toISOString())}
                                            disabled={(date) => date < new Date()}
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
                        name="contract_end_date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>End Date</FormLabel>
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
                                            selected={new Date(field.value)}
                                            onSelect={(date)=>field.onChange(date?.toISOString())}
                                            disabled={(date) => {
                                                const startDate = form.getValues("contract_start_date");
                                                return date < (startDate || new Date());
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fixed Hours */}
                    <FormField
                        control={form.control}
                        name="fixed_contract_hours"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fixed Hours (weekly)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={168}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e.target.valueAsNumber);
                                            form.trigger("variable_contract_hours");
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Variable Hours */}
                    <FormField
                        control={form.control}
                        name="variable_contract_hours"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Variable Hours (weekly)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={60}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e.target.valueAsNumber);
                                            form.trigger("fixed_contract_hours");
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full">
                    Submit Contract
                </Button>
            </form>
        </Form>
    );
}