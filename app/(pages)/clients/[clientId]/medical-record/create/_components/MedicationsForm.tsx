import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormItem, FormControl, FormMessage, FormField, FormLabel } from "@/components/ui/form";
import PrimaryButton from "@/common/components/PrimaryButton";
import { CalendarIcon, Info, PlusCircle, XCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import Tooltip from "@/common/components/Tooltip";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateDiagnosis } from "@/schemas/diagnosis.schema";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import EmployeeSelect from "../../../incidents/_components/EmployeeSelect";

const MedicationsForm: React.FC<{ className?: string }> = ({ className }) => {
    const { control } = useFormContext<CreateDiagnosis>(); // Use the form context from parent form

    const { fields, append, remove } = useFieldArray({
        control,
        name: "medications", // Field name for the array of medications
    });

    return (
        <div className="grid grid-cols-2 gap-x-2 gap-y-4">
            {fields.map((field, index) => (
                <div key={field.id} className={cn("col-span-2 grid grid-cols-2 gap-x-2 gap-y-4", className)}>
                    <FormField
                        control={control}
                        name={`medications.${index}.name`}
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
                        control={control}
                        name={`medications.${index}.dosage`}
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
                        control={control}
                        name={`medications.${index}.start_date`}
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className='flex items-center justify-between'>
                                    Startdatum medicatie
                                    <Tooltip text='Dit is de startdatum van de medicatie'>
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
                                                    <span>Kies een datum</span>
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
                        control={control}
                        name={`medications.${index}.end_date`}
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className='flex items-center justify-between'>
                                    Einddatum medicatie
                                    <Tooltip text='Dit is de einddatum van de medicatie'>
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
                                                    <span>Kies een datum</span>
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
                        control={control}
                        name={`medications.${index}.notes`}
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
                        control={control}
                        name={`medications.${index}.is_critical`}
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
                        control={control}
                        name={`medications.${index}.self_administered`}
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
                        name={`medications.${index}.administered_by_id`}
                        label="Beheerd door"
                        className="w-full col-span-2"
                        required
                    />

                    <Separator className="bg-slate-300 w-full col-span-2" />
                </div>
            ))}

            <PrimaryButton
                text="Medicatie verwijderen"
                icon={XCircle}
                animation="animate-bounce"
                type="button"
                className="w-full bg-red-200 text-red-500 hover:text-white hover:bg-red-500"
                onClick={() => remove(fields.length - 1)}
                disabled={fields.length <= 1}
            />

            <PrimaryButton
                text="Medicatie toevoegen"
                icon={PlusCircle}
                animation="animate-bounce"
                type="button"
                className="w-full"
                onClick={() =>
                    append({
                        name: "",
                        dosage: "",
                        start_date: new Date(),
                        end_date: new Date(),
                        administered_by_id: "0",
                        notes: "",
                        is_critical: false,
                        self_administered: false,
                    })
                }
            />
        </div>
    );
};

export default MedicationsForm;