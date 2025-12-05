import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = (data: any[], filename: string, title: string) => {
  if (data.length === 0) return;

  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Add date
  doc.setFontSize(11);
  doc.text(`Datum: ${new Date().toLocaleDateString('nl-NL')}`, 14, 30);

  // Get headers from the first object keys
  const headers = Object.keys(data[0]);

  // Create table data
  const tableData = data.map((row) =>
    headers.map((header) => {
      const value = row[header];
      return value !== null && value !== undefined ? String(value) : "";
    })
  );

  // Generate table
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 35,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { top: 35 },
  });

  // Save the PDF
  doc.save(`${filename}.pdf`);
};

export const exportAfsluitrapportToPDF = (uitstroom: any, trajectData: any) => {
  const doc = new jsPDF();

  // Header with title
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.text("AFSLUITRAPPORT", 14, 20);

  // Date and reference
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Datum: ${new Date().toLocaleDateString('nl-NL')}`, 14, 28);
  doc.text(`Referentie: ${uitstroom.id || 'N/A'}`, 14, 33);

  // Separator line
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(14, 38, 196, 38);

  let yPos = 48;

  // Section 1: Trajectgegevens
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("TRAJECTGEGEVENS", 14, yPos);
  yPos += 8;

  doc.setFontSize(10);
  const trajectInfo = [
    ["Cliënt", trajectData?.naam || uitstroom.clientNaam || "N/A"],
    ["Leeftijd", trajectData?.leeftijd ? `${trajectData.leeftijd} jaar` : "N/A"],
    ["Hoofdaanbieder", trajectData?.hoofdaanbieder || "N/A"],
    ["Zorgvorm", trajectData?.zorgvorm || "N/A"],
    ["Locatie", trajectData?.locatie || "N/A"],
    ["Start datum", trajectData?.start_datum || "N/A"],
    ["Eind datum", trajectData?.eind_datum || uitstroom.uitstroomDatum || "N/A"],
    ["Beschikking", trajectData?.beschikkings_totaal ? `${trajectData.beschikkings_gebruikt}/${trajectData.beschikkings_totaal} ${trajectData.beschikkings_eenheid}` : "N/A"],
  ];

  trajectInfo.forEach(([label, value]) => {
    doc.setFont(undefined, "bold");
    doc.text(`${label}:`, 14, yPos);
    doc.setFont(undefined, "normal");
    doc.text(String(value), 60, yPos);
    yPos += 6;
  });

  yPos += 5;

  // Section 2: Uitstroom Details
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text("UITSTROOM DETAILS", 14, yPos);
  yPos += 8;

  doc.setFontSize(10);
  const uitstroomInfo = [
    ["Uitstroomdatum", uitstroom.uitstroomDatum || "N/A"],
    ["Reden uitstroom", uitstroom.redenLabel || "N/A"],
    ["Status", uitstroom.statusLabel || "N/A"],
    ["Coördinator", uitstroom.coordinator || "N/A"],
  ];

  if (uitstroom.naarOrganisatie) {
    uitstroomInfo.push(["Naar organisatie", uitstroom.naarOrganisatie]);
  }

  uitstroomInfo.forEach(([label, value]) => {
    doc.setFont(undefined, "bold");
    doc.text(`${label}:`, 14, yPos);
    doc.setFont(undefined, "normal");
    doc.text(String(value), 60, yPos);
    yPos += 6;
  });

  yPos += 5;

  // Section 3: Evaluatie
  if (uitstroom.evaluatie) {
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("EVALUATIE", 14, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    const evaluatieLines = doc.splitTextToSize(uitstroom.evaluatie, 180);
    doc.text(evaluatieLines, 14, yPos);
    yPos += evaluatieLines.length * 5 + 5;
  }

  // Section 4: Opmerkingen
  if (uitstroom.opmerkingen) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("OPMERKINGEN", 14, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    const opmerkingenLines = doc.splitTextToSize(uitstroom.opmerkingen, 180);
    doc.text(opmerkingenLines, 14, yPos);
    yPos += opmerkingenLines.length * 5 + 5;
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Pagina ${i} van ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  const filename = `afsluitrapport-${uitstroom.clientNaam?.replace(/\s+/g, '-') || 'client'}-${new Date().toISOString().split('T')[0]}`;
  doc.save(`${filename}.pdf`);
};

export const exportToExcel = (data: any[], filename: string) => {
  if (data.length === 0) return;

  // Create CSV content with BOM for proper Excel encoding
  const BOM = "\uFEFF";
  const headers = Object.keys(data[0]);

  const csvContent = [
    headers.join(";"), // Use semicolon for Excel compatibility
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        // Escape semicolons and quotes in values
        if (typeof value === "string" && (value.includes(";") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(";")
    ),
  ].join("\n");

  // Create blob with BOM for proper Excel encoding
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;"
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};