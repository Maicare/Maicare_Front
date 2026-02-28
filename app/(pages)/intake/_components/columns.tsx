"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export const getUrgencyColor = (score: number | null | undefined): string => {
    if (!score) return "bg-gray-100 text-gray-800";
    if (score >= 8) return 'bg-red-100 text-red-800 border-red-200';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
};

const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
        scheduled: { label: "Gepland", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
        completed: { label: "Voltooid", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
        cancelled: { label: "Geannuleerd", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
        pending: { label: "In Afwachting", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
    };
    const badge = map[status] || { label: status, className: "bg-gray-100 text-gray-800" };
    return <span className={`px-2.5 py-0.5 rounded-sm text-xs font-medium ${badge.className}`}>{badge.label}</span>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "client_first_name",
        header: "Cliënt",
        cell: ({ row }) => {
            const intake = row.original;
            return <span className="font-medium text-slate-800 dark:text-white">{intake.client_first_name} {intake.client_last_name}</span>;
        },
    },
    {
        accessorKey: "client_email",
        header: "E-mailadres",
    },
    {
        accessorKey: "client_phone_number",
        header: "Telefoonnummer",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(row.original.status || ""),
    },
    {
        accessorKey: "date_of_intake",
        header: "Intakedatum",
        cell: ({ row }) => {
            const date = row.original.date_of_intake;
            if (!date) return <span className="text-gray-400">-</span>;
            return <span className="text-sm">{dayjs(date).format("DD-MM-YYYY HH:mm")}</span>;
        }
    },
    {
        accessorKey: "created_at",
        header: "Aangemaakt",
        cell: ({ row }) => {
            const date = row.original.created_at;
            if (!date) return <span className="text-gray-400">-</span>;
            return <span className="text-sm text-slate-500">{dayjs(date).format("DD-MM-YYYY")}</span>;
        }
    }
];
