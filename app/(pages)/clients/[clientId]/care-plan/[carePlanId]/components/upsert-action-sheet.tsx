"use client";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import PrimaryButton from '@/common/components/PrimaryButton';
import { Edit2,  PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { ObjectiveAction } from '@/types/care-plan.types';
import { Id } from '@/common/types/types';
import { CreateAction, createActionSchema } from '@/schemas/plan-care.schema';
import { Input } from '@/components/ui/input';
type Props = {
    mode: "create" | "update";
    handleCreate: (values: CreateAction,objectiveId:Id) => void;
    handleUpdate?: (values: CreateAction, id: Id) => void;
    action?: ObjectiveAction ;
    isOpen: boolean;
    handleOpen: (bool: boolean) => void;
    objectiveId?: Id; // Optional, if creating an action for a specific objective
}

const UpsertActionSheet = ({ mode, handleCreate, handleUpdate, action, handleOpen, isOpen,objectiveId }: Props) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<CreateAction>({
        resolver: zodResolver(createActionSchema),
        defaultValues: action ? {
            action_description: action.action_description,
        } : {
            action_description: "",
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: CreateAction) {
        setLoading(true);
        if (mode === "create") {
            handleCreate(values, objectiveId as Id);
        } else {
            handleUpdate?.(values, action!.action_id);
        }
        handleOpen(false);
        setLoading(false);
    }

    useEffect(() => {
        if (action) {
            form.setValue("action_description", action.action_description);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action]);

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
                    <SheetTitle>Nieuwe Acties</SheetTitle>
                    <SheetDescription>
                        Creëer Nieuwe Acties.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form} >
                    <form className="grid grid-cols-1 gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="action_description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Actie Beschrijving</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Voer actie beschrijving in" {...field} />
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

export default UpsertActionSheet