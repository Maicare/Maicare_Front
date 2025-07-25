import PrimaryButton from '@/common/components/PrimaryButton'
import Tooltip from '@/common/components/Tooltip'
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem,  SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useContact } from '@/hooks/contact/use-contact'
import { Contact, CreateContact, CreateContactSchema } from '@/schemas/contact.schema'
import { OP_CLIENT_TYPE, OpClientTypeRecord } from '@/types/contacts.types'
import { zodResolver } from '@hookform/resolvers/zod'
import {  CheckCircle, Info, XCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ContactsFormSection } from './contacts-form-section'


type Props = {
    mode: "create" | "update";
    onSuccess?: (id: number) => void;
    defaultValues?: Contact;
    onCancel: () => void;
}

const UpsertContactForm = ({ mode, onSuccess, defaultValues, onCancel }: Props) => {
    const { createOne, updateOne } = useContact({ autoFetch: false });
    const [loading, setLoading] = useState(false);
    // 1. Define your form.
    const form = useForm<CreateContact>({
        resolver: zodResolver(CreateContactSchema),
        defaultValues: mode === "update" ? {
            ...defaultValues
        } : {
            BTWnumber: "",
            KVKnumber: "",
            address: "",
            client_number: "",
            contacts: [
                {
                    email: "",
                    name: "",
                    phone_number: "",
                }
            ],
            land: "",
            name: "",
            phone_number: "",
            place: "",
            postal_code: "",
            types: "main_provider",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: CreateContact) {
        if (mode === "create") {
            try {
                setLoading(true);
                const newEmployee = await createOne(
                    {
                        ...values
                    }, {
                    displaySuccess: true,
                    displayProgress: true
                }
                );
                onSuccess?.(newEmployee.id);
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
                        ...values
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
                <div className="grid grid-cols-1 gap-4 h-fit">
                    <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
                        <h1 className='text-base font-semibold text-black'>Opdrachtgever</h1>
                        <Separator className='bg-slate-300' />
                        <div className="space-y-5">
                            <FormField
                                control={form.control}
                                name="types"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center justify-between'>
                                            Opdrachtgever type
                                            <Tooltip text='This is Opdrachtgever type'>
                                                <Info className='h-5 w-5 mr-2' />
                                            </Tooltip>
                                        </FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    <SelectGroup>
                                                        {
                                                            OP_CLIENT_TYPE?.map((item, index) => (
                                                                <SelectItem key={index} value={item} className="hover:bg-slate-100 cursor-pointer">{OpClientTypeRecord[item]}</SelectItem>
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
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Naam</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="eg: Jhon Doe" {...field} />
                                                <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                    <Tooltip text='This is Naam'>
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
                                    <FormItem>
                                        <FormLabel>Adres </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="eg: Rue de Fromelenne 265, East Flanders, Gent" {...field} />
                                                <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                    <Tooltip text='This is Adres '>
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
                    <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted">
                        <h1 className='text-base font-semibold text-black'>Coördinaten</h1>
                        <Separator className='bg-slate-300' />
                        <div className="space-y-5">
                            <FormField
                                control={form.control}
                                name="postal_code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Postcode</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="eg: 9000" {...field} />
                                                <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                    <Tooltip text='This is Postcode.'>
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
                                name="place"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plaats</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="eg: Plaats" {...field} />
                                                <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                    <Tooltip text='This is Plaats.'>
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
                                name="land"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Land</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="eg: Land" {...field} />
                                                <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                    <Tooltip text='This is Land.'>
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
                                name="BTWnumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>BTW nummer</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="eg: 9867373" {...field} />
                                                <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                    <Tooltip text='This is BTW nummer.'>
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
                                name="KVKnumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>KvK nummer</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="eg: 895467373" {...field} />
                                                <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                    <Tooltip text='This is KvK nummer.'>
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
                                        <FormLabel>Telefoonnummer </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="eg: +3282828282" {...field} />
                                                <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                    <Tooltip text='This is Telefoonnummer .'>
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
                                name="client_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Clientnummer</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="eg: 2812582892" {...field} />
                                                <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                    <Tooltip text='This is Clientnummer.'>
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
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted">
                        <h1 className='text-base font-semibold text-black'>Contactpersonen</h1>
                        <Separator className='bg-slate-300' />
                        <div className="space-y-5">
                            <ContactsFormSection />

                        </div>
                    </div>
                </div>
                <PrimaryButton
                    text='Save'
                    type='submit'
                    animation='animate-bounce'
                    icon={CheckCircle}
                    disabled={loading}
                    className='bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white px-4 py-3 text-sm'
                />
                <PrimaryButton
                    text='Cancel'
                    type='button'
                    animation='animate-bounce'
                    icon={XCircle}
                    onClick={onCancel}
                    disabled={loading}
                    className='bg-red-100 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 text-sm'
                />
            </form>
        </Form>
    )
}

export default UpsertContactForm