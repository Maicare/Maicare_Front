'use client'

import { useMemo, useState, useEffect } from "react";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Plus, Search, Download, FileText, CheckCircle, XCircle, Clock, FileSpreadsheet, Edit, Eye, AlertCircle, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AanmeldingDialog } from "./AanmeldingDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportToExcel, exportToPDF } from "@/utils/pdfExportUtils";
import { useRegistration } from "@/hooks/registration/use-registration";
import { Registration, RegistrationParamsFilters } from "@/types/registration.types";
import { useDebounce } from "@/hooks/common/useDebounce";
import { Button } from "../ui/button";

const statusConfig = {
  pending: { label: "In behandeling", variant: "secondary" as const, icon: Clock, color: "text-amber-500" },
  approved: { label: "Goedgekeurd", variant: "default" as const, icon: CheckCircle, color: "text-green-500" },
  rejected: { label: "Afgewezen", variant: "destructive" as const, icon: XCircle, color: "text-red-500" },
};

type StatusFilter = "alle" | keyof typeof statusConfig;

const documentFields = [
  { key: "document_referral", label: "Verwijsbrief" },
  { key: "document_id_copy", label: "ID Kopie" },
  { key: "document_psychiatric_report", label: "Psychiatrisch verslag" },
  { key: "document_diagnosis", label: "Diagnose" },
  { key: "document_education_report", label: "Onderwijsrapport" },
  { key: "document_safety_plan", label: "Veiligheidsplan" },
  { key: "document_action_plan", label: "Actieplan" },
] as const;

const getDocuments = (registration: Registration) => {
  return documentFields
    .filter(({ key }) => {
      const value = registration[key as keyof Registration];
      return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
    })
    .map(({ label }) => label);
};

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("nl-NL");
};

export function AanmeldingenTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("alle");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAanmelding, setSelectedAanmelding] = useState<Registration | undefined>();

  const [filters, setFilters] = useState<RegistrationParamsFilters>({
    page: 1,
    page_size: 50,
    status: "pending",
    risk_aggressive_behavior: false,
    risk_criminal_history: false,
    risk_day_night_rhythm: false,
    risk_flight_behavior: false,
    risk_psychiatric_issues: false,
    risk_sexual_behavior: false,
    risk_suicidal_selfharm: false,
    risk_substance_abuse: false,
    risk_weapon_possession: false,
  });

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      status: statusFilter === "alle" ? "pending" : statusFilter,
      page: 1,
    }));
  }, [statusFilter]);

  const deboucedFilters = useDebounce(filters, 500);

  const { registrations, isLoading, setPage } = useRegistration(deboucedFilters);

  const registrationItems = useMemo(() => registrations?.results ?? [], [registrations]);

  const filteredAanmeldingen = useMemo(() => {
    return registrationItems.filter((registration) => {
      const naam = `${registration.client_first_name} ${registration.client_last_name}`.toLowerCase();
      const search = searchQuery.toLowerCase();
      const matchesSearch =
        naam.includes(search) ||
        registration.referrer_organization?.toLowerCase().includes(search) ||
        registration.referrer_first_name?.toLowerCase().includes(search) ||
        registration.referrer_last_name?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "alle" ||
        registration.form_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [registrationItems, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return Object.keys(statusConfig).reduce((acc, key) => {
      const statusKey = key as keyof typeof statusConfig;
      acc[statusKey] = registrationItems.filter(item => item.form_status === statusKey).length;
      return acc;
    }, {} as Record<keyof typeof statusConfig, number>);
  }, [registrationItems]);

  const handleAdd = () => {
    setSelectedAanmelding(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (aanmelding: Registration) => {
    setSelectedAanmelding(aanmelding);
    setDialogOpen(true);
  };

  const handleExport = (type: "excel" | "pdf") => {
    const dataToExport = filteredAanmeldingen.map((aanmelding) => {
      const documenten = getDocuments(aanmelding);
      const status = aanmelding.form_status as keyof typeof statusConfig;
      return {
        "Cliënt": `${aanmelding.client_first_name} ${aanmelding.client_last_name}`,
        "Aanvraagdatum": formatDate(aanmelding.application_date),
        "Status": statusConfig[status]?.label ?? aanmelding.form_status,
        "Verwijzer": aanmelding.referrer_organization || `${aanmelding.referrer_first_name} ${aanmelding.referrer_last_name}`,
        "Telefoon verwijzer": aanmelding.referrer_phone_number || "-",
        "Documenten": documenten.join(", ") || "Geen",
        "Aantal Documenten": documenten.length,
      };
    });

    const filename = `aanmeldingen-export-${new Date().toISOString().split('T')[0]}`;

    if (type === "excel") {
      exportToExcel(dataToExport, filename);
    } else {
      exportToPDF(dataToExport, filename, "Aanmeldingen Rapport");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(stats).map(([status, count]) => {
          const config = statusConfig[status as keyof typeof statusConfig];
          const Icon = config.icon;
          return (
            <Card key={status} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{config.label}</p>
                  <p className="text-2xl font-bold mt-1">{count}</p>
                </div>
                <Icon className={`w-8 h-8 ${config.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoek op naam of verwijzer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter op status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle statussen</SelectItem>
              <SelectItem value="pending">In behandeling</SelectItem>
              <SelectItem value="approved">Goedgekeurd</SelectItem>
              <SelectItem value="rejected">Afgewezen</SelectItem>
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
            text="Nieuwe Aanmelding"
            onClick={handleAdd}
            disabled={false}
            icon={Plus}
            animation="animate-bounce"
            className="flex-1 sm:flex-none bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white"
          />
        </div>
      </div>

      {/* Aanmeldingen List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Laden...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAanmeldingen.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">Geen aanmeldingen gevonden</Card>
          ) : (
            filteredAanmeldingen.map((aanmelding) => {
              const statusKey = (aanmelding.form_status as keyof typeof statusConfig) ?? "pending";
              const config = statusConfig[statusKey] ?? statusConfig.pending;
              const Icon = config.icon;
              const documenten = getDocuments(aanmelding);
              return (
                <Card key={aanmelding.id} className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    {/* Main Content */}
                    <div className="flex-1 space-y-4">
                      {/* Header Section */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-xl text-gray-900">
                            {aanmelding.client_first_name} {aanmelding.client_last_name}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Aangemeld op {formatDate(aanmelding.application_date)}
                          </p>
                        </div>
                        <Badge variant={config.variant} className="gap-1.5 px-3 py-1.5 text-sm">
                          <Icon className="w-3.5 h-3.5" />
                          {config.label}
                        </Badge>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500">Verwijzer</p>
                          <p className="font-semibold text-gray-900">
                            {aanmelding.referrer_organization || `${aanmelding.referrer_first_name} ${aanmelding.referrer_last_name}`}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500">Contact</p>
                          <p className="font-semibold text-gray-900">
                            {aanmelding.referrer_phone_number || aanmelding.referrer_email || "-"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500">Risicofactoren</p>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{aanmelding.risk_count}</p>
                            {aanmelding.risk_count > 0 && (
                              <AlertCircle className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500">Documenten</p>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">
                              {documenten.length} van {documentFields.length}
                            </p>
                            {documenten.length === documentFields.length && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Documents Section */}
                      {documenten.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-500">Toegevoegde documenten</p>
                          <div className="flex flex-wrap gap-2">
                            {documenten.map((doc) => (
                              <Badge
                                key={doc}
                                variant="secondary"
                                className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 border-blue-200"
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex lg:flex-col gap-3 lg:min-w-[120px]">
                      <Button
                        variant="outline"
                        className="flex-1 lg:flex-none bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Bekijken
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(aanmelding)}
                        className="flex-1 lg:flex-none bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Bewerken
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      <AanmeldingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        aanmelding={selectedAanmelding}
      />
    </div>
  );
}
