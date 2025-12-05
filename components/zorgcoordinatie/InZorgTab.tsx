'use client';

import { useState, useMemo, useEffect } from "react";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Search, Download, Users, MapPin, TrendingUp, AlertTriangle, Bell, History, CheckSquare, Filter, FileSpreadsheet, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ClientDetailsDialog } from "./ClientDetailsDialog";
import { HerindicatieReminderDialog } from "./HerindicatieReminderDialog";
import { EditClientDialog } from "./EditClientDialog";
import { AuditLogDialog } from "./AuditLogDialog";
import { BulkActionsDialog } from "./BulkActionsDialog";
import { AdvancedSearchDialog } from "./AdvancedSearchDialog";
import { exportToExcel, exportToPDF } from "@/utils/pdfExportUtils";
import { formatClientDataForExport } from "@/utils/exportUtils";
import { useClient } from "@/hooks/client/use-client";
import { useDebounce } from "@/hooks/common/useDebounce";
import { Client as ClientType } from "@/types/client.types";
import { PAGE_SIZE } from "@/consts";
import { Any } from "@/common/types/types";

interface Client {
  id: string;
  naam: string;
  leeftijd: number;
  locatie: string;
  zorgvorm: "BW" | "KTC" | "BZW" | "Ambulant";
  hoofdaanbieder: string;
  startDatum: string;
  eindDatum: string;
  beschikkingsEenheid: "uren" | "weken" | "dagen";
  beschikkingsTotaal: number;
  beschikkingsGebruikt: number;
  herindicatie: string;
  alertStatus?: "verlopen" | "bijna_verlopen" | "ok";
  mentor?: string;
}

// Helper function to calculate age from date of birth
const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Helper function to map legal_measure to zorgvorm
const mapZorgvorm = (legalMeasure?: string): "BW" | "KTC" | "BZW" | "Ambulant" => {
  if (!legalMeasure) return "Ambulant";
  const measure = legalMeasure.toLowerCase();
  if (measure.includes("beschermd wonen") || measure.includes("bw")) return "BW";
  if (measure.includes("kortdurend") || measure.includes("ktc")) return "KTC";
  if (measure.includes("begeleid zelfstandig") || measure.includes("bzw")) return "BZW";
  return "Ambulant";
};

const zorgvormColors = {
  BW: "bg-blue-500",
  KTC: "bg-purple-500",
  BZW: "bg-green-500",
  Ambulant: "bg-orange-500",
};

const alertConfig = {
  verlopen: { label: "Verlopen", variant: "destructive" as const, icon: AlertTriangle },
  bijna_verlopen: { label: "Bijna Verlopen", variant: "secondary" as const, icon: AlertTriangle },
  ok: { label: "Actueel", variant: "default" as const, icon: TrendingUp },
};

export function InZorgTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [zorgvormFilter, setZorgvormFilter] = useState<string>("alle");
  const [locatieFilter, setLocatieFilter] = useState<string>("alle");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    page: 1,
    page_size: PAGE_SIZE,
    status: "In Care" as const,
    search: "",
  });

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: debouncedSearch,
      page: 1,
    }));
  }, [debouncedSearch]);

  const { clients, isLoading, setPage } = useClient(filters);

  // Map Client to component's Client interface
  const mappedClienten = useMemo<Client[]>(() => {
    if (!clients?.results) return [];

    return clients.results.map((client: ClientType) => {
      const leeftijd = client.date_of_birth ? calculateAge(client.date_of_birth) : 0;
      const zorgvorm = mapZorgvorm(client.legal_measure);
      
      // Calculate days since created_at for herindicatie approximation
      const createdDate = client.created_at ? new Date(client.created_at) : new Date();
      const daysSinceStart = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Approximate herindicatie date (1 year from start)
      const herindicatieDate = new Date(createdDate);
      herindicatieDate.setFullYear(herindicatieDate.getFullYear() + 1);
      const daysUntilHerindicatie = Math.floor((herindicatieDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      // Determine alert status based on days until herindicatie
      let alertStatus: "verlopen" | "bijna_verlopen" | "ok" = "ok";
      if (daysUntilHerindicatie < 0) {
        alertStatus = "verlopen";
      } else if (daysUntilHerindicatie < 30) {
        alertStatus = "bijna_verlopen";
      }

      // Format dates
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
      };

      return {
        id: client.id.toString(),
        naam: `${client.first_name} ${client.infix || ''} ${client.last_name}`.trim(),
        leeftijd,
        locatie: client.location_name || client.location || "Niet gespecificeerd",
        zorgvorm,
        hoofdaanbieder: client.organisation || "Niet gespecificeerd",
        startDatum: formatDate(createdDate),
        eindDatum: formatDate(herindicatieDate),
        beschikkingsEenheid: "weken" as const, // Default, as not available in API
        beschikkingsTotaal: 52, // Default, as not available in API
        beschikkingsGebruikt: Math.min(52, Math.floor(daysSinceStart / 7)), // Approximate based on days since start
        herindicatie: formatDate(herindicatieDate),
        alertStatus,
        mentor: undefined, // Not available in Client type
      };
    });
  }, [clients]);

  // Get unique locations for filter
  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>();
    mappedClienten.forEach(client => {
      if (client.locatie && client.locatie !== "Niet gespecificeerd") {
        locations.add(client.locatie);
      }
    });
    return Array.from(locations).sort();
  }, [mappedClienten]);

  const filteredClienten = useMemo(() => {
    return mappedClienten.filter((client) => {
    const matchesSearch = client.naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.hoofdaanbieder.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZorgvorm = zorgvormFilter === "alle" || client.zorgvorm === zorgvormFilter;
    const matchesLocatie = locatieFilter === "alle" || client.locatie === locatieFilter;
    return matchesSearch && matchesZorgvorm && matchesLocatie;
  });
  }, [mappedClienten, searchQuery, zorgvormFilter, locatieFilter]);

  const stats = useMemo(() => {
    return {
      totaal: mappedClienten.length,
      herindicaties: mappedClienten.filter(c => c.alertStatus !== "ok").length,
      gemiddeldeGebruik: mappedClienten.length > 0
        ? Math.round(mappedClienten.reduce((acc, c) => acc + (c.beschikkingsGebruikt / c.beschikkingsTotaal * 100), 0) / mappedClienten.length)
        : 0,
  };
  }, [mappedClienten]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredClienten.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredClienten.map((c) => c.id));
    }
  };

  const handleSelectClient = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleExport = (type: "excel" | "pdf") => {
    const dataToExport = formatClientDataForExport(filteredClienten);
    const filename = `clienten-export-${new Date().toISOString().split('T')[0]}`;
    
    if (type === "excel") {
      exportToExcel(dataToExport, filename);
    } else {
      exportToPDF(dataToExport, filename, "Cliënten in Zorg");
    }
  };

  const handleAdvancedSearch = (filters: Any) => {
    console.log("Geavanceerde zoek filters:", filters);
    // Implementeer filtering logica hier
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Actieve Cliënten</p>
              <p className="text-2xl font-bold mt-1">{stats.totaal}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Herindicaties Nodig</p>
              <p className="text-2xl font-bold mt-1">{stats.herindicaties}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gem. Gebruik</p>
              <p className="text-2xl font-bold mt-1">{stats.gemiddeldeGebruik}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoek op naam of hoofdaanbieder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={zorgvormFilter} onValueChange={setZorgvormFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Zorgvorm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle zorgvormen</SelectItem>
              <SelectItem value="BW">BW</SelectItem>
              <SelectItem value="KTC">KTC</SelectItem>
              <SelectItem value="BZW">BZW</SelectItem>
              <SelectItem value="Ambulant">Ambulant</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locatieFilter} onValueChange={setLocatieFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Locatie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle locaties</SelectItem>
              {uniqueLocations.map((locatie) => (
                <SelectItem key={locatie} value={locatie}>
                  {locatie}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <PrimaryButton
            text="Geavanceerd"
            onClick={() => setAdvancedSearchOpen(true)}
            icon={Filter}
            className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white"
            disabled={false}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {selectedIds.length > 0 && (
            <>
              <PrimaryButton
                text={`Bulk Acties (${selectedIds.length})`}
                onClick={() => setBulkActionsOpen(true)}
                icon={CheckSquare}
                className="bg-purple-100 text-purple-500 hover:bg-purple-500 hover:text-white"
                disabled={false}
              />
              <PrimaryButton
                text="Deselecteer"
                onClick={() => setSelectedIds([])}
                className="bg-gray-100 text-gray-500 hover:bg-gray-500 hover:text-white"
                disabled={false}
              />
            </>
          )}
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
        </div>
      </div>

      {/* Clients List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">Laden...</div>
      ) : filteredClienten.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Geen cliënten gevonden
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-4">
        {filteredClienten.map((client) => {
          const gebruikPercentage = (client.beschikkingsGebruikt / client.beschikkingsTotaal) * 100;
          const alertConf = client.alertStatus ? alertConfig[client.alertStatus] : null;
          const AlertIcon = alertConf?.icon;
          
          const eenheidLabel = client.beschikkingsEenheid === "uren" ? "uren" : 
                               client.beschikkingsEenheid === "weken" ? "weken" : "dagen";
          
          return (
            <Card key={client.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      checked={selectedIds.includes(client.id)}
                      onCheckedChange={() => handleSelectClient(client.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{client.naam}</h3>
                        <Badge className={zorgvormColors[client.zorgvorm]}>
                          {client.zorgvorm}
                        </Badge>
                        {alertConf && AlertIcon && (
                          <Badge variant={alertConf.variant} className="gap-1">
                            <AlertIcon className="w-3 h-3" />
                            {alertConf.label}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {client.leeftijd} jaar • {client.locatie}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Hoofdaanbieder:</span>
                          <p className="font-medium text-sm">{client.hoofdaanbieder}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Zorgperiode:</span>
                          <p className="font-medium text-sm">{client.startDatum} - {client.eindDatum}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Herindicatie:</span>
                          <p className="font-medium text-sm">{client.herindicatie}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Mentor:</span>
                          <p className="font-medium text-sm">{client.mentor || "Niet toegewezen"}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            {client.beschikkingsEenheid === "uren" ? "Urengebruik:" : 
                             client.beschikkingsEenheid === "weken" ? "Weken:" : "Dagen:"}
                          </span>
                          <p className="font-medium text-sm">
                            {client.beschikkingsGebruikt} / {client.beschikkingsTotaal} {eenheidLabel}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">
                            Beschikking ({eenheidLabel})
                          </span>
                          <span className="font-medium">{Math.round(gebruikPercentage)}%</span>
                        </div>
                        <Progress value={gebruikPercentage} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <PrimaryButton
                      text="Historie"
                      onClick={() => {
                        setSelectedClient(client);
                        setAuditOpen(true);
                      }}
                      icon={History}
                      className="flex-1 lg:flex-none bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm px-3 py-2"
                      disabled={false}
                    />
                    <PrimaryButton
                      text="Herinnering"
                      onClick={() => {
                        setSelectedClient(client);
                        setReminderOpen(true);
                      }}
                      icon={Bell}
                      className="flex-1 lg:flex-none bg-yellow-100 text-yellow-500 hover:bg-yellow-500 hover:text-white text-sm px-3 py-2"
                      disabled={false}
                    />
                    <PrimaryButton
                      text="Dossier"
                      onClick={() => {
                        setSelectedClient(client);
                        setDetailsOpen(true);
                      }}
                      className="flex-1 lg:flex-none bg-green-100 text-green-500 hover:bg-green-500 hover:text-white text-sm px-3 py-2"
                      disabled={false}
                    />
                    <PrimaryButton
                      text="Bewerken"
                      onClick={() => {
                        setSelectedClient(client);
                        setEditOpen(true);
                      }}
                      className="flex-1 lg:flex-none bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white text-sm px-3 py-2"
                      disabled={false}
                    />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      )}

      <ClientDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        client={selectedClient}
      />

      <HerindicatieReminderDialog
        open={reminderOpen}
        onOpenChange={setReminderOpen}
        client={selectedClient}
      />

      <EditClientDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        client={selectedClient}
        onSave={(clientId, mentor) => {
          console.log(`Mentor ${mentor} toegewezen aan cliënt ${clientId}`);
        }}
      />

      <AuditLogDialog
        open={auditOpen}
        onOpenChange={setAuditOpen}
        clientId={selectedClient?.id}
      />

      <BulkActionsDialog
        open={bulkActionsOpen}
        onOpenChange={setBulkActionsOpen}
        selectedIds={selectedIds}
        onComplete={() => {
          setSelectedIds([]);
        }}
      />

      <AdvancedSearchDialog
        open={advancedSearchOpen}
        onOpenChange={setAdvancedSearchOpen}
        onSearch={handleAdvancedSearch}
      />
    </div>
  );
}
