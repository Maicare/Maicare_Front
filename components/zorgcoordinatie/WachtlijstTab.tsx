'use client';

import { useState, useEffect, useMemo } from "react";
import { Search, UserPlus, Clock, AlertCircle, CheckCircle2, ArrowRight, Download, FileSpreadsheet, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/zorgcoordinatie/StatCard";
import { EmptyState } from "@/components/zorgcoordinatie/EmptyState";
import { ToevoegenWachtlijstDialog } from "./ToevoegenWachtlijstDialog";
import { useSnackbar } from "notistack";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { exportToExcel, exportToPDF } from "@/utils/pdfExportUtils";
import { useClient } from "@/hooks/client/use-client";
import { useDebounce } from "@/hooks/common/useDebounce";
import { Client } from "@/types/client.types";
import { PAGE_SIZE } from "@/consts";

interface WachtlijstItem {
  id: string;
  client_naam: string;
  geboortedatum: string;
  intake_datum: string;
  gewenste_zorgvorm: string;
  gewenste_locatie: string;
  prioriteit: string;
  status: string;
  opmerkingen?: string;
  toegevoegd_op: string;
}

const prioriteitConfig = {
  hoog: { label: "Hoog", variant: "destructive" as const, color: "text-red-600" },
  normaal: { label: "Normaal", variant: "secondary" as const, color: "text-blue-600" },
  laag: { label: "Laag", variant: "outline" as const, color: "text-gray-600" },
};

export function WachtlijstTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [prioriteitFilter, setPrioriteitFilter] = useState<string>("alle");
  const [locatieFilter, setLocatieFilter] = useState<string>("alle");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const debouncedSearch = useDebounce(searchQuery, 500);
  const [filters, setFilters] = useState({
    page: 1,
    page_size: PAGE_SIZE,
    status: "On Waiting List" as const,
    search: debouncedSearch,
  });

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: debouncedSearch,
      page: 1,
    }));
  }, [debouncedSearch]);

  const { clients, isLoading, updateStatus, setPage } = useClient(filters);

  // Map Client to WachtlijstItem
  const wachtlijstItems = useMemo<WachtlijstItem[]>(() => {
    if (!clients?.results) return [];
    
    return clients.results.map((client: Client) => {
      // Derive priority from urgency or default to "normaal"
      // Since Client doesn't have priority, we'll default to "normaal"
      // You could potentially derive this from other fields if available
      const prioriteit = "normaal"; // Default, as Client type doesn't have priority field
      
      return {
        id: client.id.toString(),
        client_naam: `${client.first_name} ${client.last_name}`.trim(),
        geboortedatum: client.date_of_birth,
        intake_datum: client.created_at || new Date().toISOString(), // Use created_at as fallback
        gewenste_zorgvorm: client.legal_measure || "Niet gespecificeerd", // Use legal_measure as approximation
        gewenste_locatie: client.location_name || client.location || "Niet gespecificeerd",
        prioriteit,
        status: client.status || "On Waiting List",
        opmerkingen: client.departure_reason || undefined, // Optional field
        toegevoegd_op: client.created_at,
      };
    });
  }, [clients]);

  const handlePlaatsInZorg = async (item: WachtlijstItem) => {
    try {
      await updateStatus(
        item.id,
        {
          status: "In Care",
          schedueled: false,
          reason: "Geplaatst vanuit wachtlijst",
        },
        { displayProgress: true, displaySuccess: true }
      );

      enqueueSnackbar(`${item.client_naam} is nu in zorg geplaatst`, { variant: "success" });
      // Item will be automatically removed from list since status changed to "In Care"
      // Force refetch by toggling page
      setFilters(prev => ({ ...prev, page: prev.page === 1 ? 2 : 1 }));
      setTimeout(() => setFilters(prev => ({ ...prev, page: 1 })), 100);
    } catch (error) {
      console.error('Error placing in care:', error);
      // Error message is already shown by updateStatus hook
    }
  };

  const handleExport = (type: "excel" | "pdf") => {
    const dataToExport = filteredItems.map((item) => ({
      "Client Naam": item.client_naam,
      "Geboortedatum": item.geboortedatum,
      "Gewenste Zorgvorm": item.gewenste_zorgvorm,
      "Gewenste Locatie": item.gewenste_locatie,
      "Intake Datum": item.intake_datum,
      "Prioriteit": prioriteitConfig[item.prioriteit as keyof typeof prioriteitConfig]?.label || item.prioriteit,
      "Toegevoegd Op": new Date(item.toegevoegd_op).toLocaleDateString('nl-NL'),
      "Dagen op Wachtlijst": Math.floor((new Date().getTime() - new Date(item.toegevoegd_op).getTime()) / (1000 * 60 * 60 * 24)),
      "Opmerkingen": item.opmerkingen || "",
    }));
    
    const filename = `wachtlijst-export-${new Date().toISOString().split('T')[0]}`;
    
    if (type === "excel") {
      exportToExcel(dataToExport, filename);
    } else {
      exportToPDF(dataToExport, filename, "Wachtlijst Rapport");
    }
  };

  const filteredItems = wachtlijstItems.filter(item => {
    const matchesSearch = item.client_naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.gewenste_locatie.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrioriteit = prioriteitFilter === "alle" || item.prioriteit === prioriteitFilter;
    const matchesLocatie = locatieFilter === "alle" || item.gewenste_locatie === locatieFilter;
    return matchesSearch && matchesPrioriteit && matchesLocatie;
  });

  const stats = {
    totaal: wachtlijstItems.length,
    hoog: wachtlijstItems.filter(i => i.prioriteit === 'hoog').length,
    normaal: wachtlijstItems.filter(i => i.prioriteit === 'normaal').length,
    laag: wachtlijstItems.filter(i => i.prioriteit === 'laag').length,
  };

  const locaties = Array.from(new Set(wachtlijstItems.map(i => i.gewenste_locatie)));

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Totaal op wachtlijst"
          value={stats.totaal}
          subtitle="Actieve wachtenden"
          icon={Clock}
          variant="blue"
        />
        <StatCard
          title="Hoge prioriteit"
          value={stats.hoog}
          subtitle="Spoedeisend"
          icon={AlertCircle}
          variant="orange"
        />
        <StatCard
          title="Normale prioriteit"
          value={stats.normaal}
          subtitle="Regulier"
          icon={CheckCircle2}
          variant="green"
        />
        <StatCard
          title="Lage prioriteit"
          value={stats.laag}
          subtitle="Niet urgent"
          icon={Clock}
          variant="purple"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Zoek op naam of locatie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={prioriteitFilter} onValueChange={setPrioriteitFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Prioriteit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle prioriteiten</SelectItem>
              <SelectItem value="hoog">Hoog</SelectItem>
              <SelectItem value="normaal">Normaal</SelectItem>
              <SelectItem value="laag">Laag</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locatieFilter} onValueChange={setLocatieFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Locatie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle locaties</SelectItem>
              {locaties.map(locatie => (
                <SelectItem key={locatie} value={locatie}>{locatie}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <PrimaryButton
                text="Exporteren"
                icon={Download}
                className="bg-green-100 text-green-500 hover:bg-green-500 hover:text-white"
                disabled={false}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export naar Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FileText className="w-4 h-4 mr-2" />
                Export naar PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <PrimaryButton
            text="Toevoegen aan wachtlijst"
            onClick={() => setDialogOpen(true)}
            disabled={false}
            icon={UserPlus}
            animation="animate-bounce"
            className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white"
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          message="Geen cliënten op de wachtlijst"
          actionLabel="Voeg cliënt toe"
          onAction={() => setDialogOpen(true)}
          icon={Clock}
        />
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{item.client_naam}</h3>
                      <p className="text-sm text-muted-foreground">
                        Geboortedatum: {format(new Date(item.geboortedatum), 'dd MMMM yyyy', { locale: nl })}
                      </p>
                    </div>
                    <Badge variant={prioriteitConfig[item.prioriteit as keyof typeof prioriteitConfig].variant}>
                      {prioriteitConfig[item.prioriteit as keyof typeof prioriteitConfig].label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Gewenste zorgvorm</p>
                      <p className="font-medium">{item.gewenste_zorgvorm}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Gewenste locatie</p>
                      <p className="font-medium">{item.gewenste_locatie}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Intake datum</p>
                      <p className="font-medium">{format(new Date(item.intake_datum), 'dd MMM yyyy', { locale: nl })}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Op wachtlijst sinds</p>
                      <p className="font-medium">{format(new Date(item.toegevoegd_op), 'dd MMM yyyy', { locale: nl })}</p>
                    </div>
                  </div>

                  {item.opmerkingen && (
                    <div className="text-sm">
                      <p className="text-muted-foreground">Opmerkingen</p>
                      <p className="mt-1">{item.opmerkingen}</p>
                    </div>
                  )}
                </div>

                <PrimaryButton
                  text="Plaats in zorg"
                  onClick={() => handlePlaatsInZorg(item)}
                  icon={ArrowRight}
                  className="ml-4 bg-green-100 text-green-500 hover:bg-green-500 hover:text-white text-sm px-3 py-2"
                  disabled={false}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      <ToevoegenWachtlijstDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          // Force refetch by toggling page
          setFilters(prev => ({ ...prev, page: prev.page === 1 ? 2 : 1 }));
          setTimeout(() => setFilters(prev => ({ ...prev, page: 1 })), 100);
        }}
      />
    </div>
  );
}
