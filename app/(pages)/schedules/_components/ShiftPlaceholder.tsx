import { Sun, Sunset, Moon, Clock } from "lucide-react";
import { Shift } from "@/schemas/shift.schema";

export type ScheduleRow = {
  shift_name: string;
  employee_name: string;
  start_time: string;
  end_time: string;
};

type ShiftPlaceholderProps = {
  shift: Shift;
  isDefault: boolean;
  detailed?: boolean;
  schedule?: ScheduleRow[];
  onClick?: () => void
};

const DEFAULT_SHIFTS = [
  "Ochtenddienst",
  "Avonddienst",
  "Slaapdienst of Waakdienst",
];

const getIcon = (name: string) => {
  const key = name.toLowerCase();
  if (key.includes("ochtend")) return <Sun className="w-3 h-3" />;
  if (key.includes("avond")) return <Sunset className="w-3 h-3" />;
  return <Moon className="w-3 h-3" />;
};

const formatTimeRange = (start: string, end: string) => {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const s = new Date(start).toLocaleTimeString([], opts);
  const e = new Date(end).toLocaleTimeString([], opts);
  return `${s}-${e}`;
};

const ShiftPlaceholder = ({
  shift,
  isDefault,
  schedule,
  onClick,
  detailed = false,
}: ShiftPlaceholderProps) => {
  const rows = schedule?.filter(r => {
    if (isDefault) return r.shift_name === shift.shift;
    return (
      r.shift_name === shift.shift &&
      r.start_time === shift.start_time &&
      r.end_time === shift.end_time
    );
  }) ?? [];

  const count = rows.length;
  const names = rows.map(r => r.employee_name).join(", ");

  if (isDefault && !DEFAULT_SHIFTS.includes(shift.shift)) return null;

  let shiftClass = "";
  let badgeClass = "";

  if (count === 0) {
    shiftClass = "bg-gray-100 text-gray-400";
    badgeClass = "bg-gray-200 text-gray-500";
  } else if (isDefault) {
    switch (shift.shift) {
      case "Ochtenddienst":
        shiftClass = "bg-amber-100 text-amber-800";
        badgeClass = "bg-amber-200 text-amber-900";
        break;
      case "Avonddienst":
        shiftClass = "bg-orange-100 text-orange-800";
        badgeClass = "bg-orange-200 text-orange-900";
        break;
      case "Slaapdienst of Waakdienst":
        shiftClass = "bg-violet-100 text-violet-800";
        badgeClass = "bg-violet-200 text-violet-900";
        break;
      default:
        shiftClass = "bg-gray-100 text-gray-800";
        badgeClass = "bg-gray-200 text-gray-900";
    }
  } else {
    shiftClass = "bg-blue-100 text-blue-800";
    badgeClass = "bg-blue-200 text-blue-900";
  }
  return (
    <div
      className={`flex flex-col gap-2 truncate rounded text-xs p-2 ${shiftClass}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {isDefault ? getIcon(shift.shift) : <Clock className="w-3 h-3" />}

        {isDefault ? (
          detailed && (
            <span className="ml-2 font-semibold tracking-wide">
              {shift.shift}
            </span>
          )
        ) : (
          <span className="ml-2 text-[11px] font-semibold tracking-wide flex-shrink-0">
            {formatTimeRange(shift.start_time, shift.end_time)}
          </span>
        )}

        {!detailed && (
          <span
            className={`ml-auto count-badge flex h-5 w-5 items-center justify-center rounded-full
                       text-[0.6rem] font-medium ${badgeClass}`}
          >
            {count}
          </span>
        )}
      </div>

      {count > 0 && (
        <span className="truncate font-semibold">
          {names}
        </span>
      )}
    </div>
  );
};

export default ShiftPlaceholder;
