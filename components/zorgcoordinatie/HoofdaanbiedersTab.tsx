'use client';

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Plus, FileText, Pencil, Phone, Mail, MapPin, Download, CheckCircle, User } from "lucide-react";
import { useSnackbar } from "notistack";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HoofdaanbiederDialog } from "./HoofdaanbiederDialog";
import { useOrganisation } from "@/hooks/organisation/use-organisation";
import { Organization } from "@/types/organisation";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface HoofdaanbiederDoc {
  id: string;
  hoofdaanbieder: string;
  contactpersoon?: string | null;
  telefoon?: string | null;
  email?: string | null;
  adres?: string | null;
  notities?: string | null;
  raamovereenkomst_url: string | null;
  created_at: string;
  updated_at: string;
}

// Helper function to map Organization to HoofdaanbiederDoc
const mapOrganizationToHoofdaanbieder = (org: Organization): HoofdaanbiederDoc => ({
  id: org.id,
  hoofdaanbieder: org.name,
  contactpersoon: null, // Not available in Organization type
  telefoon: null, // Not available in Organization type
  email: org.email,
  adres: `${org.address}, ${org.city} ${org.postal_code}`,
  notities: null, // Not available in Organization type
  raamovereenkomst_url: null, // Not available in Organization type - would need document management
  created_at: org.created_at,
  updated_at: org.updated_at,
});

export function HoofdaanbiedersTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHoofdaanbieder, setSelectedHoofdaanbieder] = useState<HoofdaanbiederDoc | undefined>();
  const { enqueueSnackbar } = useSnackbar();

  const { organisations, isLoading, createOne, updateOne } = useOrganisation({ autoFetch: true });

  // Map organizations to hoofdaanbieder documents
  const documenten = useMemo<HoofdaanbiederDoc[]>(() => {
    if (!organisations) return [];
    return organisations
      .map(mapOrganizationToHoofdaanbieder)
      .sort((a, b) => a.hoofdaanbieder.localeCompare(b.hoofdaanbieder));
  }, [organisations]);

  const handleEdit = (doc: HoofdaanbiederDoc) => {
    setSelectedHoofdaanbieder(doc);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedHoofdaanbieder(undefined);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedHoofdaanbieder(undefined);
    // No need to manually refresh - useOrganisation handles this automatically
  };

  if (isLoading) {
    return <div>Laden...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Hoofdaanbieders</h3>
          </div>
          <PrimaryButton
            text="Nieuwe Hoofdaanbieder"
            onClick={handleAdd}
            disabled={false}
            icon={Plus}
            animation="animate-bounce"
            className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white"
          />
        </div>
        
        <Table>
  <TableHeader>
    <TableRow className="hover:bg-transparent">
      <TableHead className="font-semibold text-gray-900">Hoofdaanbieder</TableHead>
      <TableHead className="font-semibold text-gray-900">Contactgegevens</TableHead>
      <TableHead className="font-semibold text-gray-900">Document</TableHead>
      <TableHead className="text-right font-semibold text-gray-900">Acties</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {documenten.length === 0 ? (
      <TableRow>
        <TableCell colSpan={4} className="text-center py-12">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-gray-100 rounded-full">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-900">Nog geen hoofdaanbieders</p>
              <p className="text-sm text-gray-500">Voeg je eerste hoofdaanbieder toe om te beginnen</p>
            </div>
          </div>
        </TableCell>
      </TableRow>
    ) : (
      documenten.map((doc) => (
        <TableRow key={doc.id} className="group hover:bg-gray-50 transition-colors">
          {/* Hoofdaanbieder Column */}
          <TableCell>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">{doc.hoofdaanbieder}</p>
              {doc.contactpersoon && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <User className="w-3 h-3 text-gray-400" />
                  <span>{doc.contactpersoon}</span>
                </div>
              )}
            </div>
          </TableCell>

          {/* Contactgegevens Column */}
          <TableCell>
            <div className="space-y-2">
              {doc.telefoon && (
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-blue-50 rounded">
                    <Phone className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-900 font-medium">{doc.telefoon}</span>
                </div>
              )}
              {doc.email && (
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-green-50 rounded">
                    <Mail className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-900 font-medium truncate">{doc.email}</span>
                </div>
              )}
              {doc.adres && (
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-orange-50 rounded">
                    <MapPin className="w-3 h-3 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-900 font-medium line-clamp-1">{doc.adres}</span>
                </div>
              )}
            </div>
          </TableCell>

          {/* Document Column */}
          <TableCell>
            {doc.raamovereenkomst_url ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Geüpload
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Geen document
              </Badge>
            )}
          </TableCell>

          {/* Actions Column */}
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              {doc.raamovereenkomst_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(doc)}
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Bewerken
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
</Table>
      </Card>

      <HoofdaanbiederDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        hoofdaanbieder={selectedHoofdaanbieder}
        onSuccess={handleDialogClose}
        createOne={createOne}
        updateOne={updateOne}
      />
    </div>
  );
}
