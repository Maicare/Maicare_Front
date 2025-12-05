import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, FileText, Building2, Download } from "lucide-react";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Any } from "@/common/types/types";

interface ClientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Any;
}

export function ClientDetailsDialog({
  open,
  onOpenChange,
  client,
}: ClientDetailsDialogProps) {
  if (!client) return null;

  const gebruikPercentage = (client.beschikkingsGebruikt / client.beschikkingsTotaal) * 100;
  const eenheidLabel = client.beschikkingsEenheid === "uren" ? "uren" : 
                       client.beschikkingsEenheid === "weken" ? "weken" : "dagen";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Cliënt Dossier</DialogTitle>
          <DialogDescription>
            Volledige informatie van {client.naam}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold">{client.naam}</h3>
              <p className="text-muted-foreground">{client.leeftijd} jaar</p>
            </div>
            <Badge className="text-base px-3 py-1">{client.zorgvorm}</Badge>
          </div>

          <Separator />

          <Tabs defaultValue="algemeen" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="algemeen">Algemeen</TabsTrigger>
              <TabsTrigger value="hoofdaanbieder">Hoofdaanbieder</TabsTrigger>
              <TabsTrigger value="rapportages">Rapportages</TabsTrigger>
            </TabsList>

            <TabsContent value="algemeen" className="space-y-6 mt-6">
              {/* Cliënt Contact & Verwijzing */}
              <div>
                <h4 className="font-semibold mb-3">Contactgegevens & Verwijzing</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Mentor:</span>
                    <p className="font-medium">{client.mentor || "Niet toegewezen"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Zorgvorm:</span>
                    <p className="font-medium">{client.zorgvorm}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Ouders/Verzorgers:</span>
                    <p className="font-medium text-muted-foreground italic">Nog in te vullen</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Verwijzende Instantie:</span>
                    <p className="font-medium text-muted-foreground italic">Nog in te vullen</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Zorgperiode */}
              <div>
                <h4 className="font-semibold mb-3">Zorgperiode</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Locatie:</span>
                    <p className="font-medium">{client.locatie}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Startdatum:</span>
                    <p className="font-medium">{client.startDatum}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Einddatum:</span>
                    <p className="font-medium">{client.eindDatum}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Herindicatie:</span>
                    <p className="font-medium">{client.herindicatie}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={client.alertStatus === "ok" ? "default" : "destructive"}>
                      {client.alertStatus === "ok" ? "Actueel" : 
                       client.alertStatus === "bijna_verlopen" ? "Bijna Verlopen" : "Verlopen"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Beschikking */}
              <div>
                <h4 className="font-semibold mb-3">
                  Beschikking ({client.beschikkingsEenheid === "uren" ? "Uren" : 
                              client.beschikkingsEenheid === "weken" ? "Weken" : "Dagen"})
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Totaal:</span>
                      <p className="font-medium">{client.beschikkingsTotaal} {eenheidLabel}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gebruikt:</span>
                      <p className="font-medium">{client.beschikkingsGebruikt} {eenheidLabel}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Resterend:</span>
                      <p className="font-medium">
                        {client.beschikkingsTotaal - client.beschikkingsGebruikt} {eenheidLabel}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Voortgang</span>
                      <span className="font-medium">{Math.round(gebruikPercentage)}%</span>
                    </div>
                    <Progress value={gebruikPercentage} className="h-3" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hoofdaanbieder" className="space-y-6 mt-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-lg">Hoofdaanbieder Informatie</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Organisatie</span>
                    <p className="text-lg font-medium">{client.hoofdaanbieder}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Contactpersoon</span>
                      <p className="font-medium">{client.contactpersoon_hoofdaanbieder || "Niet ingevuld"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Zorgvorm</span>
                      <p className="font-medium">{client.zorgvorm}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {client.contactpersoon_telefoon && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Phone className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Telefoonnummer</p>
                          <p className="font-medium">{client.contactpersoon_telefoon}</p>
                        </div>
                      </div>
                    )}

                    {client.contactpersoon_email && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Mail className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">E-mailadres</p>
                          <p className="font-medium">{client.contactpersoon_email}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <MapPin className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Locatie</p>
                        <p className="font-medium">{client.locatie}</p>
                      </div>
                    </div>
                  </div>

                  {client.opdrachtbevestiging_url && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <FileText className="w-4 h-4 text-primary" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Opdrachtbevestiging</p>
                          <p className="font-medium">Beschikbaar</p>
                        </div>
                        <PrimaryButton
                          text="Download"
                          type="button"
                          icon={Download}
                          animation="animate-bounce"
                          className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm px-3 py-2"
                          disabled={false}
                        />
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="rapportages" className="space-y-4 mt-6">
              {/* Rapportages */}
              <div>
                <h4 className="font-semibold mb-3">Recente Rapportages</h4>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">Maandrapportage December 2024</p>
                    <p className="text-muted-foreground text-xs mt-1">Aangemaakt: 05-01-2025</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">Evaluatie Q4 2024</p>
                    <p className="text-muted-foreground text-xs mt-1">Aangemaakt: 20-12-2024</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">Zorgplan Update</p>
                    <p className="text-muted-foreground text-xs mt-1">Aangemaakt: 15-11-2024</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
