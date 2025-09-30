"use client";
import PrimaryButton from '@/common/components/PrimaryButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch';
import { STATUS_OPTIONS } from '@/consts';
import { useLocation } from '@/hooks/location/use-location'
import { useI18n } from '@/lib/i18n/client';
import { ClientsSearchParams } from '@/types/client.types';
import { PlusCircle } from 'lucide-react'
import React from 'react'

type Props = {
    filters: ClientsSearchParams;
    setFilters: (filters: ClientsSearchParams) => void;
    handleAdd: () => void;
}

const TableFilters = ({ filters, handleAdd, setFilters }: Props) => {
    const { locations } = useLocation({ autoFetch: true });
    const t = useI18n();

    return (
        <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mb-5 gap-2 border-2 border-muted">
            <Input type="search" placeholder={t("common.search")} className="w-60 dark:bg-[#18181b] dark:border-white dark:ring-offset-black focus:ring-indigo-800" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
            <Select value={filters.location_id?.toString()} onValueChange={(e) => setFilters({ ...filters, location_id: parseInt(e) })} >
                <SelectTrigger className="w-[180px] dark:bg-[#18181b] dark:ring-offset-black focus:ring-indigo-800">
                    <SelectValue placeholder={t("clients.list.selectLocation")} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#18181b] dark:border-black dark:text-white">
                    <SelectGroup>
                        <SelectLabel>{t("clients.list.location")}</SelectLabel>
                        {
                            locations?.map((item, index) => (
                                <SelectItem key={index} value={item.id.toString()} className="hover:bg-slate-100 dark:hover:bg-gray-500 cursor-pointer">{item.name}</SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div className="flex space-x-3 bg-indigo-50 dark:bg-indigo-900 px-3 py-2 rounded-md">
                {STATUS_OPTIONS.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <Switch
                            id={`status-${item.value}`}
                            checked={filters.status === item.value}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    setFilters({ ...filters, status: item.value })
                                } else if (filters.status === item.value) {
                                    // Optional: clear selection when switching off the currently selected option
                                    setFilters({ ...filters, status: "" })
                                }
                            }}
                            className="data-[state=checked]:bg-indigo-800 dark:data-[state=checked]:bg-indigo-600"
                        />
                        <Label htmlFor={`status-${item.value}`} className="cursor-pointer">
                            {item.label === "Wachtlijst" ? t("clients.list.waitingList") : item.label === "In Zorg" ? t("clients.list.inCare") : t("clients.list.outOfCare")}
                        </Label>
                    </div>
                ))}
            </div>
            <PrimaryButton
                text={t("common.add")}
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