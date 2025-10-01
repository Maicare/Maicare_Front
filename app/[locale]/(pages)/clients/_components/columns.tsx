"use client"
'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { User, FileText, MapPin, Calendar, Eye, Edit, KeyIcon, Transgender, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n/client';
import { useRouter } from 'next/navigation';
import { useLocalizedPath } from '@/hooks/common/useLocalizedPath';
import { Button } from '@/components/ui/button';
import { Client } from '@/types/client.types';
import { Any } from '@/common/types/types';

export function useClientColumns() {
  const t = useI18n();

  const columns: ColumnDef<Client>[] = [
    {
      id: "client",
      header: ()=>(
        <div className="flex items-center gap-2">
          <UsersRound className="h-4 w-4 text-purple-500" />
          <span>{t('clients.list.client')}</span>
        </div>
      ),
      cell: ({ row }) => {
        const client = row.original;
        const fullName = `${client.first_name} ${client.infix || ''} ${client.last_name}`.trim();

        return (
          <div className="flex items-center gap-3">
            {client.profile_picture ? (
              <img
                src={client.profile_picture}
                alt={fullName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">
                {fullName}
              </span>
              <span className="text-sm text-gray-500">BSN: {client.bsn}</span>
            </div>
          </div>
        );
      },
    },
    {
      id: "age_gender",
      header: ()=>(
        <div className="flex items-center gap-2">
          <Transgender className="h-4 w-4 text-indigo-500" />
          <span>{t('clients.list.ageGender')}</span>
        </div>
      ),
      cell: ({ row }) => {
        const client = row.original;

        const calculateAge = (birthDate: string) => {
          const today = new Date();
          const birth = new Date(birthDate);
          let age = today.getFullYear() - birth.getFullYear();
          const monthDiff = today.getMonth() - birth.getMonth();

          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
          }

          return age;
        };

        const age = client.date_of_birth ? calculateAge(client.date_of_birth) : t('common.na');
        const gender = client.gender || t('clients.list.notSpecified');

        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{age} {t('clients.list.years')}</span>
            <span className="text-sm text-gray-500 capitalize">{gender}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "filenumber",
      header: () => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-cyan-500" />
          <span>{t('clients.list.fileNumber')}</span>
        </div>
      ),
      cell: ({ row }) => {
        const fileNumber = row.getValue("filenumber") as string;
        return (
          <div className="font-medium text-gray-800">
            {fileNumber || t('common.na')}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="flex items-center gap-2">
          <KeyIcon className="h-4 w-4 text-orange-500" />
          <span>{t('clients.list.status')}</span>
        </div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        const statusVariants: Record<string, string> = {
          active: "bg-green-100 text-green-800 border-green-200",
          inactive: "bg-gray-100 text-gray-800 border-gray-200",
          pending: "bg-amber-100 text-amber-800 border-amber-200",
          terminated: "bg-red-100 text-red-800 border-red-200",
          completed: "bg-blue-100 text-blue-800 border-blue-200",
        };

        const statusClass = statusVariants[status?.toLowerCase()] || statusVariants.inactive;

        return (
          <Badge variant="outline" className={`capitalize ${statusClass}`}>
            {status || "inactive"}
          </Badge>
        );
      },
    },
    {
      id: "location",
      header: () => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-red-500" />
          <span>{t('clients.list.location')}</span>
        </div>
      ),
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex flex-col">
            <span className="text-gray-800">{client.location_name || t('common.na')}</span>
            <span className="text-sm text-gray-500">{client.organisation || ""}</span>
          </div>
        );
      },
    },
    {
      id: "intake_date",
      header: () => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-amber-500" />
          <span>{t('clients.list.intakeDate')}</span>
        </div>
      ),
      cell: ({ row }) => {
        const client = row.original;
        const intakeDate = (client as Any).intake_date || client.created_at;

        return (
          <div className="text-gray-700">
            {intakeDate ? new Date(intakeDate).toLocaleDateString() : t('common.na')}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionCell row={row} />
    },
  ];

  return columns;
}
const ActionCell = ({ row }: { row: Row<Client> }) => {
  const client = row.original;
  const router = useRouter();
  const { currentLocale } = useLocalizedPath();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        onClick={() => router.push(`/${currentLocale}/clients/${client.id}/overview`)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-50"
        onClick={() => router.push(`/${currentLocale}/clients/${client.id}/update`)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      {/* <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
        onClick={() => console.log("Delete client:", client)}
      >
        <DeleteClientButton 
          client={client}
          onDelete={(id)=>deleteOne(id.toString())}
          />
        
      </Button> */}
    </div>
  );
};