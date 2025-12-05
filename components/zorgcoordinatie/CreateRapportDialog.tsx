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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSnackbar } from "notistack";
import { Loader2, FileText, XCircle, CheckCircle } from "lucide-react";
import { Any } from "@/common/types/types";

interface CreateRapportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId?: string;
}

interface Template {
  id: string;
  naam: string;
  beschrijving: string;
  template_type: string;
  velden: Any;
}

export function CreateRapportDialog({
  open,
  onOpenChange,
  clientId,
}: CreateRapportDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [titel, setTitel] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, Any>>({});

  useEffect(() => {
    if (open) {
      fetchTemplates();
    }
  }, [open]);

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from("rapportage_templates")
      .select("*")
      .eq("actief", true);

    if (!error && data) {
      setTemplates(data);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setTitel(`${template.naam} - ${new Date().toLocaleDateString("nl-NL")}`);
    }
  };

  const handleSave = async () => {
    if (!selectedTemplate || !titel) {
      enqueueSnackbar("Selecteer een template en voer een titel in", { variant: "warning" });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("rapporten").insert({
      client_id: clientId,
      template_id: selectedTemplate,
      titel,
      inhoud: formData,
      status: "concept",
    });

    setLoading(false);

    if (error) {
      enqueueSnackbar(error.message || "Kon rapport niet opslaan", { variant: "error" });
    } else {
      enqueueSnackbar("Rapport is als concept aangemaakt", { variant: "success" });
      onOpenChange(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedTemplate("");
    setTitel("");
    setFormData({});
  };

  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Nieuw Rapport Maken
          </DialogTitle>
          <DialogDescription>
            Gebruik een template om snel een rapport aan te maken
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer een template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.naam} - {template.template_type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTemplateData && (
              <p className="text-sm text-muted-foreground">
                {selectedTemplateData.beschrijving}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="titel">Titel</Label>
            <Input
              id="titel"
              value={titel}
              onChange={(e) => setTitel(e.target.value)}
              placeholder="Rapporttitel..."
            />
          </div>

          {selectedTemplateData && (
            <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
              <p className="text-sm font-medium">Template Structuur:</p>
              {selectedTemplateData.velden?.secties?.map((sectie: Any, idx: number) => (
                <div key={idx} className="text-sm">
                  <p className="font-medium text-primary">{sectie.naam}:</p>
                  <ul className="list-disc list-inside ml-4 text-muted-foreground">
                    {Array.isArray(sectie.velden) ? (
                      sectie.velden.map((veld: string, vidx: number) => (
                        <li key={vidx}>{veld.replace(/_/g, " ")}</li>
                      ))
                    ) : (
                      <li>{sectie.velden}</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <PrimaryButton
            text="Annuleren"
            type="button"
            onClick={() => {
              onOpenChange(false);
              resetForm();
            }}
            icon={XCircle}
            animation="animate-bounce"
            className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 text-sm"
            disabled={loading}
          />
          <PrimaryButton
            text="Rapport Aanmaken"
            type="button"
            onClick={handleSave}
            icon={FileText}
            animation="animate-bounce"
            className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white px-4 py-3 text-sm"
            disabled={loading}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
