'use client';

import { useState, useEffect, useMemo } from "react";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Plus, Search, Download, AlertTriangle, Shield, Activity, Pill } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IncidentDialog } from "./IncidentDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClient } from "@/hooks/client/use-client";
import { useDebounce } from "@/hooks/common/useDebounce";
import { Incident as ApiIncident } from "@/types/incident.types";
import { Client } from "@/types/client.types";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import Pagination from "@/components/common/Pagination/Pagination";
import { PAGE_SIZE } from "@/consts";

interface Incident {
  id: string;
  client_naam: string;
  datum: string;
  tijd: string;
  type: "agressie" | "medicatie" | "veiligheid" | "ongewenst_gedrag";
  ernst: "laag" | "middel" | "hoog";
  status: "nieuw" | "in_onderzoek" | "afgerond";
  locatie: string;
  medewerker: string;
  beschrijving: string;
  genomen_actie: string;
}


const typeConfig = {
  agressie: { label: "Agressie", icon: AlertTriangle, color: "bg-red-500" },
  medicatie: { label: "Medicatie", icon: Pill, color: "bg-blue-500" },
  veiligheid: { label: "Veiligheid", icon: Shield, color: "bg-orange-500" },
  ongewenst_gedrag: { label: "Ongewenst Gedrag", icon: Activity, color: "bg-purple-500" },
};

const ernstConfig = {
  laag: { label: "Laag", variant: "outline" as const },
  middel: { label: "Middel", variant: "secondary" as const },
  hoog: { label: "Hoog", variant: "destructive" as const },
};

const statusConfig = {
  nieuw: { label: "Nieuw", variant: "default" as const },
  in_onderzoek: { label: "In Onderzoek", variant: "secondary" as const },
  afgerond: { label: "Afgerond", variant: "outline" as const },
};

// Helper functions to map API incident data to component interface
const mapIncidentType = (apiIncident: ApiIncident): "agressie" | "medicatie" | "veiligheid" | "ongewenst_gedrag" => {
  const type = apiIncident.incident_type?.toLowerCase();
  if (type?.includes('agressie') || type?.includes('violence') || apiIncident.violence) return "agressie";
  if (type?.includes('medicatie') || type?.includes('medicine') || apiIncident.medicines) return "medicatie";
  if (type?.includes('veiligheid') || type?.includes('safety') || apiIncident.fire_water_damage || apiIncident.accident) return "veiligheid";
  return "ongewenst_gedrag";
};

const mapIncidentSeverity = (severity?: string): "laag" | "middel" | "hoog" => {
  const sev = severity?.toLowerCase();
  if (sev?.includes('high') || sev?.includes('hoog')) return "hoog";
  if (sev?.includes('medium') || sev?.includes('middel')) return "middel";
  return "laag";
};

const mapIncidentStatus = (apiIncident: ApiIncident): "nieuw" | "in_onderzoek" | "afgerond" => {
  // Since API doesn't have explicit status, we'll derive it from other fields
  if (apiIncident.succession && apiIncident.succession.length > 0) return "afgerond";
  if (apiIncident.incident_taken_measures || apiIncident.needed_consultation) return "in_onderzoek";
  return "nieuw";
};

export function IncidentenTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("alle");
  const [ernstFilter, setErnstFilter] = useState<string>("alle");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | undefined>();
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [incidentsLoading, setIncidentsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Use proper pagination for clients
  const { clients, isLoading: clientsLoading, page, setPage } = useClient({
    autoFetch: true,
    page_size: PAGE_SIZE,
    page: 1
  });

  // Fetch incidents for all clients
  useEffect(() => {
    const fetchAllIncidents = async () => {
      if (!clients?.results || clients.results.length === 0) return;
      
      setIncidentsLoading(true);
      try {
        const incidentPromises = clients.results.map(async (client: Client) => {
          try {
            const response = await api.get(
              `${ApiRoutes.Client.Incident.ReadAll.replace("{id}", client.id)}?page=1&page_size=100`
            );
            
            if (response.data?.data?.results) {
              return response.data.data.results.map((apiIncident: ApiIncident) => ({
                id: apiIncident.id.toString(),
                client_naam: `${client.first_name} ${client.last_name}`.trim(),
                datum: apiIncident.incident_date ? format(new Date(apiIncident.incident_date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                tijd: apiIncident.runtime_incident || format(new Date(), 'HH:mm'),
                type: mapIncidentType(apiIncident),
                ernst: mapIncidentSeverity(apiIncident.severity_of_incident),
                status: mapIncidentStatus(apiIncident),
                locatie: client.location_name || client.location || "Niet gespecificeerd",
                medewerker: `${apiIncident.employee_first_name || ''} ${apiIncident.employee_last_name || ''}`.trim() || "Niet gespecificeerd",
                beschrijving: apiIncident.incident_explanation || "Geen beschrijving beschikbaar",
                genomen_actie: apiIncident.incident_taken_measures || "Geen actie geregistreerd"
              }));
            }
            return [];
          } catch (error) {
            console.error(`Error fetching incidents for client ${client.id}:`, error);
            return [];
    }
        });

        const incidentArrays = await Promise.all(incidentPromises);
        const flattenedIncidents = incidentArrays.flat();
        
        // Sort by date (newest first)
        flattenedIncidents.sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());
        
        setAllIncidents(flattenedIncidents);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        setIncidentsLoading(false);
      }
    };

    fetchAllIncidents();
  }, [clients]);

  const filteredIncidenten = useMemo(() => {
    return allIncidents.filter((incident) => {
      const matchesSearch = incident.client_naam.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        incident.locatie.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesType = typeFilter === "alle" || incident.type === typeFilter;
    const matchesErnst = ernstFilter === "alle" || incident.ernst === ernstFilter;
    return matchesSearch && matchesType && matchesErnst;
  });
  }, [allIncidents, debouncedSearch, typeFilter, ernstFilter]);

  const stats = {
    totaal: allIncidents.length,
    hoog: allIncidents.filter(i => i.ernst === "hoog").length,
    openstaand: allIncidents.filter(i => i.status !== "afgerond").length,
  };

  const isLoading = clientsLoading || incidentsLoading;

  // Calculate pagination for clients
  const totalPages = clients ? Math.ceil(clients.count / (clients.page_size || PAGE_SIZE)) : 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAdd = () => {
    setSelectedIncident(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (incident: Incident) => {
    setSelectedIncident(incident);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Totaal Incidenten</p>
              <p className="text-2xl font-bold mt-1">{stats.totaal}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hoge Ernst</p>
              <p className="text-2xl font-bold mt-1">{stats.hoog}</p>
            </div>
            <Shield className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Openstaand</p>
              <p className="text-2xl font-bold mt-1">{stats.openstaand}</p>
            </div>
            <Activity className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoek op naam of locatie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle types</SelectItem>
              <SelectItem value="agressie">Agressie</SelectItem>
              <SelectItem value="medicatie">Medicatie</SelectItem>
              <SelectItem value="veiligheid">Veiligheid</SelectItem>
              <SelectItem value="ongewenst_gedrag">Ongewenst Gedrag</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ernstFilter} onValueChange={setErnstFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Ernst" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle ernst</SelectItem>
              <SelectItem value="laag">Laag</SelectItem>
              <SelectItem value="middel">Middel</SelectItem>
              <SelectItem value="hoog">Hoog</SelectItem>
            </SelectContent>
          </Select>
          <PrimaryButton
            text="Exporteren"
            icon={Download}
            className="bg-green-100 text-green-500 hover:bg-green-500 hover:text-white"
            disabled={false}
          />
        </div>
      </div>

      {/* Incidenten List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">Laden...</div>
      ) : filteredIncidenten.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Geen incidenten gevonden
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-4">
        {filteredIncidenten.map((incident) => {
          const typeConf = typeConfig[incident.type];
          const ernstConf = ernstConfig[incident.ernst];
          const statusConf = statusConfig[incident.status];
          const TypeIcon = typeConf.icon;
          
          return (
            <Card key={incident.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold text-lg">{incident.client_naam}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(incident.datum).toLocaleDateString("nl-NL")} {incident.tijd}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={typeConf.color}>
                        {typeConf.label}
                      </Badge>
                      <Badge variant={ernstConf.variant}>
                        Ernst: {ernstConf.label}
                      </Badge>
                      <Badge variant={statusConf.variant}>
                        {statusConf.label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Locatie:</span>
                      <p className="font-medium">{incident.locatie}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Medewerker:</span>
                      <p className="font-medium">{incident.medewerker}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Beschrijving:</p>
                    <p className="text-sm">{incident.beschrijving}</p>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <PrimaryButton
                    text="Details"
                    className="flex-1 lg:flex-none bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm px-3 py-2"
                    disabled={false}
                  />
                  <PrimaryButton
                    text="Behandelen"
                    onClick={() => handleEdit(incident)}
                    className="flex-1 lg:flex-none bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white text-sm px-3 py-2"
                    disabled={false}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            page={page}
            totalPages={totalPages}
            onClick={handlePageChange}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Add New Incident Button (Fixed Bottom Right) */}
      <div className="fixed bottom-6 right-6">
        <PrimaryButton
          text="Nieuw Incident"
          onClick={handleAdd}
          disabled={false}
          icon={Plus}
          animation="animate-bounce"
          className="shadow-lg bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white px-6 py-3"
        />
      </div>

      <IncidentDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        incident={selectedIncident}
      />
    </div>
  );
}
