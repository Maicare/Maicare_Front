import PrimaryButton from '@/common/components/PrimaryButton'
import Tooltip from '@/common/components/Tooltip'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { GENDER_OPTIONS } from '@/consts'
import { useEmployee } from '@/hooks/employee/use-employee'
import { useLocation } from '@/hooks/location/use-location'
import { useRole } from '@/hooks/role/use-role'
import { CreateEmployee,  employeeSchema } from '@/schemas/employee.schema'
import { EmployeeDetailsResponse } from '@/types/employee.types'
import { cn } from '@/utils/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, CheckCircle, Info, XCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'


type Props = {
    mode:"create"|"update";
    onSuccess?:(id:number)=>void;
    defaultValues?:EmployeeDetailsResponse;
    onCancel:()=>void;
}

const UpsertEmployeeForm = ({mode,onSuccess,defaultValues,onCancel}:Props) => {
    const { createOne, updateOne } = useEmployee({ autoFetch: false });
    const {locations} = useLocation({autoFetch:true});
    const {roles} = useRole({autoFetch:true});
    const [loading, setLoading] = useState(false);
    // 1. Define your form.
    const form = useForm<CreateEmployee>({
        resolver: zodResolver(employeeSchema),
        defaultValues: mode === "update" ? {
            ...defaultValues,
            date_of_birth: new Date(defaultValues?.date_of_birth||""),
            location_id: defaultValues?.location_id?.toString()??"",
            role_id:defaultValues?.role_id?.toString()??"",
        } : {
            employee_number: '',
            employment_number: '',
            location_id: '',
            is_subcontractor: false,
            out_of_service: false,
            first_name: '',
            last_name: '',
            date_of_birth: new Date(),
            home_telephone_number: '',
            private_phone_number: '',
            work_phone_number: '',
            authentication_phone_number: '',
            private_email_address: '',
            email: '',
            gender: '',
            role_id: '',
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: CreateEmployee) {
        if (mode === "create") {
            try {
                setLoading(true);
                const newEmployee = await createOne(
                    {
                        ...values,
                        date_of_birth: values.date_of_birth.toISOString().split("T")[0],
                        location_id: Number(values.location_id),
                        role_id: Number(values.role_id),
                        department: null,
                        position: null,
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
                    {
                        ...values,
                        date_of_birth: values.date_of_birth.toISOString().split("T")[0],
                        location_id: Number(values.location_id),
                        role_id: Number(values.role_id),
                        department: null,
                        position: null,
                        id: defaultValues?.id || 0
                    }, {
                    displaySuccess: true,
                    displayProgress: true
                }
                );
                onSuccess?.(defaultValues?.id||0);
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
                        <h1 className='text-base font-semibold text-black'>Identificatie</h1>
                        <Separator className='bg-slate-300' />
                        <div className="space-y-5">
                            <FormField
                                control={form.control}
                                name="employee_number"
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
                                name="employment_number"
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
                                    name="location_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='flex items-center justify-between'>
                                                Locatie
                                                <Tooltip text='This is Locatie '>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a Location" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            <SelectLabel>Locations</SelectLabel>
                                                            {
                                                                locations?.map((item,index)=>(
                                                                    <SelectItem key={index} value={item.id.toString()} className="hover:bg-slate-100 cursor-pointer">{item.name}</SelectItem>
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
                                    name="role_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='flex items-center justify-between'>
                                                Rolen
                                                <Tooltip text='This is Rolen '>
                                                    <Info className='h-5 w-5 mr-2' />
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a Location" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectGroup>
                                                            <SelectLabel>Rolen</SelectLabel>
                                                            {
                                                                roles?.map((item,index)=>(
                                                                    <SelectItem value={item.id.toString()} key={index} className="hover:bg-slate-100 cursor-pointer">{item.role_name}</SelectItem>
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
                            <FormField
                                control={form.control}
                                name="out_of_service"
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
                                name="is_subcontractor"
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
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Voornaam</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="eg: Jhon" {...field} />
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
                                name="last_name"
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
                                name="private_email_address"
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
                                name="authentication_phone_number"
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
                                name="work_phone_number"
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
                                name="private_phone_number"
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
                                name="home_telephone_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Huis Telefoonnummer</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="eg: +212-626-661-516" {...field} />
                                                <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                    <Tooltip text='This is home phone number. '>
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
                                name="date_of_birth"
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
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center justify-between'>
                                            Geslacht
                                            <Tooltip text='This is gender '>
                                                <Info className='h-5 w-5 mr-2' />
                                            </Tooltip>
                                        </FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a Location" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    <SelectGroup>
                                                        <SelectLabel>Geslacht</SelectLabel>
                                                        {
                                                            GENDER_OPTIONS.map((item,index)=>(
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

export default UpsertEmployeeForm