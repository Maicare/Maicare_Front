// Utility functies voor exporteren van data naar Excel/CSV

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  // Haal de headers uit de keys van het eerste object
  const headers = Object.keys(data[0]);
  
  // Maak CSV content
  const csvContent = [
    headers.join(","), // Header rij
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        // Escape commas en quotes in values
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatClientDataForExport = (clients: any[]) => {
  return clients.map((client) => ({
    Naam: client.naam,
    Leeftijd: client.leeftijd,
    Locatie: client.locatie,
    Zorgvorm: client.zorgvorm,
    Hoofdaanbieder: client.hoofdaanbieder,
    Startdatum: client.startDatum || client.start_datum,
    Einddatum: client.eindDatum || client.eind_datum,
    Beschikking: `${client.beschikkingsGebruikt || client.beschikkings_gebruikt}/${client.beschikkingsTotaal || client.beschikkings_totaal} ${client.beschikkingsEenheid || client.beschikkings_eenheid}`,
    Herindicatie: client.herindicatie || client.herindicatie_datum,
    Mentor: client.mentor || "Niet toegewezen",
  }));
};
