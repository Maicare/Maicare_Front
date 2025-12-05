'use client';

import { useState } from "react";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Search, Download, Filter, CheckCircle2, Clock, AlertCircle, FileSpreadsheet, FileText, Calendar, CheckCircle, AlertTriangle, User } from "lucide-react";
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
import { useSnackbar } from "notistack";
import { exportToExcel, exportToPDF } from "@/utils/pdfExportUtils";

interface VerbeterlogItem {
  id: string;
  incident_id: string;
  verbeterpunt: string;
  verantwoordelijke: string;
  deadline: string | null;
  status: "open" | "in_uitvoering" | "afgerond";
  resultaat: string | null;
  afgerond_op: string | null;
  created_at: string;
  incident?: {
    client_naam: string;
    type: string;
    datum: string;
  };
}

const statusConfig = {
  open: { label: "Open", variant: "default" as const, icon: Clock, color: "text-blue-500" },
  in_uitvoering: { label: "In Uitvoering", variant: "secondary" as const, icon: AlertCircle, color: "text-yellow-500" },
  afgerond: { label: "Afgerond", variant: "outline" as const, icon: CheckCircle2, color: "text-green-500" },
};

// Mock data until proper API integration
const mockVerbeterlogItems: VerbeterlogItem[] = [
  {
    id: "1",
    incident_id: "inc_001",
    verbeterpunt: "Verbetering van medicatiebeheer protocollen",
    verantwoordelijke: "Dr. Sarah van der Berg",
    deadline: "2024-12-15",
    status: "in_uitvoering",
    resultaat: null,
    afgerond_op: null,
    created_at: "2024-11-01T10:00:00Z",
    incident: {
      client_naam: "Emma van der Berg",
      type: "Medicatie",
      datum: "2024-10-28"
    }
  },
  {
    id: "2",
    incident_id: "inc_002",
    verbeterpunt: "Training personeel in de-escalatietechnieken",
    verantwoordelijke: "Mohammed El-Amin",
    deadline: "2024-11-30",
    status: "open",
    resultaat: null,
    afgerond_op: null,
    created_at: "2024-10-25T14:30:00Z",
    incident: {
      client_naam: "Lucas Vermeer",
      type: "Agressie",
      datum: "2024-10-20"
    }
  },
  {
    id: "3",
    incident_id: "inc_003",
    verbeterpunt: "Implementatie van extra veiligheidsmaatregelen in de tuin",
    verantwoordelijke: "Linda van Dijk",
    deadline: "2024-11-20",
    status: "afgerond",
    resultaat: "Anti-slip matten geplaatst en extra verlichting geïnstalleerd. Geen verdere incidenten sinds implementatie.",
    afgerond_op: "2024-11-18T16:00:00Z",
    created_at: "2024-10-22T09:15:00Z",
    incident: {
      client_naam: "Sophie Bakker",
      type: "Veiligheid",
      datum: "2024-10-18"
    }
  },
  {
    id: "4",
    incident_id: "inc_004",
    verbeterpunt: "Herziening van individuele gedragsplannen",
    verantwoordelijke: "Peter de Vries",
    deadline: "2024-12-01",
    status: "in_uitvoering",
    resultaat: null,
    afgerond_op: null,
    created_at: "2024-10-30T11:45:00Z",
    incident: {
      client_naam: "Tim Hoekstra",
      type: "Ongewenst Gedrag",
      datum: "2024-10-25"
    }
  },
  {
    id: "5",
    incident_id: "inc_005",
    verbeterpunt: "Aanscherping medicatie controle procedures",
    verantwoordelijke: "Anna Smit",
    deadline: "2024-11-25",
    status: "afgerond",
    resultaat: "Dubbele controle systeem ingevoerd. Alle medewerkers getraind in nieuwe procedures. Medicatie fouten gereduceerd met 95%.",
    afgerond_op: "2024-11-22T14:20:00Z",
    created_at: "2024-10-18T13:00:00Z",
    incident: {
      client_naam: "Maya Patel",
      type: "Medicatie",
      datum: "2024-10-16"
    }
  }
];

export function VerbeterlogTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("alle");
  const { enqueueSnackbar } = useSnackbar();

  const filteredItems = mockVerbeterlogItems.filter((item) => {
    const matchesSearch = 
      item.verbeterpunt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.verantwoordelijke.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.incident && item.incident.client_naam.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "alle" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totaal: mockVerbeterlogItems.length,
    open: mockVerbeterlogItems.filter(i => i.status === "open").length,
    inUitvoering: mockVerbeterlogItems.filter(i => i.status === "in_uitvoering").length,
    afgerond: mockVerbeterlogItems.filter(i => i.status === "afgerond").length,
  };

  const handleExport = (type: "excel" | "pdf") => {
    const exportData = filteredItems.map(item => ({
      "Cliënt": item.incident?.client_naam || "-",
      "Incident Type": item.incident?.type || "-",
      "Incident Datum": item.incident?.datum ? new Date(item.incident.datum).toLocaleDateString("nl-NL") : "-",
      "Verbeterpunt": item.verbeterpunt,
      "Verantwoordelijke": item.verantwoordelijke,
      "Deadline": item.deadline ? new Date(item.deadline).toLocaleDateString("nl-NL") : "-",
      "Status": statusConfig[item.status].label,
      "Resultaat": item.resultaat || "-",
      "Afgerond op": item.afgerond_op ? new Date(item.afgerond_op).toLocaleDateString("nl-NL") : "-",
      "Aangemaakt op": new Date(item.created_at).toLocaleDateString("nl-NL"),
    }));

    const filename = `verbeterlog-export-${new Date().toISOString().split('T')[0]}`;
    
    if (type === "excel") {
      exportToExcel(exportData, filename);
    } else {
      exportToPDF(exportData, filename, "Verbeterlog Rapport");
    }
    
    enqueueSnackbar(`${exportData.length} verbeterpunten geëxporteerd`, { variant: "success" });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Totaal</p>
              <p className="text-2xl font-bold mt-1">{stats.totaal}</p>
            </div>
            <Filter className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="text-2xl font-bold mt-1">{stats.open}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Uitvoering</p>
              <p className="text-2xl font-bold mt-1">{stats.inUitvoering}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Afgerond</p>
              <p className="text-2xl font-bold mt-1">{stats.afgerond}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Zoek op verbeterpunt, verantwoordelijke of cliënt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle statussen</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_uitvoering">In Uitvoering</SelectItem>
            <SelectItem value="afgerond">Afgerond</SelectItem>
          </SelectContent>
        </Select>
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

      {/* Verbeterlog Items List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Geen verbeterpunten gevonden</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map((item) => {
            const statusConf = statusConfig[item.status];
            const StatusIcon = statusConf.icon;
            const isOverdue = item.deadline && new Date(item.deadline) < new Date() && item.status !== "afgerond";
            
            return (
              <Card key={item.id} className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500">
  <div className="space-y-4">
    {/* Header Section */}
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={statusConf.variant} className="gap-1.5 px-3 py-1">
            <StatusIcon className="w-3.5 h-3.5" />
            {statusConf.label}
          </Badge>
          {isOverdue && (
            <Badge variant="destructive" className="gap-1.5 px-3 py-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Verlopen
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-xl text-gray-900 leading-tight">
          {item.verbeterpunt}
        </h3>
      </div>
    </div>

    {/* Incident Information */}
    {item.incident && (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium text-blue-900">Gekoppeld incident</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-blue-700 font-medium">Cliënt</p>
                <p className="text-blue-900 font-semibold">{item.incident.client_naam}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-blue-700 font-medium">Type incident</p>
                <p className="text-blue-900 font-semibold">{item.incident.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-blue-700 font-medium">Datum incident</p>
                <p className="text-blue-900 font-semibold">
                  {new Date(item.incident.datum).toLocaleDateString("nl-NL")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Details Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <p className="text-sm font-medium text-gray-600">Verantwoordelijke</p>
        </div>
        <p className="font-semibold text-gray-900">{item.verantwoordelijke}</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <p className="text-sm font-medium text-gray-600">Deadline</p>
        </div>
        <p className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-900'} flex items-center gap-1`}>
          {item.deadline ? new Date(item.deadline).toLocaleDateString("nl-NL") : "-"}
          {isOverdue && <AlertTriangle className="w-4 h-4" />}
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <p className="text-sm font-medium text-gray-600">Aangemaakt</p>
        </div>
        <p className="font-semibold text-gray-900">
          {new Date(item.created_at).toLocaleDateString("nl-NL")}
        </p>
      </div>
    </div>

    {/* Result Section */}
    {item.resultaat && (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-green-900">Resultaat</p>
              {item.afgerond_op && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  Afgerond
                </Badge>
              )}
            </div>
            <p className="text-gray-900 leading-relaxed">{item.resultaat}</p>
            {item.afgerond_op && (
              <p className="text-xs text-green-700 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Afgerond op: {new Date(item.afgerond_op).toLocaleDateString("nl-NL")}
              </p>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
</Card>
            );
          })}
        </div>
      )}
    </div>
  );
}