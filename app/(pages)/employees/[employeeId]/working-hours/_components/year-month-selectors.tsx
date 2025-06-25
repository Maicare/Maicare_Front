import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  interface YearMonthSelectProps {
    filters: {
      year: string;
      month: string;
      employee_id: number;
      autoFetch: boolean;
    };
    setFilters: React.Dispatch<React.SetStateAction<{
      year: string;
      month: string;
      employee_id: number;
      autoFetch: boolean;
    }>>;
  }
  
  export function YearMonthSelectors({ filters, setFilters }: YearMonthSelectProps) {
    const handleMonthChange = (value: string) => {
      setFilters(prev => ({ ...prev, month: value }));
    };
  
    const handleYearChange = (value: string) => {
      setFilters(prev => ({ ...prev, year: value }));
    };
  
    return (
      <div className="flex gap-4">
        {/* Month Select */}
        <Select value={filters.month} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {Array.from({ length: 12 }, (_, i) => {
              const monthValue = (i + 1).toString();
              const monthName = new Date(0, i).toLocaleString('default', { month: 'long' });
              return (
                <SelectItem key={monthValue} value={monthValue} className="hover:bg-gray-100 cursor-pointer">
                  {monthName}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
  
        {/* Year Select */}
        <Select value={filters.year} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() + i - 5;
              return (
                <SelectItem key={year} value={year.toString()} className="hover:bg-gray-100 cursor-pointer">
                  {year}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    );
  }