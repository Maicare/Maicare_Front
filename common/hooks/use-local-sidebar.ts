"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

export function useLocalSidebar(key: string, defaultValue: boolean):[boolean,Dispatch<SetStateAction<boolean>>] {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (typeof window !== "undefined") {
        setValue(key === "true");
    }
  }, [key, value]);

  return [value, setValue];
}