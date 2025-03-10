"use client";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, CheckCircle, Info, XCircle } from 'lucide-react';
import Tooltip from '@/common/components/Tooltip';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';


const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    Medewerkernummer: z.string().min(2, {
        message: "Medewerkernummer must be at least 2 characters.",
    }),
    contractor: z.boolean().default(false),
    email: z.string().email({
        message: "Must be a valid Email!"
    }).min(1, {
        message: "Email Required!.",
    }),
    emailPrivate: z.string().email({
        message: "Must be a valid Email!"
    }).min(1, {
        message: "Email Required!.",
    }),
    birthday: z.date({
        required_error: "A date of birth is required.",
    }),
})
const Page = () => {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            contractor: false,
            email: "",
            emailPrivate: "",
            birthday: new Date(),
            Medewerkernummer:""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold">Medewerker Aanmaken</h1>
                <p>Dashboard / <span className="font-medium text-indigo-500 hover:cursor-pointer">Medewerker Aanmaken</span></p>
            </div>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                    <div className="grid grid-cols-1 gap-4 h-fit">
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted h-fit">
                            <h1 className='text-base font-semibold text-black'>Identificatie</h1>
                            <Separator className='bg-slate-300' />
                            <div className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="Medewerkernummer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Medewerkernummer</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: T23JK467" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is Medewerkernummer'>
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
                                    name="Medewerkernummer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dienstnummer</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: T23JK467" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is Dienstnummer '>
                                                            <Info className='h-5 w-5' />
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <FormField
                                        control={form.control}
                                        name="Medewerkernummer"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='flex items-center justify-between'>
                                                    Locatie
                                                    <Tooltip text='This is Locatie '>
                                                        <Info className='h-5 w-5 mr-2' />
                                                    </Tooltip>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select {...field} >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a Location" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white">
                                                            <SelectGroup>
                                                                <SelectLabel>Locations</SelectLabel>
                                                                <SelectItem value="apple" className="hover:bg-slate-100 cursor-pointer">Apple</SelectItem>
                                                                <SelectItem value="banana" className="hover:bg-slate-100 cursor-pointer">Banana</SelectItem>
                                                                <SelectItem value="blueberry" className="hover:bg-slate-100 cursor-pointer">Blueberry</SelectItem>
                                                                <SelectItem value="grapes" className="hover:bg-slate-100 cursor-pointer">Grapes</SelectItem>
                                                                <SelectItem value="pineapple" className="hover:bg-slate-100 cursor-pointer">Pineapple</SelectItem>
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
                                        name="Medewerkernummer"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='flex items-center justify-between'>
                                                    Rolen
                                                    <Tooltip text='This is Rolen '>
                                                        <Info className='h-5 w-5 mr-2' />
                                                    </Tooltip>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select {...field}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a Location" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white">
                                                            <SelectGroup>
                                                                <SelectLabel>Rolen</SelectLabel>
                                                                <SelectItem value="apple" className="hover:bg-slate-100 cursor-pointer">Apple</SelectItem>
                                                                <SelectItem value="banana" className="hover:bg-slate-100 cursor-pointer">Banana</SelectItem>
                                                                <SelectItem value="blueberry" className="hover:bg-slate-100 cursor-pointer">Blueberry</SelectItem>
                                                                <SelectItem value="grapes" className="hover:bg-slate-100 cursor-pointer">Grapes</SelectItem>
                                                                <SelectItem value="pineapple" className="hover:bg-slate-100 cursor-pointer">Pineapple</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="contractor"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className=''
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Uit Dienst
                                                </FormLabel>
                                                <FormDescription>
                                                    An Out of service is a person No longer operational or available for use.
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contractor"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className=''
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Is een onderaannemer
                                                </FormLabel>
                                                <FormDescription>
                                                    A subcontractor is a person or company hired by a main contractor to perform specific tasks or services within a larger project.
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 px-6 py-3 bg-white rounded-md border-2 border-muted">
                            <h1 className='text-base font-semibold text-black'>Naam</h1>
                            <Separator className='bg-slate-300' />
                            <div className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Voornaam</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input type='email' placeholder="eg: Jhon" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is First name.'>
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
                                    name="emailPrivate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Achternaam</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: Doe" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is Last name. '>
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
                            <h1 className='text-base font-semibold text-black'>Contact</h1>
                            <Separator className='bg-slate-300' />
                            <div className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>E-mailadres</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input type='email' placeholder="eg: Taha@gmail.com" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is email address.'>
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
                                    name="emailPrivate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Privé E-mailadres</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: Taha@maicaire.com" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is private email address. '>
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
                                    name="emailPrivate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Authenticatie Telefoonnummer</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: +212-626-661-516" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is authentication phone number. '>
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
                                    name="emailPrivate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Werk Telefoonnummer</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: +212-626-661-516" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is work phone number. '>
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
                                    name="emailPrivate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Privé Telefoonnummer</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: +212-626-661-516" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is private phone number. '>
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
                                    name="emailPrivate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Huis Telefoonnummer</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="eg: +212-626-661-516" {...field} />
                                                    <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                        <Tooltip text='This is huis phone number. '>
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
                            <h1 className='text-base font-semibold text-black'>Geboortedetails</h1>
                            <Separator className='bg-slate-300' />
                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="birthday"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className='flex items-center justify-between'>
                                                Date of birth
                                                <Tooltip text='This is date of birth. '>
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
                                                                <span>Pick a date</span>
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
                                    control={form.control}
                                    name="Medewerkernummer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='flex items-center justify-between'>
                                                Geslacht
                                                <Tooltip text='This is gender '>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select {...field} >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a Location" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            <SelectLabel>Geslacht</SelectLabel>
                                                            <SelectItem value="apple" className="hover:bg-slate-100 cursor-pointer">Male</SelectItem>
                                                            <SelectItem value="banana" className="hover:bg-slate-100 cursor-pointer">Female</SelectItem>
                                                            <SelectItem value="blueberry" className="hover:bg-slate-100 cursor-pointer">Non-binary</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <button type='submit' className='flex items-center justify-center gap-2 bg-indigo-100 text-indigo-500 hover:bg-indigo-500 transition-all ease-linear duration-300 hover:text-white rounded-md px-4 py-3 text-sm'>
                        <span>Save</span>
                        <CheckCircle size={15} className='animate-bounce' />
                    </button>
                    <button type="button" onClick={() => { }} className='flex items-center justify-center gap-2 bg-red-100 text-red-500 hover:bg-red-500 transition-all ease-linear duration-300 hover:text-white rounded-md px-4 py-3 text-sm'>
                        <span>Cancel</span>
                        <XCircle size={15} className='animate-bounce' />
                    </button>
                </form>
            </Form>
        </div>
    )
}

export default Page