"use client";
import PrimaryButton from '@/common/components/PrimaryButton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLocation } from '@/hooks/location/use-location'
import { EmployeesSearchParams } from '@/types/employee.types';
import { PlusCircle } from 'lucide-react'
import React from 'react'

type Props = {
    filters:EmployeesSearchParams;
    setFilters:(filters:EmployeesSearchParams)=>void;
    handleAdd:()=>void;
}

const TableFilters = ({filters,setFilters,handleAdd}:Props) => {
    const {locations} = useLocation({autoFetch:true});
    return (
        <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mb-5 gap-2 border-2 border-muted">
            <Input type="search" placeholder="Zoeken" className="w-60 dark:bg-[#18181b] dark:border-white dark:ring-offset-black focus:ring-indigo-800" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
            <Select value={filters.location_id?.toString()} onValueChange={(e) => setFilters({ ...filters, location_id: parseInt(e) })} >
                <SelectTrigger className="w-[180px] dark:bg-[#18181b] dark:ring-offset-black focus:ring-indigo-800">
                    <SelectValue placeholder="Selecteer een locatie" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#18181b] dark:border-black dark:text-white">
                    <SelectGroup>
                        <SelectLabel>Locaties</SelectLabel>
                        {
                            locations?.map((item, index) => (
                                <SelectItem key={index} value={item.id.toString()} className="hover:bg-slate-100 dark:hover:bg-gray-500 cursor-pointer">{item.name}</SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select value={filters.is_archived ? "true" : "false"} onValueChange={(e) => setFilters({ ...filters, is_archived: e === "true" })} >
                <SelectTrigger className="w-[180px] dark:bg-[#18181b] dark:ring-offset-black focus:ring-indigo-800">
                    <SelectValue placeholder={"Actief"} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#18181b] dark:border-black dark:text-white">
                    <SelectGroup>
                        <SelectItem value="true" className="hover:bg-slate-100 dark:hover:bg-gray-500 cursor-pointer">Gearchiveerd</SelectItem>
                        <SelectItem value="false" className="hover:bg-slate-100 dark:hover:bg-gray-500 cursor-pointer">Actief</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select value={filters.out_of_service ? "true" : "false"} onValueChange={(e) => setFilters({ ...filters, out_of_service: e === "true" })} >
                <SelectTrigger className="w-[180px] dark:bg-[#18181b] dark:ring-offset-black focus:ring-indigo-800">
                    <SelectValue placeholder={"In dienst"} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#18181b] dark:border-black dark:text-white">
                    <SelectGroup>
                        <SelectItem value="false" className="hover:bg-slate-100 dark:hover:bg-gray-500 cursor-pointer">In dienst</SelectItem>
                        <SelectItem value="true" className="hover:bg-slate-100 dark:hover:bg-gray-500 cursor-pointer">Uit dienst</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <PrimaryButton
                text="Toevoegen"
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