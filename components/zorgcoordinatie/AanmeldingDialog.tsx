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
import { Upload, X, XCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useAttachment } from "@/hooks/attachment/use-attachment";
import { Any } from "@/common/types/types";

const formSchema = z.object({
  naam: z.string().min(2, "Naam cliënt is verplicht"),
  geboortedatum: z.string().min(1, "Geboortedatum is verplicht"),
  bsn: z.string().min(9, "BSN moet 9 cijfers bevatten").max(9),
  verwijzendOrganisatie: z.string().min(2, "Verwijzende organisatie is verplicht"),
  verwijzer_contactpersoon: z.string().optional(),
  verwijzer_telefoon: z.string().optional(),
  verwijzer_email: z.string().email("Ongeldig e-mailadres").optional().or(z.literal("")),
  aanmelddatum: z.string().min(1, "Aanmelddatum is verplicht"),
  gewenste_zorgvorm: z.string().min(1, "Zorgvorm is verplicht"),
  reden: z.string().min(10, "Reden moet minimaal 10 karakters bevatten"),
  status: z.enum(["nieuw", "in_behandeling", "compleet", "afgewezen"]),
  coordinator: z.string().min(1, "Coördinator is verplicht"),
  bijzonderheden: z.string().optional(),
});

interface AanmeldingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aanmelding?: Any;
}

export function AanmeldingDialog({
  open,
  onOpenChange,
  aanmelding,
}: AanmeldingDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { createOne: uploadFile } = useAttachment();
  const [gezinsplanFile, setGezinsplanFile] = useState<File | null>(null);
  const [andereDocumenten, setAndereDocumenten] = useState<File[]>([]);
  const [veelVoorkomendOrganisaties, setVeelVoorkomendOrganisaties] = useState<Any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: aanmelding || {
      naam: "",
      geboortedatum: "",
      bsn: "",
      verwijzendOrganisatie: "",
      verwijzer_contactpersoon: "",
      verwijzer_telefoon: "",
      verwijzer_email: "",
      aanmelddatum: new Date().toISOString().split('T')[0],
      gewenste_zorgvorm: "",
      reden: "",
      status: "nieuw",
      coordinator: "",
      bijzonderheden: "",
    },
  });

  useEffect(() => {
    if (open) {
      fetchVerwijzendeOrganisaties();
    }
  }, [open]);

  async function fetchVerwijzendeOrganisaties() {
    // const { data } = await supabase
    //   .from('verwijzende_organisaties')
    //   .select('*')
    //   .order('gebruikt_count', { ascending: false })
    //   .limit(10);
    
    // if (data) {
    //   setVeelVoorkomendOrganisaties(data);
    // }
  }

  async function uploadGezinsplan(clientNaam: string): Promise<string | null> {
    if (!gezinsplanFile) return null;

    const formData = new FormData();
    formData.append('file', gezinsplanFile);
    const attachment = await uploadFile(formData, { displayProgress: false, displaySuccess: true });
    return attachment.file_url;
  }

  async function uploadAndereDocumenten(clientNaam: string): Promise<string[]> {
    if (andereDocumenten.length === 0) return [];

    const urls: string[] = [];

    for (const file of andereDocumenten) {
      const formData = new FormData();
      formData.append('file', file);
      const attachment = await uploadFile(formData, { displayProgress: false, displaySuccess: true });
      urls.push(attachment.file_url);
    }

    return urls;
  }

  async function saveOrUpdateOrganisatie(organisatieNaam: string, contactData: Any) {
    // const { data: existing } = await supabase
    //   .from('verwijzende_organisaties')
    //   .select('*')
    //   .eq('organisatie_naam', organisatieNaam)
    //   .maybeSingle();

    // if (existing) {
    //   await supabase
    //     .from('verwijzende_organisaties')
    //     .update({ 
    //       gebruikt_count: existing.gebruikt_count + 1,
    //       contactpersoon: contactData.contactpersoon || existing.contactpersoon,
    //       telefoon: contactData.telefoon || existing.telefoon,
    //       email: contactData.email || existing.email,
    //     })
    //     .eq('id', existing.id);
    // } else {
    //   await supabase
    //     .from('verwijzende_organisaties')
    //     .insert([{
    //       organisatie_naam: organisatieNaam,
    //       contactpersoon: contactData.contactpersoon,
    //       telefoon: contactData.telefoon,
    //       email: contactData.email,
    //     }]);
    // }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsUploading(true);

      // Upload gezinsplan indien aanwezig
      const gezinsplanUrl = await uploadGezinsplan(values.naam);

      // Sla verwijzende organisatie op of update count
      await saveOrUpdateOrganisatie(values.verwijzendOrganisatie, {
        contactpersoon: values.verwijzer_contactpersoon,
        telefoon: values.verwijzer_telefoon,
        email: values.verwijzer_email,
      });

      console.log(values);
      enqueueSnackbar(
        `${values.naam} is succesvol ${aanmelding ? "bijgewerkt" : "aangemeld"}.`,
        { variant: "success" }
      );
      onOpenChange(false);
      form.reset();
      setGezinsplanFile(null);
      setAndereDocumenten([]);
    } catch (error) {
      console.error('Error submitting aanmelding:', error);
      enqueueSnackbar("Kon aanmelding niet opslaan", { variant: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {aanmelding ? "Aanmelding bewerken" : "Nieuwe aanmelding"}
          </DialogTitle>
          <DialogDescription>
            {aanmelding
              ? "Bewerk de gegevens van de aanmelding"
              : "Voeg een nieuwe cliënt aanmelding toe"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Cliëntgegevens</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="naam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Naam Cliënt *</FormLabel>
                      <FormControl>
                        <Input placeholder="Volledige naam" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>

              <FormField
                control={form.control}
                name="bsn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BSN *</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789" maxLength={9} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Verwijzende Instantie</h3>
              
              <FormField
                control={form.control}
                name="verwijzendOrganisatie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organisatie *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer of typ nieuwe organisatie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {veelVoorkomendOrganisaties.map((org) => (
                          <SelectItem key={org.id} value={org.organisatie_naam}>
                            {org.organisatie_naam}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormControl>
                      <Input 
                        placeholder="Of typ nieuwe organisatie..."
                        value={field.value}
                        onChange={field.onChange}
                        className="mt-2"
                      />
                    </FormControl>
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
                  name="aanmelddatum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aanmelddatum *</FormLabel>
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
                <FormField
                  control={form.control}
                  name="coordinator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coördinator *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
            </div>

            <FormField
              control={form.control}
              name="reden"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reden van Aanmelding *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Beschrijf de reden van aanmelding..."
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
              name="bijzonderheden"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bijzonderheden</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Eventuele bijzonderheden..."
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
                      <SelectItem value="nieuw">Nieuw</SelectItem>
                      <SelectItem value="in_behandeling">In Behandeling</SelectItem>
                      <SelectItem value="compleet">Compleet</SelectItem>
                      <SelectItem value="afgewezen">Afgewezen</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Documenten</h3>
              
              <div className="space-y-2">
                <Label>Gezinsplan</Label>
                <div className="flex items-center gap-3">
                  <PrimaryButton
                    text={gezinsplanFile ? "Ander bestand kiezen" : "Gezinsplan uploaden"}
                    type="button"
                    onClick={() => document.getElementById('gezinsplan-upload-aanmelding')?.click()}
                    icon={Upload}
                    iconSide="left"
                    animation="animate-bounce"
                    className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm px-3 py-2"
                    disabled={false}
                  />
                  <input
                    id="gezinsplan-upload-aanmelding"
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
                    onClick={() => document.getElementById('andere-documenten-upload-aanmelding')?.click()}
                    icon={Upload}
                    iconSide="left"
                    animation="animate-bounce"
                    className="w-full bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm px-3 py-2"
                    disabled={false}
                  />
                  <input
                    id="andere-documenten-upload-aanmelding"
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

            <div className="flex justify-end gap-3 pt-4">
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
                text={isUploading ? "Bezig met opslaan..." : aanmelding ? "Opslaan" : "Aanmelden"}
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
