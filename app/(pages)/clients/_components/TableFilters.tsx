"use client";
import PrimaryButton from '@/common/components/PrimaryButton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { STATUS_OPTIONS } from '@/consts';
import { useLocation } from '@/hooks/location/use-location'
import { ClientsSearchParams } from '@/types/client.types';
import { PlusCircle } from 'lucide-react'
import React from 'react'

type Props = {
    filters: ClientsSearchParams;
    setFilters: (filters: ClientsSearchParams) => void;
    handleAdd: () => void;
}

const TableFilters = ({ filters, handleAdd, setFilters }: Props) => {
    const { locations } = useLocation({autoFetch:true});

    return (
        <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mb-5 gap-2 border-2 border-muted">
            <Input type="search" placeholder="Search" className="w-60 dark:bg-[#18181b] dark:border-white dark:ring-offset-black focus:ring-indigo-800" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
            <Select value={filters.location_id?.toString()} onValueChange={(e) => setFilters({ ...filters, location_id: parseInt(e) })} >
                <SelectTrigger className="w-[180px] dark:bg-[#18181b] dark:ring-offset-black focus:ring-indigo-800">
                    <SelectValue placeholder="Select a Location" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#18181b] dark:border-black dark:text-white">
                    <SelectGroup>
                        <SelectLabel>Locations</SelectLabel>
                        {
                            locations?.map((item, index) => (
                                <SelectItem key={index} value={item.id.toString()} className="hover:bg-slate-100 dark:hover:bg-gray-500 cursor-pointer">{item.name}</SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(e) => setFilters({ ...filters, status: e })} >
                <SelectTrigger className="w-[180px] dark:bg-[#18181b] dark:ring-offset-black focus:ring-indigo-800">
                    <SelectValue placeholder={"In service"} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#18181b] dark:border-black dark:text-white">
                    <SelectGroup>
                        {
                            STATUS_OPTIONS.map((item, index) => (
                                <SelectItem key={index} value={item.value} className="hover:bg-slate-100 dark:hover:bg-gray-500 cursor-pointer">{item.label}</SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
            <PrimaryButton
                text="Add"
                onClick={handleAdd}
                disabled={false}
                icon={PlusCircle}
                animation="animate-bounce"
                className="ml-auto dark:bg-indigo-800 dark:text-white dark:hover:bg-indigo-500"
            />
        </div>
    )
}

export default TableFilters