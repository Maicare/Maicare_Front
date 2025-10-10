"use client";
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { useClient } from '@/hooks/client/use-client';
import { useContact } from '@/hooks/contact/use-contact';
import { cn } from '@/utils/cn';
import { InvoiceSearchParams } from '@/hooks/invoice/use-invoive';

interface TableFiltersProps {
  filters: InvoiceSearchParams;
  setFilters: (filters: InvoiceSearchParams) => void;
  handleAdd: () => void;
}

// Status opties
const STATUS_OPTIONS = [
  { value: 'outstanding', label: 'Openstaand' },
  { value: 'partially_paid', label: 'Gedeeltelijk Betaald' },
  { value: 'paid', label: 'Betaald' },
  { value: 'expired', label: 'Verlopen' },
  { value: 'overpaid', label: 'Overbetaald' },
  { value: 'imported', label: 'Geïmporteerd' },
  { value: 'concept', label: 'Concept' },
];

const TableFilters = ({ filters,  setFilters }: TableFiltersProps) => {

    const {clients} = useClient({autoFetch:true});
    const {contacts} = useContact({autoFetch:true}); 

  const handleDateChange = (date: Date | undefined, type: 'start_date' | 'end_date') => {
    if (date) {
      setFilters({ ...filters, [type]: format(date, 'yyyy-MM-dd') });
    } else {
      const newFilters = { ...filters };
      delete newFilters[type];
      setFilters(newFilters);
    }
  };

  const getDateFromString = (dateString?: string): Date | undefined => {
    return dateString ? new Date(dateString) : undefined;
  };
  const resetFilters = () => {
    setFilters({
      search: '',
      client_id: undefined,
      sender_id: undefined,
      status: undefined,
      start_date: undefined,
      end_date: undefined,
    });
  };

  // Controleer of er actieve filters zijn
  const hasActiveFilters = Object.values(filters).some(
    value => value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-[#18181b] rounded-lg border border-muted mb-6">
      {/* Zoek Input */}
      <Input
        type="search"
        placeholder="Zoek facturen..."
        className="w-60 dark:bg-[#18181b] dark:border-white focus:ring-indigo-800"
        value={filters.search || ''}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />

      {/* Cliënt Select */}
      <Select
        value={filters.client_id?.toString() || ''}
        onValueChange={(value) => 
          setFilters({ ...filters, client_id: value ? parseInt(value) : undefined })
        }
      >
        <SelectTrigger className="w-60 dark:bg-[#18181b] dark:border-white focus:ring-indigo-800">
          <SelectValue placeholder="Selecteer Cliënt" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-[#18181b] dark:border-black">
          <SelectGroup>
            <SelectLabel>Cliënten</SelectLabel>
            {clients?.results.map((client) => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.first_name} {client.last_name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Verzender Select */}
      <Select
        value={filters.sender_id?.toString() || ''}
        onValueChange={(value) => 
          setFilters({ ...filters, sender_id: value ? parseInt(value) : undefined })
        }
      >
        <SelectTrigger className="w-60 dark:bg-[#18181b] dark:border-white focus:ring-indigo-800">
          <SelectValue placeholder="Selecteer Verzender" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-[#18181b] dark:border-black">
          <SelectGroup>
            <SelectLabel>Verzenders</SelectLabel>
            {contacts?.results.map((sender) => (
              <SelectItem key={sender.id} value={sender.id.toString()}>
                {sender.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Status Select */}
      <Select
        value={filters.status || ''}
        onValueChange={(value) => 
          setFilters({ ...filters, status: value || undefined })
        }
      >
        <SelectTrigger className="w-60 dark:bg-[#18181b] dark:border-white focus:ring-indigo-800">
          <SelectValue placeholder="Selecteer Status" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-[#18181b] dark:border-black">
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Datum Bereik */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-40 justify-start text-left font-normal dark:bg-[#18181b] dark:border-white",
                !filters.start_date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.start_date ? format(new Date(filters.start_date), 'PPP') : 'Startdatum'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={getDateFromString(filters.start_date)}
              onSelect={(date) => handleDateChange(date, 'start_date')}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span className="text-muted-foreground">tot</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-40 justify-start text-left font-normal dark:bg-[#18181b] dark:border-white",
                !filters.end_date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.end_date ? format(new Date(filters.end_date), 'PPP') : 'Einddatum'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={getDateFromString(filters.end_date)}
              onSelect={(date) => handleDateChange(date, 'end_date')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* Reset Filters Knop */}
      <Button
        onClick={resetFilters}
        variant="outline"
        disabled={!hasActiveFilters}
        className="dark:bg-[#18181b] dark:border-white dark:hover:bg-gray-800"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Resetten
      </Button>
    </div>
  );
};

export default TableFilters;