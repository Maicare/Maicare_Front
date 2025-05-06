"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import PrimaryButton from "@/common/components/PrimaryButton";
import {
  Bot,
  CalendarIcon,
  Info,
  PencilIcon,
  PlusCircle,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Tooltip from "@/common/components/Tooltip";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { GoalObjective } from "@/types/goals.types";

export const createObjectiveSchema = z.object({
  objective_description: z.string().min(1, "Description is required"),
  due_date: z.date(),
  status: z.string().default("pending"),
});

export type CreateObjectiveForm = z.infer<typeof createObjectiveSchema>;

type Props = {
  mode: "create" | "update";
  handleCreate: (values: CreateObjectiveForm) => void;
  handleUpdate: (values: CreateObjectiveForm) => void;
  handleGenerate: () => void;
  objective?: GoalObjective;
  isOpen: boolean;
  handleOpen: (bool: boolean) => void;
  className?: string;
};

const UpsertObjectiveSheet = ({
  mode,
  handleCreate,
  handleUpdate,
  handleGenerate,
  objective,
  handleOpen,
  isOpen,
  className,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateObjectiveForm>({
    resolver: zodResolver(createObjectiveSchema),
    defaultValues: objective
      ? {
        objective_description: objective.objective_description,
        due_date: new Date(objective.due_date),
        status: objective.status,
      }
      : {
        objective_description: "",
        due_date: new Date(),
        status: "pending",
      },
  });

  async function onSubmit(values: CreateObjectiveForm) {
    setLoading(true);
    if (mode === "create") {
      handleCreate(values);
    } else {
      handleUpdate(values);
    }
    handleOpen(false);
    setLoading(false);
  }

  useEffect(() => {
    if (objective) {
      form.setValue("objective_description", objective.objective_description);
      form.setValue("due_date", new Date(objective.due_date));
      form.setValue("status", objective.status);
    }
  }, [objective, form]);

  return (
    <Sheet open={isOpen} onOpenChange={(o) => handleOpen(o)}>
      <SheetTrigger asChild>
        {mode === "create" ? (
          <PrimaryButton
            text="Add"
            disabled={false}
            icon={PlusCircle}
            animation="animate-bounce"
            className={className || "bg-indigo-400 text-white"}
          />
        ) : (
          <PrimaryButton
            text="Edit"
            disabled={false}
            icon={PencilIcon}
            animation="animate-bounce"
            className={className || "bg-indigo-400 text-white"}
          />
        )}
      </SheetTrigger>

      <SheetContent
        className="bg-slate-200/50 backdrop-blur-sm overflow-scroll"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>
            {mode === "create" ? "Nieuwe Objective" : "Bewerk Objective"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Creëer nieuwe objective."
              : "Pas de objective aan."}
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-4">


          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="objective_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between text-sm font-semibold">
                      Beschrijving
                      <Tooltip text="This is beschrijving">
                        <Info className="h-5 w-5 mr-2" />
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="beschrijving"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Doeldatum
                      <Tooltip text="This is doeldatum.">
                        <Info className="h-5 w-5 mr-2" />
                      </Tooltip>
                    </FormLabel>

                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-white"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <input type="hidden" {...form.register("status")} />

              <Button
                type="button"
                onClick={handleGenerate}
                className="w-full flex items-center justify-center gap-2 bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <Bot className="h-4 w-4" />
                Generate
              </Button>

              <div className="flex items-center justify-between gap-2 mt-4">
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-indigo-200 text-indigo-600 hover:text-white hover:bg-indigo-600 transition-colors"
                >
                  Save changes
                </Button>

                <Button
                  type="button"
                  onClick={() => handleOpen(false)}
                  className="w-full bg-red-200 text-red-600 hover:text-white hover:bg-red-600 transition-colors"
                >
                  Cancel
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UpsertObjectiveSheet;
