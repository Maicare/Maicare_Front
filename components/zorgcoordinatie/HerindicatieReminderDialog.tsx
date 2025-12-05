import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
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
  FormDescription,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useSnackbar } from "notistack";
import { Bell, CalendarIcon, XCircle, CheckCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "../ui/button";
import { Any } from "@/common/types/types";

const formSchema = z.object({
  herinneringsDatum: z.date({
    required_error: "Herinneringsdatum is verplicht",
  }),
  herinneringsType: z.enum(["email", "dashboard", "beide"]),
  notitie: z.string().optional(),
});

interface HerindicatieReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Any;
}

export function HerindicatieReminderDialog({
  open,
  onOpenChange,
  client,
}: HerindicatieReminderDialogProps) {
  const { enqueueSnackbar } = useSnackbar();

  // Bereken een standaard herinneringsdatum (2 maanden voor herindicatie)
  const getDefaultReminderDate = () => {
    if (!client) return new Date();
    const herindicatieDatum = new Date(client.herindicatie.split('-').reverse().join('-'));
    const defaultDatum = new Date(herindicatieDatum);
    defaultDatum.setMonth(defaultDatum.getMonth() - 2);
    return defaultDatum;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      herinneringsDatum: getDefaultReminderDate(),
      herinneringsType: "beide",
      notitie: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Herinnering ingesteld:", values);

    enqueueSnackbar(
      `Je ontvangt op ${format(values.herinneringsDatum, "d MMMM yyyy", { locale: nl })} een melding`,
      { variant: "success" }
    );
    onOpenChange(false);
    form.reset();
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Herindicatie Herinnering
          </DialogTitle>
          <DialogDescription>
            Stel een herinnering in voor de herindicatie van {client.naam}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cliënt:</span>
            <span className="font-medium">{client.naam}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Herindicatie datum:</span>
            <span className="font-medium">{client.herindicatie}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Zorgvorm:</span>
            <span className="font-medium">{client.zorgvorm}</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="herinneringsDatum"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Herinneringsdatum</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "d MMMM yyyy", { locale: nl })
                          ) : (
                            <span>Kies een datum</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Kies wanneer je de herinnering wilt ontvangen
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="herinneringsType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Herinneringstype</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard notificatie</SelectItem>
                      <SelectItem value="email">Email notificatie</SelectItem>
                      <SelectItem value="beide">Dashboard + Email</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Kies hoe je de herinnering wilt ontvangen
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notitie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notitie (optioneel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Bijv. urgentie of specifieke aandachtspunten" {...field} />
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
                text="Herinnering instellen"
                type="submit"
                icon={Bell}
                iconSide="left"
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
