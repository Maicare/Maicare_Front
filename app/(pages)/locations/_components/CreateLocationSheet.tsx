"use client";
import { Sheet, SheetClose, SheetContent, SheetDescription,  SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import PrimaryButton from '@/common/components/PrimaryButton';
import {  Info, PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Tooltip from '@/common/components/Tooltip';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { CreateLocation, createLocationSchema, Location } from '@/schemas/location.schema';
type Props = {
    mode: "create" | "update";
    handleCreate: (values: CreateLocation) => void;
    handleUpdate: (values: CreateLocation) => void;
    location?: Location;
    isOpen: boolean;
    handleOpen: (bool: boolean) => void;
}

const CreateLocationSheet = ({ mode, handleCreate, handleUpdate, location, handleOpen, isOpen }: Props) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<CreateLocation>({
        resolver: zodResolver(createLocationSchema),
        defaultValues: location ? {
            ...location
        } : {
            address:"",
            capacity:0,
            name:""
        },
    });
    // 2. Definieer een submit handler.
    async function onSubmit(values: CreateLocation) {
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
        if (location) {
            form.setValue("address", location.address);
            form.setValue("capacity", location.capacity);
            form.setValue("name", location.name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);
    return (
        <Sheet open={isOpen} onOpenChange={(o) => handleOpen(o)}>
            <SheetTrigger asChild>
                <PrimaryButton
                    text="Toevoegen"
                    // onClick={handleAdd}
                    disabled={false}
                    icon={PlusCircle}
                    animation="animate-bounce"
                    className="bg-indigo-400 text-white"
                />
            </SheetTrigger>
            <SheetContent className='bg-slate-200/50 backdrop-blur-sm overflow-scroll' onPointerDownOutside={(e) => e.preventDefault()} >
                <SheetHeader>
                    <SheetTitle>{mode === "create" ? "Nieuwe Locatie" : "Locatie Bewerken"}</SheetTitle>
                    <SheetDescription>
                        {mode === "create" ? "Creëer Nieuwe Locatie." : "Bewerk bestaande locatie."}
                    </SheetDescription>
                </SheetHeader>
                <Form {...form} >
                    <form className="grid grid-cols-2 gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Naam</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="bijv: Hoofdkantoor" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='Dit is de naam van de locatie'>
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
                            name="capacity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Capaciteit</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type="number" placeholder="bijv: 100" {...field} onChange={(e) => field.onChange(Number(e.target.value))}  />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='Dit is de maximale capaciteit van de locatie'>
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
                            name="address"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
                                    <FormLabel className='flex items-center justify-between text-sm font-semibold'>
                                        Adres
                                        <Tooltip text='Dit is het volledige adres van de locatie'>
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

export default CreateLocationSheet