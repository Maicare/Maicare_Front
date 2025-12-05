import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PrimaryButton from "@/common/components/PrimaryButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, XCircle } from "lucide-react";
import { Any } from "@/common/types/types";

interface SearchFilters {
  naam?: string;
  leeftijdMin?: number;
  leeftijdMax?: number;
  zorgvorm?: string;
  locatie?: string;
  mentor?: string;
  herindicatieVan?: string;
  herindicatieTot?: string;
}

interface AdvancedSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (filters: SearchFilters) => void;
}

export function AdvancedSearchDialog({
  open,
  onOpenChange,
  onSearch,
}: AdvancedSearchDialogProps) {
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleSearch = () => {
    onSearch(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({});
  };

  const updateFilter = (key: keyof SearchFilters, value: Any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Geavanceerd Zoeken
          </DialogTitle>
          <DialogDescription>
            Gebruik meerdere filters om specifieke cliënten te vinden
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="naam">Naam</Label>
            <Input
              id="naam"
              placeholder="Cliënt naam..."
              value={filters.naam || ""}
              onChange={(e) => updateFilter("naam", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mentor">Mentor</Label>
            <Input
              id="mentor"
              placeholder="Mentor naam..."
              value={filters.mentor || ""}
              onChange={(e) => updateFilter("mentor", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leeftijdMin">Leeftijd (min)</Label>
            <Input
              id="leeftijdMin"
              type="number"
              placeholder="Van..."
              value={filters.leeftijdMin || ""}
              onChange={(e) => updateFilter("leeftijdMin", parseInt(e.target.value) || undefined)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leeftijdMax">Leeftijd (max)</Label>
            <Input
              id="leeftijdMax"
              type="number"
              placeholder="Tot..."
              value={filters.leeftijdMax || ""}
              onChange={(e) => updateFilter("leeftijdMax", parseInt(e.target.value) || undefined)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zorgvorm">Zorgvorm</Label>
            <Select value={filters.zorgvorm || "all"} onValueChange={(val) => updateFilter("zorgvorm", val === "all" ? undefined : val)}>
              <SelectTrigger>
                <SelectValue placeholder="Alle zorgvormen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle zorgvormen</SelectItem>
                <SelectItem value="BW">BW</SelectItem>
                <SelectItem value="KTC">KTC</SelectItem>
                <SelectItem value="BZW">BZW</SelectItem>
                <SelectItem value="Ambulant">Ambulant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locatie">Locatie</Label>
            <Input
              id="locatie"
              placeholder="Locatie..."
              value={filters.locatie || ""}
              onChange={(e) => updateFilter("locatie", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="herindicatieVan">Herindicatie vanaf</Label>
            <Input
              id="herindicatieVan"
              type="date"
              value={filters.herindicatieVan || ""}
              onChange={(e) => updateFilter("herindicatieVan", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="herindicatieTot">Herindicatie tot</Label>
            <Input
              id="herindicatieTot"
              type="date"
              value={filters.herindicatieTot || ""}
              onChange={(e) => updateFilter("herindicatieTot", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <PrimaryButton
            text="Reset"
            type="button"
            onClick={handleReset}
            icon={XCircle}
            iconSide="left"
            animation="animate-bounce"
            className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 text-sm"
            disabled={false}
          />
          <PrimaryButton
            text="Zoeken"
            type="button"
            onClick={handleSearch}
            icon={Search}
            iconSide="left"
            animation="animate-bounce"
            className="bg-indigo-100 text-indigo-500 hover:bg-indigo-500 hover:text-white px-4 py-3 text-sm"
            disabled={false}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
