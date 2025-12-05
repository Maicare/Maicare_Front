import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/common/components/PrimaryButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSnackbar } from "notistack";
import { Upload, XCircle, CheckCircle } from "lucide-react";
import { useClient } from "@/hooks/client/use-client";
import { useState, useEffect } from "react";
import { useAttachment } from "@/hooks/attachment/use-attachment";
import { CreateClientInput } from "@/types/client.types";
import api from "@/common/api/axios";
import ApiRoutes from "@/common/api/routes";
import { constructUrlSearchParams } from "@/utils/construct-search-params";
import { stringConstructor } from "@/utils/string-constructor";
import { Client } from "@/types/client.types";
import { PaginatedResponse } from "@/common/types/pagination.types";
import { Any } from "@/common/types/types";

const formSchema = z.object({
  clientNaam: z.string().min(2, "Naam moet minimaal 2 karakters bevatten"),
  uitstroomDatum: z.string().min(1, "Uitstroomdatum is verplicht"),
  reden: z.enum([
    "volgens_plan",
    "overeenstemming",
    "eenzijdig_client",
    "eenzijdig_aanbieder",
    "externe_omstandigheden",
    "anders"
  ]),
  naarOrganisatie: z.string().optional(),
  coordinator: z.string().min(1, "Coördinator is verplicht"),
  status: z.enum(["in_behandeling", "afgerond", "bevestigd"]),
  afsluitRapport: z.string().optional(),
  evaluatie: z.string().optional(),
  opmerkingen: z.string().optional(),
});

interface UitstroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uitstroom?: Any;
  onSuccess?: () => void;
}

export function UitstroomDialog({
  open,
  onOpenChange,
  uitstroom,
  onSuccess,
}: UitstroomDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { readOne, updateStatus, updateOne } = useClient({ autoFetch: false });
  const { createOne: uploadFile } = useAttachment();
  const [isSaving, setIsSaving] = useState(false);
  const [clientId, setClientId] = useState<string | null>(uitstroom?.id || null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: uitstroom || {
      clientNaam: "",
      uitstroomDatum: new Date().toISOString().split('T')[0],
      reden: "volgens_plan",
      naarOrganisatie: "",
      coordinator: "",
      status: "in_behandeling",
      afsluitRapport: "",
      evaluatie: "",
      opmerkingen: "",
    },
  });

  useEffect(() => {
    if (uitstroom?.id) {
      setClientId(uitstroom.id);
    } else {
      setClientId(null);
    }
  }, [uitstroom]);

  const redenValue = form.watch("reden");
  const showOpmerkingen = redenValue === "anders";

  const findClientByName = async (clientName: string): Promise<string | null> => {
    try {
      const url = stringConstructor(
        ApiRoutes.Client.ReadAll,
        constructUrlSearchParams({ 
          search: clientName, 
          status: "In Care",
          page: 1,
          page_size: 50
        })
      );
      
      const response = await api.get(url);
      const clients: PaginatedResponse<Client> | null = response.data?.data;
      
      if (clients?.results && clients.results.length > 0) {
        const found = clients.results.find((client: Client) => {
          const fullName = `${client.first_name} ${client.infix || ''} ${client.last_name}`.trim();
          return fullName.toLowerCase() === clientName.trim().toLowerCase();
        });
        return found ? found.id.toString() : null;
      }
      return null;
    } catch (error) {
      console.error('Error finding client:', error);
      return null;
    }
  };

  const uploadDocuments = async (): Promise<string[]> => {
    if (uploadedFiles.length === 0) return [];

    const attachmentIds: string[] = [];
    for (const file of uploadedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      const attachment = await uploadFile(formData, { displayProgress: false, displaySuccess: true });
      attachmentIds.push(attachment.file_id);
    }
    return attachmentIds;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);

      let targetClientId = clientId;

      if (!targetClientId) {
        targetClientId = await findClientByName(values.clientNaam);
        if (!targetClientId) {
          throw new Error(`Cliënt "${values.clientNaam}" niet gevonden. Controleer de naam of selecteer een cliënt uit de lijst.`);
        }
      }

      const client = await readOne(targetClientId, { displayProgress: true });

      const documentIds = await uploadDocuments();

      const departureReason = values.opmerkingen && values.reden === "anders" 
        ? `${values.reden}: ${values.opmerkingen}`
        : values.reden;

      const departureReport = values.afsluitRapport || undefined;

      const clientWithAttachments = client as Client & { identity_attachment_ids?: string[] };
      const existingDocumentIds = clientWithAttachments.identity_attachment_ids || [];
      const allDocumentIds = [...existingDocumentIds, ...documentIds];

      const updateData: CreateClientInput = {
        first_name: client.first_name,
        last_name: client.last_name,
        email: client.email,
        organisation_id: client.organisation_id,
        location_id: client.location_id,
        legal_measure: client.legal_measure,
        birthplace: client.birthplace,
        departement: client.departement,
        gender: client.gender,
        filenumber: client.filenumber,
        phone_number: client.phone_number,
        bsn: client.bsn,
        source: client.source,
        date_of_birth: client.date_of_birth,
        addresses: client.addresses,
        infix: client.infix,
        departure_reason: departureReason,
        departure_report: departureReport,
        added_identity_documents: documentIds.length > 0 ? documentIds : undefined,
        sender_id: client.sender_id,
      };

      await updateOne(targetClientId, updateData, {
        displayProgress: false,
        displaySuccess: false,
      });

      await updateStatus(
        targetClientId,
        {
          status: "Out Of Care",
          schedueled: false,
          reason: `Uitstroom geregistreerd. Reden: ${departureReason}. Coördinator: ${values.coordinator}`,
        },
        { displayProgress: false, displaySuccess: true }
      );

      enqueueSnackbar(`Uitstroom voor ${values.clientNaam} is succesvol ${uitstroom ? "bijgewerkt" : "geregistreerd"}.`, { variant: "success" });
      onOpenChange(false);
      form.reset();
      setUploadedFiles([]);
      onSuccess?.();
    } catch (error: Any) {
      console.error('Error saving uitstroom:', error);
      enqueueSnackbar(
        error?.message || "Kon uitstroom niet opslaan",
        { variant: "error" }
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {uitstroom ? "Uitstroom bewerken" : "Nieuwe uitstroom"}
          </DialogTitle>
          <DialogDescription>
            {uitstroom
              ? "Bewerk de gegevens van de uitstroom"
              : "Registreer een cliënt die uit zorg gaat"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientNaam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliënt Naam *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Volledige naam" 
                      {...field} 
                      disabled={!!uitstroom?.id}
                    />
                  </FormControl>
                  <FormMessage />
                  {uitstroom?.id && (
                    <p className="text-xs text-muted-foreground">
                      Cliënt is geselecteerd uit de lijst
                    </p>
                  )}
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="uitstroomDatum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uitstroomdatum *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coordinator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coördinator *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer coördinator" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Dr. Sarah van der Berg">Dr. Sarah van der Berg</SelectItem>
                        <SelectItem value="Dr. Mohammed El-Amin">Dr. Mohammed El-Amin</SelectItem>
                        <SelectItem value="Drs. Linda Bakker">Drs. Linda Bakker</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reden"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reden van Uitstroom *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="volgens_plan">Beëindigd volgens plan</SelectItem>
                      <SelectItem value="overeenstemming">Voortijdig afgesloten: in overeenstemming</SelectItem>
                      <SelectItem value="eenzijdig_client">Voortijdig afgesloten: eenzijdig door de cliënt</SelectItem>
                      <SelectItem value="eenzijdig_aanbieder">Voortijdig afgesloten: eenzijdig door de aanbieder</SelectItem>
                      <SelectItem value="externe_omstandigheden">Voortijdig afgesloten: wegens externe omstandigheden</SelectItem>
                      <SelectItem value="anders">Anders. Toelichting onder opmerkingen</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showOpmerkingen && (
              <FormField
                control={form.control}
                name="opmerkingen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Toelichting *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Geef een toelichting bij de uitstroomreden..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="afsluitRapport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Afsluitrapport</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Samenvatting van het zorgtraject..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="evaluatie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evaluatie</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Evaluatie van de uitstroom (optioneel, na 3 maanden)..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="in_behandeling">In Behandeling</SelectItem>
                      <SelectItem value="afgerond">Afgerond</SelectItem>
                      <SelectItem value="bevestigd">Bevestigd</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload documenten: Eindrapportage, Afsluitbrief, Overdrachtsdossier
              </p>
              <div className="flex justify-center">
                <PrimaryButton
                  text="Bestanden kiezen"
                  type="button"
                  onClick={() => document.getElementById('uitstroom-documents-upload')?.click()}
                  icon={Upload}
                  iconSide="left"
                  animation="animate-bounce"
                  className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm px-3 py-2"
                  disabled={isSaving}
                />
                <input
                  id="uitstroom-documents-upload"
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      setUploadedFiles([...uploadedFiles, ...files]);
                    }
                  }}
                />
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                      <span className="text-muted-foreground">{file.name}</span>
                      <PrimaryButton
                        text=""
                        type="button"
                        onClick={() => {
                          setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
                        }}
                        icon={XCircle}
                        animation="animate-bounce"
                        className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white text-sm px-2 py-2"
                        disabled={isSaving}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <PrimaryButton
                text="Annuleren"
                type="button"
                onClick={() => onOpenChange(false)}
                icon={XCircle}
                animation="animate-bounce"
                className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 text-sm"
                disabled={isSaving}
              />
              <PrimaryButton
                text={isSaving ? "Bezig met opslaan..." : (uitstroom ? "Opslaan" : "Registreren")}
                type="submit"
                icon={CheckCircle}
                animation="animate-bounce"
                className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white px-4 py-3 text-sm"
                disabled={isSaving}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
