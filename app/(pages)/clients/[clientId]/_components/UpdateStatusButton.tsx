'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { STATUS_OPTIONS } from '@/consts';
import { useClient } from '@/hooks/client/use-client';

// Zod schema for form validation
const formSchema = z.object({
    reason: z.string().min(1, 'Reden is verplicht'),
    schedueled: z.boolean().default(false),
    schedueled_for: z.string().optional(),
    status: z.string().min(1, 'Status is verplicht'),
}).refine((data) => {
    // If scheduled is true, scheduled_for is required
    if (data.schedueled) {
        return data.schedueled_for && data.schedueled_for.length > 0;
    }
    return true;
}, {
    message: 'Geplande datum is verplicht wanneer planning is ingeschakeld',
    path: ['scheduled_for'],
});

type FormValues = z.infer<typeof formSchema>;

interface UpdateStatusButtonProps {
    onConfirm: (data: FormValues) => void;
    clientId: string;
    status: string;
}

export function UpdateStatusButton({ onConfirm, clientId, status }: UpdateStatusButtonProps) {
    const [open, setOpen] = useState(false);
    const { updateStatus } = useClient({ autoFetch: false });
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reason: '',
            schedueled: false,
            schedueled_for: '',
            status: status || '',
        },
    });

    const watchedScheduled = form.watch('schedueled');

    async function onSubmit(data: FormValues) {
        try {
            await updateStatus(clientId, data, {
                displayProgress: true,
                displaySuccess: true
            });
            onConfirm(data);
            setOpen(false);
            form.reset();
        } catch (error) {
            console.error(error);
        }
    }

    function handleCancel() {
        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className='flex items-center justify-center gap-2 bg-indigo-400 text-white rounded-md py-2 text-sm w-[50%] hover:bg-indigo-500 transition-colors'>
                    <span>Status bijwerken</span>
                    <ArrowRight size={15} className='arrow-animation' />
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Status bijwerken</DialogTitle>
                    <DialogDescription>
                        Werk de status van de cliënt bij. Dit helpt bij het bijhouden van de voortgang en planning.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reden</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Voer reden voor update in" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecteer status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className='bg-white'>
                                            {
                                                STATUS_OPTIONS.map(s => (
                                                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="schedueled"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <FormLabel>Ingepland</FormLabel>
                                        <FormDescription>
                                            Schakel planning in voor een toekomstige statuswijziging
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {watchedScheduled && (
                            <FormField
                                control={form.control}
                                name="schedueled_for"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ingepland voor</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="datetime-local"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                Annuleren
                            </Button>
                            <Button type="submit" className="bg-indigo-400 hover:bg-indigo-500">
                                Bevestigen
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}