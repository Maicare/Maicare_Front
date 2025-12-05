import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Download, TrendingUp, Users, Calendar, AlertTriangle, CheckCircle, FileText, BarChart3, Clock, FileSpreadsheet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSnackbar } from "notistack";
import { exportToExcel, exportToPDF } from "@/utils/pdfExportUtils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function JaarrapportageTab() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClienten: 0,
    nieuweAanmeldingen: 0,
    afgerondeIntakes: 0,
    wachtlijstClienten: 0,
    doorstroomClienten: 0,
    uitstroomClienten: 0,
    incidenten: 0,
    verbeterlogItems: 0,
    beddenBezetting: 0,
    gemiddeldeWachttijd: 0,
  });
  const [clientenPerOpdrachtgever, setClientenPerOpdrachtgever] = useState<{ [key: string]: number }>({});
  const { enqueueSnackbar } = useSnackbar();

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  useEffect(() => {
    fetchYearStats();
  }, [selectedYear]);

  const fetchYearStats = async () => {
    setLoading(true);
    // try {
    //   const startDate = `${selectedYear}-01-01`;
    //   const endDate = `${selectedYear}-12-31`;

    //   // Fetch clienten statistics
    //   // const { count: totalClienten, data: clientenData } = await supabase
    //   //   .from('clienten')
    //   //   .select('hoofdaanbieder')
    //   //   .gte('created_at', startDate)
    //   //   .lte('created_at', endDate);

    //   // // Count clients per opdrachtgever
    //   // const opdrachtgeverCount: { [key: string]: number } = {};
    //   // clientenData?.forEach((client) => {
    //   //   const opdrachtgever = client.hoofdaanbieder || 'Niet toegewezen';
    //   //   opdrachtgeverCount[opdrachtgever] = (opdrachtgeverCount[opdrachtgever] || 0) + 1;
    //   // });
    //   // setClientenPerOpdrachtgever(opdrachtgeverCount);

    //   // // Fetch wachtlijst statistics
    //   // const { count: wachtlijstClienten } = await supabase
    //   //   .from('wachtlijst')
    //   //   .select('*', { count: 'exact', head: true })
    //   //   .gte('created_at', startDate)
    //   //   .lte('created_at', endDate);

    //   // // Fetch incidents
    //   // const { count: incidenten } = await supabase
    //   //   .from('incidenten')
    //   //   .select('*', { count: 'exact', head: true })
    //   //   .gte('created_at', startDate)
    //   //   .lte('created_at', endDate);

    //   // // Fetch verbeterlog items
    //   // const { count: verbeterlogItems } = await supabase
    //   //   .from('verbeterlog_items')
    //   //   .select('*', { count: 'exact', head: true })
    //   //   .gte('created_at', startDate)
    //   //   .lte('created_at', endDate);

    //   // // Fetch rapporten
    //   // const { count: rapporten } = await supabase
    //   //   .from('rapporten')
    //   //   .select('*', { count: 'exact', head: true })
    //   //   .gte('created_at', startDate)
    //   //   .lte('created_at', endDate);

    //   // // Fetch bedden capaciteit
    //   // const { data: beddenData } = await supabase
    //   //   .from('bedden_capaciteit')
    //   //   .select('totaal_bedden, bezette_bedden');

    //   // let totalBedden = 0;
    //   // let bezetteBedden = 0;
    //   // beddenData?.forEach((bed) => {
    //   //   totalBedden += bed.totaal_bedden;
    //   //   bezetteBedden += bed.bezette_bedden;
    //   // });

    //   // const beddenBezetting = totalBedden > 0 ? Math.round((bezetteBedden / totalBedden) * 100) : 0;

    //   // // Calculate average waiting time
    //   // const { data: wachtlijstData } = await supabase
    //   //   .from('wachtlijst')
    //   //   .select('toegevoegd_op, geplaatst_op')
    //   //   .eq('status', 'geplaatst')
    //   //   .gte('geplaatst_op', startDate)
    //   //   .lte('geplaatst_op', endDate);

    //   // let gemiddeldeWachttijd = 0;
    //   // if (wachtlijstData && wachtlijstData.length > 0) {
    //   //   const totalWaitDays = wachtlijstData.reduce((sum, item) => {
    //   //     if (item.geplaatst_op) {
    //   //       const days = Math.floor(
    //   //         (new Date(item.geplaatst_op).getTime() - new Date(item.toegevoegd_op).getTime()) / (1000 * 60 * 60 * 24)
    //   //       );
    //   //       return sum + days;
    //   //     }
    //   //     return sum;
    //   //   }, 0);
    //   //   gemiddeldeWachttijd = Math.round(totalWaitDays / wachtlijstData.length);
    //   // }

    //   // setStats({
    //   //   totalClienten: totalClienten || 0,
    //   //   nieuweAanmeldingen: 0, // Mock data - zou uit een aanmeldingen tabel moeten komen
    //   //   afgerondeIntakes: 0, // Mock data
    //   //   wachtlijstClienten: wachtlijstClienten || 0,
    //   //   doorstroomClienten: 0, // Mock data
    //   //   uitstroomClienten: 0, // Mock data
    //   //   incidenten: incidenten || 0,
    //   //   verbeterlogItems: verbeterlogItems || 0,
    //   //   beddenBezetting,
    //   //   gemiddeldeWachttijd,
    //   // });
    // } catch (error) {
    //   console.error('Error fetching year stats:', error);
    //   enqueueSnackbar("Kon jaarstatistieken niet laden", { variant: "error" });
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleExportYearReport = async (type: "excel" | "pdf") => {
    // try {
    //   const startDate = `${selectedYear}-01-01`;
    //   const endDate = `${selectedYear}-12-31`;

    //   // Fetch all data for export
    //   const { data: clientenData } = await supabase
    //     .from('clienten')
    //     .select('*')
    //     .gte('created_at', startDate)
    //     .lte('created_at', endDate);

    //   const { data: wachtlijstData } = await supabase
    //     .from('wachtlijst')
    //     .select('*')
    //     .gte('created_at', startDate)
    //     .lte('created_at', endDate);

    //   const { data: incidentenData } = await supabase
    //     .from('incidenten')
    //     .select('*')
    //     .gte('created_at', startDate)
    //     .lte('created_at', endDate);

    //   // Export summary
    //   const summaryData = [{
    //     Jaar: selectedYear,
    //     "Totaal Cliënten": stats.totalClienten,
    //     "Nieuwe Aanmeldingen": stats.nieuweAanmeldingen,
    //     "Afgeronde Intakes": stats.afgerondeIntakes,
    //     "Wachtlijst": stats.wachtlijstClienten,
    //     "Doorstroom": stats.doorstroomClienten,
    //     "Uitstroom": stats.uitstroomClienten,
    //     "Incidenten": stats.incidenten,
    //     "Verbeterlog Items": stats.verbeterlogItems,
    //     "Bedden Bezetting %": stats.beddenBezetting,
    //     "Gem. Wachttijd (dagen)": stats.gemiddeldeWachttijd,
    //   }];

    //   const filename = `jaarrapportage-${selectedYear}-samenvatting`;
      
    //   if (type === "excel") {
    //     exportToExcel(summaryData, filename);
    //   } else {
    //     exportToPDF(summaryData, filename, `Jaarrapportage ${selectedYear} - Samenvatting`);
    //   }

    //   // Export detailed client data if available
    //   if (clientenData && clientenData.length > 0) {
    //     const clientenExport = clientenData.map((client) => ({
    //       Naam: client.naam,
    //       Leeftijd: client.leeftijd,
    //       Locatie: client.locatie,
    //       Zorgvorm: client.zorgvorm,
    //       Hoofdaanbieder: client.hoofdaanbieder,
    //       Startdatum: client.start_datum,
    //       Einddatum: client.eind_datum,
    //       "Beschikking Gebruikt": client.beschikkings_gebruikt,
    //       "Beschikking Totaal": client.beschikkings_totaal,
    //       Herindicatie: client.herindicatie_datum,
    //     }));
        
    //     const clientenFilename = `jaarrapportage-${selectedYear}-clienten`;
        
    //     if (type === "excel") {
    //       exportToExcel(clientenExport, clientenFilename);
    //     } else {
    //       exportToPDF(clientenExport, clientenFilename, `Jaarrapportage ${selectedYear} - Cliënten Details`);
    //     }
    //   }

    //   enqueueSnackbar(`Jaarrapportage ${selectedYear} is geëxporteerd naar ${type === "excel" ? "Excel" : "PDF"}`, { variant: "success" });
    // } catch (error) {
    //   console.error('Error exporting year report:', error);
    //   enqueueSnackbar("Kon jaarrapportage niet exporteren", { variant: "error" });
    // }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-12">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Jaarverantwoording
              </CardTitle>
              <CardDescription>
                Overzicht van alle zorgcoördinatie activiteiten voor verantwoording
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Selecteer jaar" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <PrimaryButton
                    text="Exporteer Rapportage"
                    icon={Download}
                    className="bg-green-100 text-green-500 hover:bg-green-500 hover:text-white"
                    disabled={false}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExportYearReport("excel")}>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export naar Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportYearReport("pdf")}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export naar PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Totaal Cliënten in Zorg</CardDescription>
            <CardTitle className="text-3xl">{stats.totalClienten}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Actief in {selectedYear}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Wachtlijst</CardDescription>
            <CardTitle className="text-3xl">{stats.wachtlijstClienten}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Gem. {stats.gemiddeldeWachttijd} dagen</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Incidenten</CardDescription>
            <CardTitle className="text-3xl">{stats.incidenten}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4" />
              <span>Geregistreerd in {selectedYear}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Bedden Bezetting</CardDescription>
            <CardTitle className="text-3xl">{stats.beddenBezetting}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={stats.beddenBezetting} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Zorgproces Overzicht</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Nieuwe Aanmeldingen</span>
              </div>
              <Badge variant="secondary">{stats.nieuweAanmeldingen}</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-500" />
                <span className="font-medium">Afgeronde Intakes</span>
              </div>
              <Badge variant="secondary">{stats.afgerondeIntakes}</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Cliënten in Zorg</span>
              </div>
              <Badge variant="secondary">{stats.totalClienten}</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Doorstroom</span>
              </div>
              <Badge variant="secondary">{stats.doorstroomClienten}</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Uitstroom</span>
              </div>
              <Badge variant="secondary">{stats.uitstroomClienten}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kwaliteit & Verbetering</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="font-medium">Totaal Incidenten</span>
              </div>
              <Badge variant="secondary">{stats.incidenten}</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Verbeterlog Items</span>
              </div>
              <Badge variant="secondary">{stats.verbeterlogItems}</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Afgeronde Verbeteringen</span>
              </div>
              <Badge variant="secondary">-</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Gemiddelde Bezetting</span>
              </div>
              <Badge variant="secondary">{stats.beddenBezetting}%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cliënten per Opdrachtgever</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(clientenPerOpdrachtgever).length > 0 ? (
              Object.entries(clientenPerOpdrachtgever)
                .sort(([, a], [, b]) => b - a)
                .map(([opdrachtgever, count], index) => (
                  <div key={opdrachtgever} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">{opdrachtgever}</span>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                Geen cliënten gevonden voor {selectedYear}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Export Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Export Informatie</CardTitle>
          <CardDescription>
            De jaarrapportage bevat alle relevante data voor verantwoording aan financiers en gemeenten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Cliënt Trajecten</p>
              <p className="text-sm text-muted-foreground">
                Volledige overzicht van alle cliënt trajecten inclusief in-, door- en uitstroom
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Wachtlijst Analyse</p>
              <p className="text-sm text-muted-foreground">
                Gemiddelde wachttijden, prioriteiten en plaatsingsgegevens
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Incidenten & Verbeteringen</p>
              <p className="text-sm text-muted-foreground">
                Kwaliteitsindicatoren en verbetertrajecten voor IGJ-verantwoording
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Capaciteit & Bezetting</p>
              <p className="text-sm text-muted-foreground">
                Beddengebruik per locatie en gemiddelde bezettingsgraad
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}