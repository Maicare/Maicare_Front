'use client';

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSnackbar } from "notistack";
import { Upload, FileText, Download, Trash2, XCircle, CheckCircle } from "lucide-react";
import { CreateOrganisation } from "@/schemas/organisation.schema";
import { Organization } from "@/types/organisation";
import { ApiOptions } from "@/common/types/api.types";
import { useAttachment } from "@/hooks/attachment/use-attachment";

interface HoofdaanbiederDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hoofdaanbieder?: {
    id: string;
    hoofdaanbieder: string;
    contactpersoon?: string | null;
    telefoon?: string | null;
    email?: string | null;
    adres?: string | null;
    notities?: string | null;
    raamovereenkomst_url?: string | null;
  };
  onSuccess?: () => void;
  createOne: (organisation: CreateOrganisation, options?: ApiOptions) => Promise<Organization>;
  updateOne: (organisation: CreateOrganisation, id: string, options?: ApiOptions) => Promise<Organization>;
}

export function HoofdaanbiederDialog({
  open,
  onOpenChange,
  hoofdaanbieder,
  onSuccess,
  createOne,
  updateOne,
}: HoofdaanbiederDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);
  const { createOne: uploadFile, readOne: downloadFile, deleteOne: deleteFile } = useAttachment();
  const [raamovereenkomstFileId, setRaamovereenkomstFileId] = useState<string | null>(hoofdaanbieder?.raamovereenkomst_url || null);
  const [formData, setFormData] = useState({
    hoofdaanbieder: "",
    contactpersoon: "",
    telefoon: "",
    email: "",
    adres: "",
    city: "",
    postal_code: "",
    btw_number: "",
    kvk_number: "",
    notities: "",
  });

  useEffect(() => {
    if (hoofdaanbieder) {
      // Parse address to extract city and postal code if possible
      const addressParts = hoofdaanbieder.adres?.split(',') || [];
      const mainAddress = addressParts[0]?.trim() || "";
      const cityPostal = addressParts[1]?.trim() || "";
      const cityPostalMatch = cityPostal.match(/^(\d{4}\s?[A-Z]{2})\s+(.+)$/);
      
      setFormData({
        hoofdaanbieder: hoofdaanbieder.hoofdaanbieder || "",
        contactpersoon: hoofdaanbieder.contactpersoon || "",
        telefoon: hoofdaanbieder.telefoon || "",
        email: hoofdaanbieder.email || "",
        adres: mainAddress,
        city: cityPostalMatch ? cityPostalMatch[2] : cityPostal,
        postal_code: cityPostalMatch ? cityPostalMatch[1] : "",
        btw_number: "",
        kvk_number: "",
        notities: hoofdaanbieder.notities || "",
      });
    } else {
      setFormData({
        hoofdaanbieder: "",
        contactpersoon: "",
        telefoon: "",
        email: "",
        adres: "",
        city: "",
        postal_code: "",
        btw_number: "",
        kvk_number: "",
        notities: "",
      });
    }
  }, [hoofdaanbieder, open]);

  const handleSave = async () => {
    if (!formData.hoofdaanbieder.trim()) {
      enqueueSnackbar("Hoofdaanbieder naam is verplicht", { variant: "error" });
      return;
    }

    if (!formData.email.trim()) {
      enqueueSnackbar("E-mailadres is verplicht", { variant: "error" });
      return;
    }

    try {
      // Map form data to Organization schema
      const organisationData: CreateOrganisation = {
        name: formData.hoofdaanbieder,
        email: formData.email,
        address: formData.adres,
        city: formData.city || "Niet gespecificeerd",
        postal_code: formData.postal_code || "0000AA",
        btw_number: formData.btw_number || "NL000000000B01",
        kvk_number: formData.kvk_number || "00000000",
      };

      if (hoofdaanbieder) {
        // Update existing
        await updateOne(organisationData, hoofdaanbieder.id, {
          displayProgress: true,
          displaySuccess: true,
        });
      } else {
        // Create new
        await createOne(organisationData, {
          displayProgress: true,
          displaySuccess: true,
        });
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving hoofdaanbieder:', error);
      // Error handling is done by the hooks
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!hoofdaanbieder) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const attachment = await uploadFile(formData, { displayProgress: false, displaySuccess: true });
      
      // Store file_id for future reference
      setRaamovereenkomstFileId(attachment.file_id);
      
      // TODO: Update organization via API with raamovereenkomst_file_id: attachment.file_id
      // This would be done via updateOne from useOrganisation

      onSuccess?.();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!raamovereenkomstFileId || !hoofdaanbieder) return;

    try {
      const attachment = await downloadFile(raamovereenkomstFileId, { displayProgress: false, displaySuccess: false });
      
      // Download the file from the URL
      const response = await fetch(attachment.file_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `raamovereenkomst_${hoofdaanbieder.hoofdaanbieder}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDeleteDocument = async () => {
    if (!raamovereenkomstFileId) return;
    if (!confirm('Weet je zeker dat je dit document wilt verwijderen?')) return;

    try {
      await deleteFile(raamovereenkomstFileId, { displayProgress: false, displaySuccess: true });
      setRaamovereenkomstFileId(null);
      
      // TODO: Update organization via API to remove raamovereenkomst_file_id

      onSuccess?.();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {hoofdaanbieder ? "Hoofdaanbieder Bewerken" : "Hoofdaanbieder Toevoegen"}
          </DialogTitle>
          <DialogDescription>
            Vul de gegevens van de hoofdaanbieder in
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="naam">Naam Hoofdaanbieder *</Label>
            <Input
              id="naam"
              value={formData.hoofdaanbieder}
              onChange={(e) => setFormData({ ...formData, hoofdaanbieder: e.target.value })}
              placeholder="Naam van de hoofdaanbieder..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactpersoon">Contactpersoon</Label>
            <Input
              id="contactpersoon"
              value={formData.contactpersoon}
              onChange={(e) => setFormData({ ...formData, contactpersoon: e.target.value })}
              placeholder="Naam contactpersoon..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefoon">Telefoonnummer</Label>
              <Input
                id="telefoon"
                type="tel"
                value={formData.telefoon}
                onChange={(e) => setFormData({ ...formData, telefoon: e.target.value })}
                placeholder="06-12345678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mailadres *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@voorbeeld.nl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adres">Adres</Label>
            <Input
              id="adres"
              value={formData.adres}
              onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
              placeholder="Straat 1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postcode</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                placeholder="1234 AB"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Plaats</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Amsterdam"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kvk_number">KVK Nummer</Label>
              <Input
                id="kvk_number"
                value={formData.kvk_number}
                onChange={(e) => setFormData({ ...formData, kvk_number: e.target.value })}
                placeholder="12345678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="btw_number">BTW Nummer</Label>
              <Input
                id="btw_number"
                value={formData.btw_number}
                onChange={(e) => setFormData({ ...formData, btw_number: e.target.value })}
                placeholder="NL123456789B01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notities">Notities</Label>
            <Textarea
              id="notities"
              value={formData.notities}
              onChange={(e) => setFormData({ ...formData, notities: e.target.value })}
              placeholder="Aanvullende opmerkingen..."
              rows={3}
            />
          </div>

          {hoofdaanbieder && (
            <div className="space-y-2">
              <Label>Raamovereenkomst</Label>
              {raamovereenkomstFileId ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-2 bg-muted rounded flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Raamovereenkomst geüpload</span>
                  </div>
                  <PrimaryButton
                    text=""
                    onClick={handleDownload}
                    icon={Download}
                    animation="animate-bounce"
                    className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm px-3 py-2"
                    disabled={false}
                  />
                  <PrimaryButton
                    text=""
                    onClick={handleDeleteDocument}
                    icon={Trash2}
                    animation="animate-bounce"
                    className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white text-sm px-3 py-2"
                    disabled={false}
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 p-3 border-2 border-dashed rounded hover:bg-muted/50 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">
                        {uploading ? 'Uploaden...' : 'Klik om bestand te uploaden'}
                      </span>
                    </div>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <PrimaryButton
            text="Annuleren"
            type="button"
            onClick={() => onOpenChange(false)}
            icon={XCircle}
            animation="animate-bounce"
            className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 text-sm"
            disabled={false}
          />
          <PrimaryButton
            text={hoofdaanbieder ? "Opslaan" : "Toevoegen"}
            type="button"
            onClick={handleSave}
            icon={CheckCircle}
            animation="animate-bounce"
            className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white px-4 py-3 text-sm"
            disabled={false}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
