"use client";
import { Any } from '@/common/types/types';
import { FormLabel } from '@/components/ui/form';
import { MultiSelectCombobox } from '@/components/ui/MultiSelectCombobox';
import { useClient } from '@/hooks/client/use-client';
import { useEmployee } from '@/hooks/employee/use-employee';
import React, { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form';

type Props = {
    mode?: "create" | "update";
    emails?: string[];
    clientId?: string;
    label:string;
}

const MultiEmailsSelect = ({ mode = "create", emails, clientId, label }: Props) => {
    const { readEmployeesEmails } = useEmployee({ autoFetch: false });
    const { readClientRelatedEmails } = useClient({ autoFetch: false });
    const [selectedValues, setSelectedValues] = useState<string[]>([])
    const [suggestions, setSuggestions] = useState<Any[]>([]);
    const form = useFormContext();
    useEffect(() => {
        if (mode === "update") {
            setSelectedValues(emails || []);
        } else {
            (async () => {
                try {
                    const data = await readClientRelatedEmails(parseInt(clientId as string));
                    if (!data.emails || data.emails.length === 0) return;
                    setSelectedValues(data.emails);
                } catch (error) {
                    console.error("Failed to fetch emails", error);
                }
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientId, mode,emails]);

    useEffect(() => {
        (async () => {
            try {
                const data = await readEmployeesEmails("");
                setSuggestions(data.data);
            } catch (error) {
                console.error("Failed to fetch emails", error);
                setSuggestions([]);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const options = useMemo(() => {
        return suggestions.map((item) => ({
            value: item.email,
            label: item.email + " (" + item.first_name + " " + item.last_name + ")",
        }));
    }, [suggestions]);
    useEffect(() => {
        form.setValue("emails", selectedValues);
    }, [selectedValues]);
    return (
        <div className='col-span-2 w-full'>
            <FormLabel className='flex items-center justify-between text-sm text-slate-700 font-semibold mb-2'>
                {label}
            </FormLabel>
            <MultiSelectCombobox
                options={options}
                selectedValues={selectedValues}
                onSelect={setSelectedValues}
                placeholder={label}
                searchPlaceholder="Search Emails..."
                emptyText="No Emails found."
            />
        </div>
    )
}

export default MultiEmailsSelect