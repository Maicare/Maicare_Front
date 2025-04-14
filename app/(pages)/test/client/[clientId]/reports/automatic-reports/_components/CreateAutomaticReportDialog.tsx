"use client";

import PrimaryButton from "@/common/components/PrimaryButton";
import { Id } from "@/common/types/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useAutomaticReport } from "@/hooks/automatic-report/use-automatic-report";
import { CreateAutomaticReport, ValidateAutomaticReport } from "@/types/automatic-report.types";
import { cn } from "@/utils/cn";
import { addDays, addHours, format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

type Props = {
    handleGenerate: (values: CreateAutomaticReport) => Promise<string | undefined>;
    handleValidate: (values: ValidateAutomaticReport) => Promise<void>;
}

const CreateAutomaticReportDialog = ({ handleGenerate, handleValidate: handleValidateProp }: Props) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState<DateRange | undefined>({
        from: addDays(new Date(), -5),
        to: addDays(new Date(), 2),
    });
    const [report, setReport] = useState("");


    const handleClick = async () => {
        if (!date?.from || !date.to) {
            return;
        }
        try {
            setLoading(true);
            const res = await handleGenerate({ start_date: addHours(date.from, 1).toISOString(), end_date: addHours(date.to, 1).toISOString() });
            if (res) {
                setReport(res);
            } else {
                throw new Error("Somthing went wrong!");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    const handleValidate = async () => {
        if (!date?.from || !date.to || !report) {
            return;
        }
        try {
            setLoading(true);
            await handleValidateProp({ start_date: addHours(date.from, 1).toISOString(), end_date: addHours(date.to, 1).toISOString(),report_text:report });
            setReport("");
            setDate({
                from: addDays(new Date(), -5),
                to: addDays(new Date(), 2),
            });
            setOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger asChild>
                <PrimaryButton
                    text="Add"
                    // onClick={handleAdd}
                    disabled={false}
                    icon={PlusCircle}
                    animation="animate-bounce"
                    className="bg-indigo-400 text-white"
                />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Nieuwe Automatische Rapporten Toevoegen</DialogTitle>
                </DialogHeader>
                <Popover modal>
                    <Label>Datumbereik</Label>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start" >
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
                {
                    report && (
                        <>
                            <Textarea
                                rows={6}
                                value={report}
                                onChange={(e) => { setReport(e.target.value) }}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <Button disabled={!date?.from || !date.to || loading} className="w-full p-2 text-center bg-indigo-300 text-indigo-600 hover:text-white hover:bg-indigo-700" onClick={handleClick}>
                                    Rapport Genereren
                                </Button>
                                <Button disabled={!date?.from || !date.to || !report || loading} className="w-full p-2 text-center bg-indigo-300 text-indigo-600 hover:text-white hover:bg-indigo-700" onClick={handleValidate}>
                                    Valideren & Opslaan
                                </Button>
                            </div>
                        </>
                    )
                }

                {
                    !report && (
                        <Button disabled={!date?.from || !date.to || loading} className="w-full p-2 text-center bg-indigo-300 text-indigo-600 hover:text-white hover:bg-indigo-700" onClick={handleClick}>
                            Rapport Genereren
                        </Button>
                    )
                }


            </DialogContent>
        </Dialog>
    )
}

export default CreateAutomaticReportDialog