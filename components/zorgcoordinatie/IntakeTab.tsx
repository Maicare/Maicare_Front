'use client';

import { useState, useMemo } from "react";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Plus, Search, Download, Calendar, CheckCircle, Clock, AlertCircle, FileSpreadsheet, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IntakeDialog } from "./IntakeDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { exportToExcel, exportToPDF } from "@/utils/pdfExportUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIntake } from "@/hooks/intake/use-intake";
import { useDebounce } from "@/hooks/common/useDebounce";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

interface Intake {
  id: string;
  clientNaam: string;
  intakeDatum: string;
  intakeTijd?: string;
  status: "gepland" | "afgerond" | "in_afwachting";
  coordinator: string;
  locatie: string;
  rapportStatus: "compleet" | "ontbreekt" | "in_behandeling";
}

const statusConfig = {
  gepland: { label: "Gepland", variant: "default" as const, icon: Calendar, color: "text-blue-500" },
  afgerond: { label: "Afgerond", variant: "default" as const, icon: CheckCircle, color: "text-green-500" },
  in_afwachting: { label: "In Afwachting", variant: "secondary" as const, icon: Clock, color: "text-yellow-500" },
};

const rapportStatusConfig = {
  compleet: { label: "Compleet", variant: "default" as const, color: "bg-green-500" },
  ontbreekt: { label: "Ontbreekt", variant: "destructive" as const, color: "bg-red-500" },
  in_behandeling: { label: "In Behandeling", variant: "secondary" as const, color: "bg-yellow-500" },
};

export function IntakeTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("alle");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIntake, setSelectedIntake] = useState<Intake | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('urgency_score');

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { intakes, isLoading } = useIntake({
    autoFetch: true,
    sort_by: sortBy,
    search: debouncedSearch,
    page: currentPage,
  });

  const mappedIntakes = useMemo<Intake[]>(() => {
    if (!intakes?.results) return [];

    return intakes.results.map((intake) => {
      const status: "gepland" | "afgerond" | "in_afwachting" = "in_afwachting";
      const intakeDate = intake.created_at
        ? format(new Date(intake.created_at), 'dd-MM-yyyy', { locale: nl })
        : format(new Date(), 'dd-MM-yyyy', { locale: nl });

      const intakeTime = intake.created_at
        ? format(new Date(intake.created_at), 'HH:mm', { locale: nl })
        : undefined;

      return {
        id: intake.id || "",
        clientNaam: `${intake.first_name} ${intake.last_name}`.trim(),
        intakeDatum: intakeDate,
        intakeTijd: intakeTime,
        status,
        coordinator: intake.referrer_name || "Niet gespecificeerd",
        locatie: intake.main_provider_name || intake.city || "Niet gespecificeerd",
        rapportStatus: intake.attachement_ids && intake.attachement_ids.length > 0
          ? "compleet"
          : "ontbreekt",
      };
    });
  }, [intakes]);

  const filteredIntakes = mappedIntakes.filter((intake) => {
    const matchesSearch = intake.clientNaam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intake.locatie.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "alle" || intake.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    gepland: mappedIntakes.filter(i => i.status === "gepland").length,
    afgerond: mappedIntakes.filter(i => i.status === "afgerond").length,
    conversie: mappedIntakes.length > 0
      ? Math.round((mappedIntakes.filter(i => i.status === "afgerond").length / mappedIntakes.length) * 100)
      : 0,
  };

  const handleAdd = () => {
    setSelectedIntake(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (intake: Intake) => {
    setSelectedIntake(intake);
    setDialogOpen(true);
  };

  const handleExport = (type: "excel" | "pdf") => {
    const dataToExport = filteredIntakes.map((intake) => ({
      "Client Naam": intake.clientNaam,
      "Intake Datum": intake.intakeDatum,
      "Intake Tijd": intake.intakeTijd || "",
      "Status": statusConfig[intake.status].label,
      "Coördinator": intake.coordinator,
      "Locatie": intake.locatie,
      "Rapport Status": rapportStatusConfig[intake.rapportStatus].label,
    }));
    
    const filename = `intakes-export-${new Date().toISOString().split('T')[0]}`;
    
    if (type === "excel") {
      exportToExcel(dataToExport, filename);
    } else {
      exportToPDF(dataToExport, filename, "Intakes Rapport");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gepland</p>
              <p className="text-2xl font-bold mt-1">{stats.gepland}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Afgerond</p>
              <p className="text-2xl font-bold mt-1">{stats.afgerond}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Conversie naar Zorg</p>
              <p className="text-2xl font-bold mt-1">{stats.conversie}%</p>
            </div>
            <AlertCircle className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoek op naam of locatie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter op status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle statussen</SelectItem>
              <SelectItem value="gepland">Gepland</SelectItem>
              <SelectItem value="afgerond">Afgerond</SelectItem>
              <SelectItem value="in_afwachting">In Afwachting</SelectItem>
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
            text="Plan Intake"
            onClick={handleAdd}
            disabled={false}
            icon={Plus}
            animation="animate-bounce"
            className="flex-1 sm:flex-none bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">Laden...</div>
      ) : filteredIntakes.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Geen intakes gevonden
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-4">
        {filteredIntakes.map((intake) => {
          const statusConf = statusConfig[intake.status];
          const rapportConf = rapportStatusConfig[intake.rapportStatus];
          const StatusIcon = statusConf.icon;
          
          return (
            <Card key={intake.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{intake.clientNaam}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {intake.intakeDatum}
                          {intake.intakeTijd && ` om ${intake.intakeTijd}`}
                        </p>
                      </div>
                    </div>
                    <Badge variant={statusConf.variant} className="gap-1">
                      <StatusIcon className="w-3 h-3" />
                      {statusConf.label}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Coördinator:</span>
                      <p className="font-medium">{intake.coordinator}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Locatie:</span>
                      <p className="font-medium">{intake.locatie}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rapport:</span>
                      <Badge variant={rapportConf.variant} className="text-xs mt-1">
                        {rapportConf.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                      <PrimaryButton
                        text="Details"
                        className="flex-1 lg:flex-none bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm px-3 py-2"
                        disabled={false}
                      />
                      <PrimaryButton
                        text="Bewerken"
                        onClick={() => handleEdit(intake)}
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

      <IntakeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        intake={selectedIntake}
      />
    </div>
  );
}
