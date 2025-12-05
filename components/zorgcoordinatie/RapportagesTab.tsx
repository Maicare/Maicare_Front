'use client';

import PrimaryButton from "@/common/components/PrimaryButton";
import { Download, FileText, Users, TrendingUp, Activity, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import { CreateRapportDialog } from "./CreateRapportDialog";
import { Badge } from "@/components/ui/badge";
import { JaarrapportageTab } from "./JaarrapportageTab";
import { Separator } from "@/components/ui/separator";
import { useClient } from "@/hooks/client/use-client";
import { useDebounce } from "@/hooks/common/useDebounce";
import { Client } from "@/types/client.types";
import { Report } from "@/types/reports.types";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import Pagination from "@/components/common/Pagination/Pagination";
import { PAGE_SIZE } from "@/consts";

interface RapportageType {
  id: string;
  titel: string;
  beschrijving: string;
  icon: typeof FileText;
  categorie: string;
}

interface RapportItem {
  id: string;
  titel: string;
  client_naam: string;
  template_naam: string;
  status: "concept" | "definitief" | "in_behandeling";
  created_at: string;
  employee_naam: string;
  type: string;
}

// Helper function to dynamically generate report type info from actual data
const generateReportTypeInfo = (type: string, reports: RapportItem[]) => {
  const reportsOfType = reports.filter(r => r.type === type);
  const count = reportsOfType.length;

  // Get the most recent report to extract more info
  const latestReport = reportsOfType.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  // Use the template name from actual data, or generate from type
  const titel = latestReport?.template_naam || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Generate description based on actual data patterns
  const beschrijving = `${count} rapporten beschikbaar van dit type`;

  // Assign icon based on type pattern (minimal logic)
  const icon = type.includes('report') ? FileText :
    type.includes('journal') ? FileText :
      type.includes('process') ? Activity :
        type.includes('one_to_one') ? Users : FileText;

  // Generate category based on type pattern
  const categorie = type.includes('morning') || type.includes('evening') || type.includes('night') ? "Dagrapportages" :
    type.includes('shift') ? "Operationeel" :
      type.includes('one_to_one') ? "Individueel" :
        type.includes('process') ? "Kwaliteit" :
          type.includes('contact') || type.includes('journal') ? "Communicatie" :
            "Overig";

  return { titel, beschrijving, icon, categorie };
};

export function RapportagesTab() {
  const [periodeFilter, setPeriodeFilter] = useState<string>("maand");
  const [categorieFilter, setCategorieFilter] = useState<string>("alle");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [allReports, setAllReports] = useState<RapportItem[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  // Get clients with pagination (similar to IncidentenTab)
  const { clients, isLoading: clientsLoading, page, setPage } = useClient({
    autoFetch: true,
    page_size: PAGE_SIZE,
    page: 1
  });

  // Fetch reports for all clients
  useEffect(() => {
    const fetchAllReports = async () => {
      if (!clients?.results || clients.results.length === 0) {
        setAllReports([]);
        return;
      }

      setReportsLoading(true);
      try {
        const reportPromises = clients.results.map(async (client: Client) => {
          try {
            const response = await api.get(
              `${ApiRoutes.Report.ReadAll.replace("{id}", client.id)}?page=1&page_size=50`
            );

            if (response.data?.data?.results) {
              return response.data.data.results.map((apiReport: Report) => ({
                id: apiReport.id || "",
                titel: `${getReportTypeLabel(apiReport.type)} - ${client.first_name} ${client.last_name}`,
                client_naam: `${client.first_name} ${client.last_name}`.trim(),
                template_naam: getReportTypeLabel(apiReport.type),
                status: getReportStatus(apiReport),
                created_at: apiReport.date,
                employee_naam: apiReport.employee_first_name && apiReport.employee_last_name
                  ? `${apiReport.employee_first_name} ${apiReport.employee_last_name}`.trim()
                  : "Niet gespecificeerd",
                type: apiReport.type
              }));
            }
            return [];
          } catch (error) {
            console.error(`Error fetching reports for client ${client.id}:`, error);
            return [];
          }
        });

        const reportArrays = await Promise.all(reportPromises);
        const flattenedReports = reportArrays.flat();

        // Sort by date (newest first)
        flattenedReports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setAllReports(flattenedReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setReportsLoading(false);
      }
    };

    fetchAllReports();
  }, [clients]);

  // Helper functions to map report data
  const getReportTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      "morning_report": "Ochtendrapport",
      "evening_report": "Avondrapport",
      "night_report": "Nachtrapport",
      "shift_report": "Tussenrapport",
      "one_to_one_report": "1 op 1 Rapportage",
      "process_report": "Procesrapportage",
      "contact_journal": "Contact Journal",
      "other": "Overige"
    };
    return typeMap[type] || "Onbekend rapport";
  };

  const getReportStatus = (report: Report): "concept" | "definitief" | "in_behandeling" => {
    // Since API doesn't have explicit status, derive from report content
    if (report.report_text && report.report_text.length > 100) return "definitief";
    if (report.report_text && report.report_text.length > 0) return "in_behandeling";
    return "concept";
  };

  // Get recent reports (last 10)
  const recentReports = useMemo(() => {
    return allReports.slice(0, 10);
  }, [allReports]);

  // Generate dynamic report types based on actual fetched data
  const rapportageTypes = useMemo<RapportageType[]>(() => {
    if (allReports.length === 0) return [];

    // Get unique report types from fetched data
    const uniqueTypes = Array.from(new Set(allReports.map(report => report.type)));

    // Create report type objects dynamically from actual data
    return uniqueTypes.map(type => {
      const info = generateReportTypeInfo(type, allReports);

      return {
        id: type,
        titel: info.titel,
        beschrijving: info.beschrijving,
        icon: info.icon,
        categorie: info.categorie
      };
    });
  }, [allReports]);

  const filteredRapportages = rapportageTypes.filter((rapport) => {
    return categorieFilter === "alle" || rapport.categorie === categorieFilter;
  });

  const categories = Array.from(new Set(rapportageTypes.map(r => r.categorie)));

  // Templates are now the actual report types we found
  const templates = rapportageTypes;

  const isLoading = clientsLoading || reportsLoading;

  // Calculate pagination for clients
  const totalPages = clients ? Math.ceil(clients.count / (clients.page_size || PAGE_SIZE)) : 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Jaarverantwoording Section */}
      <JaarrapportageTab />
      
      <Separator className="my-8" />
      
      {/* Info Card */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-4">
          <FileText className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Rapportage Templates</h3>
                <p className="text-muted-foreground">
                  Gebruik voorgedefinieerde templates om snel professionele rapporten aan te maken. 
                  {templates.length} templates beschikbaar.
                </p>
              </div>
              <PrimaryButton
                text="Nieuw Rapport"
                onClick={() => setCreateDialogOpen(true)}
                disabled={false}
                icon={Plus}
                animation="animate-bounce"
                className="ml-auto bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Rapporten */}
      {isLoading ? (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Recente Rapporten</h3>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Rapporten laden...</p>
          </div>
        </Card>
      ) : recentReports.length > 0 ? (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Recente Rapporten ({allReports.length} totaal)</h3>
          <div className="space-y-2">
            {recentReports.map((rapport) => (
              <div key={rapport.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium">{rapport.titel}</p>
                  <p className="text-sm text-muted-foreground">
                    {rapport.template_naam} • {rapport.employee_naam} • {new Date(rapport.created_at).toLocaleDateString("nl-NL")}
                  </p>
                </div>
                <Badge variant={rapport.status === "definitief" ? "default" : rapport.status === "in_behandeling" ? "secondary" : "outline"}>
                  {rapport.status}
                </Badge>
              </div>
            ))}
          </div>

          {/* Pagination for clients (affects which reports are shown) */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 pt-4 border-t">
              <Pagination
                page={page}
                totalPages={totalPages}
                onClick={handlePageChange}
                disabled={isLoading}
              />
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Recente Rapporten</h3>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Nog geen rapporten gevonden</p>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={categorieFilter} onValueChange={setCategorieFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter op categorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle categorieën</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={periodeFilter} onValueChange={setPeriodeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Deze Week</SelectItem>
            <SelectItem value="maand">Deze Maand</SelectItem>
            <SelectItem value="kwartaal">Dit Kwartaal</SelectItem>
            <SelectItem value="jaar">Dit Jaar</SelectItem>
            <SelectItem value="custom">Aangepaste Periode</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rapportages Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredRapportages.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Geen rapporten gevonden</h3>
          <p className="text-muted-foreground">
            {allReports.length === 0
              ? "Er zijn nog geen rapporten aangemaakt voor de huidige cliënten."
              : "Geen rapporten gevonden voor de geselecteerde categorie."
            }
          </p>
        </Card>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRapportages.map((rapport) => {
          const Icon = rapport.icon;
            const reportCount = allReports.filter(r => r.type === rapport.id).length;

          return (
            <Card key={rapport.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg">{rapport.titel}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rapport.beschrijving}
                        </p>
                      </div>
                    </div>
                      <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {rapport.categorie}
                      </span>
                        <span className="text-xs font-medium text-primary">
                          {reportCount} rapporten
                        </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                    <PrimaryButton
                      text={`Bekijken (${reportCount})`}
                      icon={FileText}
                      className="flex-1 bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm px-3 py-2"
                      disabled={false}
                    />
                    <PrimaryButton
                      text="Exporteren"
                      icon={Download}
                      className="flex-1 bg-green-100 text-green-500 hover:bg-green-500 hover:text-white text-sm px-3 py-2"
                      disabled={false}
                    />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      )}

      {/* Export Info */}
      <Card className="p-6 bg-muted/50">
        <div className="flex items-start gap-4">
          <Download className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
          <div className="text-sm">
            <p className="font-medium mb-2">Export Informatie</p>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li>Alle exports bevatten tabelweergave met datum, naam, status en verantwoordelijke</li>
              <li>Totale tellingen worden automatisch berekend per categorie</li>
              <li>Custom filters kunnen worden opgeslagen voor hergebruik</li>
          <li>Exports zijn beschikbaar in Excel (.xlsx) en PDF formaat</li>
        </ul>
      </div>
    </div>
  </Card>

  <CreateRapportDialog
    open={createDialogOpen}
    onOpenChange={setCreateDialogOpen}
  />
</div>
  );
}
