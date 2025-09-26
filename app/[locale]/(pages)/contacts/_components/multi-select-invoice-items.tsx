"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

export interface InvoiceTemplateItem {
  id: number;
  description: string;
  item_tag?: string;
  source_column?: string;
  source_table?: string;
}

interface MultiSelectInvoiceItemsProps {
  items: InvoiceTemplateItem[];
  selectedIds: number[];
  onSelectChange: (selectedIds: number[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelectInvoiceItems({
  items,
  selectedIds = [],
  onSelectChange,
  placeholder = "Select template items...",
  className,
}: MultiSelectInvoiceItemsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_tag?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle checkbox changes
  const handleCheckedChange = (itemId: number, checked: boolean) => {
    if (checked) {
      onSelectChange([...selectedIds, itemId]);
    } else {
      onSelectChange(selectedIds.filter(id => id !== itemId));
    }
  };

  // Remove a selected item
  const removeSelectedItem = (itemId: number) => {
    onSelectChange(selectedIds.filter(id => id !== itemId));
  };

  // Clear all selections
  const clearAll = () => {
    onSelectChange([]);
  };

  // Get selected items
  const selectedItems = items.filter(item => selectedIds.includes(item.id));

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Selected items display */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map(item => (
            <Badge 
              key={item.id}
              variant="secondary"
              className="px-3 py-1 text-sm flex items-center gap-2"
            >
              {item.description}
              <button
                type="button"
                onClick={() => removeSelectedItem(item.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-xs text-destructive"
            onClick={clearAll}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Popover with search and checkboxes */}
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedItems.length > 0 
                ? `${selectedItems.length} item(s) selected`
                : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[250px] bg-white">
            {filteredItems.length > 0 ? (
              <div className="p-1">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-2 p-2 hover:bg-accent rounded"
                  >
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={(checked) => 
                        handleCheckedChange(item.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`item-${item.id}`} className="flex-1">
                      <div className="flex flex-col">
                        <span>{item.description}</span>
                        {item.item_tag && (
                          <span className="text-xs text-muted-foreground">
                            Tag: {item.item_tag}
                          </span>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {searchTerm ? "No matching items found" : "No items available"}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}