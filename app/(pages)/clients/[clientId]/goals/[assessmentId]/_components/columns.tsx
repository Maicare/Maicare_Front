import { Any } from '@/common/types/types';
import { Goal } from '@/types/goals.types';
import { LEVEL_OPTIONS } from '@/types/maturity-matrix.types';
import { cn, getTailwindClasses } from '@/utils/cn';
import { fullDateFormat } from '@/utils/timeFormatting';
import { ColumnDef } from '@tanstack/table-core';
import React from 'react'

const columns: ColumnDef<Goal>[] =
    [
        {
            accessorKey: "description",
            header: () => "Description",
            cell: (info) => (info.getValue() as string ?? "").split(' ').slice(0, 5).join(' ') + " ..." || "",
        },
        {
            accessorKey: "start_date",
            header: () => "Start Date",
            cell: (info: Any) => fullDateFormat(info.getValue() as string) ? <span className='bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-yellow-900 dark:text-yellow-300'>{fullDateFormat(info.getValue() as string)}</span> : <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet Beschikbaar</span>,
        },
        {
            accessorKey: "target_level",
            header: () => "Target Level",
            cell: (info: Any) => {
                const level = info.getValue() as number;
                const classes = getTailwindClasses(level);
                return (
                    <span className={cn(classes)}>{LEVEL_OPTIONS.find(it => it.value === info.getValue().toString())?.label || "Niet Beschikbaar"}</span>
                )
            },
        },
        {
            accessorKey: "completion_date",
            header: () => "Completion Date",
            cell: (info: Any) => fullDateFormat(info.getValue() as string) ? <span className='bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300'>{fullDateFormat(info.getValue() as string)}</span> : <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet Beschikbaar</span>,
        },
        {
            accessorKey: "target_date",
            header: () => "Target Date",
            cell: (info: Any) =>  fullDateFormat(info.getValue() as string) ? <span className='bg-orange-100 text-orange-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-orange-900 dark:text-orange-300'>{fullDateFormat(info.getValue() as string)}</span> : <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>Niet Beschikbaar</span>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: (info) => info.getValue() || "",
        },
    ];


export default columns