import { FunctionComponent, useMemo } from "react";
import { format } from "date-fns";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/utils/cn";
import { RecurrenceType } from "@/types/calendar.types";

/* ── local constants (only used here) ───────────────────────────────────── */
const recurrenceOptions = [
  { value: RecurrenceType.NONE, label: "No recurrence" },
  { value: RecurrenceType.DAILY, label: "Daily" },
  { value: RecurrenceType.WEEKLY, label: "Weekly" },
  { value: RecurrenceType.MONTHLY, label: "Monthly" },
] as const;

const recurrenceUnits: Record<
  Exclude<RecurrenceType, RecurrenceType.NONE>,
  { singular: string; plural: string }
> = {
  [RecurrenceType.DAILY]: { singular: "day", plural: "days" },
  [RecurrenceType.WEEKLY]: { singular: "week", plural: "weeks" },
  [RecurrenceType.MONTHLY]: { singular: "month", plural: "months" },
};

/* ── props ─────────────────────────────────────────────────────────────── */
type Props = {
  type: RecurrenceType;
  interval: number;
  endDate: Date | null;
  onTypeChange: (t: RecurrenceType) => void;
  onIntervalChange: (n: number) => void;
  onEndDateChange: (d: Date | null) => void;
  className?: string;
};

const RecurrenceSelect: FunctionComponent<Props> = ({
  type,
  interval,
  endDate,
  onTypeChange,
  onIntervalChange,
  onEndDateChange,
  className,
}) => {
  const intervalLabel = useMemo(() => {
    if (type === RecurrenceType.NONE) return "";
    return interval === 1
      ? recurrenceUnits[type].singular
      : recurrenceUnits[type].plural;
  }, [type, interval]);

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-slate-600 font-medium">Recurrence</Label>

      {/* recurrence type */}
      <Select
        value={type}
        onValueChange={(val: RecurrenceType) => {
          onTypeChange(val);
          if (val === RecurrenceType.NONE) {
            onIntervalChange(1);
            onEndDateChange(null);
          }
        }}
      >
        <SelectTrigger className="w-full hover:border-indigo-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200">
          <SelectValue placeholder="Select recurrence" />
        </SelectTrigger>
        <SelectContent className="border-slate-200 bg-white">
          {recurrenceOptions.map(({ value, label }) => (
            <SelectItem
              key={value}
              value={value}
              className="text-slate-700 hover:bg-indigo-50 focus:bg-indigo-50"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* extra controls when recurring */}
      {type !== RecurrenceType.NONE && (
        <div className="space-y-3 pl-4 border-l-2 border-indigo-100 ml-3">
          {/* interval */}
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-2">
              <Label className="text-slate-600 text-sm">Every</Label>
              <input
                type="number"
                min={1}
                value={interval}
                onChange={(e) =>
                  onIntervalChange(Math.max(1, Number(e.target.value)))
                }
                className="w-16 px-2 py-1.5 border border-slate-200 rounded-md text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
              />
            </div>
            <span className="text-sm text-slate-600 font-medium">
              {intervalLabel}
            </span>
          </div>

          {/* end date */}
          <div className="flex items-center gap-3">
            <Label className="text-slate-600 text-sm">Ends</Label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="text-sm px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors w-full text-left"
                >
                  {endDate ? format(endDate, "MMM d, yyyy") : "No end date"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white rounded-md shadow-lg">
                <Calendar
                  mode="single"
                  selected={endDate ?? undefined}
                  onSelect={(d) => onEndDateChange(d ?? null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurrenceSelect;
