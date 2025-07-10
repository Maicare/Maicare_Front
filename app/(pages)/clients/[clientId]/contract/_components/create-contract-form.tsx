import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { CreateContract, CreateContractSchema, FinancingActSchema, FinancingOptionSchema } from "@/schemas/contract.schema";
import { cn } from "@/utils/cn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/app/(public)/registration/_components/file-upload";
import { Any } from "@/common/types/types";
import { useAttachment } from "@/hooks/attachment/use-attachment";
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PrimaryButton from "@/common/components/PrimaryButton";


export function CreateContractForm({
    onSubmit,
    defaultValues,
    contractTypes,
    createContractType
}: {
    onSubmit: (data: CreateContract) => void;
    defaultValues?: Partial<CreateContract>;
    contractTypes?: { label: string; value: string }[];
    createContractType:(name:string)=>void;
}) {
    const [contractTypeName, setContractTypeName] = useState<string>('');
    const [open,setOpen] = useState(false);
    const form = useForm<CreateContract>({
        resolver: zodResolver(CreateContractSchema),
        defaultValues: {
            care_type: "ambulante",
            VAT: 21,
            reminder_period: 30,
            ...defaultValues,
        },
    });
    const { createOne: uploadFile } = useAttachment();
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const watchCareType = form.watch("care_type");
    const handleFileUpload = async (fieldName: string, file: File | undefined) => {
        if (!file) {
            form.setValue(fieldName as Any, '');
            return;
        }
        const formData: FormData = new FormData();
        // Append the file to the FormData object
        formData.append('file', file);
        try {
            setIsUploading(true);
            const { file_id } = await uploadFile(formData, { displaySuccess: true });
            form.setValue(fieldName as Any, file_id);
        } catch (error) {
            console.log(error)
        } finally {
            setIsUploading(false);
        }
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Niew Uitzendkrachten</CardTitle>
                        <CardDescription>Personal details of the client</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Care Type */}
                            <FormField
                                control={form.control}
                                name="care_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Care Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select care type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white">
                                                <SelectItem value="ambulante">Ambulante</SelectItem>
                                                <SelectItem value="accommodation">Accommodation</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Care Name */}
                            <FormField
                                control={form.control}
                                name="care_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Care Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Home Care" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Financing Act */}
                            <FormField
                                control={form.control}
                                name="financing_act"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Financing Act</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select financing act" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white">
                                                {Object.values(FinancingActSchema.Values).map((act) => (
                                                    <SelectItem key={act} value={act}>
                                                        {act}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Financing Option */}
                            <FormField
                                control={form.control}
                                name="financing_option"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Financing Option</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select financing option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white">
                                                {Object.values(FinancingOptionSchema.Values).map((option) => (
                                                    <SelectItem key={option} value={option}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Conditional Fields */}
                            {watchCareType === "ambulante" ? (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="hours"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hours</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="40"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="hours_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hours Type</FormLabel>
                                                <Select onValueChange={field.onChange} >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select hours Type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-white">
                                                        <SelectItem value="weekly">Weekly</SelectItem>
                                                        <SelectItem value="all_period">All Period</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            ) : null}

                            {/* Price */}
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="100.50"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Price Time Unit */}
                            <FormField
                                control={form.control}
                                name="price_time_unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price Time Unit</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select time unit" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white">
                                                {watchCareType === "accommodation" ? (
                                                    <>
                                                        <SelectItem value="daily">Daily</SelectItem>
                                                        <SelectItem value="weekly">Weekly</SelectItem>
                                                        <SelectItem value="monthly">Monthly</SelectItem>
                                                    </>
                                                ) : (
                                                    <>
                                                        <SelectItem value="minute">Per Minute</SelectItem>
                                                        <SelectItem value="hourly">Hourly</SelectItem>
                                                    </>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* VAT */}
                            <FormField
                                control={form.control}
                                name="VAT"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>VAT (%)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="21"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Reminder Period */}
                            <FormField
                                control={form.control}
                                name="reminder_period"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reminder Period (days)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="30"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Attachments */}
                            <FormField
                                control={form.control}
                                name="attachment_ids"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Attachments (optional)</FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                accept="application/pdf,image/*"
                                                onUpload={(file) => handleFileUpload(field.name, file)}
                                                isUploading={isUploading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            {/* Start Date */}
                            <FormField
                                control={form.control}
                                name="start_date"
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
                                                            format(new Date(field.value), "PPP")
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
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) =>
                                                        field.onChange(date ? date.toISOString() : "")
                                                    }
                                                    disabled={(date) => date < new Date("1900-01-01")}
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
                                name="end_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>End Date (optional)</FormLabel>
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
                                                            format(new Date(field.value), "PPP")
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
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) =>
                                                        field.onChange(date ? date.toISOString() : "")
                                                    }
                                                    disabled={(date) => date < new Date("1900-01-01")}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Type ID */}
                            <FormField
                                control={form.control}
                                name="type_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center justify-between'>
                                            <span>contracttype</span>
                                            <Dialog open={open} onOpenChange={(o) => {setOpen(o);setContractTypeName('')}}>
                                                <DialogTrigger asChild>
                                                    <PrimaryButton
                                                        text="Add"
                                                        disabled={false}
                                                        icon={PlusCircle}
                                                        animation="animate-bounce"
                                                        className="ml-auto dark:bg-indigo-800 dark:text-white dark:hover:bg-indigo-500 h-6 text-xs"
                                                    />
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Create a contracttype</DialogTitle>
                                                        <DialogDescription>
                                                            Please Create a contracttype.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4">
                                                        <div className="grid gap-3">
                                                            <Input
                                                                placeholder="Contract Type Name"
                                                                value={contractTypeName}
                                                                onChange={(e) => setContractTypeName(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <Button type="button" disabled={contractTypeName === ""} onClick={() => {if (contractTypeName !== "") {createContractType(contractTypeName);setOpen(false);}}}>Save changes</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </FormLabel>
                                        <FormControl>
                                            <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={field.value + ""} >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecteer contracttype" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    <SelectGroup>
                                                        {
                                                            (contractTypes ?? []).map((item, index) => (
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
                            <div className="flex items-center justify-end gap-4">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                                <Button type="submit">Save</Button>
                            </div>
                        </div>



                    </CardContent>
                </Card>

            </form>
        </Form>
    );
}