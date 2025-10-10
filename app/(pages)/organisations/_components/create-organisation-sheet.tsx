"use client";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import PrimaryButton from '@/common/components/PrimaryButton';
import { Edit2, Info, PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Tooltip from '@/common/components/Tooltip';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { CreateOrganisation, createOrganisationSchema } from '@/schemas/organisation.schema';
import { Organization } from '@/types/organisation';
type Props = {
    mode: "create" | "update";
    handleCreate: (values: CreateOrganisation) => void;
    handleUpdate: (values: CreateOrganisation) => void;
    organisation?: Organization;
    isOpen: boolean;
    handleOpen: (bool: boolean) => void;
}

const CreateOrganisationSheet = ({ mode, handleCreate, handleUpdate, organisation, handleOpen, isOpen }: Props) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<CreateOrganisation>({
        resolver: zodResolver(createOrganisationSchema),
        defaultValues: organisation ? {
            ...organisation
        } : {
            address: "",
            btw_number: "",
            city: "",
            email: "",
            kvk_number: "",
            name: "",
            postal_code: ""
        },
    });
    // 2. Definieer een submit handler.
    async function onSubmit(values: CreateOrganisation) {
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
        if (organisation) {
            form.setValue("address", organisation.address);
            form.setValue("btw_number", organisation.btw_number);
            form.setValue("city", organisation.city);
            form.setValue("email", organisation.email);
            form.setValue("kvk_number", organisation.kvk_number);
            form.setValue("name", organisation.name);
            form.setValue("postal_code", organisation.postal_code);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [organisation]);
    return (
        <Sheet open={isOpen} onOpenChange={(o) => handleOpen(o)}>
            <SheetTrigger asChild>
                <PrimaryButton
                    text={mode === "create" ? "Nieuwe Organisatie" : "Organisatie Bewerken"}
                    // onClick={handleAdd}
                    disabled={false}
                    icon={mode === "create" ? PlusCircle : Edit2}
                    animation="animate-bounce"
                    className="bg-indigo-400 text-white"
                />
            </SheetTrigger>
            <SheetContent className='bg-slate-200/50 backdrop-blur-sm overflow-scroll' onPointerDownOutside={(e) => e.preventDefault()} >
                <SheetHeader>
                    <SheetTitle>{mode === "create" ? "Nieuwe Organisatie" : "Organisatie Bewerken"}</SheetTitle>
                    <SheetDescription>
                        {mode === "create" ? "Creëer Nieuwe Organisatie." : "Bewerk bestaande organisatie."}
                    </SheetDescription>
                </SheetHeader>
                <Form {...form} >
                    <form className="grid grid-cols-2 gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
                                    <FormLabel className='flex items-center justify-between text-sm font-semibold'>
                                        Adres
                                        <Tooltip text='Dit is het volledige adres van de organisatie'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl className=''>
                                        <div className="relative">
                                            <Textarea
                                                placeholder="Voer het volledige adres in"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        E-mailadres
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="bijv: info@organisatie.nl" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="kvk_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        KVK Nummer
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="bijv: 12345678" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="btw_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        BTW Nummer
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="bijv: NL123456789B01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="postal_code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Postcode
                                    </FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder="bijv: 1234 AB" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Naam
                                    </FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder="bijv: Zorgorganisatie B.V." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Stad
                                    </FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder="bijv: Amsterdam" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <Button disabled={loading} type="submit" className='bg-indigo-200 text-indigo-600 hover:text-white hover:bg-indigo-600 transition-colors'>
                            {loading ? "Opslaan..." : "Wijzigingen Opslaan"}
                        </Button>
                        <SheetClose asChild>
                            <Button className='bg-red-200 text-red-600 hover:text-white hover:bg-red-600 transition-colors'>Annuleren</Button>
                        </SheetClose>
                    </form>
                </Form>


            </SheetContent>
        </Sheet>
    )
}

export default CreateOrganisationSheet