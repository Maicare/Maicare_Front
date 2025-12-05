'use client'

import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bed, Plus, Minus, AlertTriangle, ExternalLink, XCircle, CheckCircle, Pencil } from "lucide-react";
import PrimaryButton from "@/common/components/PrimaryButton";
import { useSnackbar } from "notistack";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLocation } from "@/hooks/location/use-location";
import { Location } from "@/types/location.types";

interface BeddenCapaciteit {
  id: string;
  locatie: string;
  totaal_bedden: number;
  bezette_bedden: number;
}

export function BeddenCapaciteitCard() {
  const { locations, isLoading, readOne, createOne, updateOne } = useLocation({ autoFetch: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [totaalBedden, setTotaalBedden] = useState("");
  const [bezetteBedden, setBezetteBedden] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [nieuweLocatie, setNieuweLocatie] = useState("");
  const [nieuwTotaalBedden, setNieuwTotaalBedden] = useState("");
  const [nieuwAdres, setNieuwAdres] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const capaciteiten = useMemo<BeddenCapaciteit[]>(() => {
    if (!locations) return [];
    return locations
      .map((location: Location) => ({
        id: location.id,
        locatie: location.name,
        totaal_bedden: location.capacity,
        bezette_bedden: location.occupied,
      }))
      .sort((a, b) => a.locatie.localeCompare(b.locatie));
  }, [locations]);

  const handleEdit = (cap: BeddenCapaciteit) => {
    setEditingId(cap.id);
    setTotaalBedden(cap.totaal_bedden.toString());
    setBezetteBedden(cap.bezette_bedden.toString());
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      const existingLocation = locations?.find(loc => loc.id === editingId);
      if (!existingLocation) {
        enqueueSnackbar("Locatie niet gevonden", { variant: "error" });
        return;
      }

      await updateOne(
        {
          name: existingLocation.name,
          address: existingLocation.address,
          capacity: parseInt(totaalBedden),
          organisation_id: existingLocation.organisation_id,
        },
        editingId,
        { displayProgress: true, displaySuccess: true }
      );

      setEditingId(null);
      setTotaalBedden("");
      setBezetteBedden("");
    } catch (error) {
      console.error('Error updating capaciteit:', error);
    }
  };

  const getBezettingPercentage = (cap: BeddenCapaciteit) => {
    return (cap.bezette_bedden / cap.totaal_bedden) * 100;
  };

  const handleAddLocatie = async () => {
    if (!nieuweLocatie || !nieuwTotaalBedden || !nieuwAdres) {
      enqueueSnackbar("Vul alle verplichte velden in", { variant: "warning" });
      return;
    }

    try {
      // Use the first location's organisation_id if available, otherwise we'd need to add it to the form
      const organisationId = locations?.[0]?.organisation_id;
      if (!organisationId) {
        enqueueSnackbar("Geen organisatie ID gevonden. Voeg eerst een locatie toe via de locaties pagina.", { variant: "error" });
        return;
      }

      await createOne(
        {
          name: nieuweLocatie,
          address: nieuwAdres,
          capacity: parseInt(nieuwTotaalBedden),
          organisation_id: organisationId,
        },
        { displayProgress: true, displaySuccess: true }
      );

      setAddDialogOpen(false);
      setNieuweLocatie("");
      setNieuwTotaalBedden("");
      setNieuwAdres("");
    } catch (error) {
      console.error('Error adding locatie:', error);
      // Error message is already shown by the hook
    }
  };

  if (isLoading) {
    return <div>Laden...</div>;
  }

  const totalBeschikbaar = capaciteiten.reduce(
    (sum, cap) => sum + (cap.totaal_bedden - cap.bezette_bedden),
    0
  );
  const alleenVolleLocaties = capaciteiten.every(
    (cap) => cap.totaal_bedden - cap.bezette_bedden === 0
  );

  const handleNavigateToWachtlijst = () => {
    // Scroll to top first
    window.scrollTo(0, 0);
    // Then trigger tab change by clicking the wachtlijst tab
    const wachtlijstTab = document.querySelector('[value="wachtlijst"]') as HTMLElement;
    if (wachtlijstTab) {
      wachtlijstTab.click();
    }
  };

  return (
    <div className="space-y-4">
      {alleenVolleLocaties && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Alle plaatsen bezet</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              Er zijn momenteel geen beschikbare plaatsen op alle locaties. 
              Nieuwe aanmeldingen kunnen op de wachtlijst worden geplaatst.
            </span>
            <PrimaryButton
              text="Naar Wachtlijst"
              onClick={handleNavigateToWachtlijst}
              icon={ExternalLink}
              className="ml-4 bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm px-3 py-2"
              disabled={false}
            />
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Capaciteit per locatie</h3>
          </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
              <PrimaryButton
                text="Nieuwe locatie"
                icon={Plus}
                className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white text-sm px-3 py-2"
                disabled={false}
              />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nieuwe locatie toevoegen</DialogTitle>
              <DialogDescription>
                Voeg een nieuwe locatie toe met capaciteit
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Locatie naam *</Label>
                <Input
                  placeholder="Bijv. Rotterdam West"
                  value={nieuweLocatie}
                  onChange={(e) => setNieuweLocatie(e.target.value)}
                />
              </div>
                <div>
                  <Label>Adres *</Label>
                  <Input
                    placeholder="Bijv. Hoofdstraat 123, Rotterdam"
                    value={nieuwAdres}
                    onChange={(e) => setNieuwAdres(e.target.value)}
                  />
                </div>
              <div>
                <Label>Totaal aantal plaatsen *</Label>
                <Input
                  type="number"
                  placeholder="Bijv. 10"
                  value={nieuwTotaalBedden}
                  onChange={(e) => setNieuwTotaalBedden(e.target.value)}
                  min="0"
                />
              </div>
                <div className="flex justify-end gap-2">
                  <PrimaryButton
                    text="Annuleren"
                    onClick={() => setAddDialogOpen(false)}
                    icon={XCircle}
                    animation="animate-bounce"
                    className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
                    disabled={false}
                  />
                  <PrimaryButton
                    text="Toevoegen"
                    onClick={handleAddLocatie}
                    icon={Plus}
                    animation="animate-bounce"
                    className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white"
                    disabled={false}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {capaciteiten.map((cap) => {
            const location = locations?.find(loc => loc.id === cap.id);
            const beschikbaar = location?.available ?? (cap.totaal_bedden - cap.bezette_bedden);
          const percentage = getBezettingPercentage(cap);
          const isBeperkt = beschikbaar <= 2;
          const isVol = beschikbaar === 0;

          return (
            <div key={cap.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{cap.locatie}</span>
                    <Dialog>
                      <DialogTrigger asChild>
                          <PrimaryButton
                            text="Wijzig"
                          onClick={() => handleEdit(cap)}
                            icon={Pencil}
                            animation="animate-bounce"
                            className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white text-sm px-3 py-2"
                            disabled={false}
                          />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Capaciteit aanpassen</DialogTitle>
                          <DialogDescription>
                            Wijzig de capaciteit voor {cap.locatie}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Totaal aantal plaatsen</Label>
                            <Input
                              type="number"
                              value={totaalBedden}
                              onChange={(e) => setTotaalBedden(e.target.value)}
                              min="0"
                            />
                          </div>
                          <div>
                            <Label>Bezette plaatsen</Label>
                            <Input
                              type="number"
                              value={bezetteBedden}
                              onChange={(e) => setBezetteBedden(e.target.value)}
                              min="0"
                              max={totaalBedden}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                              <PrimaryButton
                                text="Annuleren"
                                onClick={() => setEditingId(null)}
                                icon={XCircle}
                                animation="animate-bounce"
                                className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white text-sm px-3 py-2"
                                disabled={false}
                              />
                              <PrimaryButton
                                text="Opslaan"
                                onClick={handleSave}
                                icon={CheckCircle}
                                animation="animate-bounce"
                                className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white text-sm px-3 py-2"
                                disabled={false}
                              />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      Bezet: <span className="font-medium text-foreground">{cap.bezette_bedden}</span>
                    </span>
                    <span>
                      Beschikbaar: <span className={`font-medium ${isVol ? 'text-red-600' : isBeperkt ? 'text-orange-600' : 'text-green-600'}`}>
                        {beschikbaar}
                      </span>
                    </span>
                    <span>
                      Totaal: <span className="font-medium text-foreground">{cap.totaal_bedden}</span>
                    </span>
                  </div>
                </div>
              </div>
              <Progress 
                value={percentage} 
                className={`h-2 ${isVol ? 'bg-red-100' : isBeperkt ? 'bg-orange-100' : 'bg-green-100'}`}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {capaciteiten.reduce((sum, cap) => sum + cap.totaal_bedden, 0)}
            </div>
            <div className="text-muted-foreground">Totaal plaatsen</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {capaciteiten.reduce((sum, cap) => sum + cap.bezette_bedden, 0)}
            </div>
            <div className="text-muted-foreground">Bezet</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {capaciteiten.reduce((sum, cap) => sum + (cap.totaal_bedden - cap.bezette_bedden), 0)}
            </div>
            <div className="text-muted-foreground">Beschikbaar</div>
          </div>
        </div>
      </div>
      </Card>
    </div>
  );
}
