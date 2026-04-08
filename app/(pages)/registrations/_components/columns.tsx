"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export const getStatusBadge = (status: string) => {
    switch (status) {
        case 'approved':
            return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-success/10 text-success border border-success/20">Goedgekeurd</span>;
        case 'rejected':
            return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-danger/10 text-danger border border-danger/20">Afgewezen</span>;
        case 'in_review':
            return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">In Behandeling</span>;
        case 'archived':
            return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">Gearchiveerd</span>;
        default:
            return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-warning/10 text-warning border border-warning/20">In Afwachting</span>;
    }
};

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "name",
        header: "Naam",
        cell: ({ row }) => {
            const client = row.original;
            return <span className="font-medium text-slate-800 dark:text-white">{client.client_first_name} {client.client_last_name}</span>;
        },
    },
    {
        accessorKey: "client_email",
        header: "E-mailadres",
    },
    {
        accessorKey: "client_phone_number",
        header: "Telefoon",
    },
    {
        accessorKey: "form_status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(row.original.form_status || row.original.status),
    },
    {
        accessorKey: "application_date",
        header: "Datum",
        cell: ({ row }) => {
            return row.original.application_date ? dayjs(row.original.application_date).format("DD-MM-YYYY") : '-';
        },
    },
];
