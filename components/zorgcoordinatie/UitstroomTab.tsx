"use client";
import { useState, useMemo, useEffect } from "react";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Plus, Search, Download, LogOut, CheckCircle, FileText, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { UitstroomDialog } from "./UitstroomDialog";
import { exportToExcel, exportToPDF, exportAfsluitrapportToPDF } from "@/utils/pdfExportUtils";
import { useSnackbar } from "notistack";
import { useECR } from "@/hooks/ecr/use-ecr";
import { Any } from "@/common/types/types";

interface Id {
  id: string;
}

interface ClientData {
  contract_end_date: string;
  contract_status: string;
  current_status: string;
  departure_reason: string;
  discharge_type: string;
  first_name: string;
  follow_up_plan: string;
  id: string;
  last_name: string;
  scheduled_status: string;
  status_change_date: string;
  status_change_reason: string;
}

interface Uitstroom {
  id: string;
  clientNaam: string;
  uitstroomDatum: string;
  reden: "volgens_plan" | "overeenstemming" | "eenzijdig_client" | "eenzijdig_aanbieder" | "externe_omstandigheden" | "anders";
  naarOrganisatie?: string;
  status: "in_behandeling" | "afgerond" | "bevestigd";
  coordinator: string;
  rapportStatus: "compleet" | "ontbreekt";
  opmerkingen?: string;
}

// Dummy data based on the provided type
const dummyClients: ClientData[] = [
  {
    contract_end_date: "2024-12-31",
    contract_status: "completed",
    current_status: "Out Of Care",
    departure_reason: "volgens_plan",
    discharge_type: "regular",
    first_name: "Jan",
    follow_up_plan: "Follow-up plan A",
    id: { id: "1" },
    last_name: "Jansen",
    scheduled_status: "completed",
    status_change_date: "2024-01-15",
    status_change_reason: "Treatment completed"
  },
  {
    contract_end_date: "2024-11-30",
    contract_status: "terminated",
    current_status: "Out Of Care",
    departure_reason: "eenzijdig_client",
    discharge_type: "early",
    first_name: "Maria",
    follow_up_plan: "Follow-up plan B",
    id: { id: "2" },
    last_name: "de Vries",
    scheduled_status: "terminated",
    status_change_date: "2024-01-10",
    status_change_reason: "Client decision"
  },
  {
    contract_end_date: "2024-10-31",
    contract_status: "completed",
    current_status: "Out Of Care",
    departure_reason: "overeenstemming",
    discharge_type: "mutual",
    first_name: "Peter",
    follow_up_plan: "Follow-up plan C",
    id: { id: "3" },
    last_name: "Bakker",
    scheduled_status: "completed",
    status_change_date: "2024-01-05",
    status_change_reason: "Mutual agreement"
  },
  {
    contract_end_date: "2024-09-30",
    contract_status: "terminated",
    current_status: "Out Of Care",
    departure_reason: "eenzijdig_aanbieder",
    discharge_type: "provider_decision",
    first_name: "Sarah",
    follow_up_plan: "Follow-up plan D",
    id: { id: "4" },
    last_name: "van Dijk",
    scheduled_status: "terminated",
    status_change_date: "2024-01-01",
    status_change_reason: "Provider decision"
  },
  {
    contract_end_date: "2024-08-31",
    contract_status: "completed",
    current_status: "Out Of Care",
    departure_reason: "externe_omstandigheden",
    discharge_type: "external",
    first_name: "Thomas",
    follow_up_plan: "Follow-up plan E",
    id: { id: "5" },
    last_name: "Visser",
    scheduled_status: "completed",
    status_change_date: "2023-12-28",
    status_change_reason: "External circumstances"
  }
];

// Helper function to map departure_reason to reden type
const mapReden = (departureReason?: string): "volgens_plan" | "overeenstemming" | "eenzijdig_client" | "eenzijdig_aanbieder" | "externe_omstandigheden" | "anders" => {
  if (!departureReason) return "anders";
  const reason = departureReason.toLowerCase();
  if (reason.includes("plan") || reason.includes("volgens")) return "volgens_plan";
  if (reason.includes("overeenstemming") || reason.includes("overeen")) return "overeenstemming";
  if (reason.includes("client") || reason.includes("cliënt")) return "eenzijdig_client";
  if (reason.includes("aanbieder") || reason.includes("organisatie")) return "eenzijdig_aanbieder";
  if (reason.includes("externe") || reason.includes("omstandigheden")) return "externe_omstandigheden";
  return "anders";
};

// Helper function to format date
const formatDate = (dateString?: string): string => {
  if (!dateString) return new Date().toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return new Date(dateString).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const redenConfig = {
  volgens_plan: { label: "Volgens plan", color: "bg-green-500" },
  overeenstemming: { label: "In overeenstemming", color: "bg-blue-500" },
  eenzijdig_client: { label: "Eenzijdig door cliënt", color: "bg-yellow-500" },
  eenzijdig_aanbieder: { label: "Eenzijdig door aanbieder", color: "bg-orange-500" },
  externe_omstandigheden: { label: "Externe omstandigheden", color: "bg-purple-500" },
  anders: { label: "Anders", color: "bg-gray-500" },
};

const statusConfig = {
  in_behandeling: { label: "In Behandeling", variant: "secondary" as const, icon: FileText },
  afgerond: { label: "Afgerond", variant: "default" as const, icon: CheckCircle },
  bevestigd: { label: "Bevestigd", variant: "default" as const, icon: CheckCircle },
};

export function UitstroomTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [redenFilter, setRedenFilter] = useState<string>("alle");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dischargeOverview, setDischargeOverview] = useState<ClientData[]>([]);
  const [selectedUitstroom, setSelectedUitstroom] = useState<Uitstroom | undefined>();
  const { enqueueSnackbar } = useSnackbar();
  const {readDischargeOverview} = useECR();
  useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const dischargeData = await readDischargeOverview();
          setDischargeOverview(dischargeData.results);
          
        } catch (error) {
          console.error("Kon dashboard data niet ophalen:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  // Map ClientData to Uitstroom interface using dummy data
  const mappedUitstromen = useMemo<Uitstroom[]>(() => {
    return dischargeOverview.map((client: ClientData) => {
      const reden = mapReden(client.departure_reason);
      
      const uitstroomDatum = formatDate(client.status_change_date);
      
      // Determine status based on contract_status
      let status: "in_behandeling" | "afgerond" | "bevestigd" = "in_behandeling";
      if (client.contract_status === "completed") {
        status = "afgerond";
      }

      // Random coordinator names for demo
      const coordinators = ["Anna de Wit", "Mark Smit", "Lisa Jansen", "David Bakker"];
      const randomCoordinator = coordinators[Math.floor(Math.random() * coordinators.length)];

      return {
        id: client.id,
        clientNaam: `${client.first_name} ${client.last_name}`.trim(),
        uitstroomDatum,
        reden,
        naarOrganisatie: `Organisatie ${client.last_name}`,
        status,
        coordinator: randomCoordinator,
        rapportStatus: Math.random() > 0.3 ? "compleet" as const : "ontbreekt" as const,
        opmerkingen: client.follow_up_plan || undefined,
      };
    });
  }, []);

  const filteredUitstromen = useMemo(() => {
    return mappedUitstromen.filter((uitstroom) => {
      const matchesSearch = uitstroom.clientNaam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (uitstroom.naarOrganisatie && uitstroom.naarOrganisatie.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesReden = redenFilter === "alle" || uitstroom.reden === redenFilter;
      return matchesSearch && matchesReden;
    });
  }, [mappedUitstromen, searchQuery, redenFilter]);

  const stats = useMemo(() => {
    return {
      volgens_plan: mappedUitstromen.filter(u => u.reden === "volgens_plan").length,
      voortijdig: mappedUitstromen.filter(u =>
        ["overeenstemming", "eenzijdig_client", "eenzijdig_aanbieder", "externe_omstandigheden"].includes(u.reden)
      ).length,
      anders: mappedUitstromen.filter(u => u.reden === "anders").length,
    };
  }, [mappedUitstromen]);

  const handleExport = (type: "excel" | "pdf") => {
    const dataToExport = filteredUitstromen.map((uitstroom) => ({
      "Cliënt": uitstroom.clientNaam,
      "Uitstroomdatum": uitstroom.uitstroomDatum,
      "Reden": redenConfig[uitstroom.reden].label,
      "Status": statusConfig[uitstroom.status].label,
      "Coördinator": uitstroom.coordinator,
      "Rapport": uitstroom.rapportStatus === "compleet" ? "Compleet" : "Ontbreekt",
      "Opmerkingen": uitstroom.opmerkingen || "",
    }));

    const filename = `uitstroom-export-${new Date().toISOString().split('T')[0]}`;
    
    if (type === "excel") {
      exportToExcel(dataToExport, filename);
    } else {
      exportToPDF(dataToExport, filename, "Uitstroom Rapport");
    }
  };

  const handleDownloadAfsluitrapport = async (uitstroom: Uitstroom) => {
    try {
      // Find the client from the dummy data
      const client = dischargeOverview.find(c => c.id === uitstroom.id);

      if (!client) {
        enqueueSnackbar("Cliëntgegevens niet gevonden", { variant: "error" });
        return;
      }

      // Prepare data for PDF export
      const uitstroomData = {
        ...uitstroom,
        redenLabel: redenConfig[uitstroom.reden].label,
        statusLabel: statusConfig[uitstroom.status].label,
        evaluatie: "Het traject is succesvol afgerond. De cliënt heeft goede vooruitgang geboekt.",
      };

      exportAfsluitrapportToPDF(uitstroomData, client as Any);

      enqueueSnackbar(`Afsluitrapport voor ${uitstroom.clientNaam} gedownload`, { variant: "success" });
    } catch (error) {
      console.error('Error downloading afsluitrapport:', error);
      enqueueSnackbar("Fout bij downloaden van afsluitrapport", { variant: "error" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Volgens Plan</p>
              <p className="text-2xl font-bold mt-1">{stats.volgens_plan}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Voortijdig Afgesloten</p>
              <p className="text-2xl font-bold mt-1">{stats.voortijdig}</p>
            </div>
            <LogOut className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Anders</p>
              <p className="text-2xl font-bold mt-1">{stats.anders}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-500" />
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoek op naam of organisatie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={redenFilter} onValueChange={setRedenFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter op reden" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle redenen</SelectItem>
              <SelectItem value="volgens_plan">Volgens plan</SelectItem>
              <SelectItem value="overeenstemming">In overeenstemming</SelectItem>
              <SelectItem value="eenzijdig_client">Eenzijdig door cliënt</SelectItem>
              <SelectItem value="eenzijdig_aanbieder">Eenzijdig door aanbieder</SelectItem>
              <SelectItem value="externe_omstandigheden">Externe omstandigheden</SelectItem>
              <SelectItem value="anders">Anders</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <PrimaryButton
                text="Exporteren"
                icon={Download}
                className="flex-1 sm:flex-none bg-green-100 text-green-500 hover:bg-green-500 hover:text-white"
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
            text="Nieuwe Uitstroom"
            onClick={() => {
              setSelectedUitstroom(undefined);
              setDialogOpen(true);
            }}
            disabled={false}
            icon={Plus}
            animation="animate-bounce"
            className="flex-1 sm:flex-none bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white"
          />
        </div>
      </div>

      {/* Uitstromen List */}
      {filteredUitstromen.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Geen uitstroom gevonden
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredUitstromen.map((uitstroom) => {
            const redenConf = redenConfig[uitstroom.reden];
            const statusConf = statusConfig[uitstroom.status];
            const StatusIcon = statusConf.icon;
            
            return (
              <Card key={uitstroom.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="font-semibold text-lg">{uitstroom.clientNaam}</h3>
                        <p className="text-sm text-muted-foreground">
                          Uitstroom: {uitstroom.uitstroomDatum}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={redenConf.color}>
                          {redenConf.label}
                        </Badge>
                        <Badge variant={statusConf.variant} className="gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {statusConf.label}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Coördinator:</span>
                        <p className="font-medium">{uitstroom.coordinator}</p>
                      </div>
                      {uitstroom.naarOrganisatie && (
                        <div>
                          <span className="text-muted-foreground">Naar organisatie:</span>
                          <p className="font-medium">{uitstroom.naarOrganisatie}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Eindrapport:</span>
                        <Badge 
                          variant={uitstroom.rapportStatus === "compleet" ? "default" : "destructive"}
                          className="text-xs mt-1"
                        >
                          {uitstroom.rapportStatus === "compleet" ? "Compleet" : "Ontbreekt"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <PrimaryButton
                      text="Afsluitrapport"
                      onClick={() => handleDownloadAfsluitrapport(uitstroom)}
                      icon={Download}
                      className="flex-1 lg:flex-none bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm px-3 py-2"
                      disabled={false}
                    />
                    <PrimaryButton
                      text="Bewerken"
                      onClick={() => {
                        setSelectedUitstroom(uitstroom);
                        setDialogOpen(true);
                      }}
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

      <UitstroomDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        uitstroom={selectedUitstroom}
        onSuccess={() => {
          // In a real app, you would refresh the data here
          // For dummy data, we don't need to do anything
        }}
      />
    </div>
  );
}