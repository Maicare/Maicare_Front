"use client"

import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/utils/cn";

export interface MultiSelectProps {
  options: { label: string; value: string }[]
  selected: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  const toggleOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value]
    onChange(newSelected)
  }

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selected.filter(item => item !== value))
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selected.map(value => {
              const option = options.find(o => o.value === value)
              return (
                <span
                  key={value}
                  className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800"
                >
                  {option?.label}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={e => removeOption(value, e)}
                  />
                </span>
              )
            })
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>

      {isOpen && (
        <div className="absolute bg-white top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          </div>
          <div className="p-1">
            {filteredOptions.map(option => (
              <div
                key={option.value}
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onClick={() => toggleOption(option.value)}
              >
                <div className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                  selected.includes(option.value)
                    ? "bg-indigo-600 text-primary-foreground"
                    : "opacity-50"
                )}>
                  {selected.includes(option.value) && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}