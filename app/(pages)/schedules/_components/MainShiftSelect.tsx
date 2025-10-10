"use client";

import { FunctionComponent, useEffect } from "react";
import { useShift } from "@/hooks/shift/use-shift";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface MainShiftSelectProps {
  locationId: number;
  value: number;
  onChange: (shiftId: number) => void;
}

const MainShiftSelect: FunctionComponent<MainShiftSelectProps> = ({
  locationId,
  value,
  onChange,
}) => {
  const { shifts, isLoading } = useShift({
    location_id: locationId,
    autoFetch: true,
  });

  const options = shifts ?? [];

  useEffect(() => {
    if (!isLoading) {
      if (value && !options.some((s) => s.id === value)) {
        onChange(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId, isLoading, options, value]);
  return (
    <Select
      value={String(value)}
      onValueChange={(val) => onChange(Number(val))}
      disabled={isLoading || options.length === 0}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? "Loading shifts…" : "Select a shift"} />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="__loading" disabled>
            Loading shifts…
          </SelectItem>
        ) : options.length === 0 ? (
          <SelectItem value="__none" disabled>
            No shifts available
          </SelectItem>
        ) : (
          options.map((s) => (
            <SelectItem key={s.id} value={String(s.id)}>
              {s.shift}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default MainShiftSelect;
