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
import { XCircle, CheckCircle } from "lucide-react";
import { Any } from "@/common/types/types";

const formSchema = z.object({
  clientNaam: z.string().min(2, "Naam is verplicht"),
  intakeDatum: z.string().min(1, "Intakedatum is verplicht"),
  intakeTijd: z.string().min(1, "Tijd is verplicht"),
  locatie: z.string().min(1, "Locatie is verplicht"),
  coordinator: z.string().min(1, "Coördinator is verplicht"),
  gezinssituatie: z.string().min(1, "Gezinssituatie is verplicht"),
  hoofdaanbieder: z.string().min(1, "Hoofdaanbieder is verplicht"),
  beperkingen: z.string().optional(),
  leefgebieden: z.string().min(1, "Leefgebieden zijn verplicht"),
  doelen: z.string().min(1, "Doelen zijn verplicht"),
  status: z.enum(["gepland", "afgerond", "in_afwachting"]),
  bijzonderheden: z.string().optional(),
});

interface IntakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intake?: Any;
}

export function IntakeDialog({
  open,
  onOpenChange,
  intake,
}: IntakeDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: intake || {
      clientNaam: "",
      intakeDatum: "",
      intakeTijd: "",
      locatie: "",
      coordinator: "",
      gezinssituatie: "",
      hoofdaanbieder: "",
      beperkingen: "",
      leefgebieden: "",
      doelen: "",
      status: "gepland",
      bijzonderheden: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    enqueueSnackbar(
      `Intake voor ${values.clientNaam} is succesvol ${intake ? "bijgewerkt" : "gepland"}.`,
      { variant: "success" }
    );
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {intake ? "Intake bewerken" : "Intake plannen"}
          </DialogTitle>
          <DialogDescription>
            {intake
              ? "Bewerk de intakegegevens"
              : "Plan een nieuwe intake met de cliënt"}
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
                name="intakeDatum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intakedatum *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="intakeTijd"
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
                name="coordinator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coördinator *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <FormField
              control={form.control}
              name="gezinssituatie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gezinssituatie *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Beschrijf de gezinssituatie..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hoofdaanbieder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hoofdaanbieder *</FormLabel>
                  <FormControl>
                    <Input placeholder="Naam hoofdaanbieder" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="beperkingen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beperkingen</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Eventuele beperkingen..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leefgebieden"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leefgebieden *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Aandachtsgebieden (bijv. school, sociale vaardigheden, gezondheid)..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doelen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doelen *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Zorgdoelen en verwachte uitkomsten..."
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
                      <SelectItem value="gepland">Gepland</SelectItem>
                      <SelectItem value="afgerond">Afgerond</SelectItem>
                      <SelectItem value="in_afwachting">In Afwachting</SelectItem>
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
                text={intake ? "Opslaan" : "Plannen"}
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
