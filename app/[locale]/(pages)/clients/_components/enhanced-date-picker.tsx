// components/EnhancedDatePicker.tsx
'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import Tooltip from '@/common/components/Tooltip';
import { Any } from '@/common/types/types';

interface EnhancedDatePickerProps {
  control: Any;
  name: string;
  label?: string;
  tooltipText?: string;
}

export function EnhancedDatePicker({ 
  control, 
  name, 
  label = "Date of birth",
  tooltipText = "This is date of birth." 
}: EnhancedDatePickerProps) {
  const [yearView, setYearView] = useState(false);
  const [decadeView, setDecadeView] = useState(false);
  const [currentDecade, setCurrentDecade] = useState(Math.floor(new Date().getFullYear() / 10) * 10);

  // Calculate years starting from 1950
  const currentYear = new Date().getFullYear();
  const startYear = 1950;
  
  const decades = useMemo(() => {
    const decades = [];
    for (let decade = Math.floor(currentYear / 10) * 10; decade >= 1900; decade -= 10) {
      if (decade >= 1940) { // Show decades from 1940 onwards to include 1950
        decades.push(decade);
      }
    }
    return decades;
  }, [currentYear]);

  const yearsInDecade = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => currentDecade + i)
      .filter(year => year >= startYear && year <= currentYear);
  }, [currentDecade, startYear, currentYear]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="flex items-center justify-between">
            {label}
            <Tooltip text={tooltipText}>
              <Info className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </FormLabel>
          
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                    "hover:bg-accent/50 transition-colors"
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
              className="w-auto p-0 bg-white border shadow-lg rounded-xl" 
              align="start"
            >
              {/* Header with navigation */}
              <div className="flex items-center justify-between p-3 border-b">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    if (decadeView) {
                      setCurrentDecade(prev => prev - 100);
                    } else if (yearView) {
                      setCurrentDecade(prev => prev - 10);
                    }
                  }}
                  disabled={decadeView && currentDecade - 100 < 1900}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-medium px-3 py-1 text-sm"
                    onClick={() => {
                      if (decadeView) {
                        setDecadeView(false);
                        setYearView(true);
                      } else if (yearView) {
                        setYearView(false);
                        setDecadeView(true);
                      } else {
                        setYearView(true);
                      }
                    }}
                  >
                    {decadeView ? (
                      <span>{currentDecade - 90}s - {currentDecade + 9}s</span>
                    ) : yearView ? (
                      <span>{currentDecade} - {currentDecade + 9}</span>
                    ) : (
                      <span>{format(field.value || new Date(), 'MMMM yyyy')}</span>
                    )}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    if (decadeView) {
                      setCurrentDecade(prev => prev + 100);
                    } else if (yearView) {
                      setCurrentDecade(prev => prev + 10);
                    }
                  }}
                  disabled={decadeView && currentDecade + 100 > currentYear + 100}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Decade View */}
              {decadeView ? (
                <div className="grid grid-cols-2 gap-3 p-4">
                  {decades.map((decade) => (
                    <Button
                      key={decade}
                      variant="ghost"
                      className={cn(
                        "h-12 w-full text-sm font-normal transition-all",
                        "hover:bg-primary/10 hover:scale-105",
                        currentDecade === decade && "bg-primary/20 border border-primary/30"
                      )}
                      onClick={() => {
                        setCurrentDecade(decade);
                        setDecadeView(false);
                        setYearView(true);
                      }}
                    >
                      {decade}s
                    </Button>
                  ))}
                </div>
              ) : yearView ? (
                <div className="p-3">
                  {/* Year Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {yearsInDecade.map((year) => (
                      <Button
                        key={year}
                        variant="ghost"
                        className={cn(
                          "h-10 w-full text-sm font-normal",
                          "hover:bg-primary/10 hover:scale-105 transition-all",
                          field.value && year === field.value.getFullYear() && 
                          "bg-primary/20 border border-primary/30"
                        )}
                        onClick={() => {
                          setYearView(false);
                          // Keep the current month/day or set to Jan 1st if no date selected
                          const newDate = field.value 
                            ? new Date(year, field.value.getMonth(), field.value.getDate())
                            : new Date(year, 0, 1);
                          field.onChange(newDate);
                        }}
                      >
                        {year}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Quick Year Selection */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => {
                        const recentYear = currentYear - 18; // Default to 18 years ago
                        const newDate = field.value 
                          ? new Date(recentYear, field.value.getMonth(), field.value.getDate())
                          : new Date(recentYear, 0, 1);
                        field.onChange(newDate);
                        setYearView(false);
                      }}
                    >
                      Recent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => {
                        const newDate = new Date(startYear, 0, 1);
                        field.onChange(newDate);
                        setYearView(false);
                      }}
                    >
                      Oldest
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex">
                  {/* Month Quick Select */}
                  <div className="w-32 border-r">
                    <div className="p-2">
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Months</h4>
                      <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto">
                        {months.map((month, index) => (
                          <Button
                            key={month}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-7 w-full justify-start text-xs font-normal",
                              "hover:bg-primary/10",
                              field.value && field.value.getMonth() === index && 
                              "bg-primary/20 border border-primary/30"
                            )}
                            onClick={() => {
                              const newDate = field.value 
                                ? new Date(field.value.getFullYear(), index, field.value.getDate())
                                : new Date(currentYear, index, 1);
                              field.onChange(newDate);
                            }}
                          >
                            {month.substring(0, 3)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Calendar */}
                  <div className="flex-1">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1950-01-01")
                      }
                      initialFocus
                      className="p-3"
                    />
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
}