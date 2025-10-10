import { Sun, Sunset, Moon, Clock } from "lucide-react";
import { Shift } from "@/schemas/shift.schema";
import { Badge } from "@/components/ui/badge";

export type ScheduleRow = {
  shift_name: string;
  employee_name: string;
  start_time: string;
  end_time: string;
  event_id?: string;
};

type ShiftPlaceholderProps = {
  shift: Shift;
  isDefault: boolean;
  detailed?: boolean;
  schedule?: ScheduleRow[];
  onClick?: () => void;
  onBadgeClick?: (row?: ScheduleRow) => void;
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
  onBadgeClick,
  detailed = false,
}: ShiftPlaceholderProps) => {
  const rows =
    schedule?.filter((r) => {
      if (isDefault) return r.shift_name === shift.shift;
      return (
        r.shift_name === shift.shift &&
        r.start_time === shift.start_time &&
        r.end_time === shift.end_time
      );
    }) ?? [];

  const count = rows.length;
  if (isDefault && !DEFAULT_SHIFTS.includes(shift.shift)) return null;

  let containerCls = "";
  let badgeBase = "";
  let badgeHover = "";
  let badgeText = "";

  const gray = () => {
    containerCls = "bg-gray-100 text-gray-400";
    badgeBase = "bg-gray-200";
    badgeHover = "hover:bg-gray-300";
    badgeText = "text-gray-500";
  };

  const palette = (
    base: string,
    text: string,
    hover: string,
    container: string
  ) => {
    badgeBase = base;
    badgeText = text;
    badgeHover = hover;
    containerCls = container;
  };

  if (count === 0) {
    gray();
  } else if (isDefault) {
    switch (shift.shift) {
      case "Ochtenddienst":
        palette(
          "bg-amber-200",
          "text-amber-900",
          "hover:bg-amber-300",
          "bg-amber-100 text-amber-800"
        );
        break;
      case "Avonddienst":
        palette(
          "bg-orange-200",
          "text-orange-900",
          "hover:bg-orange-300",
          "bg-orange-100 text-orange-800"
        );
        break;
      case "Slaapdienst of Waakdienst":
        palette(
          "bg-violet-200",
          "text-violet-900",
          "hover:bg-violet-300",
          "bg-violet-100 text-violet-800"
        );
        break;
      default:
        gray();
    }
  } else {
    palette(
      "bg-blue-200",
      "text-blue-900",
      "hover:bg-blue-300",
      "bg-blue-100 text-blue-800"
    );
  }

  return (
    <div className={`flex flex-col gap-2 truncate rounded text-xs p-2 ${containerCls}`} onClick={onClick}>

      <div className="flex items-center">
        {isDefault ? getIcon(shift.shift) : <Clock className="w-3 h-3" />}

        {isDefault ? (
          detailed && (
            <span className="ml-2 font-semibold tracking-wide">{shift.shift}</span>
          )
        ) : (
          <span className="ml-2 text-[11px] font-semibold tracking-wide flex-shrink-0">
            {formatTimeRange(shift.start_time, shift.end_time)}
          </span>
        )}

        {!detailed && (
          <span
            className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] font-medium ${badgeBase} ${badgeText}`}
          >
            {count}
          </span>
        )}
      </div>

      {count > 0 && (
        <div className="flex flex-wrap gap-1">
          {rows.map((r, i) => (
            <Badge
              key={i}
              className={`cursor-pointer ${badgeBase} ${badgeText} ${badgeHover}`}
              onClick={(e) => {
                e.stopPropagation();
                onBadgeClick?.(r);
              }}
            >
              {r.employee_name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShiftPlaceholder;
