"use client";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import PrimaryButton from '@/common/components/PrimaryButton';
import { CalendarIcon, Info, PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Tooltip from '@/common/components/Tooltip';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreatePayment, createPaymentSchema } from '@/schemas/payment.schema';
import { Payment, PAYMENT_METHODS_OPTIONS, PAYMENT_STATUSES_OPTIONS } from '@/types/payment.types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
type Props = {
    mode: "create" | "update";
    handleCreate: (values: CreatePayment) => void;
    handleUpdate: (values: CreatePayment & { recorded_by: number }) => void;
    payment?: Payment;
    isOpen: boolean;
    handleOpen: (bool: boolean) => void;
}

const UpsertPaymentSheet = ({ mode, handleCreate, handleUpdate, payment, handleOpen, isOpen }: Props) => {
    const [loading, setLoading] = useState(false);

    const form = useForm<CreatePayment>({
        resolver: zodResolver(createPaymentSchema),
        defaultValues: payment ? {
            amount: payment.amount,
            notes: payment.notes || "",
            payment_date: new Date(payment.payment_date),
            payment_method: payment.payment_method,
            payment_reference: payment.payment_reference,
            payment_status: payment.payment_status,
            recorded_by: payment.recorded_by,
        } : {
            amount: 0,
            notes: "",
            payment_date: new Date(),
            payment_method: "credit_card",
            payment_reference: "",
            payment_status: "pending",
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: CreatePayment) {
        setLoading(true);
        if (mode === "create") {
            handleCreate(values);
        } else {
            handleUpdate({ ...values, recorded_by: payment!.recorded_by! });
        }
        handleOpen(false);
        setLoading(false);
    }
    useEffect(()=>{
        if (payment) {
            form.setValue("payment_date", new Date(payment.payment_date));
            form.setValue("amount", payment.amount);
            form.setValue("notes", payment.notes||"");
            form.setValue("payment_method", payment.payment_method);
            form.setValue("payment_reference", payment.payment_reference);
            form.setValue("payment_status", payment.payment_status);
            form.setValue("recorded_by", payment.recorded_by);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payment]);

    return (
        <Sheet open={isOpen} onOpenChange={(o) => handleOpen(o)}>
            <SheetTrigger asChild>
                <PrimaryButton
                    text="Add"
                    // onClick={handleAdd}
                    disabled={false}
                    icon={PlusCircle}
                    animation="animate-bounce"
                    className="bg-indigo-400 text-white"
                />
            </SheetTrigger>
            <SheetContent className='bg-slate-200/50 backdrop-blur-sm overflow-scroll' onPointerDownOutside={(e) => e.preventDefault()} >
                <SheetHeader>
                    <SheetTitle>Nieuwe Payment</SheetTitle>
                    <SheetDescription>
                        Creëer Nieuwe Payment.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form} >
                    <form className="grid grid-cols-2 gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="eg: 3000"
                                                {...field}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(value === '' ? undefined : Number(value));
                                                }}
                                            />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='This is Amount'>
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
                            name={`payment_date`}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className='flex items-center justify-between'>
                                        Payment Date
                                        <Tooltip text='This is payment Date.'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <Popover modal>
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
                                                onSelect={field.onChange}
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
                            name="payment_method"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
                                    <FormLabel className='flex items-center justify-between'>
                                        Payment Method
                                        <Tooltip text='This is Payment Method'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Payment Method" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectGroup>
                                                    {
                                                        PAYMENT_METHODS_OPTIONS.map((item, index) => (
                                                            <SelectItem key={index} value={item.value} className="hover:bg-slate-100 cursor-pointer capitalize">{item.label}</SelectItem>
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
                            name="payment_status"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
                                    <FormLabel className='flex items-center justify-between'>
                                        Payment Status
                                        <Tooltip text='This is Payment Status'>
                                            <Info className='h-5 w-5 mr-2' />
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Payment Status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectGroup>
                                                    {
                                                        PAYMENT_STATUSES_OPTIONS.map((item, index) => (
                                                            <SelectItem key={index} value={item.value} className="hover:bg-slate-100 cursor-pointer capitalize">{item.label}</SelectItem>
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
                            name="payment_reference"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
                                    <FormLabel>Payment Refrence</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="eg: FE435TG6" {...field} />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='This is Payment Refrence'>
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
                            name="notes"
                            render={({ field }) => (
                                <FormItem className='col-span-2'>
                                    <FormLabel>Payment Notes</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Textarea
                                                placeholder="Notes about the payment"
                                                className="resize-none"
                                                rows={4}
                                                {...field}
                                            />
                                            <div className="absolute right-2 top-0 translate-y-1/2 h-5 w-5 ">
                                                <Tooltip text='This is Payment Notes'>
                                                    <Info className='h-5 w-5' />
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <Separator className="bg-slate-300 w-full col-span-2" />

                        <Button disabled={loading} type="submit" className='bg-indigo-200 text-indigo-600 hover:text-white hover:bg-indigo-600 transition-colors'>Save changes</Button>
                        <SheetClose asChild>
                            <Button className='bg-red-200 text-red-600 hover:text-white hover:bg-red-600 transition-colors'>Cancel</Button>
                        </SheetClose>
                    </form>
                </Form>


            </SheetContent>
        </Sheet>
    )
}

export default UpsertPaymentSheet