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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSnackbar } from "notistack";
import { Upload, FileText, Download, Trash2, XCircle, CheckCircle } from "lucide-react";
import { useAttachment } from "@/hooks/attachment/use-attachment";
import { Any } from "@/common/types/types";

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Any;
  onSave?: (clientId: string, mentor: string) => void;
}

const mockMentoren = [
  { id: "1", naam: "Laura van der Berg" },
  { id: "2", naam: "Mohamed Aziz" },
  { id: "3", naam: "Sophie Dekker" },
  { id: "4", naam: "Thomas Jansen" },
  { id: "5", naam: "Emma Visser" },
];

export function EditClientDialog({
  open,
  onOpenChange,
  client,
  onSave,
}: EditClientDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { createOne: uploadFile, readOne: downloadFile, deleteOne: deleteFile } = useAttachment();
  const [selectedMentor, setSelectedMentor] = useState(client?.mentor || "");
  const [contactpersoon, setContactpersoon] = useState(client?.contactpersoon_hoofdaanbieder || "");
  const [telefoon, setTelefoon] = useState(client?.contactpersoon_telefoon || "");
  const [email, setEmail] = useState(client?.contactpersoon_email || "");
  const [uploading, setUploading] = useState(false);
  const [opdrachtbevestigingFileId, setOpdrachtbevestigingFileId] = useState<string | null>(client?.opdrachtbevestiging_url || null);

  if (!client) return null;

  const handleSave = async () => {
    const mentorValue = selectedMentor === "none" ? "" : selectedMentor;
    
    try {
      // const { error } = await supabase
      //   .from('clienten')
      //   .update({ 
      //     mentor: mentorValue,
      //     contactpersoon_hoofdaanbieder: contactpersoon,
      //     contactpersoon_telefoon: telefoon,
      //     contactpersoon_email: email
      //   })
      //   .eq('id', client.id);

      // if (error) throw error;

      // onSave?.(client.id, mentorValue);
      // enqueueSnackbar(`Gegevens succesvol bijgewerkt voor ${client.naam}`, { variant: "success" });
      // onOpenChange(false);
    } catch (error) {
      console.error('Error updating client:', error);
      enqueueSnackbar("Kon gegevens niet opslaan", { variant: "error" });
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const attachment = await uploadFile(formData, { displayProgress: false, displaySuccess: true });
      
      // Store file_id for future reference
      setOpdrachtbevestigingFileId(attachment.file_id);
      
      // TODO: Update client via API with opdrachtbevestiging_file_id: attachment.file_id
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!opdrachtbevestigingFileId) return;

    try {
      const attachment = await downloadFile(opdrachtbevestigingFileId, { displayProgress: false, displaySuccess: false });
      
      // Download the file from the URL
      const response = await fetch(attachment.file_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `opdrachtbevestiging_${client.naam}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDeleteDocument = async () => {
    if (!opdrachtbevestigingFileId) return;
    if (!confirm('Weet je zeker dat je dit document wilt verwijderen?')) return;

    try {
      await deleteFile(opdrachtbevestigingFileId, { displayProgress: false, displaySuccess: true });
      setOpdrachtbevestigingFileId(null);
      
      // TODO: Update client via API to remove opdrachtbevestiging_file_id
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cliënt Bewerken</DialogTitle>
          <DialogDescription>
            Wijs een mentor toe aan {client.naam}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="mentor">Mentor</Label>
            <Select value={selectedMentor || "none"} onValueChange={setSelectedMentor}>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer een mentor..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Geen mentor</SelectItem>
                {mockMentoren.map((mentor) => (
                  <SelectItem key={mentor.id} value={mentor.naam}>
                    {mentor.naam}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactpersoon">Contactpersoon Hoofdaanbieder</Label>
            <Input
              id="contactpersoon"
              value={contactpersoon}
              onChange={(e) => setContactpersoon(e.target.value)}
              placeholder="Naam contactpersoon..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefoon">Telefoonnummer</Label>
            <Input
              id="telefoon"
              type="tel"
              value={telefoon}
              onChange={(e) => setTelefoon(e.target.value)}
              placeholder="06-12345678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contactpersoon@voorbeeld.nl"
            />
          </div>

          <div className="space-y-2">
            <Label>Opdrachtbevestiging</Label>
            {opdrachtbevestigingFileId ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 p-2 bg-muted rounded flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Opdrachtbevestiging geüpload</span>
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
            text="Opslaan"
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
