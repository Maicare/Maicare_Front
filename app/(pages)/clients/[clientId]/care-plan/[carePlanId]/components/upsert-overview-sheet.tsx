"use client";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import PrimaryButton from '@/common/components/PrimaryButton';
import { Edit2,  PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { UpdateOverview, updateOverviewSchema } from '@/schemas/plan-care.schema';
import { Textarea } from '@/components/ui/textarea';
type Props = {
    mode: "create" | "update";
    handleCreate: (values: UpdateOverview) => void;
    handleUpdate?: (values: UpdateOverview) => void;
    overview?: {
        assessment_summary: string;
    } ;
    isOpen: boolean;
    handleOpen: (bool: boolean) => void;
}

const UpsertOverviewSheet = ({ mode, handleCreate, handleUpdate, overview, handleOpen, isOpen }: Props) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<UpdateOverview>({
        resolver: zodResolver(updateOverviewSchema),
        defaultValues: overview ? {
            assessment_summary: overview.assessment_summary,
        } : {
            assessment_summary: "",
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: UpdateOverview) {
        setLoading(true);
        if (mode === "create") {
            handleCreate(values);
        } else {
            handleUpdate?.(values);
        }
        handleOpen(false);
        setLoading(false);
    }

    useEffect(() => {
        if (overview) {
            form.setValue("assessment_summary", overview.assessment_summary);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [overview]);

    return (
        <Sheet open={isOpen} onOpenChange={(o) => handleOpen(o)}>
            <SheetTrigger asChild>
                <PrimaryButton
                    text={mode === "create" ? "Add" : ""}
                    // onClick={handleAdd}
                    disabled={false}
                    icon={mode === "create" ? PlusCircle : Edit2}
                    animation="animate-bounce"
                    className={mode === "create" ? "bg-indigo-400 text-white" : "bg-blue-300 text-white hover:bg-blue-500"}
                />
            </SheetTrigger>
            <SheetContent className='bg-slate-200/50 backdrop-blur-sm overflow-scroll' onPointerDownOutside={(e) => e.preventDefault()} >
                <SheetHeader>
                    <SheetTitle>Update Overview</SheetTitle>
                    <SheetDescription>
                    Update Overview.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form} >
                    <form className="grid grid-cols-1 gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="assessment_summary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assessment Summary</FormLabel>
                                    <FormControl>
                                        <Textarea rows={10} {...field} placeholder="Enter assessment summary" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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

export default UpsertOverviewSheet