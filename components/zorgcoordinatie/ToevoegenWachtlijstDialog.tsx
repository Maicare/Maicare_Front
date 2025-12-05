import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import PrimaryButton from "@/common/components/PrimaryButton";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { Upload, X, XCircle, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useAttachment } from "@/hooks/attachment/use-attachment";
import { useClient } from "@/hooks/client/use-client";
import { useAuth } from "@/common/hooks/use-auth";
import { useLocation } from "@/hooks/location/use-location";
import { useOrganisation } from "@/hooks/organisation/use-organisation";
import { CreateClientInput } from "@/types/client.types";
import { AddressType } from "@/schemas/clientNew.schema";
import { Any } from "@/common/types/types";

const formSchema = z.object({
  client_naam: z.string().min(2, "Naam cliënt is verplicht"),
  geboortedatum: z.string().min(1, "Geboortedatum is verplicht"),
  intake_datum: z.string().min(1, "Intake datum is verplicht"),
  gewenste_zorgvorm: z.string().min(1, "Zorgvorm is verplicht"),
  location_id: z.string().min(1, "Locatie is verplicht"),
  prioriteit: z.string().min(1, "Prioriteit is verplicht"),
  organisation_id: z.string().min(1, "Verwijzende organisatie is verplicht"),
  verwijzer_contactpersoon: z.string().optional(),
  verwijzer_telefoon: z.string().optional(),
  verwijzer_email: z.string().email("Ongeldig e-mailadres").optional().or(z.literal("")),
  opmerkingen: z.string().optional(),
});

interface ToevoegenWachtlijstDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ToevoegenWachtlijstDialog({ open, onOpenChange, onSuccess }: ToevoegenWachtlijstDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { createOne: uploadFile } = useAttachment();
  const { createOne: createClient, updateStatus } = useClient({ autoFetch: false });
  const { user } = useAuth({ autoFetch: true });
  const { locations } = useLocation({ autoFetch: true });
  const { organisations } = useOrganisation({ autoFetch: true });
  const [gezinsplanFile, setGezinsplanFile] = useState<File | null>(null);
  const [andereDocumenten, setAndereDocumenten] = useState<File[]>([]);
  const [veelVoorkomendOrganisaties, setVeelVoorkomendOrganisaties] = useState<Any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_naam: "",
      geboortedatum: "",
      intake_datum: new Date().toISOString().split('T')[0],
      gewenste_zorgvorm: "",
      location_id: "",
      prioriteit: "normaal",
      organisation_id: "",
      verwijzer_contactpersoon: "",
      verwijzer_telefoon: "",
      verwijzer_email: "",
      opmerkingen: "",
    },
  });

  useEffect(() => {
    if (open && organisations) {
      setVeelVoorkomendOrganisaties(organisations.slice(0, 10));
    }
  }, [open, organisations]);

  async function uploadGezinsplan(): Promise<string | null> {
    if (!gezinsplanFile) return null;

    const formData = new FormData();
    formData.append('file', gezinsplanFile);
    const attachment = await uploadFile(formData, { displayProgress: false, displaySuccess: true });
    return attachment.file_id;
  }

  async function uploadAndereDocumenten(): Promise<string[]> {
    if (andereDocumenten.length === 0) return [];

    const attachmentIds: string[] = [];

    for (const file of andereDocumenten) {
      const formData = new FormData();
      formData.append('file', file);
      const attachment = await uploadFile(formData, { displayProgress: false, displaySuccess: true });
      attachmentIds.push(attachment.file_id);
    }

    return attachmentIds;
  }

  function splitClientName(fullName: string): { first_name: string; last_name: string } {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return { first_name: parts[0], last_name: "" };
    }
    const last_name = parts[parts.length - 1];
    const first_name = parts.slice(0, -1).join(" ");
    return { first_name, last_name };
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsUploading(true);

      if (!user?.employee_id) {
        throw new Error("Gebruiker niet gevonden. Log opnieuw in.");
      }

      if (!values.location_id) {
        throw new Error("Selecteer een geldige locatie.");
      }

      if (!values.organisation_id) {
        throw new Error("Selecteer een geldige organisatie.");
      }

      const selectedOrganisation = organisations?.find(org => org.id.toString() === values.organisation_id);
      const { first_name, last_name } = splitClientName(values.client_naam);

      const gezinsplanAttachmentId = await uploadGezinsplan();
      const andereDocumentenAttachmentIds = await uploadAndereDocumenten();

      const identityDocuments: string[] = [];
      if (gezinsplanAttachmentId) {
        identityDocuments.push(gezinsplanAttachmentId);
      }
      identityDocuments.push(...andereDocumentenAttachmentIds);

      const defaultAddress: AddressType = {
        belongs_to: "client",
        address: "",
        city: "",
        zip_code: "",
        phone_number: values.verwijzer_telefoon || "",
        house_number: "",
      };

      const clientData: CreateClientInput = {
        first_name,
        last_name,
        email: values.verwijzer_email || `${first_name.toLowerCase().replace(/\s+/g, '.')}.${last_name.toLowerCase()}@example.com`,
        organisation_id: values.organisation_id,
        location_id: values.location_id,
        legal_measure: values.gewenste_zorgvorm,
        birthplace: "",
        departement: "",
        gender: "",
        filenumber: `WL-${Date.now()}`,
        phone_number: values.verwijzer_telefoon || "",
        bsn: "",
        source: selectedOrganisation?.name || "",
        date_of_birth: values.geboortedatum,
        addresses: [defaultAddress],
        added_identity_documents: identityDocuments.length > 0 ? identityDocuments : undefined,
        departure_reason: values.opmerkingen || undefined,
        sender_id: user.employee_id,
      };

      const createdClient = await createClient(clientData, {
        displayProgress: true,
        displaySuccess: false,
      });

      await updateStatus(
        createdClient.id.toString(),
        {
          status: "On Waiting List",
          schedueled: false,
          reason: `Toegevoegd aan wachtlijst. Prioriteit: ${values.prioriteit}. Intake datum: ${values.intake_datum}`,
        },
        { displayProgress: false, displaySuccess: true }
      );

      enqueueSnackbar(`${values.client_naam} is toegevoegd aan de wachtlijst`, { variant: "success" });
      
      form.reset();
      setGezinsplanFile(null);
      setAndereDocumenten([]);
      onOpenChange(false);
      onSuccess?.();
    } catch (error: Any) {
      console.error('Error adding to wachtlijst:', error);
      enqueueSnackbar(
        error?.message || "Kon cliënt niet toevoegen aan wachtlijst",
        { variant: "error" }
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cliënt toevoegen aan wachtlijst</DialogTitle>
          <DialogDescription>
            Voeg een cliënt toe aan de wachtlijst wanneer er geen plek beschikbaar is
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Cliëntgegevens</h3>
              <FormField
                control={form.control}
                name="client_naam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Naam cliënt *</FormLabel>
                    <FormControl>
                      <Input placeholder="Volledige naam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="geboortedatum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Geboortedatum *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="intake_datum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intake datum *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Verwijzende Instantie</h3>
              
              <FormField
                control={form.control}
                name="organisation_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organisatie *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer organisatie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {veelVoorkomendOrganisaties.length > 0 ? (
                          veelVoorkomendOrganisaties.map((org) => (
                            <SelectItem key={org.id} value={org.id.toString()}>
                              {org.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>Geen organisaties beschikbaar</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="verwijzer_contactpersoon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contactpersoon</FormLabel>
                    <FormControl>
                      <Input placeholder="Naam contactpersoon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="verwijzer_telefoon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefoonnummer</FormLabel>
                      <FormControl>
                        <Input placeholder="06-12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="verwijzer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mailadres</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@organisatie.nl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Aanmelding Voor</h3>
              
              <FormField
                control={form.control}
                name="gewenste_zorgvorm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zorgvorm *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer zorgvorm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beschermd Wonen 24/7">Beschermd Wonen 24/7</SelectItem>
                        <SelectItem value="Semi Zelfstandig Wonen">Semi Zelfstandig Wonen</SelectItem>
                        <SelectItem value="Zelfstandig Begeleid Wonen">Zelfstandig Begeleid Wonen</SelectItem>
                        <SelectItem value="Ambulante begeleiding">Ambulante begeleiding</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gewenste locatie *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer locatie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations && locations.length > 0 ? (
                            locations.map((location) => (
                              <SelectItem key={location.id} value={location.id.toString()}>
                                {location.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>Geen locaties beschikbaar</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prioriteit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioriteit *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer prioriteit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hoog">Hoog - Spoedeisend</SelectItem>
                          <SelectItem value="normaal">Normaal - Regulier</SelectItem>
                          <SelectItem value="laag">Laag - Niet urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Documenten</h3>
              
              <div className="space-y-2">
                <Label>Gezinsplan</Label>
                <div className="flex items-center gap-3">
                  <PrimaryButton
                    text={gezinsplanFile ? "Ander bestand kiezen" : "Gezinsplan uploaden"}
                    type="button"
                    onClick={() => document.getElementById('gezinsplan-upload')?.click()}
                    icon={Upload}
                    iconSide="left"
                    animation="animate-bounce"
                    className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm px-3 py-2"
                    disabled={false}
                  />
                  <input
                    id="gezinsplan-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setGezinsplanFile(file);
                    }}
                  />
                  {gezinsplanFile && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{gezinsplanFile.name}</span>
                      <PrimaryButton
                        text=""
                        type="button"
                        onClick={() => setGezinsplanFile(null)}
                        icon={X}
                        animation="animate-bounce"
                        className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white text-sm px-2 py-2"
                        disabled={false}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Andere Documenten</Label>
                <div className="space-y-2">
                  <PrimaryButton
                    text="Andere documenten toevoegen"
                    type="button"
                    onClick={() => document.getElementById('andere-documenten-upload')?.click()}
                    icon={Upload}
                    iconSide="left"
                    animation="animate-bounce"
                    className="w-full bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm px-3 py-2"
                    disabled={false}
                  />
                  <input
                    id="andere-documenten-upload"
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        setAndereDocumenten([...andereDocumenten, ...files]);
                      }
                    }}
                  />
                  {andereDocumenten.length > 0 && (
                    <div className="space-y-2">
                      {andereDocumenten.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <span className="text-sm text-muted-foreground">{file.name}</span>
                          <PrimaryButton
                            text=""
                            type="button"
                            onClick={() => {
                              setAndereDocumenten(andereDocumenten.filter((_, i) => i !== index));
                            }}
                            icon={X}
                            animation="animate-bounce"
                            className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white text-sm px-2 py-2"
                            disabled={false}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="opmerkingen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opmerkingen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Extra informatie of bijzonderheden..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <PrimaryButton
                text="Annuleren"
                type="button"
                onClick={() => onOpenChange(false)}
                icon={XCircle}
                animation="animate-bounce"
                className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 text-sm"
                disabled={isUploading}
              />
              <PrimaryButton
                text={isUploading ? "Bezig met opslaan..." : "Toevoegen aan wachtlijst"}
                type="submit"
                icon={CheckCircle}
                animation="animate-bounce"
                className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white px-4 py-3 text-sm"
                disabled={isUploading}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
