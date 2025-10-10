import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormItem, FormControl, FormMessage, FormField, FormLabel } from "@/components/ui/form";
import { CreateClientInput } from "@/schemas/clientNew.schema";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Info, PlusCircle, XCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import Tooltip from "@/common/components/Tooltip";
import { Separator } from "@/components/ui/separator";

const AddressesForm: React.FC<{ className?: string }> = ({ className }) => {
    const { control } = useFormContext<CreateClientInput>(); // Use the form context from the parent form
    const { fields, append, remove } = useFieldArray({
        control,
        name: "addresses", // Field name for the array of addresses
    });

    return (
        <div className="grid grid-cols-2 gap-x-2 gap-y-4">
            {
                fields.map((field, index) => (
                    <div key={field.id} className={cn("col-span-2 grid grid-cols-2 gap-x-2 gap-y-4", className)}>
                        <FormField
                            control={control}
                            name={`addresses.${index}.belongs_to`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Behoort toe</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="Bijv: moeder, broer" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='Dit is Behoort toe'>
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
                            control={control}
                            name={`addresses.${index}.city`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stad</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="Bijv: Amsterdam" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='Dit is Stad'>
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
                            control={control}
                            name={`addresses.${index}.phone_number`}
                            render={({ field }) => (
                                <FormItem>
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
                            control={control}
                            name={`addresses.${index}.zip_code`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Postcode</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="Bijv: 1234 AB" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='Dit is Postcode'>
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
                            control={control}
                            name={`addresses.${index}.address`}
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Adres</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="Bijv: Hoofdstraat 123" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='Dit is Adres'>
                                                    <Info className='h-5 w-5' />
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Separator className='bg-slate-300 w-full col-span-2' />
                    </div>

                ))
            }

            <PrimaryButton
                text="Adres verwijderen"
                icon={XCircle}
                animation="animate-bounce"
                type="button"
                className="w-full bg-red-200 text-red-500 hover:text-white hover:bg-red-500"
                onClick={() => remove(fields.length - 1)}
                disabled={fields.length <= 1}
            />

            <PrimaryButton
                text="Adres toevoegen"
                icon={PlusCircle}
                animation="animate-bounce"
                type="button"
                className="w-full"
                onClick={() =>
                    append({
                        belongs_to: "",
                        address: "",
                        city: "",
                        zip_code: "",
                        phone_number: "",
                    })
                }
            />
        </div>
    )
};

export default AddressesForm;