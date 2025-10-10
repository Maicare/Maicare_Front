"use client";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContractFilterFormType } from '@/types/contracts.types';
import React from 'react'

type Props = {
    filters: ContractFilterFormType;
    setFilters: (filters: ContractFilterFormType) => void;
}

const STATUSES = [
    { label: "Alle", value: "0" },
    { label: "Beëindigd", value: "terminated" },
    { label: "Concept", value: "draft" },
    { label: "Actief", value: "approved" },
];
const CARE_TYPE = [
    { label: "Alle", value: "0" },
    { label: "Ambulante", value: "ambulante" },
    { label: "Accommodatie", value: "accommodation" },
];
const FINANCING_ACT = [
    { label: "Alle", value: "0" },
    { label: "WMO", value: "WMO" },
    { label: "ZVW", value: "ZVW" },
    { label: "WLZ", value: "WLZ" },
    { label: "JW", value: "JW" },
    { label: "WPG", value: "WPG" },
];
const FINANCING_OPTION = [
    { label: "Alle", value: "0" },
    { label: "ZIN", value: "ZIN" },
    { label: "PGB", value: "PGB" },
];
const TableFilters = ({ filters, setFilters }: Props) => {
    return (
        <div className="grid grid-cols-6 items-center px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mb-5 gap-2 border-2 border-muted">
            <Select value={filters.status} onValueChange={(e) => setFilters({ ...filters, status: (e as "draft" | "terminated" | "approved" | "0") === "0" ? undefined : (e as "draft" | "terminated" | "approved" ) })} >
                <SelectTrigger className="col-span-1 w-full dark:bg-[#18181b] dark:ring-offset-black focus:ring-indigo-800">
                    <SelectValue placeholder="Selecteer status" />
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
            <Select value={filters.care_type} onValueChange={(e) => setFilters({ ...filters, care_type: (e as "ambulante" | "accommodation" | "0") === "0" ? undefined : (e as "ambulante" | "accommodation") })} >
                <SelectTrigger className="col-span-1 w-full dark:bg-[#18181b] dark:ring-offset-black focus:ring-indigo-800">
                    <SelectValue placeholder="Selecteer zorgtype" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#18181b] dark:border-black dark:text-white">
                    <SelectGroup>
                        {
                            CARE_TYPE?.map((item, index) => (
                                <SelectItem key={index} value={item.value} className="hover:bg-slate-100 dark:hover:bg-gray-500 cursor-pointer">{item.label}</SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select value={filters.financing_act} onValueChange={(e) => setFilters({ ...filters, financing_act: (e as "WMO" | "ZVW" | "WLZ" | "JW" | "WPG" | "0") === "0" ? undefined : (e as "WMO" | "ZVW" | "WLZ" | "JW" | "WPG" ) })} >
                <SelectTrigger className="col-span-1 w-full dark:bg-[#18181b] dark:ring-offset-black focus:ring-indigo-800">
                    <SelectValue placeholder="Selecteer financieringswet" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#18181b] dark:border-black dark:text-white">
                    <SelectGroup>
                        {
                            FINANCING_ACT?.map((item, index) => (
                                <SelectItem key={index} value={item.value} className="hover:bg-slate-100 dark:hover:bg-gray-500 cursor-pointer">{item.label}</SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select value={filters.financing_option} onValueChange={(e) => setFilters({ ...filters, financing_option: (e as "ZIN" | "PGB" | "0") === "0" ? undefined : (e as "ZIN" | "PGB")})} >
                <SelectTrigger className="col-span-1 w-full dark:bg-[#18181b] dark:ring-offset-black focus:ring-indigo-800">
                    <SelectValue placeholder="Selecteer financieringsoptie" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#18181b] dark:border-black dark:text-white">
                    <SelectGroup>
                        {
                            FINANCING_OPTION?.map((item, index) => (
                                <SelectItem key={index} value={item.value} className="hover:bg-slate-100 dark:hover:bg-gray-500 cursor-pointer">{item.label}</SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>

            <div className="col-span-2">
                <Input type="search" placeholder="Zoeken" className="w-full dark:bg-[#18181b] dark:border-white dark:ring-offset-black focus:ring-indigo-800" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
            </div>
        </div >
    )
}

export default TableFilters