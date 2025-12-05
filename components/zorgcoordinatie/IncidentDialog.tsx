import { useEffect, useState } from "react";
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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { VerbeterlogDialog } from "./VerbeterlogDialog";
import { Plus, Calendar, User, CheckCircle2, Clock, X, XCircle, CheckCircle } from "lucide-react";
import { Any } from "@/common/types/types";

const verbeteringSchema = z.object({
  verbeterpunt: z.string().min(1, "Verbeterpunt is verplicht"),
  verantwoordelijke: z.string().min(1, "Verantwoordelijke is verplicht"),
  deadline: z.string().optional(),
});

const formSchema = z.object({
  clientNaam: z.string().min(2, "Cliënt naam is verplicht"),
  datum: z.string().min(1, "Datum is verplicht"),
  tijd: z.string().min(1, "Tijd is verplicht"),
  type: z.enum(["agressie", "medicatie", "veiligheid", "ongewenst_gedrag"]),
  ernst: z.enum(["laag", "middel", "hoog"]),
  locatie: z.string().min(1, "Locatie is verplicht"),
  medewerker: z.string().min(1, "Medewerker is verplicht"),
  beschrijving: z.string().min(20, "Beschrijving moet minimaal 20 karakters bevatten"),
  genomenActie: z.string().min(10, "Beschrijf de genomen actie"),
  betrokkenen: z.string().optional(),
  status: z.enum(["nieuw", "in_onderzoek", "afgerond"]),
  verbeteringen: z.array(verbeteringSchema).optional(),
});

interface IncidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident?: Any;
}

export function IncidentDialog({
  open,
  onOpenChange,
  incident,
}: IncidentDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [verbeterlogItems, setVerbeterlogItems] = useState<Any[]>([]);
  const [verbeterlogDialogOpen, setVerbeterlogDialogOpen] = useState(false);
  const [selectedVerbeterlogItem, setSelectedVerbeterlogItem] = useState<Any>();
  const [verbeteringen, setVerbeteringen] = useState<Array<{ verbeterpunt: string; verantwoordelijke: string; deadline: string }>>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: incident || {
      clientNaam: "",
      datum: new Date().toISOString().split('T')[0],
      tijd: new Date().toTimeString().slice(0, 5),
      type: "agressie",
      ernst: "middel",
      locatie: "",
      medewerker: "",
      beschrijving: "",
      genomenActie: "",
      betrokkenen: "",
      status: "nieuw",
      verbeteringen: [],
    },
  });

  useEffect(() => {
    if (incident?.id) {
      fetchVerbeterlogItems();
    }
  }, [incident?.id]);

  const fetchVerbeterlogItems = async () => {
    if (!incident?.id) return;
    
    // const { data, error } = await supabase
    //   .from("verbeterlog_items")
    //   .select("*")
    //   .eq("incident_id", incident.id)
    //   .order("created_at", { ascending: false });

    // if (error) {
    //   console.error("Error fetching verbeterlog items:", error);
    //   return;
    // }

    // setVerbeterlogItems(data || []);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        client_naam: values.clientNaam,
        datum: values.datum,
        tijd: values.tijd,
        type: values.type,
        ernst: values.ernst,
        locatie: values.locatie,
        medewerker: values.medewerker,
        beschrijving: values.beschrijving,
        genomen_actie: values.genomenActie,
        betrokkenen: values.betrokkenen || null,
        status: values.status,
      };

      if (incident?.id) {
        // const { error } = await supabase
        //   .from("incidenten")
        //   .update(data)
        //   .eq("id", incident.id);

        // if (error) throw error;
      } else {
        // Insert incident en krijg het ID terug
        // const { data: newIncident, error: incidentError } = await supabase
        //   .from("incidenten")
        //   .insert([data])
        //   .select()
        //   .single();

        // if (incidentError) throw incidentError;

        // Voeg verbeteringen toe aan verbeterlog
      //   if (verbeteringen.length > 0 && newIncident) {
      //     const verbeterlogData = verbeteringen.map(v => ({
      //       incident_id: newIncident.id,
      //       verbeterpunt: v.verbeterpunt,
      //       verantwoordelijke: v.verantwoordelijke,
      //       deadline: v.deadline || null,
      //       status: "open" as const,
      //     }));

      //     const { error: verbeterlogError } = await supabase
      //       .from("verbeterlog_items")
      //       .insert(verbeterlogData);

      //     if (verbeterlogError) throw verbeterlogError;
      //   }
      }

      enqueueSnackbar(`Incident is succesvol ${incident ? "bijgewerkt" : "geregistreerd"}.`, { variant: "success" });
      setVerbeteringen([]);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error saving incident:", error);
      enqueueSnackbar("Er is een fout opgetreden bij het opslaan.", { variant: "error" });
    }
  };

  const addVerbetering = () => {
    setVerbeteringen([...verbeteringen, { verbeterpunt: "", verantwoordelijke: "", deadline: "" }]);
  };

  const removeVerbetering = (index: number) => {
    setVerbeteringen(verbeteringen.filter((_, i) => i !== index));
  };

  const updateVerbetering = (index: number, field: string, value: string) => {
    const updated = [...verbeteringen];
    updated[index] = { ...updated[index], [field]: value };
    setVerbeteringen(updated);
  };

  const handleAddVerbeterlog = () => {
    setSelectedVerbeterlogItem(undefined);
    setVerbeterlogDialogOpen(true);
  };

  const handleEditVerbeterlog = (item: Any) => {
    setSelectedVerbeterlogItem(item);
    setVerbeterlogDialogOpen(true);
  };

  const statusConfig = {
    open: { label: "Open", variant: "default" as const, icon: Clock },
    in_uitvoering: { label: "In Uitvoering", variant: "secondary" as const, icon: Clock },
    afgerond: { label: "Afgerond", variant: "outline" as const, icon: CheckCircle2 },
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {incident ? "Incident bewerken" : "Nieuw incident registreren"}
          </DialogTitle>
          <DialogDescription>
            {incident
              ? "Bewerk de incidentgegevens"
              : "Registreer een nieuw incident"}
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
                    <Input placeholder="Naam cliënt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="datum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Datum *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tijd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tijd *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type Incident *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="agressie">Agressie</SelectItem>
                        <SelectItem value="medicatie">Medicatie</SelectItem>
                        <SelectItem value="veiligheid">Veiligheid</SelectItem>
                        <SelectItem value="ongewenst_gedrag">Ongewenst Gedrag</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ernst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ernst *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer ernst" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="laag">Laag</SelectItem>
                        <SelectItem value="middel">Middel</SelectItem>
                        <SelectItem value="hoog">Hoog</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="locatie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locatie *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer locatie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Amsterdam Zuid">Amsterdam Zuid</SelectItem>
                        <SelectItem value="Rotterdam Centrum">Rotterdam Centrum</SelectItem>
                        <SelectItem value="Utrecht West">Utrecht West</SelectItem>
                        <SelectItem value="Den Haag Noord">Den Haag Noord</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medewerker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medewerker *</FormLabel>
                    <FormControl>
                      <Input placeholder="Naam medewerker" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="beschrijving"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschrijving Incident *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Gedetailleerde beschrijving van het incident..."
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
              name="genomenActie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genomen Actie *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Beschrijf de direct genomen actie..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="betrokkenen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Andere Betrokkenen</FormLabel>
                  <FormControl>
                    <Input placeholder="Namen andere betrokkenen" {...field} />
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
                      <SelectItem value="in_onderzoek">In Onderzoek</SelectItem>
                      <SelectItem value="afgerond">Afgerond</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!incident && (
              <>
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Verbeteringen</h3>
                      <p className="text-sm text-muted-foreground">
                        Voeg direct verbeterpunten toe die gekoppeld worden aan dit incident
                      </p>
                    </div>
                    <PrimaryButton
                      text="Toevoegen"
                      type="button"
                      onClick={addVerbetering}
                      icon={Plus}
                      iconSide="left"
                      animation="animate-bounce"
                      className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white text-sm px-3 py-2"
                      disabled={false}
                    />
                  </div>

                  {verbeteringen.length === 0 ? (
                    <div className="text-center py-6 border rounded-lg border-dashed">
                      <p className="text-sm text-muted-foreground">
                        Nog geen verbeteringen toegevoegd
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {verbeteringen.map((verbetering, index) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-medium">Verbeterpunt {index + 1}</h4>
                              <PrimaryButton
                                text=""
                                type="button"
                                onClick={() => removeVerbetering(index)}
                                icon={X}
                                animation="animate-bounce"
                                className="h-8 w-8 p-0 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
                                disabled={false}
                              />
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <label className="text-sm font-medium">
                                  Verbeterpunt *
                                </label>
                                <Textarea
                                  placeholder="Beschrijf wat er verbeterd moet worden..."
                                  value={verbetering.verbeterpunt}
                                  onChange={(e) => updateVerbetering(index, "verbeterpunt", e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-sm font-medium">
                                    Verantwoordelijke *
                                  </label>
                                  <Input
                                    placeholder="Naam verantwoordelijke"
                                    value={verbetering.verantwoordelijke}
                                    onChange={(e) => updateVerbetering(index, "verantwoordelijke", e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Deadline
                                  </label>
                                  <Input
                                    type="date"
                                    value={verbetering.deadline}
                                    onChange={(e) => updateVerbetering(index, "deadline", e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {incident?.id && (
              <>
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Verbeterlog</h3>
                      <p className="text-sm text-muted-foreground">
                        Vastgelegde verbeterpunten en follow-up acties
                      </p>
                    </div>
                    <PrimaryButton
                      text="Verbeterpunt"
                      type="button"
                      onClick={handleAddVerbeterlog}
                      icon={Plus}
                      iconSide="left"
                      animation="animate-bounce"
                      className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white text-sm px-3 py-2"
                      disabled={false}
                    />
                  </div>

                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    {verbeterlogItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <p className="text-muted-foreground">
                          Nog geen verbeterpunten toegevoegd
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Klik op &quot;Verbeterpunt&quot; om een nieuw verbeterpunt toe te voegen
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {verbeterlogItems.map((item) => {
                          const statusConf = statusConfig[item.status as keyof typeof statusConfig];
                          const StatusIcon = statusConf.icon;
                          
                          return (
                            <Card
                              key={item.id}
                              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => handleEditVerbeterlog(item)}
                            >
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-medium text-sm flex-1">
                                    {item.verbeterpunt}
                                  </p>
                                  <Badge variant={statusConf.variant} className="gap-1">
                                    <StatusIcon className="w-3 h-3" />
                                    {statusConf.label}
                                  </Badge>
                                </div>
                                
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {item.verantwoordelijke}
                                  </div>
                                  {item.deadline && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {new Date(item.deadline).toLocaleDateString("nl-NL")}
                                    </div>
                                  )}
                                </div>

                                {item.resultaat && (
                                  <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                                    <span className="font-medium">Resultaat:</span> {item.resultaat}
                                  </p>
                                )}
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
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
                text={incident ? "Opslaan" : "Registreren"}
                type="submit"
                icon={CheckCircle}
                animation="animate-bounce"
                className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white px-4 py-3 text-sm"
                disabled={false}
              />
            </div>
          </form>
        </Form>
        </DialogContent>
      </Dialog>

      {incident?.id && (
        <VerbeterlogDialog
          open={verbeterlogDialogOpen}
          onOpenChange={setVerbeterlogDialogOpen}
          incidentId={incident.id}
          verbeterlogItem={selectedVerbeterlogItem}
          onSuccess={fetchVerbeterlogItems}
        />
      )}
    </>
  );
}
