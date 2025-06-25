"use client";
import PrimaryButton from '@/common/components/PrimaryButton'
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RegistrationParamsFilters } from '@/types/registration.types';
import { PlusCircle } from 'lucide-react'
import React from 'react'

type Props = {
    filters: RegistrationParamsFilters;
    setFilters: (filters: RegistrationParamsFilters) => void;
    handleAdd: () => void;
}

const STATUSES = [
    { label: "Pending", value: "pending" },
    { label: "Rejected", value: "rejected" },
    { label: "Approved", value: "approved" },
];
const TableFilters = ({ filters, handleAdd, setFilters }: Props) => {
    return (
        <div className="grid grid-cols-6 items-center px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mb-5 gap-2 border-2 border-muted">
            <Select value={filters.status} onValueChange={(e) => setFilters({ ...filters, status: e as "pending" | "rejected" | "approved" })} >
                <SelectTrigger className="col-span-1 w-full dark:bg-[#18181b] dark:ring-offset-black focus:ring-indigo-800">
                    <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#18181b] dark:border-black dark:text-white">
                    <SelectGroup>
                        {
                            STATUSES?.map((item, index) => (
                                <SelectItem key={index} value={item.value} className="hover:bg-slate-100 dark:hover:bg-gray-500 cursor-pointer">{item.label}</SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
            {/* check box */}
            {([
                "risk_aggressive_behavior",
                "risk_criminal_history",
                "risk_day_night_rhythm",
                "risk_flight_behavior",
                "risk_psychiatric_issues",
                "risk_sexual_behavior",
                "risk_substance_abuse",
                "risk_suicidal_selfharm",
                "risk_weapon_possession",
            ] as (keyof RegistrationParamsFilters)[]).map((field: keyof RegistrationParamsFilters,index) => (
                <div className="flex gap-2 px-2 py-3 border-indigo-600 border-1 items-center rounded-md" key={index}>
                    <Checkbox
                        checked={typeof filters[field] === "boolean" ? filters[field] : false}
                        onCheckedChange={(checked) => {
                            // You'll need to implement this handler
                            // For example:
                            setFilters({ ...filters, [field]: checked });
                        }}
                        id={field}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-offset-0 dark:bg-[#18181b] dark:border-black dark:focus:ring-offset-black dark:focus:ring-indigo-500"
                    />
                    <Label className="font-normal" htmlFor={field}>
                        {field
                            .replace("risk_", "")
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Label>
                </div>
            ))}
            <div className="col-span-2">
                <PrimaryButton
                    text="Add"
                    onClick={handleAdd}
                    disabled={false}
                    icon={PlusCircle}
                    animation="animate-bounce"
                    className="ml-auto dark:bg-indigo-800 dark:text-white dark:hover:bg-indigo-500"
                />
            </div>
        </div >
    )
}

export default TableFilters