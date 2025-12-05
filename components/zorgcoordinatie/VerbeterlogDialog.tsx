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
import { XCircle, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSnackbar } from "notistack";
import { Any } from "@/common/types/types";

const formSchema = z.object({
  verbeterpunt: z.string().min(10, "Verbeterpunt moet minimaal 10 karakters bevatten"),
  verantwoordelijke: z.string().min(2, "Verantwoordelijke is verplicht"),
  deadline: z.string().optional(),
  status: z.enum(["open", "in_uitvoering", "afgerond"]),
  resultaat: z.string().optional(),
});

interface VerbeterlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incidentId: string;
  verbeterlogItem?: Any;
  onSuccess?: () => void;
}

export function VerbeterlogDialog({
  open,
  onOpenChange,
  incidentId,
  verbeterlogItem,
  onSuccess,
}: VerbeterlogDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: verbeterlogItem || {
      verbeterpunt: "",
      verantwoordelijke: "",
      deadline: "",
      status: "open",
      resultaat: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data: Any = {
        incident_id: incidentId,
        verbeterpunt: values.verbeterpunt,
        verantwoordelijke: values.verantwoordelijke,
        deadline: values.deadline || null,
        status: values.status,
        resultaat: values.resultaat || null,
      };

      if (values.status === "afgerond") {
        data.afgerond_op = new Date().toISOString();
      }

      if (verbeterlogItem?.id) {
        // const { error } = await supabase
        //   .from("verbeterlog_items")
        //   .update(data)
        //   .eq("id", verbeterlogItem.id);

        // if (error) throw error;
      } else {
        // const { error } = await supabase
        //   .from("verbeterlog_items")
        //   .insert([data]);

        // if (error) throw error;
      }

      enqueueSnackbar("Het verbeterpunt is succesvol opgeslagen.", { variant: "success" });
      
      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error saving verbeterlog item:", error);
      enqueueSnackbar("Er is een fout opgetreden bij het opslaan.", { variant: "error" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {verbeterlogItem ? "Verbeterpunt bewerken" : "Nieuw verbeterpunt toevoegen"}
          </DialogTitle>
          <DialogDescription>
            {verbeterlogItem
              ? "Bewerk het verbeterpunt"
              : "Voeg een nieuw verbeterpunt toe aan dit incident"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="verbeterpunt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verbeterpunt *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Beschrijf wat er verbeterd moet worden..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="verantwoordelijke"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verantwoordelijke *</FormLabel>
                    <FormControl>
                      <Input placeholder="Naam verantwoordelijke" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
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
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_uitvoering">In Uitvoering</SelectItem>
                      <SelectItem value="afgerond">Afgerond</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resultaat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resultaat</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Beschrijf het resultaat indien afgerond..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                text={verbeterlogItem ? "Opslaan" : "Toevoegen"}
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
  );
}