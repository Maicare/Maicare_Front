import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSnackbar } from "notistack";
import { Loader2, Users, XCircle, CheckCircle } from "lucide-react";

interface BulkActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onComplete: () => void;
}

const mockMentoren = [
  { id: "1", naam: "Laura van der Berg" },
  { id: "2", naam: "Mohamed Aziz" },
  { id: "3", naam: "Sophie Dekker" },
  { id: "4", naam: "Thomas Jansen" },
  { id: "5", naam: "Emma Visser" },
];

export function BulkActionsDialog({
  open,
  onOpenChange,
  selectedIds,
  onComplete,
}: BulkActionsDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [action, setAction] = useState<string>("");
  const [mentor, setMentor] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!action) {
      enqueueSnackbar("Kies welke actie je wilt uitvoeren", { variant: "warning" });
      return;
    }

    if (action === "assign_mentor" && !mentor) {
      enqueueSnackbar("Kies een mentor om toe te wijzen", { variant: "warning" });
      return;
    }

    setLoading(true);

    // Simuleer de bulk actie
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    
    enqueueSnackbar(`${selectedIds.length} cliënt(en) succesvol bijgewerkt`, { variant: "success" });

    onComplete();
    onOpenChange(false);
    setAction("");
    setMentor("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Bulk Acties
          </DialogTitle>
          <DialogDescription>
            Voer een actie uit op {selectedIds.length} geselecteerde cliënt(en)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="action">Actie</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer een actie..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assign_mentor">Mentor toewijzen</SelectItem>
                <SelectItem value="export">Exporteren naar Excel</SelectItem>
                <SelectItem value="archive">Archiveren</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {action === "assign_mentor" && (
            <div className="space-y-2">
              <Label htmlFor="mentor">Mentor</Label>
              <Select value={mentor} onValueChange={setMentor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer een mentor..." />
                </SelectTrigger>
                <SelectContent>
                  {mockMentoren.map((m) => (
                    <SelectItem key={m.id} value={m.naam}>
                      {m.naam}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            disabled={loading}
          />
          <PrimaryButton
            text="Uitvoeren"
            type="button"
            onClick={handleExecute}
            icon={CheckCircle}
            animation="animate-bounce"
            className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white px-4 py-3 text-sm"
            disabled={loading}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
