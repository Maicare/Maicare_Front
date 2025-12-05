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
  clientNaam: z.string().min(2, "Naam moet minimaal 2 karakters bevatten"),
  vanLocatie: z.string().min(1, "Van locatie is verplicht"),
  naarLocatie: z.string().min(1, "Naar locatie is verplicht"),
  oudeMentor: z.string().min(1, "Oude mentor is verplicht"),
  nieuweMentor: z.string().min(1, "Nieuwe mentor is verplicht"),
  aanvraagDatum: z.string().min(1, "Aanvraagdatum is verplicht"),
  reden: z.string().min(10, "Reden moet minimaal 10 karakters bevatten"),
  status: z.enum(["aanvraag", "akkoord", "verwerkt"]),
  overdrachtsRapport: z.string().optional(),
});

interface DoorstroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doorstroom?: Any;
}

export function DoorstroomDialog({
  open,
  onOpenChange,
  doorstroom,
}: DoorstroomDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: doorstroom || {
      clientNaam: "",
      vanLocatie: "",
      naarLocatie: "",
      oudeMentor: "",
      nieuweMentor: "",
      aanvraagDatum: new Date().toISOString().split('T')[0],
      reden: "",
      status: "aanvraag",
      overdrachtsRapport: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    enqueueSnackbar(
      `Doorstroom voor ${values.clientNaam} is succesvol ${doorstroom ? "bijgewerkt" : "aangemaakt"}.`,
      { variant: "success" }
    );
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {doorstroom ? "Doorstroom bewerken" : "Nieuwe interne doorstroom"}
          </DialogTitle>
          <DialogDescription>
            {doorstroom
              ? "Bewerk de gegevens van de interne doorstroom"
              : "Registreer een interne doorstroom naar een andere locatie"}
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
                    <Input placeholder="Volledige naam" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vanLocatie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Van Locatie *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer locatie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Amsterdam Zuid">Amsterdam Zuid</SelectItem>
                        <SelectItem value="Amsterdam Noord">Amsterdam Noord</SelectItem>
                        <SelectItem value="Rotterdam Centrum">Rotterdam Centrum</SelectItem>
                        <SelectItem value="Rotterdam West">Rotterdam West</SelectItem>
                        <SelectItem value="Utrecht West">Utrecht West</SelectItem>
                        <SelectItem value="Utrecht Oost">Utrecht Oost</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="naarLocatie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Naar Locatie *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer locatie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Amsterdam Zuid">Amsterdam Zuid</SelectItem>
                        <SelectItem value="Amsterdam Noord">Amsterdam Noord</SelectItem>
                        <SelectItem value="Rotterdam Centrum">Rotterdam Centrum</SelectItem>
                        <SelectItem value="Rotterdam West">Rotterdam West</SelectItem>
                        <SelectItem value="Utrecht West">Utrecht West</SelectItem>
                        <SelectItem value="Utrecht Oost">Utrecht Oost</SelectItem>
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
                name="oudeMentor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Huidige Mentor *</FormLabel>
                    <FormControl>
                      <Input placeholder="Naam mentor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nieuweMentor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nieuwe Mentor *</FormLabel>
                    <FormControl>
                      <Input placeholder="Naam mentor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="aanvraagDatum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aanvraagdatum *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reden"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reden van Doorstroom *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Beschrijf de reden van de interne doorstroom..."
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
              name="overdrachtsRapport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overdrachtsrapport</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Belangrijke informatie voor overdracht..."
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
                      <SelectItem value="aanvraag">Aanvraag</SelectItem>
                      <SelectItem value="akkoord">Akkoord</SelectItem>
                      <SelectItem value="verwerkt">Verwerkt</SelectItem>
                    </SelectContent>
                  </Select>
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
                text={doorstroom ? "Opslaan" : "Aanmaken"}
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
